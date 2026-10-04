import { Movie } from '../lib/tmdb'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Dot } from 'lucide-react';

interface MovieCardProps {
  movie: Movie
}
export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";
  const releaseYear = movie.release_date
    ? movie.release_date.split("-")[0]
    : "N/A";
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group flex flex-col space-y-2 cursor-pointer select-none transition ease-in-out hover:translate-y-1 hover:scale-105"
    >
      <div>
        <Image
          className='rounded-lg'
          src={posterUrl}
          alt={movie.title}
          width={300}
          height={350}
          loading='eager'
        />
      </div>
      <div className='flex flex-col gap-1'>
        <h2 className='font-bold text-xs text-gray-200 truncate'>{movie.title}</h2>
        <div className='flex items-center text-xs text-gray-400'>
          <span className='mr-1'><Star color='#ffe224' size={15} fill='#ffe224' /></span>
          <span className='text-[#ffe224] '>{movie.vote_average.toFixed(1)}</span>
          <span className=''><Dot /></span>
          <span className=''>{releaseYear}</span>
          <span className=''><Dot /></span>
          <span className=' border p-1 uppercase'>{movie.certification || "NR"}</span>
        </div>
      </div>

    </Link>
  );

}