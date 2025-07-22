import express from 'express'
import { generateArticle, generateBlogTitle, generateImage, removeImageBG, removeImageObject, resumeReview } from '../controllers/aicontroller.js'
import { auth } from '../middleware/auth.js'
import upload from '../configs/multer.js'

const airouter = express.Router()
airouter.post('/generate-article', auth, generateArticle)
airouter.post('/generate-blog-title', auth, generateBlogTitle)
airouter.post('/generate-image', auth, generateImage)
airouter.post('/remove-image-bg', upload.single('image'),auth, removeImageBG)
airouter.post('/remove-image-object',upload.single('image') ,auth, removeImageObject)
airouter.post('/resume-review', upload.single('resume'),auth, resumeReview)
export default airouter