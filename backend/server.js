import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv/config'  
import { clerkMiddleware, requireAuth } from '@clerk/express'
import airouter from './routes/airoutes.js'
import connectcloudinary from './configs/cloudinary.js'
import userouter from './routes/userroute.js'
// dotenv.config()

const app = express()
await connectcloudinary()
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())
app.get('/', (req,res)=>res.send('Hello World'))

app.use(requireAuth())
app.use('/api/ai', airouter)
app.use('/api/user', userouter)

const port = process.env.PORT || 3000
app.listen(port, ()=>console.log(`Server is running on port ${port}`))