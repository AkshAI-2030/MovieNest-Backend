const {
  movie: movieModel,
  review: reviewModel,
  watchlist: watchlistModel,
  wishlist: wishlistModel,
  curatedList: curatedListModel,
  curatedListItem: curatedListItemModel,
} = require("../models");
const {
  searchMoviesFromTMDB,
  getActors,
} = require("../services/searchMovieService");
const {
  validateSearchQuery,
  validateCuratedList,
  validateReviewAndRating,
} = require("../validations/index");
const axiosInstance = require("../lib/axios");

//1.MS1_Assignment_2.2: Making API Calls From TMDB
const searchMovie = async (req, res) => {
  const query = req.query.query;
  const errors = validateSearchQuery(query);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const movies = await searchMoviesFromTMDB(query);
    if (movies && movies.length === 0) {
      return res
        .status(404)
        .json({ message: "No Movies found for the given query." });
    }
    return res.status(200).json({ movies });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch movie data details",
    });
  }
};
//2.MS1_Assignment_2.3: Creating and Managing Curated Lists
const createCuratedList = async (req, res) => {
  const { name, slug, description } = req.body;
  let errors = validateCuratedList(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });
  try {
    const response = await curatedListModel.create({
      name: name,
      description: description,
      slug: slug,
    });
    return res.status(201).json({
      message: "Curated list created successfully.",
      curatedList: response,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error occured while creating Curated List" });
  }
};
//Update CuratedList.
const updateCuratedList = async (req, res) => {
  const id = req.params.curatedListId;
  const { name, description } = req.body;
  const slug = name
    .split(" ")
    .map((word) => word.toLowerCase())
    .join("-");
  if (!name)
    return res
      .status(400)
      .json({ message: "Name is required and should be a string." });
  try {
    const existingList = await curatedListModel.findByPk(id);
    if (!existingList)
      return res
        .status(404)
        .json({ message: "ID not found in the curated List" });

    const updatedList = await existingList.update({
      name: name,
      description: description,
      slug: slug,
    });
    return res.status(200).json({
      message: "Curatedlist updated successfully",
      updatedList: existingList,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error occured while updating Curated List" });
  }
};

async function movieExistsInDB(movieId) {
  let existingMovie = await movieModel.findOne({ where: { tmdbId: movieId } });
  if (!existingMovie) return false;
  return existingMovie;
}
async function fetchMovieAndCastDetails(movieId) {
  const response = await axiosInstance.get(`/movie/${movieId}`, {
    params: {
      api_key: process.env.API_KEY,
    },
  });
  if (response.status !== 200) {
    throw new Error(`TMDB API returned status: ${response.status}`);
  }
  let movie = response.data;
  const actors = await getActors(movieId);
  return {
    title: movie.title || "N/A",
    tmdbId: movie.id || "N/A",
    genre: movie.genres.map((eachGenre) => eachGenre.id).join(", "),
    actors: actors || "N/A",
    releaseYear: movie.release_date ? movie.release_date.split("-")[0] : 0,
    rating: movie.vote_average || 0,
    description: movie.overview || "N/A",
  };
}

//3.MS1_Assignment_2.4: Saving Movies to Watchlist, Wishlist, and Curated Lists
const createWishList = async (req, res) => {
  const { movieId } = req.body;
  if (!movieId)
    return res
      .status(400)
      .json({ message: "MovieId is required and should be Integer" });
  try {
    // Check if the movie already exists in the database
    const existingMovieDetails = await movieExistsInDB(movieId);

    if (existingMovieDetails) {
      // Add the movie to the wishlist if it already exists in the database
      await wishlistModel.create({ movieId: existingMovieDetails.id });
    } else {
      // Fetch movie and cast details if the movie doesn't exist
      const movieDetails = await fetchMovieAndCastDetails(movieId);

      // Save the movie details to the database
      let newMovie = await movieModel.create(movieDetails);

      // Add the movie to the wishlist
      await wishlistModel.create({ movieId: newMovie.id });
    }
    return res
      .status(200)
      .json({ message: "Movie added to wishlist successfully." });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured while creating the wishlist:",
      error: error.message,
    });
  }
};
//
const createWatchList = async (req, res) => {
  const { movieId } = req.body;
  if (!movieId)
    return res
      .status(400)
      .json({ message: "MovieId is required and should be Integer" });
  try {
    // Check if the movie already exists in the database
    const existingMovieDetails = await movieExistsInDB(movieId);

    if (existingMovieDetails) {
      // Add the movie to the wishlist if it already exists in the database
      await watchlistModel.create({ movieId: existingMovieDetails.id });
    } else {
      // Fetch movie and cast details if the movie doesn't exist
      const movieDetails = await fetchMovieAndCastDetails(movieId);

      // Save the movie details to the database
      let newMovie = await movieModel.create(movieDetails);

      // Add the movie to the wishlist
      await watchlistModel.create({ movieId: newMovie.id });
    }
    return res
      .status(200)
      .json({ message: "Movie added to watchlist successfully." });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured while creating the watchlist:",
      error: error.message,
    });
  }
};

//
const isMovieInCuratedList = async (movieId, curatedListId) => {
  const listItem = await curatedListItemModel.findOne({
    where: { movieId, curatedListId },
  });
  return !!listItem;
};
const createCuratedListItem = async (req, res) => {
  const { movieId, curatedListId } = req.body;
  if (!movieId || !curatedListId)
    return res.status(400).json({
      message: "MovieId and curatedListId is required and should be Integer",
    });
  try {
    // Check if the movie already exists in the database
    const existingMovieDetails = await movieExistsInDB(movieId);
    if (existingMovieDetails) {
      //movie is in the list and movie is in the database.(movie table)
      const isInList = await isMovieInCuratedList(
        existingMovieDetails.id,
        curatedListId
      );
      if (isInList) {
        return res
          .status(409)
          .json({ message: "Movie is already in the curated list." });
      }
      // Add the movie to the curatedListItem if it already exists in the database
      await curatedListItemModel.create({
        movieId: existingMovieDetails.id,
        curatedListId,
      });
    } else {
      // Fetch movie and cast details if the movie doesn't exist
      const movieDetails = await fetchMovieAndCastDetails(movieId);

      // Save the movie details to the database
      let newMovie = await movieModel.create(movieDetails);

      // Add the movie to the wishlist
      await curatedListItemModel.create({
        movieId: newMovie.id,
        curatedListId,
      });
    }
    return res
      .status(200)
      .json({ message: "Movie added to curatedListItem successfully." });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured while creating the curatedListItem:",
      error: error.message,
    });
  }
};

//MS1_Assignment_2.5: Adding Reviews and Ratings to Movies
const addReviewAndRating = async (req, res) => {
  const movieId = req.params.movieId;
  const { rating, reviewText } = req.body;
  let errors = await validateReviewAndRating(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const submittedReview = await reviewModel.create({
      movieId,
      rating,
      reviewText,
    });
    return res
      .status(200)
      .json({ message: "Review is added successfully.", submittedReview });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured while adding review:",
      error: error.message,
    });
  }
};

//MS1_Assignment_2.6: Searching Lists by Genre and Actor
const searchMovieByActorAndGenre = async (req, res) => {
  const { actor, genre } = req.query;
  if (!actor || !genre) {
    return res
      .status(400)
      .json({ message: "Please enter atleast actor or genre" });
  }
  try {
    const Allmovies = await movieModel.findAll();
    const movies = Allmovies.filter((movie) => {
      const isGenre =
        movie.genre && movie.genre.toLowerCase().includes(genre.toLowerCase());
      const isActor =
        movie.actors &&
        movie.actors.toLowerCase().includes(actor.toLowerCase());
      return isActor || isGenre;
    });
    return res.status(200).json({ movies });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured while fetching movies",
      error: error.message,
    });
  }
};

//MS1_Assignment_2.7: Sorting by Ratings or Year of Release
function getListModel(list) {
  switch (list) {
    case "watchlist":
      return watchlistModel;
    case "wishlist":
      return wishlistModel;
    case "curatedList":
      return curatedListItemModel;
    default:
      throw new Error("Invalid list type");
  }
}
const sortByRatingOrReleasYear = async (req, res) => {
  const { list, sortBy, order } = req.query;
  if (!["watchlist", "wishlist", "curatedList"].includes(list))
    return res.status(400).json({ message: "Invalid list type" });
  if (!["rating", "releaseYear"].includes(sortBy))
    return res.status(400).json({ message: "Invalid sort parameter" });
  if (!["ASC", "DESC"].includes(order))
    return res.status(400).json({ message: "Invalid order type" });
  try {
    const listModel = getListModel(list);
    const listItems = await listModel.findAll({
      attributes: ["movieId"], // Only fetch movie IDs
    });
    const movieIds = listItems.map((eachMovie) => eachMovie.movieId);

    /* const sortedMovies = allMovies.sort((a, b) => {
      if (sortBy === 'rating') {
        return order === 'ASC' ? a.rating - b.rating : b.rating - a.rating;
      } else if (sortBy === 'releaseYear') {
        return order === 'ASC' ? a.releaseYear - b.releaseYear : b.releaseYear - a.releaseYear;
      }
    });*/

    const movies = await movieModel.findAll({
      where: { id: movieIds },
      order: [[sortBy, order]],
      attributes: [
        "id",
        "title",
        "tmdbId",
        "genre",
        "actors",
        "releaseYear",
        "rating",
      ],
    });
    return res.status(200).json({ movies });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occured while sorting", error: error.message });
  }
};

//
//MS1_Assignment_2.8: Get Top 5 Movies by Rating + Detailed Review
const topFiveMoviesByRating = async (req, res) => {
  try {
    const topMovies = await movieModel.findAll({
      order: [["rating", "DESC"]],
      limit: 5,
      attributes: ["id", "title", "rating"],
    });
    const movieDetails = [];
    for (let movie of topMovies) {
      const review = await reviewModel.findOne({
        where: { movieId: movie.id },
        attributes: ["reviewText"],
      });

      const wordCount = review ? review.reviewText.split(" ").length : 0;
      movieDetails.push({
        title: movie.title,
        rating: movie.rating,
        review: {
          text: review ? review.reviewText : "No review Available",
          wordCount: wordCount,
        },
      });
    }
    return res.status(200).json({ movies: movieDetails });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured while finding top 5 movies:",
      error: error.message,
    });
  }
};

module.exports = {
  searchMovie,
  createCuratedList,
  updateCuratedList,
  createWatchList,
  createWishList,
  createCuratedListItem,
  addReviewAndRating,
  searchMovieByActorAndGenre,
  sortByRatingOrReleasYear,
  topFiveMoviesByRating,
};
