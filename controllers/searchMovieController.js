const axiosInstance = require("../lib/axios");
require("dotenv").config();

//1.
const getActors = async (movieId) => {
  try {
    const response = await axiosInstance.get(`/movie/${movieId}/credits`, {
      params: {
        api_key: process.env.API_KEY,
      },
    });
    const actors = [];
    for (const person of response.data.cast) {
      if (person.known_for_department === "Acting") {
        actors.push(person.name);
        if (actors.length == 5) break;
      }
    }
    return actors.join(", ");
  } catch (error) {
    console.error("Error in getActors:", error.message);
  }
};

const searchMoviesFromTMDB = async (query) => {
  try {
    const response = await axiosInstance.get("/search/movie", {
      params: {
        query,
        api_key: process.env.API_KEY,
      },
    });

    if (response.status !== 200) {
      throw new Error(`TMDB API returned status: ${response.status}`);
    }

    const movies = [];
    for (const movie of response.data.results) {
      const actors = await getActors(movie.id);
      movies.push({
        title: movie.title || "N/A",
        tmdbId: movie.id || "N/A",
        genre: movie.genre_ids.join(", "),
        actors: actors || "N/A",
        releaseYear: movie.release_date
          ? movie.release_date.split("-")[0]
          : "N/A",
        rating: movie.vote_average || "N/A",
        description: movie.overview || "N/A",
      });
    }
    return movies;
  } catch (error) {
    const errorMessage = error?.message || "Failed to fetch movies from TMDB.";
    throw new Error(errorMessage);
  }
};

module.exports = { searchMoviesFromTMDB, getActors };
