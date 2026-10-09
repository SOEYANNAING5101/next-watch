'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, User } from 'lucide-react'
import MobileDrawer from './MobileDrawer'
import RouletteModal from './RouletteModal';
export default function Navbar() {
    const pathname = usePathname();
    const getLinkStyle = (path: string) => {
        return `text-sm transition-all duration-200 whitespace-nowrap ${pathname === path
            ? "text-gray-200 font-bold"
            : "text-gray-400 hover:text-gray-200"
            }`
    }
    return (
        <nav className="text-gray-200 bg-black px-6 py-3 md:px-12 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">

            <div className='flex items-center gap-4'>
                <div className='md:hidden block'>
                    <MobileDrawer />
                </div>
                <Link
                    href="/"
                    className="text-gray-400 text-sm">
                    <span className="font-bold text-gray-200 text-xl ">NEXT<span className='text-gray-400'>WATCH</span></span>
                </Link>
                
                <div className='hidden md:flex items-center gap-4'>
                    <span className='text-gray-400'>|</span>
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
                    <RouletteModal />
                </div>
            </div>
            <div className='flex items-center justify-center gap-4'>
                <button className='text-gray-400'><Search size={20} /></button>
                <button className='text-gray-400'><Bell size={20} /></button>
                <Link href='/signup' className='hidden md:flex border rounded-lg'><User size={20} /></Link>
            </div>
        </nav>
    )
}