import { getMovieDetails } from '../../lib/tmdb'
import BackButton from '../../components/BackButton'
import TrailerButton from '../../components/TrailerButton'
import WatchedButton from '../../components/WatchedButton'
import SaveToListModal from "../../components/SaveToListModal"
import RatingModal from '../../components/RatingModal'
import { checkIfWatched, getMoveRating } from '../../actions/movie-action'
import { STANDOUT_ELEMENTS, BRAIN_POWER_OPTIONS, ATTENTION_OPTIONS } from '../../lib/vibe-rating-config'
import Image from 'next/image'
import { Dot, Star } from 'lucide-react'
interface PageProps {
    params: Promise<{
        id: string;
    }>
}
export default async function MovieDetailPage({ params }: PageProps) {

    const id = await params;
    const movie = await getMovieDetails(id.id);
    const isWatched = await checkIfWatched(id.id)
    const personalRating = await getMoveRating(movie.id)
    const backDropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "https://via.placeholder.com/1920x1080?text=No+Background"
    const posterPath = movie.poster_path
        ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
        : "https://via.placeholder.com/1920x1080?text=No+Background"
    const release_Year = movie.release_date ? movie.release_date.split("-")[0] : "";
    const casts = movie.credits.cast.slice(0, 5);
    const director = movie.credits.crew.find((member: any) => member.job === 'Director')?.name || "Unknown Director";


    return (
        <div className='min-h-screen bg-slate-950'>
            <div className='relative h-[70vh] md:h-[80vh] w-full'>
                <BackButton />
                <Image
                    src={backDropUrl}
                    alt={movie.title}
                    className='object-cover'
                    fill
                    priority />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent'></div>
                <div className='absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent'></div>
                <div className='absolute bottom-0 left-0 z-10 w-full p-6 mb:p-15 md:flex'>
                    {/* Poster */}
                    <div className='w-full max-w-[150px] md:max-w-[200px]'>
                        <Image
                            src={posterPath}
                            alt={movie.title}
                            height={300}
                            width={200}
                            className='rounded-lg backdrop-blur-2'
                        />
                    </div>
                    <div className='p-6 flex flex-col items-start justify-center'>
                        {/* Movie Title */}
                        <h1 className="flex items-center justify-center gap-4 text-gray-200 text-xl md:text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg mb-2">
                            {movie.title}

                        </h1>
                        {/* Release date, Age Rating, Runtime */}
                        <div className='text-gray-400 text-xs flex items-center justify-center mb-2'>
                            <span className=''>{release_Year}</span>
                            <span className=''><Dot /></span>
                            <span className=''>{movie.certification}</span>
                            <span className=''><Dot /></span>
                            <span className=''>{movie.runtime}m</span>
                        </div>
                        {/* Ratings */}
                        <div className='flex md:flex-row flex-col items-center md:items-center gap-2 md:justify-center tracking-wide mb-4'>
                            <div className='flex gap-1 items-center justify-center'>
                                <Star color='#ffe224' size={16} fill='#ffe224' />
                                <span className='text-[#ffe224] text-sm font-bold'>{movie.vote_average.toFixed(1)}</span>
                                <span className='text-gray-400 text-xs'>/10</span>
                            </div>
                            <span className='text-gray-400'>|</span>
                            <RatingModal
                                movieId={movie.id}
                                movieTitle={movie.title}
                                releaseYear={release_Year}
                                director={director}
                                initialData={personalRating}
                            />

                        </div>
                        <div className='flex gap-2 items-center justify-center'>
                            {movie.genres.map((genre) => (
                                <div
                                    className='bg-gray-700 px-2 py-1 text-gray-200 rounded-full flex items-center justify-center text-xs'
                                    key={genre.id}>{genre.name}</div>
                            ))}
                        </div>
                        {/* Overview */}
                        <div className='mt-4'>
                            <h2 className='text-gray-200 text-sm md:text-lg font-bold mt-2'>Overview</h2>
                            <p className='text-gray-400 text-xs md:text-sm'>{movie.overview}</p>
                        </div>
                        <div className='flex flex-col md:flex-row gap-2 mt-4'>
                            <WatchedButton
                                movieId={movie.id}
                                initialIsWatched={isWatched} />
                            <SaveToListModal
                                movieId={movie.id} />

                        </div>

                    </div>
                </div>
            </div>
            {/* Meta data */}
            <div className='p-6'>
                {/* Cast & Credit */}
                <div className='w-full max-w-[1000px] mb-8'>
                    <label className='text-gray-200 text-sm md:text-lg font-bold mt-2'>Cast</label>
                    <div className='flex gap-4 mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                        {casts.map((cast) => (
                            <div key={cast.id}
                                className='flex flex-col items-center justify-center'>
                                <Image
                                    src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`}
                                    alt={cast.name}
                                    className='rounded-full w-12 h-12 md:w-14 md:h-14 object-cover border border-slate-700 shadow-sm'
                                    width={100}
                                    height={100} />
                                <span className='text-gray-200 text-sm md:text-base font-bold w-full text-center truncate'>{cast.name}</span>
                                <span className='text-gray-400 text-xs md:text-sm w-full text-center truncate'>{cast.character}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <TrailerButton videos={movie.videos.results} />

            </div>
        </div >
    )

}