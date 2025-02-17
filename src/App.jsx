import "./index.css";
import "./App.css";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [moviesList, setMoviesList] = useState([]);

  const [trendingMovies, setTrendingMovies] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  ); //debounce prevents the search from happening for 500 milliseconds. if each letter results in a request then it would cause problems with the api

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` //encodeUriComponent makes sure that no matter what characters are in the query it will still return
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      // alert(response) use this alert to check if the api is actually fetching any info

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      // console.log (data); use this to see the json data that is being fetched in the console, and it works.

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMoviesList([]);
        return;
      }

      setMoviesList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies : ${error}`);
      setErrorMessage(`Error fetching movies. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch {
      console.error(`Error fetching movies : ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]); // the empty dependency array makes sure that it loads only at the start / the debounceSearchTerm stops the server from making a request for up to 500 milliseconds

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <>
      <main>
        <div className="pattern" />

        <div className="wrapper">
          <header>
            {/* <img src="./BG.png" alt="background" /> */}
            <img src="./hero-img.png" alt="hero banner" />

            <h1>
              Find <span className="text-gradient">Movies</span> You'll Love
              without the Work
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {/* {trendingMovies.length > 0 && ( */}
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>

          <h2>All Movies</h2>
          <section className="all-movies">
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="error">{errorMessage}</p>
            ) : (
              <ul>
                {moviesList.map(
                  (
                    movie //by using the parathesis and not the curly brackets i dont have to use Return, making the code a bit cleaner also whenever mapping over it needs a KEY like movie.id
                  ) => (
                    <MovieCard key={movie.id} movie={movie} />
                  )
                )}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
