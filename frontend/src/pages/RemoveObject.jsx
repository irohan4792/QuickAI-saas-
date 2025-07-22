import React, {useState} from 'react'
import { Sparkles, Edit, Hash, Eraser, Scissors } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL


function RemoveObject() {
  const onsubmithandler=async(e)=>{
    setcontent('')
    e.preventDefault();
    try {
      setloading(true)
      if(object.split(' ').length > 1){
        toast.error('Please enter a single object name')
        return
      }
      const formData = new FormData()
      formData.append('image', input)
      formData.append('object', object)
      const {data} = await axios.post('/api/ai/remove-image-object', formData, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })
      if(data.success){setcontent(data.content)}
      else{toast.error(data.message)}
    } catch (error) {
      toast.error(error.message)
    }
    finally{setloading(false)}
  }
  const [input, setinput] = useState('')
  const [object, setobject] = useState('')
  const [loading, setloading] = useState(false)
  const [content, setcontent] = useState('')
  const {getToken} = useAuth()
  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      <form  onSubmit={onsubmithandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div>
          <Sparkles className='w-5 text-purple-600 fill-purple-400'/>
          <h1 className='text-xl font-semibold '>Object remover</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload image</p>
        <input onChange={(e)=>setinput(e.target.files[0])} type = "file" accept='image/*' className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600' required/>

        <p className='mt-6 text-sm font-medium'>Describe object name to remove</p>
        <textarea rows={4} onChange={(e)=>setobject(e.target.value)} value={object} className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='Car or chair, only single object name is required...' required/>

          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#b22802] to-[#ac77c6] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
          >
            {
              loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Scissors className='w-5'/>
            }
             Remove object</button>
      </form>

      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
          <div className='flex items-center gap-3'>
            <Scissors className='w-5 h-5 text-[#df5317]'/>
            <h1 className='text-xl font-semibold'>Processed image</h1>
          </div>
          {
            !content ? (
              <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-500'>
              {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Scissors className='w-10 h-10'/>}

              <p hidden={loading} className='text-sm'>Upload the image and click "Remove object" to generate the image</p>
            </div>
          </div>
            ) : (
              <img src={content} alt="image" className=' mt-3 w-full h-full' />
            )
          }
          
      </div>
    </div>
  )
}

export default RemoveObject