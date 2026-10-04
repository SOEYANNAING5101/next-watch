'use client'
import { useState } from 'react'
import { X, Play } from 'lucide-react'
interface Video {
  key: string;
  type: string;
}
interface TrailerButtonProps {
  videos: Video[]
}
export default function TrailerButton({ videos }: TrailerButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const trailer = videos.find((v) => v.type === 'Trailer') || videos[0];
  if (!trailer) return null
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className='text-slate-950 font-semibold tracking-wide bg-white px-6 py-3 flex items-center justify-center gap-2 rounded-full cursor-pointer hover:scale-105 hover:bg-slate-200 transition-all duration-200 ease-in-out active:scale-95 '>
        <Play fill='current-color' size={20} />
        <span>Watch Trailer</span>
      </button>
      {isModalOpen && (
        <div className='fixed inset-0 bg-black/90 z-60 flex items-center justify-center'>
          <button onClick={() => setIsModalOpen(false)}
            className="absolute right-4 top-4 text-gray-200 absolute z-60 cursor-pointer hover:text-gray-200 hover:rounded-full hover:bg-gray-600 w-10 h-10 flex items-center justify-center transition-all duration-200"
          >
            <X size={25} />
          </button>
          <div className='relative w-full max-w-5xl text-gray-200 aspect-video overflow-hidden rounded-xl bg-black shadow-2xl '>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title='Youtube Video Player'
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className='absolute inset-0 h-full w-full border-0'>
            </iframe>
          </div>
        </div>
      )}
    </>

  )

}