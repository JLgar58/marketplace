const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campgrounds = require("../controllers/campgrounds");
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require("../utils/middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(Campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("campground[image]"),
    validateCampground,
    catchAsync(Campgrounds.createCampground)
  );

router.route("/new").get(isLoggedIn, Campgrounds.newForm);

router
  .route("/:id/edit")
  .get(isLoggedIn, isAuthor, catchAsync(Campgrounds.editForm));

router
  .route("/:id")
  .get(catchAsync(Campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("campground[image]"),
    validateCampground,
    catchAsync(Campgrounds.editCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(Campgrounds.deleteCampground));

module.exports = router;
