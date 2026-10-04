'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, User } from 'lucide-react'
import RouletteModal from './RouletteModal'
export default function Navbar() {
    const pathname = usePathname();
    const getLinkStyle = (path: string) => {
        return `text-sm transition-all duration-200 ${pathname === path
            ? "text-gray-200 font-bold"
            : "text-gray-400 hover:text-gray-200"
            }`
    }
    return (
        <nav className="text-gray-200 bg-black px-6 py-3 md:px-12 flex items-center justify-between">

            <div className='flex items-center justify-center gap-4'>
                <span className="font-bold text-2xl ml-4">Next Watch</span>
                <Link
                    href="/"
                    className={getLinkStyle('/')}>Home
                </Link>
                <Link
                    href="/movies"
                    className={getLinkStyle('/movies')}>
                    Movies
                </Link>
                <Link
                    href="/my-list"
                    className={getLinkStyle('/my-list')}>
                    My List
                </Link>
                <div><RouletteModal /></div>
            </div>
            <div className='flex gap-4'>
                <button><Search size={20} /></button>
                <button><Bell size={20} /></button>
                <Link href='/signup' className='border rounded-lg'><User size={20} /></Link>
            </div>
        </nav>
    )
}