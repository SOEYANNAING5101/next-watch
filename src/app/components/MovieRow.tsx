"use client"
import { useRef, useState } from 'react'
import MovieCard from './MovieCard'
import { Movie } from '../lib/tmdb'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Scooter } from 'lucide-react'
export interface MovieRowProps {
    title: string,
    movies: Movie[],
    seeAllHref?: string
}
export default function MovieRow({
    title, movies, seeAllHref = "#"
}: MovieRowProps) {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current
            setIsAtStart(scrollLeft <= 20)
            setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth)
        }
    }
    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current
            const scrollAmount = direction === 'left'
                ? scrollLeft - clientWidth + 150
                : scrollLeft + clientWidth - 150;
            scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" })
        }
    };

    return (
        <div className=''>
            {/* Row header */}
            <div className=' flex items-center justify-between p-2'>
                <h2 className='font-bold text-lg text-gray-200 tracking-wide'>{title}</h2>
                <Link className='font-bold text-base text-gray-200' href={seeAllHref}>See All</Link>
            </div>
            <div className='relative group'>
                {!isAtStart && (
                    <button
                        onClick={() => { scroll('left') }}
                        className='hidden absolute left-0 top-0 bottom-0 z-40 w-10 bg-black/60 md:flex items-center justify-center text-gray-200 cursor-pointer hover:bg-black/70 transition-all '>
                        <ChevronLeft />
                    </button>
                )}

                <div ref={scrollRef} onScroll={handleScroll} className='flex overflow-x-auto no-scrollbar snap-x snap-mandatory p-1'>
                    {movies.map((movie) => (
                        <div
                            className={`max-w-[150px] md:max-w-[170px] w-full snap-start flex-shrink-0 p-2`}
                            key={movie.id}><MovieCard movie={movie} /></div>

                    ))}
                </div>
                {!isAtEnd && (
                    <button
                        onClick={() => { scroll('right') }}
                        className='hidden absolute right-0 top-0 bottom-0 z-40 w-10 bg-black/60 md:flex items-center justify-center text-gray-200 cursor-pointer hover:bg-black/70 transition-all '>
                        <ChevronRight />
                    </button>
                )}
            </div>
        </div>
    )
}