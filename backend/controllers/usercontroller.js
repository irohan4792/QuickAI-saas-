import sql from "../configs/db.js"

export const getUserCreation = async(req,res)=>{
    try{
        const {userId} = req.auth()
        const creations = await sql `select * from creations where user_id = ${userId} order by created_at desc`
        res.json({success:true, creations})
    }
    catch(error){
        res.json({success:false, message:error.message})
    }
}

export const getPublishCreation = async(req,res)=>{
    try{
        const creations = await sql `select * from creations where publish = true order by created_at desc`
        res.json({success:true, creations})
    }
    catch(error){
        res.json({success:false, message:error.message})
    }
}

export const toggleLike = async(req,res)=>{
    try{
        const {userId} = req.auth()
        const {id} = req.body

        const [creation] = await sql `select * from creations where id = ${id}`
        if(!creation){
            return res.json({success:false, message: 'Posts not found'})
        }
        const currentlike = creation.likes
        const useridstr = userId.toString()
        let updatedlikes
        let message
        if(currentlike.includes(useridstr)){
            updatedlikes=currentlike.filter((user)=> user !== useridstr)
            message = 'Post unliked'
        }
        else{
            updatedlikes = [...currentlike, useridstr]
            message = 'Post liked'
        }

        const formattedarray = `{${updatedlikes.join(',')}}`
        await sql `update creations set likes = ${formattedarray}::text[] where id = ${id}`
        const creations = await sql `select * from creations where publish = true order by created_at desc`
        res.json({success:true, message})
    }
    catch(error){
        res.json({success:false, message:error.message})
    }
}