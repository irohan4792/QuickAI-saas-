import React, {useState} from 'react'
import { Sparkles, Edit, Hash } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'
import { useAuth } from '@clerk/clerk-react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

function BlogTitles() {
  const blogcategories=['General','Technology','Health','Finance','Education','Entertainment','Sports','Business','Science','Art','Travel','Food','Fashion','Lifestyle']
  const onsubmithandler=async(e)=>{
    setcontent('')
    e.preventDefault();
    try {
      setloading(true)
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedcategory}`
      const {data} = await axios.post('/api/ai/generate-blog-title', {prompt},{
        headers:{Authorization: `Bearer ${await getToken()}`}
      })
      if(data.success){setcontent(data.content)}
      else{toast.error(data.message)}
    } catch (error) {
      toast.error(error.message)
    }
    setloading(false)
  }
  const [selectedcategory, setselectedcategory] = useState('General')
  const [input, setinput] = useState('')
  const [loading, setloading] = useState(false)
  const [content, setcontent] = useState('')
  const {getToken} = useAuth()
  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      <form  onSubmit={onsubmithandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div>
          <Sparkles className='w-5 text-purple-600 fill-purple-400'/>
          <h1 className='text-xl font-semibold '>AI title generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Keyword</p>
        <input onChange={(e)=>setinput(e.target.value)} value={input} type = "text" className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='Write your topic here...' required/>
        <p className='mt-4 text-sm font-medium'>Category</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>{blogcategories.map((item)=><span onClick={()=>setselectedcategory(item)} 
        key={item} className={`text-xs px-4 py-1 border rounded-full cursor-pointer hover:bg-gray-100 ${selectedcategory === item ? 
          'bg-purple-50 text-purple-700' : 'text-gray-500 border-gray-300'} `}>{item}</span>)}</div>
          <br/>
          <button disabled={loading} onClick={onsubmithandler} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#4a22ff] to-[#aa65ff] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
          >
            {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Hash className='w-5'/>}
            Generate
          </button>
      </form>

      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
          <div className='flex items-center gap-3'>
            <Hash className='w-5 h-5 text-[purple]'/>
            <h1 className='text-xl font-semibold'>Generated title</h1>
          </div>
          {
            !content ? (
              <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-500'>
                
                {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <div><Edit className='w-10 h-10'/></div>}
                <p hidden={loading} className='text-sm'>Enter the topic and click "generate" to generate the title</p>
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

export default BlogTitles