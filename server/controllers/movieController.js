const Movie = require("../models/movieModel");

const addMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.send({
      success: true,
      message: "Movie added successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const allMovies = await Movie.find();
    res.send({
      success: true,
      message: "All movies fetched successfully",
      data: allMovies,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const updateMovie = async (req, res) => {
  try {
    // const movieExist = await Movie.findById(req.body.movieId);
    // if (!movieExist) {
    //   return res.status(404).send({
    //     success: false,
    //     message: "Movie not found",
    //   });
    // }
    console.log("reached updated");
    const movie = await Movie.findByIdAndUpdate(req.body.movieId, req.body, {
      new: true,
    });
    if (!movie) {
      return res.status(404).send({
        success: false,
        message: "Movie not found",
      });
    }
    res.send({
      success: true,
      message: "Movie updated successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.body.movieId);
    res.send({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send({
        success: false,
        message: "Movie not found",
      });
    }
    res.send({
      success: true,
      message: "Movie fetched successfully",
      data: movie,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
  getMovieById,
};
