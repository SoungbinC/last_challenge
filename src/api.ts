const API_KEY = "10923b261ba94d897ac6b81148314a3f"
const BASE_PATH = "https://api.themoviedb.org/3"

interface IMovie {
    id: number
    backdrop_path: string
    poster_path: string
    title: string
    overview: string
    release_date: string
    vote_average: number
}

export interface IGetMoviesResult {
    dates: {
        maximum: string
        minimum: string
    }
    page: number
    results: IMovie[]
    total_pages: number
    total_results: number
}
interface ITv {
    id: number
    backdrop_path: string
    poster_path: string
    name: string
    original_name: string
    vote_average: number
}

export interface IGetTvResult {
    dates: {
        maximum: string
        minimum: string
    }
    page: number
    results: ITv[]
    total_pages: number
    total_results: number
}

interface ISearch {
    id: number
    name: string
}
export interface IGetSearchResult {
    id: number
    keywords: ISearch[]
}
export function getMovies_Now_Playing() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}

export function getMovies_Top_Rating() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}

export function getMovies_upcoming() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}

export function getTv_Today() {
    return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}

export function getTv_On_The_Air() {
    return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}

export function getTv_Top_Rated() {
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}

export function getSearchedMovies(keyword: string) {
    return fetch(
        `${BASE_PATH}search/movie?query=${keyword}&api_key=${API_KEY}`
    ).then((response) => response.json())
}

export function getSearchedTv(keyword: string) {
    return fetch(
        `${BASE_PATH}search/tv?query=${keyword}&api_key=${API_KEY}`
    ).then((response) => response.json())
}
