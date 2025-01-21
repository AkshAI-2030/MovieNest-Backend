require("dotenv").config();
const express = require("express");
const cors = require("cors");

const {
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
} = require("./controllers/dataController");
const { sequelize } = require("./models");
const {
  withSqliteForeignKeysOff,
} = require("sequelize/lib/dialects/sqlite/sqlite-utils");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/movies/search", searchMovie);
app.post("/api/curated-lists", createCuratedList);
app.put("/api/curated-lists/:curatedListId", updateCuratedList);
app.post("/api/movies/watchlist", createWatchList);
app.post("/api/movies/wishlist", createWishList);
app.post("/api/movies/curated-list", createCuratedListItem);
app.post("/api/movies/:movieId/reviews", addReviewAndRating);
app.post("/api/movies/searchByGenreAndActor", searchMovieByActorAndGenre);
app.get("/api/movies/sort", sortByRatingOrReleasYear);
app.get("/api/movies/top5", topFiveMoviesByRating);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("unable to connect database", error);
  });

app.listen(3000, () => {
  console.log(`server started at port ${3000}`);
});
module.exports = { app };
