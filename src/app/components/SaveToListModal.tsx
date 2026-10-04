'use client'

import React, { useState } from "react"
import { getListStatus, toggleMovieInList, createCustomLists } from "../actions/movie-action";
import { X, Plus, Check } from 'lucide-react'
import {toast} from 'sonner'

interface CustomList {
    id: string;
    listName: string;
    userId?: string;
    isPublic?: boolean | null;
    createdAt?: Date
}
interface SaveToListModalProps {
    movieId: number
}
export default function SaveToListModal({ movieId }: SaveToListModalProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lists, setLists] = useState<CustomList[]>([]);
    const [savedListIds, setSavedListIds] = useState<string[]>([])
    const [newListName, setNewListName] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [showInputForm, setShowInputForm] = useState(false);
    const handleOpen = async () => {
        setIsOpen(true);
        setIsLoading(true)
        const data = await getListStatus(movieId);
        setLists(data?.lists || []);
        setSavedListIds(data?.savedListIds || []);
        setIsLoading(false);
    }
    const handleToggle = async (listId: string) => {
        const isCurrentlySaved = savedListIds.includes(listId);
        if (isCurrentlySaved) {
            toast.success("Removed from the list.")
            setSavedListIds(savedListIds.filter(id => id != listId))
        } else {
            toast.success("Added to the list.")
            setSavedListIds([...savedListIds, listId])
        }
        await toggleMovieInList(listId, movieId)
    }
    const handleCreateList = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newListName.trim()) return;
        setIsCreating(true);
        const result = await createCustomLists(newListName);
        if (result?.list) {
            toast.success("Created new list.")
            setNewListName("");
            setLists([...lists, result.list as CustomList])
            setShowInputForm(false);
            await handleToggle(result.list.id)
        }
        setIsCreating(false);
    }
    return (
        <div >
            <button
                onClick={handleOpen}
                className="flex items-center justify-center text-sm text-gray-200 hover:text-[#68c9da] font-semibold rounded-sm px-4 py-1.5 border border-gray-800 bg-gray-900 cursor-pointer transition-colors duration-200">
                <Plus size={18} />
                <span>ADD TO LIST</span>
            </button>
            {isOpen && (
                <div className=" bg-black/70 fixed inset-0 flex items-center justify-center z-60 ">
                    <div className="flex flex-col bg-slate-950 items-center justify-center p-4 rounded-lg min-w-[300px]">
                        {/* Header */}
                        <div className="flex items-center justify-between w-full mb-2">
                            <h1 className="text-gray-200 text-lg font-bold">Add to List</h1>
                            <button
                                className="text-gray-200 cursor-pointer hover:text-gray-200 hover:rounded-full hover:bg-gray-600 w-10 h-10 flex items-center justify-center transition-all duration-200"
                                onClick={() => setIsOpen(false)}><X size={15} /></button>
                        </div>
                        {/* Lists */}
                        <div className="flex flex-col items-center justify-between mb-4 gap-2 w-full max-h-[300px] overflow-y-auto">
                            {isLoading ? (
                                <div className="text-gray-400 flex items-center justify-center gap-3 p-2">
                                    <div className="w-5 h-5 rounded-full animate-spin border-2 border-gray-400 border-t-transparent"></div>
                                    <span>Loading lists ...</span>
                                </div>
                            ) : lists.length === 0 ? (
                                <div>No list</div>
                            ) : lists.map((list) => {
                                const isChecked = savedListIds.includes(list.id)
                                return (
                                    <div
                                        key={list.id}
                                        className="text-gray-400 flex justify-between items-center border border-gray-800 w-full px-4 py-2 rounded-sm cursor-pointer hover:bg-gray-900"
                                        onClick={() => handleToggle(list.id)}>
                                        <span className="text-gray-200">{list.listName}</span>
                                        <div
                                            className="w-5 h-5 flex items-center justify-center bg-transparent rounded focus:ring-0 focus:ring-offset-0 border border-gray-800 cursor-pointer">
                                            {isChecked && (
                                                <Check size={15} />
                                            )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                            )}
                        </div>
                        {/* Create new button */}
                        <div className="w-full">
                            {!showInputForm ? (
                                <button
                                    onClick={() => setShowInputForm(true)}
                                    className="text-gray-400 flex items-center justify-center gap-2 w-full border p-2 cursor-pointer hover:bg-gray-900 transition-all">
                                    <span><Plus size={15} /></span>
                                    <span>Create new list</span>
                                </button>
                            ) : (
                                <form
                                    onSubmit={handleCreateList}
                                    className="flex gap-2 w-full">
                                    <input
                                        type="text"
                                        value={newListName}
                                        onChange={(e) => setNewListName(e.target.value)}
                                        disabled={isCreating}
                                        autoFocus
                                        className="text-gray-400 border border-gray-800 px-4 py-2 rounded-sm focus:ring-0 focus:ring-offset-0">
                                    </input>
                                    <button
                                        type="submit"
                                        disabled={isCreating}
                                        className="text-gray-200 rounded-sm bg-blue-600 px-4 cursor-pointer hover:bg-blue-700 disabled:opacity-50 transition-all">
                                        {isCreating ? <span>Loading</span> : <span>Save</span>}
                                    </button>

                                </form>
                            )}

                        </div>


                    </div>
                </div>
            )}
        </div>
    )
}