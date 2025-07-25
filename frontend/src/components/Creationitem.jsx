import React, { useState } from 'react'
import Markdown from 'react-markdown'

function Creationitem({item}) {
    const [expanded, setexpanded] = useState(false)
  return (
    <div onClick={()=>setexpanded(!expanded)} className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer'>
        <div className='flex justify-between items-center gap-4'>
            <div>
                <h2>{item.prompt}</h2>
                <p className='text-gray-500'>{item.type} - {new Date(item.created_at).toLocaleDateString()}</p>
            </div>
            <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40Af] px-1 py-1 rounded-full'>{item.type}</button>
        </div>
        {
            expanded && (
                <div>
                    {item.type==='image' ? (
                        <div>
                            <img src={item.content} className='mt-3 w-full max-w-md' alt="" />
                        </div>
                    ) : (
                        <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-700'>
                            <div className='reset-tw'><Markdown>{item.content}</Markdown></div>
                        </div>
                    )}
                </div>
            )
        }
    </div>
  )
}

export default Creationitem