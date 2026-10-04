export const ROULETTE_OPTIONS = {
    genres: [
        { label: "All Genres", value: "" },
        { label: "Action &Adventure", value: "28,12" },
        { label: "Comedy", value: "35" },
        { label: "Drama", value: "18" },
        { label: "Horror & Thriller", value: "27,53" },
        { label: "Romance", value: "10749" },
        { label: "Sci-Fi & Fantasy", value: "878,14" }
    ],
    decades: [
        { label: "All Eras", value: {gte:"",lte:""} },
        { label: "2020s", value: {gte:"2020-01-01",lte:"2029-12-31"} },
        { label: "2010s", value: {gte:"2010-01-01",lte:"2019-12-31"} },
        { label: "2000s", value: {gte:"2000-01-01",lte:"2009-12-31"} },
        { label: "1990s", value: {gte:"1990-01-01",lte:"1999-12-31"} },
        { label: "1980s", value: {gte:"1980-01-01",lte:"1989-12-31"} },
        { label: "1970s & Older", value: {gte:"",lte:"1979-12-31"} }
    ],
    languages: [
        { label: "All Languages", value: "" },
        { label: "English", value: "en" },
        { label: "Spanish", value: "es" },
        { label: "French", value: "fr" },
        { label: "Japanese", value: "ja" },
        { label: "Korean", value: "ko" },
        { label: "Russian", value: "ru" }
    ]
}