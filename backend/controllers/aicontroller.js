import { GoogleGenAI, Models } from "@google/genai";
import sql from "../configs/db.js"
import { clerkClient } from "@clerk/express"
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'
import axios from 'axios'
import cloudinary from 'cloudinary'




const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
export const generateArticle = async(req,res)=>{
    try{
        const {userId} = req.auth()
        const {prompt, length} = req.body
        const plan = req.plan
        const free_usage = req.free_usage
        if(plan !== 'premium' && free_usage >= 10){
            return res.json({success:false, message: 'You have reached your free usage limit'})
        }
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            max_tokens:length
        });
        const content = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!content) {
            console.error("AI did not return content. Full response:", result);
            return res.json({success: false, message: "AI did not return any content."});
        }
        await sql `insert into creations (user_id, prompt, content, type) values (${userId}, ${prompt}, ${content}, 'article')`
        if(plan!=='premium'){
            await clerkClient.users.updateUserMetadata(userId,{
                privateMetadata:{
                    free_usage:free_usage+1
                }
            })
        }
        res.json({success:true, content})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}


export const generateBlogTitle = async(req,res)=>{
    try{
        const {userId} = req.auth()
        const {prompt} = req.body
        const plan = req.plan
        const free_usage = req.free_usage
        if(plan !== 'premium' && free_usage >= 10){
            return res.json({success:false, message: 'You have reached your free usage limit'})
        }
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            max_tokens:1000
        });
        const content = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!content) {
            console.error("AI did not return content. Full response:", result);
            return res.json({success: false, message: "AI did not return any content."});
        }
        await sql `insert into creations (user_id, prompt, content, type) values (${userId}, ${prompt}, ${content}, 'blog-title')`
        if(plan!=='premium'){
            await clerkClient.users.updateUserMetadata(userId,{
                privateMetadata:{
                    free_usage:free_usage+1
                }
            })
        }
        res.json({success:true, content})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}


export const generateImage = async(req,res)=>{
    try{
        const {userId} = req.auth()
        const {prompt, publish} = req.body
        const plan = req.plan
        if(plan !== 'premium'){
            return res.json({success:false, message: 'This feature is only available for premium users'})
        }
        
        const formData= new FormData()
        formData.append('prompt', prompt)
        const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers:{'x-api-key': process.env.CLIPDROP_API_KEY},
            responseType: 'arraybuffer'
        })
        const base64image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`
        const {secure_url} = await cloudinary.uploader.upload(base64image)

    await sql `insert into creations (user_id, prompt, content, type, publish) values (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`
    res.json({success:true, content:secure_url})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

export const removeImageBG = async(req,res)=>{
    try{
        const {userId} = req.auth()
        const image = req.file
        const plan = req.plan
        if(plan !== 'premium'){
            return res.json({success:false, message: 'This feature is only available for premium users'})
        }
        

        const {secure_url} = await cloudinary.uploader.upload(image.path, {
            transformation: [{
                effect: 'background_removal',
                background_removal: 'remove_the_background'
            }]
        })

    await sql `insert into creations (user_id, prompt, content, type) values (${userId}, 'Remove bg from image', ${secure_url}, 'image')`
    res.json({success:true, content:secure_url})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

export const removeImageObject = async(req,res)=>{
    try{
        const {userId} = req.auth()
        const {object} = req.body
        const image = req.file
        const plan = req.plan
        if(plan !== 'premium'){
            return res.json({success:false, message: 'This feature is only available for premium users'})
        }
        

        const {public_id} = await cloudinary.uploader.upload(image.path)
        const {image_url} = cloudinary.url(public_id,{
            transformation: [{effect:`gen_remove: ${object}`}],
            resource_type: 'image'
        })

    await sql `insert into creations (user_id, prompt, content, type) values (${userId}, ${`Removed ${object} from image`}, ${image_url}, 'image')`
    res.json({success:true, content:image_url})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

export const resumeReview = async(req,res)=>{
    try{
        const {userId} = req.auth()
        const resume = req.file
        const plan = req.plan
        if(plan !== 'premium'){
            return res.json({success:false, message: 'This feature is only available for premium users'})
        }
        if(resume.size > 5*1024*1024){
            return res.json({success:false, message: 'Resume size must be less than 5MB'})
        }
        const databuffer = fs.readFileSync(resume.path)
        const pdfdata = await pdf(databuffer)
        const prompt = `Review the following resume and provide a constructive detailed analysis of the candidate's skills, experience, and scope of improvement. 
        The resume is as follows: \n\n${pdfdata.text}`

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            max_tokens:1000
        });
        const content = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!content) {
            console.error("AI did not return content. Full response:", result);
            return res.json({success: false, message: "AI did not return any content."});
        }
    await sql `insert into creations (user_id, prompt, content, type) values (${userId}, 'Review the resume', ${content}, 'resume-review')`
    res.json({success:true, content:content})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}