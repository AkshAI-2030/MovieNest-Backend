const axios = require("axios");

const axiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

module.exports = axiosInstance;
