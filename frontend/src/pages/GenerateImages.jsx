import React, { useState } from 'react'
import { Sparkles, Edit, Image } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

function GenerateImages() {
  const imagestyle = ['Ghibli Style', 'Realistic', 'Cartoon', 'Anime', 'Digital Art', 'Photographic', '3D', 'Vector', 'Flat', 'Minimalist']
  const onsubmithandler = async (e) => {
    setcontent('')
    e.preventDefault();
    try {
      setloading(true)
      const prompt = `Generate an image of ${input} in the style of ${selectedstyle}`
      const { data } = await axios.post('/api/ai/generate-image', { prompt, publish }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) { setcontent(data.content) }
      else { toast.error(data.message) }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    finally { setloading(false) }
  }
  const [selectedstyle, setselectedstyle] = useState('Ghibli Style')
  const [input, setinput] = useState('')
  const [publish, setpublish] = useState(false)
  const [loading, setloading] = useState(false)
  const [content, setcontent] = useState('')

  const { getToken } = useAuth()
  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      <form onSubmit={onsubmithandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div>
          <Sparkles className='w-5 text-green-600 fill-green-400' />
          <h1 className='text-xl font-semibold '>AI image generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Describe your image</p>
        <textarea rows={4} onChange={(e) => setinput(e.target.value)} value={input} className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='Describe your image here...' required />
        <p className='mt-4 text-sm font-medium'>Style</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>{imagestyle.map((item) => <span onClick={() => setselectedstyle(item)}
          key={item} className={`text-xs px-4 py-1 border rounded-full cursor-pointer hover:bg-gray-100 ${selectedstyle === item ?
            'bg-green-50 text-green-700' : 'text-gray-500 border-gray-300'} `}>{item}</span>)}</div>

        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input type="checkbox" name="" id="" onChange={(e) => setpublish(e.target.checked)} checked={publish} className='sr-only peer' />
            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white 
              rounded-full transition peer-checked:translate-x-4'></span>
          </label>
          <p className='text-sm'>Make this image public</p>
        </div>
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#04a414] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
        >
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Image className='w-5' />
          }
          Generate</button>
      </form>

      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[green] fill-green-200' />
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
            <div className='mt-3 h-full'>
              <img src={content} alt="image" className='w-full h-full' />
            </div>
          )
        }
      </div>
    </div>
  )
}

export default GenerateImages