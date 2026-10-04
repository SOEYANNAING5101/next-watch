import { STANDOUT_ELEMENTS } from '../lib/vibe-rating-config'
interface StandoutElementsProps {
    selected: string[];
    onChange: (value: string) => void;
}
export default function StandoutFilmStrip({
    selected,
    onChange,
}: StandoutElementsProps) {;
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1 items-center justify-center">
                    <span>🌟</span>
                    <h2 className="text-gray-200 text-sm font-semibold">
                        STANDOUT ELEMENTS
                    </h2>
                </div>
                <span className="text-gray-400 font-semibold tracking-wide text-xs">
                    {selected.length} / 2 SELECTED
                </span>
            </div>
            <div className="relative flex gap-1 p-1 bg-slate-950 rounded-xl  shadow-innter overflow-x-auto hide-scrollbar">
                {STANDOUT_ELEMENTS.map((opt) => {
                    const isSelected = selected.includes(opt.label);
                    const isMaxedOut = selected.length >= 2 && !isSelected;

                    return (
                        <button
                            onClick={() => onChange(opt.label)}
                            disabled={isMaxedOut}
                            className={`flex flex-col text-xs uppercase tracking-wider font-semibold flex-shrink-0 w-[100px] h-[110px] gap-1 items-center justify-center rounded-lg cursor-pointer transition-all duration-200 ${isSelected
                                ? "bg-slate-800 border border-slate-600 text-gray-200"
                                : "text-gray-400  hover:text-gray-300"
                                }`}
                            key={opt.label}
                        >
                            <span
                                className={`transition-all duration-200 
                                ${isSelected
                                        ? "scale-110"
                                        : "scale-75 grayscale opacity-60"
                                    }`}
                            >
                                {opt.emoji}
                            </span>
                            <span>{opt.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
