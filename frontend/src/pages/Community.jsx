import React, { useState,useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL


function Community() {
  const [creations, setcreations] = useState([])
  const [loading, setloading] = useState(true)
  const {getToken} = useAuth()
  const {user} = useUser()
  const fetchcreations=async()=>{
    try {
      const {data} = await axios.get('/api/user/get-user-creations', {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })
      if(data.success){setcreations(data.creations)}
      else{toast.error(data.message)}
    } catch (error) {
      toast.error(error.message)
    }
    finally{setloading(false)}
  }

  const imagelike = async(id) => {
    try {
      const {data} = await axios.post('/api/user/toggle-like', {id}, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })
      if(data.success){
        toast.success(data.message)
        fetchcreations()
      }
      else{toast.error(data.message)}
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect (()=>{
    if(user){
      fetchcreations()
    }
  },[user])
  return !loading ? (
    <div className='flex-1 h-full flex flex-col gap-4 p-6 text-xl font-semibold'>
      Community
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>
        {creations.map((creation, index)=>(
          <div key={index} className='relative group inline-block l-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'>
            <img src={creation.content} className='w-full h-full object-cover rounded-lg' alt="" />
            <div className='absolute bottom-0  top-0 right-0 left-0 flex gap-2 items-end justify-end group-hover:justify-between
            p-3 group-hover:bg-gradient-to-b from transparent to-black/80 text-white rounded-lg'> 
              <p className='text-sm hidden group-hover:block'>{creation.prompt}</p>
              <div className='flex gap-1 items-center'>
                <p>{creation.likes.length}</p>
                <Heart onClick={()=>imagelike(creation.id)} className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${creation.likes.includes(user.id) ? 'fill-red-500 text-red-600' : 'text-white'}`}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  : (
    <div className='flex justify-center items-center h-full'>
      <span className='w-10 h-10 my-1 rounded-full border-3 border-purple-700 border-t-transparent animate-spin'></span>
    </div>
  )
}

export default Community