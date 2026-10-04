import { Dot, Pencil, Link, Save } from 'lucide-react'
import { STANDOUT_ELEMENTS, BRAIN_POWER_OPTIONS, ATTENTION_OPTIONS } from '../lib/vibe-rating-config'
interface RatingResultProps {
    movieTitle: string;
    releaseYear: string;
    director: string;
    technicalScore: number;
    finalScore: number;
    finalVerdict: { label: string, points: number };
    vibes: { attention: string, brainPower: string, standoutElements: string[] };
    onSave: () => void;
    onEdit: () => void;
    onShare: () => void;
}
export default function RatingResult({ movieTitle, releaseYear, director, technicalScore, finalScore, finalVerdict, vibes, onSave, onEdit, onShare }: RatingResultProps) {
    const formattedVibes = [
        ATTENTION_OPTIONS[vibes.attention],
        vibes.brainPower
            ? `${BRAIN_POWER_OPTIONS.find(o => o.label === vibes.brainPower)?.emoji || ''} ${vibes.brainPower}`.trim()
            : null,
        ...vibes.standoutElements.map(element => {
            const match = STANDOUT_ELEMENTS.find(o => o.label === element);
            return match ? `${match.emoji} ${match.label}` : element
        })
    ].filter(Boolean)
    return (
        <div className="flex flex-col text-start items-left ">
            <div className="flex gap-1 items-center font-semibold  text-gray-400 tracking-wide uppercase text-[9px]">
                <span>FEATURE FILM</span>
                <span className=''><Dot /></span>
                <span>118 MINS</span>
                <span className=''><Dot /></span>
                <span>4K DCP</span>
            </div>
            <div className='flex gap-1 items-center'>
                <h3 className='text-gray-200 text-lg md:text-xl font-bold tracking-wide'>{movieTitle}</h3>
                <span className='text-gray-400 text-lg md:text-xl font-semibold tracking-wide'>({releaseYear})</span>
            </div>
            <span className='text-gray-400 text-xs font-semibold tracking-wide'>Directed by {director}</span>
            <div className='w-full mt-4 mb-4 p-5 bg-slate-900 rounded-lg border border-slate-500/50 shadow-inner'>
                <span className='text-gray-400 text-xs font-semibold tracking-wide'>FINAL CALIBRATED SCORE</span>
                <div className='flex items-center'>
                    <span className='text-gray-200 text-lg font-bold tracking-wide'>{finalScore}<span className='text-gray-400 text-sm font-semibold tracking-wide'> /100</span></span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='text-gray-300 text-sm font-bold tracking-wide'>{finalVerdict.label}</span>
                    <span className='text-gray-400 text-xs font-bold tracking-wide'>Emotional Takeaway +{finalVerdict.points} pts</span>
                </div>
            </div>
            <div className='flex items-center justify-between text-gray-400 text-xs font-semibold tracking-wide'>
                <span>SCORE CALCULATION LEDGER</span>
                <span>PTS ALLOCATED</span>
            </div>
            <div className='border border-gray-700 w-full mt-2 mb-4'></div>
            <div className='flex items-center justify-between mb-2'>
                <span className='text-gray-200 text-sm text font-bold tracking-wide'>Technical Score</span>
                <span className='text-gray-300 text-xs font-bold tracking-wide'>{technicalScore} / 80 pts</span>
            </div>
            <div className='flex items-center justify-between'>
                <span className='text-gray-200 text-sm text font-bold tracking-wide'>Final Verdict Score</span>
                <span className='text-gray-300 text-xs font-bold tracking-wide'>+ {finalVerdict.points} pts</span>
            </div>
            <div className='border border-gray-700 w-full mt-4 mb-4'></div>
            <div className='flex items-center justify-between mb-4'>
                <span className='text-gray-200 text-sm text font-bold tracking-wide'>Final Calibrated Score</span>
                <span className='text-gray-300 text-xs font-bold tracking-wide'>{finalScore} / 100 pts</span>
            </div>

            <div>
                <span className='text-gray-400 text-xs font-semibold tracking-wide'>VIBE DNA SIGNATURE</span>
                <div className='flex flex-wrap gap-2 mt-2'>
                    {formattedVibes.map((vibe, i) => (
                        <div key={i} className='text-gray-400 text-xs font-semibold tracking-wide px-2 py-1 bg-slate-900 rounded-md border border-slate-500/50 flex'>
                            {vibe}
                        </div>
                    ))}
                </div>
            </div>
            <div className='border border-gray-700 w-full mt-4 mb-4'></div>
            {/* Footer */}
            <div className='flex items-center justify-between'>
                <button
                    onClick={onEdit}
                    className={`flex  gap-2 items-center justify-center p-2 rounded-sm transition-all duration-200 text-black bg-gray-200 font-bold hover:scale-105 cursor-pointer`}>
                    <span><Pencil size={15} /></span>
                    <span>Edit</span>
                </button>
                <div className='flex gap-2'>
                    <button
                        onClick={onShare}
                        className={`flex gap-2 items-center justify-center p-2 rounded-sm transition-all duration-200 text-gray-200  rounded-md border border-slate-500/50 font-bold hover:scale-105 cursor-pointer`}>
                        <span><Link size={15} /></span>
                        <span>Share Preview</span>
                    </button>
                    <button
                        onClick={onSave}
                        className={`flex gap-2 items-center justify-center p-2 rounded-sm transition-all duration-200 text-black bg-gray-200 font-bold hover:scale-105 cursor-pointer`}>
                        <span><Save size={15} /></span>
                        <span>Save</span>
                    </button>
                </div>

            </div>




        </div>
    )

}