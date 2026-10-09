'use client'
import { Menu, X, User, House, Clapperboard, Bookmark, CirclePlay, RotateCcwClock, Settings, CircleQuestionMark } from 'lucide-react'
import { useState, useEffect } from 'react'
import RouletteModal from './RouletteModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function MobileDrawer() {
    const [isOpen, setIsOpen] = useState(true)
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null)
    const minSwipeDistance = 50

    const pathName = usePathname();
    const getLinkStyle = (path: string) => {
        return pathName === path
            ? "text-gray-200 bg-gray-700"
            : "text-gray-400 hover:bg-gray-700"
    }

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX)
    }
    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd
        if (distance > minSwipeDistance) {
            setIsOpen(false)
        }
    }
    useEffect(() => {
        setIsOpen(false)
    }, [pathName])
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen])
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className='text-gray-400 flex items-center transition-colors duration-200 hover:text-gray-200'
                aria-label='Open Menu'>
                <Menu size={20} />
            </button>
            {/* Blurred background */}
            <div
                className={`fixed inset-0 z-[50] bg-black/60 h-[100dvh] transition-all duration-200 ${isOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false)
                }} />
            <div
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className={`fixed left-0 top-0 p-4 z-[60] bg-slate-950 h-[100dvh] w-3/4 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}>
                {/* User Icon */}
                <div className='flex items-center justify-between'>
                    <div className='border border-gray-200 rounded-full h-15 w-15 flex items-center justify-center'>
                        <User className='text-gray-200' size={30} />
                    </div>
                    <button
                        className="text-gray-200 cursor-pointer hover:text-gray-200 hover:rounded-full hover:bg-gray-600 w-10 h-10 flex items-center justify-center transition-all duration-200"
                        onClick={() => setIsOpen(false)}><X size={15} />
                    </button>
                </div>
                <div className='border-2 border-b border-gray-700 mt-8 mb-8'></div>
                
                    <div className='border border-gray-400 rounded-lg p-4 flex flex-col '>
                        <h2 className='text-gray-200 text-lg font-semibold mb-2'>Movie Roulette</h2>
                        <span className='text-gray-400 text-sm font-semibold mb-4'>Can&apos;t decide? Let fate pick your next cinematic adventure right now.</span>
                        {/* <div className="w-full bg-gray-200 text-black font-bold py-2.5 rounded-md flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform duration-200">
                            SPIN NOW
                        </div> */}
                        <RouletteModal />
                    </div>
                
                <div className='mt-4 flex flex-col gap-2'>
                    <Link
                        href="/"
                        className={`flex items-center font-semibold rounded-xl gap-2 p-3 w-full text-left transition-colors duration-200 ${getLinkStyle('/')}`}>
                        <House size={20} />
                        Home
                    </Link>
                    <Link
                        href="/movies"
                        className={`flex items-center font-semibold rounded-xl gap-2 p-3 w-full text-left transition-colors duration-200 ${getLinkStyle('/movies')}`}>
                        <Clapperboard size={20} />
                        Movies
                    </Link>
                    <Link
                        href="/my-list"
                        className={`flex items-center font-semibold rounded-xl gap-3 p-2 w-full text-left transition-colors duration-200 ${getLinkStyle('/my-list')}`}>
                        <Bookmark size={20} />
                        My List
                    </Link>
                </div>
                <div className='border-2 border-b border-gray-700 mt-8 mb-8'></div>
                <div className='flex flex-col gap-2'>
                    <Link
                        href="/"
                        className='text-gray-400 flex items-center rounded-xl gap-3 p-2 w-full text-left transition-colors duration-200'>
                        <Settings size={20} />
                        Settings
                    </Link>
                    <Link
                        href="/"
                        className='text-gray-400 flex items-center rounded-xl gap-3 p-2 w-full text-left transition-colors duration-200'>
                        <CircleQuestionMark size={20} />
                        Help & Support
                    </Link>
                </div>

            </div>



        </>
    )
}