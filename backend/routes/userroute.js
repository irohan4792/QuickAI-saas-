import express from 'express'
import { getUserCreation, getPublishCreation, toggleLike } from '../controllers/usercontroller.js'
import { auth } from '../middleware/auth.js'

const userouter = express.Router()

userouter.get('/get-user-creations', auth, getUserCreation)
userouter.get('/get-publish-creations', getPublishCreation)
userouter.post('/toggle-like', auth, toggleLike)

export default userouter