const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const axios = require("axios");
const { collection } = require("../models/campground");

// iniciando mongoose
main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/marketplace");
    return console.log("connection success!");
}

const collectionOne = "483251"; // woods collection
const collectionTwo = "3846912"; //campgrounds collection
const collectionThree = "9046579"; //camping

const sample = (array) => array[Math.floor(Math.random() * array.length)];

// call unsplash and return small image
async function seedImg(collection) {
    try {
        const resp = await axios.get("https://api.unsplash.com/photos/random", {
            headers: {
                Accept: "application/json",
                "Accept-Encoding": "identity",
            },
            params: {
                client_id: "DoWQFs29htdxxPSTiRA5CS0GbH7ZhlwecNff97aj5-8",
                collections: collection,
                count: 30,
            },
        });
        // console.log(resp.data.map((a) => a.urls.small));
        // console.log(resp.data.urls);
        return resp.data.map((a) => a.urls.small);
        // return resp.data.urls.small
    } catch (err) {
        console.error(err);
    }
}

async function imgsDisplay(imgs) {
    let imgsArr = await imgs;
    const amount = Math.floor(Math.random() * 5) + 1;
    const result = imgsArr.map((el, index) => {
        if (index <= amount) {
            return {
                url: sample(imgsArr),
                filename: `marketplace/${sample(
                    descriptors
                ).toLowerCase()}${sample(places).toLowerCase().split(" ")}`,
            };
        }
    });
    return result.slice(0, amount + 1);
}

const seedDB = async () => {
    await Campground.deleteMany({});
    // const newCamp = new Campground({ title: 'purple field' })
    // await newCamp.save();

    const imageSetOne = await seedImg(collectionOne);
    const imageSetTwo = await seedImg(collectionTwo);
    const imageSetThree = await seedImg(collectionThree);
    const imgs = [...imageSetOne, ...imageSetTwo, ...imageSetThree];

    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const newCamp = new Campground({
            author: "6491f019245439f3d05acd9f",
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ],
            },
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: await imgsDisplay(imgs),
            price: price,
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. In quae repellat laborum sequi reiciendis officia, amet praesentium eaque velit saepe eligendi deserunt rem consequatur veniam minus provident voluptatum ad nemo?",
        });
        await newCamp.save();
    }
};

// let imgs = seedImg(collectionThree);
// let arrayI = imgsDisplay(imgs);
// async function exe() {
//     console.log("my fn", await arrayI);
// }
// exe();

seedDB().then(() => {
    mongoose.connection.close();
});
