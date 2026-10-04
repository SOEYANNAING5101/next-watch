"use client"
import { useRouter } from "next/navigation";
import { ChevronLeft } from 'lucide-react'
export default function BackButton() {
    const router = useRouter();
    return(
        <button 
        type="button" 
        onClick={()=>router.back()} 
        className="text-gray-200 absolute left-4 top-4 z-10 cursor-pointer hover:text-gray-200 hover:rounded-full hover:bg-gray-600 w-10 h-10 flex items-center justify-center transition-all duration-200">
           <ChevronLeft size={25}/> 
        </button>
    )
}