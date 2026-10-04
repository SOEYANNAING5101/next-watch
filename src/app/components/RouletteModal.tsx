'use client'
import { useState } from 'react'
import { Dices, X, Dice5, Star, Dot, RefreshCcw, MoveRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import CustomDropDown from './CustomDropDown'
import { getUserLists, spinFromList, spinFromDiscoverNew } from '../actions/movie-action'
import { ROULETTE_OPTIONS } from '../lib/roulette-config'


interface CustomList {
    id: string;
    listName: string;
}

export default function RouletteModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'discover-new' | 'my-lists'>('discover-new')
    const [spinState, setSpinState] = useState<'idle' | 'spinning' | 'result'>('idle');
    const [winner, setWinner] = useState<any>(null)

    const [genre, setGenre] = useState(ROULETTE_OPTIONS.genres[0].label);
    const [decade, setDecade] = useState(ROULETTE_OPTIONS.decades[0].label);
    const [language, setLanguage] = useState(ROULETTE_OPTIONS.languages[0].label);

    const [userLists, setUserLists] = useState<CustomList[]>([]);
    const [selectedList, setSelectedList] = useState<string>("Loading lists...")

    const handleClose = async () => {
        setIsOpen(false);
        setSpinState('idle');
        setWinner(null);
        setActiveTab('discover-new')

        setGenre(ROULETTE_OPTIONS.genres[0].label)
        setDecade(ROULETTE_OPTIONS.decades[0].label)
        setLanguage(ROULETTE_OPTIONS.languages[0].label)
    }
    const handleOpen = async () => {
        setIsOpen(true);
        setIsLoading(true);
        try {
            const userLists = await getUserLists();
            setUserLists(userLists);
            if (userLists && userLists.length > 0) {
                setSelectedList(userLists[0].listName)
            } else {
                setSelectedList("No lists found")
            }
        } catch (error) {
            console.error("Failed to fetch lists:", error);
            setSelectedList("No lists found")
        }
        finally {
            setIsLoading(false)
        }
    }

    const handleSpin = async () => {
        if (activeTab == 'my-lists') {
            const targetLists = userLists.find(list => list.listName === selectedList);
            if (!targetLists) {
                console.error("List not found")
                return;
            }
            setSpinState('spinning');
            try {
                const [winningMovie] = await Promise.all([
                    spinFromList(targetLists.id),
                    new Promise((resolve) => setTimeout(resolve, 5000))
                ])
                setWinner(winningMovie)
                setSpinState('result')
            } catch (error) {
                console.error("Error getting the result.", error);
                setSpinState('idle')
            }
        } else {
            setSpinState('spinning');
            try {
                const [winningMovie] = await Promise.all([
                    spinFromDiscoverNew(genre, decade, language),
                    new Promise((resolve) => setTimeout(resolve, 5000))
                ]);
                console.log("winningMovie", winningMovie)
                setWinner(winningMovie)
                setSpinState('result')

            } catch (error) {
                console.error("Error getting the result.", error);
                setSpinState('idle')
            }
        }
    }
    return (
        <div>
            <button onClick={handleOpen}>
                <Dices size={18} />
            </button>
            {isOpen && (
                <div className=" bg-black/70 fixed inset-0 flex items-center justify-center z-60 ">
                    <div className="flex flex-col bg-slate-950 p-6 rounded-lg min-w-[300px] ">
                        {/* Header */}
                        <div className="flex items-center justify-between w-full">
                            <div className='flex flex-col items-start '>
                                <div className='flex gap-2 items-center justify-center'>
                                    <h1 className="text-gray-200 text-lg font-bold">MOVIE ROULETTE</h1>
                                    <span><Dices size={20} /></span>
                                </div>
                                {/* Subtitle */}
                                <p className='text-gray-400 text-xs font-semibold'>
                                    Can&apos;t decide what to stream? Let fate pick your next watch.
                                </p>
                            </div>
                            <button
                                className="text-gray-200 cursor-pointer hover:text-gray-200 hover:rounded-full hover:bg-gray-600 w-10 h-10 flex items-center justify-center transition-all duration-200"
                                onClick={handleClose}><X size={15} />
                            </button>
                        </div>
                        <div className='border-b border-gray-400 w-full mt-4 mb-4'></div>
                        {spinState == 'idle' && (
                            <>
                                {/* Tab */}
                                <div className='flex bg-black w-full p-1 rounded-md'>
                                    <button
                                        onClick={() => setActiveTab('discover-new')}
                                        className={`w-full p-2 text-sm rounded-sm cursor-pointer transition-all duration-200 ${activeTab === 'discover-new'
                                            ? "text-gray-200 font-semibold bg-slate-950 "
                                            : "text-gray-400 bg-transparent"
                                            }`}>
                                        Discover New
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('my-lists')}
                                        className={`w-full p-2 text-sm rounded-sm cursor-pointer transition-all duration-200 ${activeTab === 'my-lists'
                                            ? "text-gray-200 font-semibold bg-slate-950 "
                                            : "text-gray-400 bg-transparent"
                                            }`}>
                                        My List
                                    </button>
                                </div>
                                {/* Body */}
                                <div>
                                    {activeTab === 'discover-new' ? (
                                        <div
                                            className='mt-4 mb-4'>
                                            <CustomDropDown
                                                label='GENRE'
                                                options={ROULETTE_OPTIONS.genres.map(g => g.label)}
                                                value={genre}
                                                onChange={setGenre}
                                            />
                                            <CustomDropDown
                                                label='DECADE / ERA'
                                                options={ROULETTE_OPTIONS.decades.map(g => g.label)}
                                                value={decade}
                                                onChange={setDecade}
                                            />
                                            <CustomDropDown
                                                label='LANGUAGE'
                                                options={ROULETTE_OPTIONS.languages.map(g => g.label)}
                                                value={language}
                                                onChange={setLanguage}
                                            />
                                        </div>
                                    ) : (
                                        <div className='mt-4 mb-4'>
                                            <CustomDropDown
                                                label='SELECT YOUR LIST'
                                                options={userLists.map(list => list.listName)}
                                                value={selectedList}
                                                onChange={setSelectedList}
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    className='w-full mt-5 flex text-black bg-gray-200 items-center font-semibold justify-center p-2 rounded-sm border-2 border-gray-900  hover:scale-105  active:scale-95 cursor-pointer transition-all duration-200'
                                    onClick={handleSpin}>
                                    <Dices size={20} />
                                    <span>SPIN</span>
                                </button>
                            </>
                        )}
                        {spinState === 'spinning' && (
                            <div className='mt-20 flex flex-col items-center justify-between text-center h-full'>
                                <div className='relative flex items-center justify-center mb-10'>
                                    <div className='absolute w-25 h-25 p-5 rounded-full border-4 border-slate-600 border-t-gray-200 animate-spin duration-200'></div>
                                    <Dice5
                                        size={35}
                                        className='text-gray-200' />
                                </div>
                                <p className='font-semibold text-gray-200'>Rolling ...</p>
                                <span className='text-gray-400 text-sm max-w-md'>Finding something great to watch</span>
                                <button
                                    onClick={() => setSpinState('idle')}
                                    className='w-full mt-15 flex text-gray-200 items-center font-semibold justify-center p-2 rounded-sm border-2 border-gray-900 bg-slate-950 hover:bg-slate-900 hover:scale-105 hover:border-slate-900 active:scale-95 cursor-pointer transition-all duration-200'
                                >Cancel</button>

                            </div>
                        )}
                        {spinState === 'result' && (
                            <div className='h-full flex flex-col items-center justify-center'>
                                {winner.poster_path ? (
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w500${winner.poster_path}`}
                                        alt={winner.title}
                                        className='rounded-sm mt-4 mb-4 border-2 border-slate-800'
                                        width={200}
                                        height={300}
                                    />
                                ) : (
                                    <div>No Poster</div>
                                )}
                                <h2 className='text-gray-200 font-bold text-lg mb-2'>
                                    {winner.title}
                                </h2>
                                <div className='flex items-center text-xs text-gray-400'>
                                    <span className='mr-1'><Star color='#ffe224' size={15} fill='#ffe224' /></span>
                                    <span className='text-[#ffe224] '>{winner.vote_average ? winner.vote_average.toFixed(1) : "N/A"}</span>
                                    <span className=''><Dot /></span>
                                    <span className=''>{winner.release_date ? winner.release_date.split("-")[0] : 'N/A'}</span>
                                    <span className=''><Dot /></span>

                                    {winner.genres && winner.genres.length > 0 && (
                                        <>
                                            <span>{winner.genres.map((g: any) => g.name).slice(0, 2).join(', ')}</span>
                                        </>
                                    )}
                                </div>
                                <p className='text-gray-400 text-xs mb-3 px-2 line-clamp-3 leading-relaxed max-w-sm md:max-w-md text-center'>{winner.overview || "No overview available"}</p>
                                <Link
                                    href={`/movie/${winner.id}`}
                                    onClick={handleClose}
                                    className='w-full mt-3 flex gap-2 text-black bg-gray-200 items-center font-semibold justify-center p-2 rounded-sm border-2 border-gray-900 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-200'
                                >
                                    <span>View Movie details</span>
                                    <ArrowRight size={15} />
                                </Link>
                                <button
                                    onClick={() => { setSpinState('idle') }}
                                    className='w-full mt-3 text-gray-200 flex gap-2 items-center font-semibold justify-center p-2 rounded-sm border-2 border-gray-900 bg-slate-950 hover:bg-slate-900 hover:border-slate-900 hover:scale-105 active:scale-95 cursor-pointer transiton-all duration-200'
                                >
                                    <RefreshCcw size={15} />
                                    <span>Spin Again</span>
                                </button>

                            </div>
                        )}

                    </div>
                </div>
            )
            }
        </div >
    )
}