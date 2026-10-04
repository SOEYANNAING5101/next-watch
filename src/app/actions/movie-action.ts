'use server'
import { db } from '../../db/index';
import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { eq, and } from 'drizzle-orm'
import { watchedMovies, customLists, listItems, movieRatings } from '../../db/schema'
import { revalidatePath } from 'next/cache';
import { getMovieDetails } from '../lib/tmdb';
import { ROULETTE_OPTIONS } from '../lib/roulette-config';
import { Zap } from 'lucide-react';

export async function checkIfWatched(movieId: number) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        return false
    }
    const record = await db
        .select()
        .from(watchedMovies)
        .where(
            and(
                eq(watchedMovies.userId, session.user.id),
                eq(watchedMovies.tmdbId, movieId)
            )
        );
    return record.length > 0;
}
export async function toggleWatch(movieId: number) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        return { error: "You must be logged in to do this." }
    }
    const userId = session.user.id
    const existingRecord = await db
        .select()
        .from(watchedMovies)
        .where(
            and(
                eq(watchedMovies.userId, userId),
                eq(watchedMovies.tmdbId, movieId)
            )
        )
    if (existingRecord.length > 0) {
        await db
            .delete(watchedMovies)
            .where(
                and(
                    eq(watchedMovies.userId, userId),
                    eq(watchedMovies.tmdbId, movieId)
                )
            );
        revalidatePath("/my-list")
        return { isWatched: false }
    } else {
        await db
            .insert(watchedMovies)
            .values({
                userId: userId,
                tmdbId: movieId
            });
        revalidatePath("/my-list")
        return { isWatched: true }
    }
}
export async function getWatchedMovies() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        return []
    }
    const records = await db
        .select()
        .from(watchedMovies)
        .where(eq(watchedMovies.userId, session.user.id))
        .orderBy(watchedMovies.createdAt);
    return records;
}
export async function getListStatus(movideId: number) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        return {
            lists: [],
            savedListIds: []
        }
    }
    const userLists = await db
        .select()
        .from(customLists)
        .where(eq(customLists.userId, session.user.id));
    const savedItems = await db
        .select()
        .from(listItems)
        .where(eq(listItems.tmdbId, movideId.toString()))
    const savedListIds = savedItems.map(item => item.listId)
    return { lists: userLists, savedListIds }
}
export async function toggleMovieInList(listId: string, movieId: number) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) throw new Error("Please log in to continue.")

    const existing = await db
        .select()
        .from(listItems)
        .where(
            and(
                eq(listItems.listId, listId),
                eq(listItems.tmdbId, movieId.toString())
            ))
    if (existing.length > 0) {
        await db
            .delete(listItems)
            .where(
                and(
                    eq(listItems.listId, listId),
                    eq(listItems.tmdbId, movieId.toString())
                ))
    } else {
        await db
            .insert(listItems)
            .values({ listId: listId, tmdbId: movieId.toString() })
    }
    revalidatePath('/movie/[id]', 'page')
}
export async function createCustomLists(listname: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) throw new Error("Please log in to continue.")
    const newList = await db
        .insert(customLists)
        .values({
            userId: session.user.id,
            listName: listname
        })
        .returning()

    revalidatePath("/movie/[id]")
    return { list: newList[0] }
}
export async function getUserLists() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) return []
    const lists = await db
        .select()
        .from(customLists)
        .where(eq(customLists.userId, session.user.id))
    return lists;
}
export async function getListItems(listId: string) {
    const items = await db
        .select()
        .from(listItems)
        .where(eq(listItems.listId, listId))
    return items;
}
export async function spinFromList(listId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) throw new Error("Please log in")

    const items = await db
        .select()
        .from(listItems)
        .where(eq(listItems.listId, listId))
    if (items.length === 0) throw new Error("List is empty")
    const randomIndex = Math.floor(Math.random() * items.length);
    const winningItem = items[randomIndex]
    const winningMovie = await getMovieDetails(winningItem.tmdbId)
    return winningMovie
}
export async function spinFromDiscoverNew(genreLabel: string, decadeLabel: string, languageLabel: string) {

    const BASE_URL = "https://api.themoviedb.org/3/discover/movie";
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}` }
    };

    const selectedGenre = ROULETTE_OPTIONS.genres.find(g => g.label == genreLabel);
    const genreIds = selectedGenre ? selectedGenre.value : "";

    const selectedDecade = ROULETTE_OPTIONS.decades.find(d => d.label == decadeLabel);
    const dates = selectedDecade ? selectedDecade.value : { gte: "", lte: "" };

    const selectedLanguage = ROULETTE_OPTIONS.languages.find(l => l.label === languageLabel);
    const langCode = selectedLanguage ? selectedLanguage.value : "";

    const queryParams = new URLSearchParams({
        include_adult: 'false',
        include_video: 'false',
        sort_by: 'popularity.desc'
    })
    if (genreIds) queryParams.append('with_genres', genreIds);
    if (dates.gte) queryParams.append('primary_release_date.gte', dates.gte);
    if (dates.lte) queryParams.append('primary_release_date.lte', dates.lte);
    if (langCode) queryParams.append('with_original_language', langCode);

    try {
        const firstResponse = await fetch(`${BASE_URL}?${queryParams.toString()}`, options);
        const data = await firstResponse.json();
        if (!data.results || data.results.length === 0) {
            throw new Error("No movies found matching these filters")
        }

        const total_pages = Math.min(data.total_pages, 500);
        const randomPage = Math.floor(Math.random() * total_pages) + 1;

        queryParams.append('page', randomPage.toString());
        const finalResponse = await fetch(`${BASE_URL}?${queryParams.toString()}`, options);
        const finalData = await finalResponse.json();

        const randomMovieIndex = Math.floor(Math.random() * finalData.results.length);
        const winningMovie = finalData.results[randomMovieIndex];

        const fullMovieDetails = await getMovieDetails(winningMovie.id);
        return fullMovieDetails

    } catch (error) {
        console.error("Error fetaching movie.", error)
        throw error;
    }
}
interface RatingPayload {
    tmdbId: number;
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
export async function saveMoveRating(data: RatingPayload) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session) {
            return { success: false, error: "You must be logged in to save a rating." };
        }

        const userId = session.user.id;
        const payLoad = {
            acting: data.acting,
            plot: data.plot,
            cinematography: data.cinematography,
            pacing: data.pacing,
            verdict: data.verdict,
            finalScore: data.finalScore,
            attentionTest: data.attentionTest,
            brainPower: data.brainPower,
            standoutElements: data.standoutElements
        }
        const existingRecord = await db
            .select()
            .from(movieRatings)
            .where(
                and(
                    eq(movieRatings.userId, userId),
                    eq(movieRatings.tmdbId, data.tmdbId)
                )
            )
        if (existingRecord.length > 0) {
            await db
                .update(movieRatings)
                .set(payLoad)
                .where(
                    and(
                        eq(movieRatings.userId, userId),
                        eq(movieRatings.tmdbId, data.tmdbId)
                    )
                )
        } else {
            await db.insert(movieRatings).values({
                userId: userId,
                tmdbId: data.tmdbId,
                ...payLoad
            })
        }

        revalidatePath(`/movies/${data.tmdbId}`)
        return { success: true }

    } catch (error) {
        console.error("Failed to save rating:", error)
        return { success: false, error: "Failed to save to database." }
    }
}
export async function getMoveRating(movieId: number) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
        return null
    }
    const record = await db
        .select()
        .from(movieRatings)
        .where(
            and(
                eq(movieRatings.userId, session.user.id),
                eq(movieRatings.tmdbId, movieId)
            )
        )
        .limit(1);
    return record.length>0 ? record[0]:null
}