'use client'
import { ATTENTION_OPTIONS } from '../lib/vibe-rating-config'
interface AttentionSliderProps {
    value: string;
    onChange: (value: string) => void;
}
export default function AttentionTest({ value, onChange }: AttentionSliderProps) {
    return (
        <div className="mb-8">
            <div className="flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1 items-center justify-center">
                        <span>👀</span>
                        <h2 className="text-gray-200 text-sm font-semibold">ATTENTION TEST</h2>
                    </div>
                    <span className="text-gray-400 font-semibold tracking-wide text-xs">FOCUS PULLER</span>
                </div>
                <div className="flex items-center justify-center">
                    <h2 className="text-gray-200 font-bold p-2 bg-slate-800 border border-gray-700 rounded-lg mb-2">{ATTENTION_OPTIONS[value] || ATTENTION_OPTIONS['100']}</h2>
                </div>
                <div className="w-full">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="50"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full cursor-pointer h-2 rounded-full appearance-none bg-slate-800 accent-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                    <div className="flex justify-between text-gray-400 text-xs">
                        <span>Low</span>
                        <span>Mid</span>
                        <span>Max</span>
                    </div>

                </div>

            </div>

        </div>
    )

}