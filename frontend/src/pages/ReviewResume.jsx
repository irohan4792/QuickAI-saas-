import React, {useState} from 'react'
import { Sparkles,  FileText } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
import Markdown from 'react-markdown'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL



function ReviewResume() {
  const onsubmithandler=async(e)=>{
    setcontent('')
    e.preventDefault();
    try {
      setloading(true)
      const formData = new FormData()
      formData.append('resume', input)
      const {data} = await axios.post('/api/ai/resume-review', formData, {
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
  const [loading, setloading] = useState(false)
  const [content, setcontent] = useState('')
  const {getToken} = useAuth()
  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      <form  onSubmit={onsubmithandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div>
          <Sparkles className='w-5 text-purple-600 fill-purple-400'/>
          <h1 className='text-xl font-semibold '>Resume reviewer</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload resume</p>
        <input onChange={(e)=>setinput(e.target.files[0])} type = "file" accept='application/pdf' className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600' required/>
        <p className='text-xs text-gray-500 font-light mt-1'>Supports pdf resume only</p>
          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#9125b2] to-[#9d69c3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
          >
            {
              loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <FileText className='w-5'/>
            }
            Review resume</button>
      </form>

      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
          <div className='flex items-center gap-3'>
            <FileText className='w-5 h-5 text-[purple]'/>
            <h1 className='text-xl font-semibold'>Resume analysis</h1>
          </div>
          {
            !content ? (
              <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-500'>
              {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <div><FileText className='w-10 h-10'/></div>}

              <p hidden={loading} className='text-sm'>Upload the file and click "Review resume" to generate the report</p>
            </div>
          </div>
            ) : (
              <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
              <div className='reset-tw'><Markdown>{content}</Markdown></div>
            </div>
            )
          }
      </div>
    </div>
  )
}

export default ReviewResume