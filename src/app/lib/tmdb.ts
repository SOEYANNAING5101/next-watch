export interface Genre {
    id: number;
    name: string;
}
export interface Video {
    id: number;
    name: string;
    site: string;
    key: string;
    type: string;
}
export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}
export interface CrewMember {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
}

export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    adult: boolean;
    certification?: string;
}
export interface MovieDetails extends Movie {
    runtime: number;
    genres: Genre[];
    credits: {
        cast: CastMember[];
        crew: CrewMember[]
    };
    videos: {
        results: Video[]
    }
}
async function tmdbFetch(path: string, revalidate = 86400) {
    const token = process.env.TMDB_READ_ACCESS_TOKEN
    if (!token) throw new Error("TMDB_READ_ACCESS_TOKEN is not set")
    const res = await fetch(`https://api.themoviedb.org/3${path}`, {
        headers: { accept: "application/json", Authorization: `Bearer ${token}` },
        next: { revalidate }
    }
    );
    if (!res.ok) throw new Error(`TMDB request failed (${res.status}) for ${path}`)
    return res.json();
}

export async function getTrendingMovies(): Promise<Movie[]> {
    const data = await tmdbFetch("/trending/movie/week")
    const rawMovies = data.results;
    const moviesWithRatings = await Promise.all(
        rawMovies.map(async (movie: Movie) => {
            const certification = await getUSCertification(movie.id);
            return { ...movie, certification };
        })
    )
    return moviesWithRatings;
}
export async function getTopRatedMovies(): Promise<Movie[]> {
    const data = await tmdbFetch("/movie/top_rated")
    const rawMovies = data.results;
    const moviesWithRatings = await Promise.all(
        rawMovies.map(async (movie: Movie) => {
            const certification = await getUSCertification(movie.id);
            return { ...movie, certification };
        })
    )
    return moviesWithRatings;

}
export async function getNewReleases(): Promise<Movie[]> {
    const data = await tmdbFetch("/movie/now_playing")
    const rawMovies = data.results;
    const moviesWithRatings = await Promise.all(
        rawMovies.map(async (movie: Movie) => {
            const certification = await getUSCertification(movie.id);
            return { ...movie, certification };
        })
    )
    return moviesWithRatings;
}

async function getUSCertification(movieId: number): Promise<string> {
    try {
        const data = await tmdbFetch(`/movie/${movieId}/release_dates`)
        // Find the US release data
        const usData = data.results?.find((country: any) => country.iso_3166_1 === 'US');

        if (usData && usData.release_dates.length > 0) {
            const cert = usData.release_dates.find((release: any) => release.certification !== "")?.certification;
            return cert || "NR";
        }
        return "NR";
    } catch(error) {
        console.error(`Certification lookup failed for movie ${movieId}:`, error);
        return "NR"
    }
}
export async function getMovieDetails(id: string): Promise<MovieDetails> {

    const data = await tmdbFetch(`/movie/${id}?language=en-US&append_to_response=videos,credits`)
    const certification = await getUSCertification(parseInt(id));
    return { ...data, certification };
}
