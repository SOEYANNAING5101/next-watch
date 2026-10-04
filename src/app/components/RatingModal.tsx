'use client'
import { useState } from 'react';
import { X, ArrowRight, SquareDashedKanban, ArrowLeft, Star } from 'lucide-react'
import AttentionTest from './AttentionTest';
import BrainPowerToggle from './BrainPowerToggle';
import StandoutFilmStrip from './StandoutFilmStrip'
import FinalVerdictSelection from './FinalVerdictSelection';
import RatingResult from './RatingResult'
import { saveMoveRating } from '../actions/movie-action'
import { STANDOUT_ELEMENTS, BRAIN_POWER_OPTIONS, ATTENTION_OPTIONS, VERDICT_OPTIONS } from '../lib/vibe-rating-config'
import {toast} from 'sonner'
export interface RatingData {
    acting: number;
    plot: number;
    cinematography: number;
    pacing: number;
    verdict: number;
    finalScore: number;
    attentionTest: string;
    brainPower: string;
    standoutElements: string[]
}
interface RatingModalProps {
    movieId: number;
    movieTitle: string;
    releaseYear: string;
    director: string;
    initialData?: RatingData | null;
}
export default function RatingModal({ movieId, movieTitle, releaseYear, director, initialData }: RatingModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(initialData ? 4 : 1);
    const [isSaving, setIsSaving] = useState(false)
    const [scores, setScores] = useState({
        acting: initialData?.acting || 0,
        plot: initialData?.plot || 0,
        cinematography: initialData?.cinematography || 0,
        pacing: initialData?.pacing || 0
    });
    const [vibes, setVibes] = useState({
        attention: initialData?.attentionTest || '50',
        brainPower: initialData?.brainPower || '',
        standoutElements: initialData?.standoutElements || [] as string[]
    })

    const [finalVerdict, setFinalVerdict] = useState(() => {
        if (!initialData) return { label: '', points: 0 }
        const match = VERDICT_OPTIONS.find((v => v.points === initialData.verdict))
        return {
            label: match?.label || "",
            points: initialData.verdict
        }
    })

    const labels = ['VERY BAD', 'BAD', 'AVERAGE', 'GOOD', 'EXCELLENT']

    const handleClose = async () => {
        setIsOpen(false)
    }
    const handleScoreSelect = (category: keyof typeof scores, value: number) => {
        setScores((prev) => ({ ...prev, [category]: value * 4 }))
    }
    const handleVibeSelect = (category: 'attention' | 'brainPower', value: string) => {
        setVibes((prev) => ({ ...prev, [category]: value }))
    }
    const handleMvpSelect = (value: string) => {
        setVibes((prev) => {
            if (prev.standoutElements.includes(value)) {
                return {
                    ...prev,
                    standoutElements: prev.standoutElements.filter((item) => item !== value)
                }
            }
            if (prev.standoutElements.length >= 2) {
                return prev
            }
            return {
                ...prev,
                standoutElements: [...prev.standoutElements, value]
            }
        })
    }
    const handleSaveRating = async () => {
        setIsSaving(true)
        const payload = {
            tmdbId: movieId,
            acting: scores.acting,
            plot: scores.plot,
            cinematography: scores.cinematography,
            pacing: scores.pacing,
            verdict: finalVerdict.points,
            finalScore: finalScore,
            attentionTest: vibes.attention,
            brainPower: vibes.brainPower,
            standoutElements: vibes.standoutElements
        };
        const result = await saveMoveRating(payload);
        if (result.success) {
            toast.success("Successfully saved. ")
            handleClose();
        } else (
            toast.error("Error saving rating, please try again!")
        )

    }

    const currentBaseScore = (scores.acting + scores.plot + scores.cinematography + scores.pacing);
    const canProceedToStage2 = scores.acting > 0 && scores.plot > 0 && scores.cinematography > 0 && scores.pacing > 0;
    const canProceedToStage3 = vibes.attention != "" && vibes.brainPower != "" && vibes.standoutElements.length > 0;
    const finalScore = currentBaseScore + finalVerdict.points

    return (
        <>
            {initialData ? (
                <div
                    onClick={() => setIsOpen(true)}
                    className='flex items-center justify-center gap-2 cursor-pointer group transition duration-200 hover:opacity-80 '>
                    <div className='flex gap-1 items-center justify-center'>
                        <Star color='#3099ca' size={16} fill='#3099ca' />
                        <span className='text-[#3099ca] text-sm font-bold'>{initialData.finalScore}</span>
                        <span className='text-gray-400 text-xs'>/100</span>
                    </div>
                    <span className='text-gray-400'>|</span>
                    <span className='text-gray-400 text-sm'>{ATTENTION_OPTIONS[initialData.attentionTest]}</span>
                    <span className='text-gray-400'>|</span>
                    <span className='text-gray-400 text-sm'>{BRAIN_POWER_OPTIONS.find((o) => o.label === initialData.brainPower)?.emoji}{initialData.brainPower}</span>
                    <div
                        className={`flex items-center justify-center gap-2 text-sm font-semibold rounded-sm px-4 py-1.5 border border-gray-800 bg-gray-900 cursor-pointer transition-colors duration-200}`}>
                        {initialData.standoutElements.map((element) => {
                            const match = STANDOUT_ELEMENTS.find((o) => o.label === element);
                            return (
                                <span key={element} className='text-gray-400 text-sm'>
                                    {match ? `${match.emoji} ${match.label}` : element}
                                </span>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className='flex items-center justify-center gap-2 text-sm text-gray-200 hover:text-[#68c9da] font-semibold rounded-sm px-4 py-1.5 border border-gray-800 bg-gray-900 cursor-pointer transition-colors duration-200 '>
                    <span>
                        <Star size={20} color='#68c9da' />
                    </span>Rate this
                </button>
            )}

            {isOpen && (
                <div className=" bg-black/70 fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
                    <div className="relative overflow-hidden flex flex-col bg-slate-950 p-6 rounded-lg w-full min-w-[400px] max-w-[450px]">

                        {/* Progress Bar */}
                        {step < 4 && (
                            <div className='absolute top-0 left-0 w-full bg-slate-950 h-1 overflow-hidden'>
                                <div
                                    className='h-full bg-gray-200 transition-all duration-200'
                                    style={{ width: `${step / 3 * 100}%` }} />
                            </div>
                        )}
                        <div className='flex items-center justify-between'>
                            {/* Header */}
                            {step < 4 ? (
                                <div>
                                    {/* Movie Title */}
                                    <span className='text-gray-300 text-xs font-semibold'>{movieTitle}</span>

                                    <div className='flex gap-3'>
                                        {/* Heading */}
                                        <h2 className='text-gray-200 font-bold text-lg md:text-2xl'>{step === 1 ? 'The Technicals' : step === 2 ? "The Vibe Check" : "The Verdict"}</h2>

                                        {/* Stage */}
                                        <div className='rounded-sm bg-gray-700 flex p-1 items-center justify-center text-xs font-semibold text-gray-200 tracking-wider uppercase'>
                                            <span> Stage 0{step} /03</span>
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <div></div>
                            )}
                            {/* Close Button */}

                        </div>
                        <button
                            className="absolute top-5 right-5 text-gray-200 cursor-pointer hover:text-gray-200 hover:rounded-full hover:bg-gray-600 w-10 h-10 flex items-center justify-center transition-all duration-200"
                            onClick={handleClose}><X size={15} />
                        </button>
                        {/* Body */}
                        {step === 1 && (
                            <div className='mt-4'>
                                {/* Body */}
                                {(['acting', 'plot', 'cinematography', 'pacing'] as const).map((category) => (
                                    <div key={category}
                                        className='mb-4'
                                    >
                                        {/* Label & Scores */}
                                        <div className='flex items-center justify-between mb-1'>
                                            <h3 className='text-gray-200 font-semibold text-sm'>
                                                {category === 'acting' ? "Acting & Performance"
                                                    : category === 'plot' ? "Plot & Narrative"
                                                        : category === 'cinematography' ? "Cinematography & Visuals"
                                                            : "Pacing & Flow"}
                                            </h3>
                                            <span className='text-slate-500 font-bold text-xs'>
                                                {scores[category]} /20 PTS
                                            </span>
                                        </div>
                                        {/* Rating boxes */}
                                        <div className={`w-full bg-black flex gap-1 rounded-md p-1 transition-all duration-all`}>
                                            {[1, 2, 3, 4, 5].map((val) => (
                                                <button
                                                    className={`w-full flex flex-col p p-1 font-semibold cursor-pointer transition-all rounded-sm duration-200   ${scores[category] / 4 === val
                                                        ? "bg-gray-200 text-gray-800"
                                                        : "text-gray-400 hover:bg-gray-200 hover:text-gray-800"
                                                        }`}
                                                    onClick={() => handleScoreSelect(category, val)}
                                                    key={val}>
                                                    <span className='text-sm '>{val}</span>
                                                    <span className='text-xs '>{labels[val - 1]}</span>

                                                </button>
                                            ))}
                                        </div>

                                    </div>
                                ))}
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center justify-center'>
                                        <span className='text-gray-400 text-sm font-semibold mr-4 flex items-center justify-center gap-1'>
                                            <SquareDashedKanban className='text-gray-400' size={20} />
                                            SUBTOTAL SCORE</span>
                                        <span className='text-gray-200 text-sm font-bold'>{currentBaseScore}</span>
                                        <span className='text-gray-400 text-sm font-semibold'>/80</span>
                                    </div>
                                    {/* Footer */}
                                    <div className='flex items-end'>
                                        {/* Next Button */}
                                        <button
                                            disabled={!canProceedToStage2}
                                            onClick={() => setStep(2)}
                                            className={`flex  gap-2 items-center justify-center p-2 rounded-sm transition-all duration-200 ${canProceedToStage2
                                                ? "text-black bg-gray-200 font-bold hover:scale-105 cursor-pointer"
                                                : "text-gray-400 bg-gray-800 cursor-not-allowed"
                                                }`}>
                                            <span>Next</span>
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>


                            </div>
                        )}
                        {step === 2 && (
                            <div className='mt-4'>
                                {/* Attention Test */}
                                <AttentionTest
                                    value={vibes.attention}
                                    onChange={(val) => handleVibeSelect('attention', val)} />
                                <BrainPowerToggle
                                    value={vibes.brainPower}
                                    onChange={(val) => handleVibeSelect('brainPower', val)} />
                                <StandoutFilmStrip
                                    selected={vibes.standoutElements}
                                    onChange={(val) => handleMvpSelect(val)} />


                                {/* Footer */}
                                <div className='flex items-center justify-between'>
                                    <button
                                        onClick={() => setStep(1)}
                                        className={`flex  gap-2 items-center justify-center p-2 rounded-sm transition-all duration-200 text-black bg-gray-200 font-bold hover:scale-105 cursor-pointer`}>
                                        <ArrowLeft size={20} />
                                        <span>Previous</span>
                                    </button>
                                    <button
                                        disabled={!canProceedToStage3}
                                        onClick={() => setStep(step + 1)}
                                        className={`flex  gap-2 items-center justify-center p-2 rounded-sm transition-all duration-200 ${canProceedToStage3
                                            ? "text-black bg-gray-200 font-bold hover:scale-105 cursor-pointer"
                                            : "text-gray-400 bg-gray-800 cursor-not-allowed"
                                            }`}>
                                        <span>Next</span>
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className='mt-4'>
                                <FinalVerdictSelection
                                    selectedLabel={finalVerdict.label}
                                    onChange={setFinalVerdict}
                                />
                                {/* Footer */}
                                <div className='flex items-center justify-between'>
                                    <button
                                        onClick={() => setStep(2)}
                                        className={`flex  gap-2 items-center justify-center p-2 rounded-sm transition-all duration-200 text-black bg-gray-200 font-bold hover:scale-105 cursor-pointer`}>
                                        <ArrowLeft size={20} />
                                        <span>Previous</span>
                                    </button>
                                    <button
                                        disabled={finalVerdict.label === ''}
                                        onClick={() => setStep(4)}
                                        className={`flex  gap-2 items-center justify-center p-2 rounded-sm transition-all duration-200 ${finalVerdict.label !== ''
                                            ? "text-black bg-gray-200 font-bold hover:scale-105 cursor-pointer"
                                            : "text-gray-400 bg-gray-800 cursor-not-allowed"
                                            }`}>
                                        <span>Next</span>
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                        {step === 4 && (
                            <div>
                                <RatingResult
                                    movieTitle={movieTitle}
                                    releaseYear={releaseYear}
                                    director={director}
                                    technicalScore={currentBaseScore}
                                    vibes={vibes}
                                    finalScore={finalScore}
                                    finalVerdict={finalVerdict}
                                    onShare={() => console.log("Share Modal Opened")}
                                    onEdit={() => setStep(3)}
                                    onSave={handleSaveRating}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}