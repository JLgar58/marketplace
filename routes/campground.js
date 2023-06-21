const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Locations = require("../controllers/campgrounds");
const {
    isLoggedIn,
    isAuthor,
    validateLocation,
} = require("../utils/middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
    .route("/")
    .get(catchAsync(Locations.index))
    .post(
        isLoggedIn,
        upload.array("campground[image]"),
        validateLocation,
        catchAsync(Locations.createLocation)
    );

router.route("/new").get(isLoggedIn, Locations.newForm);

router
    .route("/:id/edit")
    .get(isLoggedIn, isAuthor, catchAsync(Locations.editForm));

router
    .route("/:id")
    .get(catchAsync(Locations.showLocation))
    .put(
        isLoggedIn,
        isAuthor,
        upload.array("campground[image]"),
        validateLocation,
        catchAsync(Locations.editLocation)
    )
    .delete(isLoggedIn, isAuthor, catchAsync(Locations.deleteLocation));

module.exports = router;