import React, {useEffect, useState} from 'react'
import {dummyCreationData} from '../assets/assets'
import { Sparkles, Gem } from 'lucide-react'
import { Protect, useAuth } from '@clerk/clerk-react'
import Creationitem from '../components/Creationitem' 
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

function Dashboard() {
  const [creation, setcreation] = useState([])
  const [loading, setloading] = useState(true)
  const {getToken} = useAuth()
  const getdashboarddata = async () => {
    try {
      const {data} = await axios.get('/api/user/get-user-creations', {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })
      if(data.success){setcreation(data.creations)}
      else{toast.error(data.message)}
    } catch (error) {
      toast.error(error.message)
    }
    finally{setloading(false)}
  }
  useEffect(()=>{
    getdashboarddata()
  },[])
  return (
    <div className='h-full overflow-y-scroll p-6'>
      <div className='flex justify-start gap-4 flex-wrap'>
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creation</p>
            <h2 className='text-2xl font-semibold'>{creation.length}</h2>
          </div>
          <div>
            <Sparkles className='w-5 text-yellow-600 fill-amber-400'/>
          </div>
        </div>
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Active plan</p>
            <h2 className='text-2xl font-semibold'><Protect plan='premium' fallback="Free">Premium</Protect></h2>
          </div>
          <div>
            <Gem className='w-5 text-blue-600 fill-sky-200'/>
          </div>
        </div>
      </div>
      {
        loading ? (
          <div className='flex justify-center items-center h-3/4'>
            <div className='w-10 h-10 my-1 rounded-full border-3 border-purple-700 border-t-transparent animate-spin'></div>
          </div>
        ) : (
          <div className='space-y-3'>
          <p className='mt-6 mb-4'>Recent creations</p>
          {
            creation.map((item )=>
              <Creationitem key={item.id} item={item}/>
            )
          }
        </div>
        )
      }

    </div>
  )
}

export default Dashboard