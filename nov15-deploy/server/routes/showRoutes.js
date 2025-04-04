const router = require("express").Router();
const Show = require("../models/showModel");

// add show
router.post("/add-show", async (req, res) => {
  try {
    const newShow = new Show(req.body);
    await newShow.save();
    res.send({
      success: true,
      message: "Show added successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// delete show

router.delete("/delete-show/:showId", async (req, res) => {
  try {
    await Show.findByIdAndDelete(req.params.showId);
    res.send({
      success: true,
      message: "Show deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update show

router.put("/update-show", async (req, res) => {
  try {
    await Show.findByIdAndUpdate(req.body.showId, req.body);
    res.send({ success: true, message: "Show updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/get-all-shows-by-theatre/:theatreId", async (req, res) => {
  try {
    console.log("show for theatre", req.params.theatreId);
    const shows = await Show.find({ theatre: req.params.theatreId }).populate(
      "movie"
    );
    console.log("shows", shows);
    res.send({
      success: true,
      data: shows,
      message: "Shows fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get all theatres by movie which has shows for that date
router.get("/get-all-theatres-by-movie/:movie/:date", async (req, res) => {
  /**
   * cosnt uniqueMap = new Map();
   * !uniqueMap.has(theate) -> uniqueMap.set(theatre, show)
   */
  try {
    /**
     * this route handles post request to get all theatres by movie which has shows for that date
     * it expects the request body to contain movie and date
     * it retrieve all shows of the specified movie and date ( Show.find({movie date})
     * it then filters out unique theatres from the shows
     * it then sends the response back to the client with the unique theatres and their shows
     */
    const { movie, date } = req.params;
    const shows = await Show.find({ movie, date }).populate("theatre");
    // filter out the unique theatres
    const uniqueTheatres = [];
    shows.forEach((show) => {
      const isTheatre = uniqueTheatres.find(
        (theatre) => theatre.id === show.theatre.id
      );
      if (!isTheatre) {
        const showsOfThisTheatre = shows.filter(
          (showObj) => showObj.theatre._id == show.theatre._id
        );
        uniqueTheatres.push({
          ...show.theatre._doc,
          shows: showsOfThisTheatre,
        });
      }
    });
    res.send({
      success: true,
      data: uniqueTheatres,
      message: "Theatres fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/get-show-by-id/:showId", async (req, res) => {
  try {
    const show = await Show.findById(req.params.showId)
      .populate("movie")
      .populate("theatre");
    res.send({
      success: true,
      data: show,
      message: "Show fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
