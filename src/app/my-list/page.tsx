import { getWatchedMovies, getUserLists, getListItems } from "../actions/movie-action";
import { getMovieDetails } from '../lib/tmdb'
import { auth } from "../lib/auth";
import { headers } from 'next/headers'
import MovieRow from "../components/MovieRow"


export default async function MyListPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const fetchWatchedMovies = async () => {
        const watchedRecords = await getWatchedMovies();
        return Promise.all(
            watchedRecords.map((record) => getMovieDetails(record.tmdbId.toString()))
        )
    }
    const fetchUserLists = async () => {
        const userLists = await getUserLists();
        const result = [];
        for (const list of userLists) {
            const dbItems = await getListItems(list.id);
            const movies = await Promise.all(
                dbItems.map(async (movie) => await getMovieDetails(movie.tmdbId))
            );
            result.push({...list, movies}) 
        }
        return result;

    }
    const [watchedMovies, listsWithMovies] = await Promise.all([
        fetchWatchedMovies(),
        fetchUserLists()
    ])

    return (
        <div className="p-10 text-white">
            {watchedMovies.length > 0 && (
                <div>
                    <MovieRow
                        title="Watched Movies"
                        movies={watchedMovies}
                        seeAllHref="" />
                </div>
            )}
            {listsWithMovies.length === 0 ? (
                <p>No custom lists</p>
            ) : (
                listsWithMovies.map((list) => (
                    <div key={list.id}>
                        <MovieRow
                            title={list.listName}
                            movies={list.movies}
                            seeAllHref=""
                        />
                    </div>
                ))
            )}


        </div>
    )
}