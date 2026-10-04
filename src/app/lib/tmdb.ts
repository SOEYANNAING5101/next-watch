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
    runtime:number;
    genres: Genre[];
    credits: {
        cast:CastMember[]
    };
    videos:{
        results:Video[]
    }
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export async function getTrendingMovies(): Promise<Movie[]> {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    if (!apiKey) {
        throw new Error("TMDB API key is missing in .env.local")
    }
    const res = await fetch(
        `${TMDB_BASE_URL}/trending/movie/week?api_key=${apiKey}`,
        {
            next: { revalidate: 86400 }
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch trending movies")
    }
    const data = await res.json();
    return data.results;
}
export async function getTopRatedMovies(): Promise<Movie[]> {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) {
        throw new Error("TMDB API key is missing in .env.local")
    }
    const res = await fetch(
        `${TMDB_BASE_URL}/movie/top_rated?api_key=${apiKey}`,
        {
            next: { revalidate: 86400 }
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch top rated movies")
    }
    const data = await res.json();
    return data.results;
}
export async function getNewReleases(): Promise<Movie[]> {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) {
        throw new Error("TMDB API key is missing in .env.local")
    }
    const res = await fetch(
        `${TMDB_BASE_URL}/movie/now_playing?api_key=${apiKey}`,
        {
            next: { revalidate: 86400 }
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch new release movies")
    }
    const data = await res.json();
    const rawMovies = data.results;
    const moviesWithRatings = await Promise.all(
        rawMovies.map(async(movie:Movie)=>{
            const certification = await getUSCertification(movie.id);
            return{...movie,certification};
        })
    )
    return moviesWithRatings;
}

async function getUSCertification(movieId: number): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    try {
        const res = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/release_dates?api_key=${apiKey}`,
            { next: { revalidate: 86400 } }
        );
        const data = await res.json();
        
        // Find the US release data
        const usData = data.results?.find((country: any) => country.iso_3166_1 === 'US');
        
        if (usData && usData.release_dates.length > 0) {
            const cert = usData.release_dates.find((release: any) => release.certification !== "")?.certification;
            return cert || "NR"; // Return "NR" (Not Rated) if blank
        }
        return "NR";
    } catch (error) {
        return "NR";
    }
}
export async function getMovieDetails (id:string):Promise<MovieDetails> {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) {
        throw new Error("TMDB API key is missing in .env.local")
    }
    const res = await fetch(
        `${TMDB_BASE_URL}/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=videos,credits`,
        {
            next: { revalidate: 86400 } 
        }
    )
    if (!res.ok){
        throw new Error(`Failed to fetch details for movie id: ${id}`)
    }
    const data = await res.json();
    const certification = await getUSCertification(parseInt(id));
    return { ...data, certification };
}
