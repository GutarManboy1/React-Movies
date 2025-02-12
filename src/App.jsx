import "./index.css";
import "./App.css";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import { useState, useEffect } from "react";

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

  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      // alert(response) use this alert to check if the api is actually fetching any info

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMoviesList([]);
        return;
      }

      setMoviesList(data.results || []);
    } catch (error) {
      console.error(`Error fetching movies : ${error}`);
      setErrorMessage(`Error fetching movies. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []); // the empty dependency array makes sure that it loads only at the start

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
          <section className="all-movies">
            <h2>All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="error">{errorMessage}</p>
            ) : (
              <ul>
                {moviesList.map((movie) => (
                  <p key={movie.id} className="trending">
                    {movie.title}
                  </p>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
