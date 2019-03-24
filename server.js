const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// // Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Routes
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "./public/index.html"));
});

app.get("/scrape", (req, res) => {

    axios.get("https://www.nintendo.com/whatsnew").then(response => {
        const $ = cheerio.load(response.data);
        console.log("we have infiltrated nintendo");
        // console.log($);
        $(".news-tiles li").each(function(i, element) {
            const result = {};
            console.log("stealing info");
            result.link = $(this).children("a").attr("href");
            result.title = $(this).children("a").children("h2").text();
            result.date = $(this).children("a").children("div.date").text();
            result.text = $(this).children("a").children("p").text();
            result.img = $(this).children("a").children("div.banner").children("img").attr("data-src");
            result.imgAlt = $(this).children("a").children("div.banner").children("img").attr("alt");
            result.saved = false;
            console.log(result);

            db.Article.create(result).then((dbArticle) => {
                console.log("pushing to our db");
                console.log(dbArticle);
            }).catch(err => console.log(err));
        });
        
    });

    res.send("Scrape Complete");
});

//Gets all artciles from the database
app.get("/articles", (req, res) => {
    db.Article.find({}).then((dbUser) => {
        res.json(dbUser);
    }).catch((err) => res.json(err));
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
