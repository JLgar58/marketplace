const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocodign = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocodign({ accessToken: mapBoxToken });

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds", { campgrounds });
};

module.exports.newForm = (req, res) => {
    res.render("new");
};

module.exports.createCampground = async(req, res, next) => {
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1,
        })
        .send();
    // res.send(geoData.body.features[0].geometry);
    const newCamp = new Campground(req.body.campground);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    newCamp.author = req.user._id;
    await newCamp.save().then((data) => {
        console.log("yikes!");
    });
    req.flash("success", "Successfully made a new location");
    res.redirect(`/locations/${newCamp._id}`);
};

module.exports.showCampground = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: "author",
        })
        .populate("author");
    if (!campground) {
        req.flash("error", "Cannot find that location!");
        return res.redirect("/locations");
    }
    res.render("show", { campground });
};

module.exports.editForm = async(req, res) => {
    const { id } = req.params;

    const location = await Campground.findById(id);
    if (!location) {
        req.flash("error", "Cannot find that location!");
        return res.redirect("/locations");
    }
    res.render("edit", { location });
};

module.exports.editCampground = async(req, res) => {
    const { id } = req.params;
    const location = await Campground.findByIdAndUpdate(
        id,
        req.body.campground, {
            runValidators: true,
            new: true,
        }
    );
    const imgs = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    location.images.push(...imgs);
    await location.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await location.updateOne({
            $pull: {
                images: {
                    filename: {
                        $in: req.body.deleteImages,
                    },
                },
            },
        });
        console.log(location);
    }

    req.flash("success", "Successfully updated location");
    res.redirect(`/locations/${location._id}`);
};

module.exports.deleteCampground = async(req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted");
    res.redirect("/locations");
};