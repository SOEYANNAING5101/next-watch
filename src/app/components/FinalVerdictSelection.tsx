
import { Check } from 'lucide-react'
import { VERDICT_OPTIONS } from '../lib/vibe-rating-config'
interface FinalVerdictSlectionProps {
    selectedLabel: string | undefined;
    onChange: (selection: { label: string, points: number }) => void
}
export default function FinalVerdictSelection({ selectedLabel, onChange }: FinalVerdictSlectionProps) {
    return (
        <div className="mb-6">
            <div className="flex flex-col gap-2">
                {VERDICT_OPTIONS.map((selection) => {
                    const isSelected = selectedLabel === selection.label
                    return (
                        <button
                            className={`flex items-center justify-between p-4  rounded-lg cursor-pointer transition-all duration-200 ${isSelected
                                ? "bg-gray-800 shadow-md shadow-gray-900"
                                : "bg-gray-900/80 "
                                }`}
                            key={selection.label}
                            onClick={() => onChange({ label: selection.label, points: selection.points })}>
                            <div className="flex flex-col gap-2 items-start justify-center ">
                                <div className="flex gap-2 items-center justify-center">
                                    <h3 className={`font-bold text-sm  ${isSelected
                                        ? "text-gray-200 scale-105"
                                        : "text-gray-300 scale-95"
                                        }`}>
                                        {selection.label}
                                    </h3>
                                    <p className={`text-xs font-semibold tracking-wide rounded-md p-1  ${isSelected
                                        ? "bg-white text-gray-900 scale-105"
                                        : "text-gray-400 bg-slate-800 scale-95"
                                        }`}>+ {selection.points} PTS</p>
                                </div>

                                <p className={`italic text-xs ${isSelected
                                    ? "text-gray-200 scale-105"
                                    : "text-gray-400 scale-95"
                                    }`}>
                                    {selection.caption}
                                </p>
                            </div>
                            <div className={`flex items-center justify-center bg-slate-800 w-6 h-6 rounded-full transition-all duration-200 ${isSelected
                                ? "bg-white"
                                : " "
                                }`}>
                                {isSelected && (
                                    <span className="text-gray-900"><Check size={18} /></span>
                                )}

                            </div>

                        </button>
                    )

                })}
            </div>



        </div>
    )
}