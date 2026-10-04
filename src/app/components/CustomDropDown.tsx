import { ChevronDown } from 'lucide-react';
import { useState,useEffect,useRef } from 'react';


interface CustomdropdownProps {
    label: string;
    options: string[];
    value: string;
    onChange: (val: string) => void;
}

export default function CustomDropDown({ label, options, value, onChange }: CustomdropdownProps) {
    const [isOpen,setIsOpen] = useState(false);
    const dropDownRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        const handleClickOutside = (event:MouseEvent)=>{
            if(dropDownRef.current && !dropDownRef.current.contains(event.target as Node)){
                setIsOpen(false)
            }
        };
        document.addEventListener("mousedown",handleClickOutside);
        return() => document.removeEventListener("mousedown",handleClickOutside)
    },[])
    return (
        <div className="flex flex-col gap-1 mb-4" ref={dropDownRef}>
            <label className="text-gray-400 text-xs font-semibold">{label}</label>
            <div className='relative'>
                <button 
                className='w-full flex items-center justify-between p-2 rounded-sm border-2 border-gray-900 bg-slate-950 hover:bg-slate-900 hover:border-slate-900 cursor-pointer transiton-all duration-200'
                onClick={()=>{setIsOpen(!isOpen)}}>
                    <span className='text-gray-200 text-xs font-semibold capitalize'>{value}</span>
                    <ChevronDown size={18}/>
                </button>
                {isOpen && (
                    <div className='absolute w-full z-60 flex flex-col rounded-sm border-2 border-gray-900 bg-slate-950 mt-1 transition-all duration-200'>
                        {options.map((option)=>(
                            <button 
                            key={option}
                            onClick={()=>{
                                onChange(option);
                                setIsOpen(!isOpen); 
                            }}
                            className={`flex items-center text-xs text-left p-2 cursor-pointer transition-all duration-200 hover:bg-slate-900 capitalize  ${
                                option == value ? " font-medium  bg-slate-900" : "text-gray-400"
                            }`}>
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}