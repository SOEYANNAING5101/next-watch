
import Link from "next/link";
import { getTrendingMovies, getTopRatedMovies, getNewReleases } from './lib/tmdb'
import MovieRow from '../app/components/MovieRow'

export default async function HomePage() {
  const trendingMovies = await getTrendingMovies();
  const topRatedMovies = await getTopRatedMovies();
  const newReleasedMovies = await getNewReleases();
  return (
    <main className="min-h-screen px-6 py-5 md:px-12">
      {/* Trending Now Grid */}
      <div className="pt-8 space-y-6">
        <MovieRow
          title="Trending Now"
          movies={trendingMovies}
          seeAllHref="" />
      </div>
      {/* Top Rated Grid */}
      <div className="pt-8 space-y-6">
        <MovieRow
          title="Top Rated"
          movies={topRatedMovies}
          seeAllHref="" />
      </div>
      {/* New Releases Grid */}
      <div className="pt-8 space-y-6">
        <MovieRow
          title="New Releases"
          movies={newReleasedMovies}
          seeAllHref="" />
      </div>

    </main>
  );
}