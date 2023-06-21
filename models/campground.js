const mongoose = require("mongoose");
const { Schema } = mongoose;
const opts = { toJSON: { virtuals: true } };

const imageSchema = new Schema({
    url: String,
    filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});

const campgroundSchema = new Schema(
    {
        title: String,
        images: [imageSchema],
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                require: true,
            },
            coordinates: {
                type: [Number],
                require: true,
            },
        },
        price: Number,
        description: String,
        location: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    opts
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<strong>
  <a class="text-decoration-none" href="/locations/${
      this._id
  }">${this.title}</a>
  </strong>
  <p>${this.description.slice(0, 20)}...</p>`;
});

module.exports = mongoose.model("Campground", campgroundSchema);
