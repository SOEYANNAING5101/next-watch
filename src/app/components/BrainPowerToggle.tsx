import { BRAIN_POWER_OPTIONS  } from '../lib/vibe-rating-config'
interface BrainPowerToggleProps {
    value: string;
    onChange: (value: string) => void;
}
export default function BrainPowerToggle({ value, onChange }: BrainPowerToggleProps) {
    const activeIndex = BRAIN_POWER_OPTIONS.findIndex(o=>o.label === value);
    const hasSelection = activeIndex!== -1
    return (
        <div className="mb-8">
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-200 text-sm font-semibold">🧠 BRAIN POWER</span>
                    <span className="text-gray-400 text-xs font-semibold">MECH TOGGLE</span>
                </div>
                <div className="relative flex p-1 bg-slate-950 rounded-xl border border-slate-500/50 shadow-inner overflow-hidden">
                
                <div 
                className={`absolute w-[calc(33.333%-0.3rem)] top-1 bottom-1 bg-slate-800 border border-slate-600 rounded-lg transition-all duration-300  shadow-md ${
                    hasSelection ? "opacity-100 scale-100" : "opacity-0 scale-40"
                }`}
                style={{ transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 0.15}rem))` }}/>
                {BRAIN_POWER_OPTIONS.map((option)=>(
                    <button 
                    key={option.label}
                    onClick={()=>onChange(option.label)}
                    className={`flex-1 flex z-10 flex-col items-center justify-center px-2 py-4 transition-colors duration-200 ${
                        value === option.label ? "text-gray-200" : "text-gray-400 hover:text-gray-200 cursor-pointer"
                    }`}>
                        <span className={`inline-block transition-all duration-300 ${
                            value === option.label 
                            ? "scale-110"
                            : "scale-75 grayscale opacity-60"
                        }`}>{option.emoji}</span>
                        <span className=" text-xs font-semibold tracking-wider uppercase">{option.label}</span>
                    </button>
                ))}

                </div>



            </div>

        </div>
    )

}