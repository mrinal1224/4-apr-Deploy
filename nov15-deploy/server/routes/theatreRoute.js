const router = require("express").Router();
const Theatre = require("../models/theatreModel");

router.post("/add-theatre", async (req, res) => {
  try {
    const newTheatre = await Theatre(req.body);
    await newTheatre.save();
    res.send({
      success: true,
      message: "Theatre added successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/update-theatre", async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.body.theatreId);
    if (!theatre) {
      return res
        .status(400)
        .json({ success: false, message: "Theatre not found" });
    }
    await Theatre.findByIdAndUpdate(req.body.theatreId, req.body);
    res.send({ success: true, message: "Theatre updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete-theatre/:theatreId", async (req, res) => {
  try {
    console.log("deleting theatre", req.params.theatreId);
    await Theatre.findByIdAndDelete(req.params.theatreId);
    res.send({ success: true, message: "Theatre deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// get all theatres for admin
router.get("/get-all-theatres", async (req, res) => {
  try {
    const allTheatres = await Theatre.find().populate("owner");
    res.send({
      success: true,
      data: allTheatres,
      message: "All theatres fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// get the theatre of a specific owner
router.get("/get-all-theatres-by-owner/:ownerId", async (req, res) => {
  try {
    const allTheatres = await Theatre.find({ owner: req.params.ownerId });
    res.send({
      success: true,
      data: allTheatres,
      message: "All theatres fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
