'use client'
import { useState } from 'react'
import { toggleWatch } from '../actions/movie-action'
import { CircleCheckBig, Loader2, Plus } from 'lucide-react'

interface WatchedButtonProps {
    movieId: number,
    initialIsWatched: boolean
}
export default function WatchedButton({ movieId, initialIsWatched }: WatchedButtonProps) {
    const [isWatched, setIsWatched] = useState(initialIsWatched);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        const result = await toggleWatch(movieId)
        if (result.error) {
            alert(result.error)
        } else if (result.isWatched !== undefined) {
            setIsWatched(result.isWatched)
        }
        setIsLoading(false)
    }
    return (
        <button 
        onClick={handleClick}
        disabled={isLoading} 
        className={`flex items-center justify-center gap-2 text-sm font-semibold rounded-sm px-4 py-1.5 border border-gray-800 bg-gray-900 cursor-pointer transition-colors duration-200
            ${isLoading ? "text-gray-200 opacity-80 cursor-not-allowed" : ""}
            ${isWatched ? "text-[#68c9da] hover:text-gray-200" : "text-gray-200 hover:text-[#68c9da]"}`}>
                {isLoading ?(
                    <Loader2 size={18} className='animate-spin'/>
                ): isWatched ? (
                    <CircleCheckBig size={18}/>
                ): (
                    <Plus size={18}/>
                )}
            <span>{isLoading ? "LOADING" : isWatched ? "WATCHED" : "MARK AS WATCHED"}</span>
        </button>
    )
}