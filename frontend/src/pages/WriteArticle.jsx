import { Sparkles } from 'lucide-react'
import React, {useState} from 'react'
import {Edit} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
import Markdown from 'react-markdown'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

function WriteArticle() {
  const articlelength=[
    {length:800, text:'Short (500-800 words)'},
    {length:1200, text:'Medium (800-1200 words)'},
    {length:1600, text:'Long (1200-1600 words)'}
  ]
  const onsubmithandler=async(e)=>{
    setcontent('')
    e.preventDefault();
    try {
      setloading(true)
      const prompt = `Write an article on the topic ${input} with the length of ${selectedlength.length} words`
      const {data} = await axios.post('/api/ai/generate-article', {prompt, length:selectedlength.length},{
        headers:{Authorization: `Bearer ${await getToken()}`}
      })
      if(data.success){setcontent(data.content)}
      else{toast.error(data.message)}
    } catch (error) {
      toast.error(error.response.data.message)
    }
    finally{
      setloading(false)
    }
  }
  const [selectedlength, setselectedlength] = useState(articlelength[0])
  const [input, setinput] = useState('')
  const [loading, setloading] = useState(false)
  const [content, setcontent] = useState('')

  const {getToken} = useAuth()
  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      <form  onSubmit={onsubmithandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div>
          <Sparkles className='w-5 text-yellow-600 fill-amber-400'/>
          <h1 className='text-xl font-semibold '>Article configuration</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Article topic</p>
        <input onChange={(e)=>setinput(e.target.value)} value={input} type = "text" className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='Write your topic here...' required/>
        <p className='mt-4 text-sm font-medium'>Article length</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>{articlelength.map((item,index)=><span onClick={()=>setselectedlength(item)} 
        key={index} className={`text-xs px-4 py-1 border rounded-full cursor-pointer hover:bg-gray-100 ${selectedlength.text === item.text ? 
          'bg-blue-50 text-blue-700' : 'text-gray-500 border-gray-300'} `}>{item.text}</span>)}</div>
          <br/>
          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
          >
            {
              loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              : <Edit className='w-5'/>
            }
            Generate</button>
      </form>

      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
          <div className='flex items-center gap-3'>
            <Edit className='w-5 h-5 text-[#4A7AFF]'/>
            <h1 className='text-xl font-semibold'>Generated article</h1>
          </div>
          {
            !content ? (
              <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-500'>
              {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <div><Edit className='w-10 h-10'/></div>}

              <p hidden={loading} className='text-sm'>Enter the topic and click "generate" to generate an article</p>
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

export default WriteArticle