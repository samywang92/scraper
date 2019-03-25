const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
var path = require("path");

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

// HTML Routes
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/saved", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/saved.html"));
});

// API Routes

app.get("/scrape", (req, res) => {

    axios.get("https://www.nintendo.com/whatsnew").then(response => {
        const $ = cheerio.load(response.data);
        console.log("we have infiltrated nintendo");
        // console.log($);
        $(".news-tiles li").each(function (i, element) {
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
app.get("/api/articles", (req, res) => {
    db.Article.find({}).then((dbUser) => {
        res.json(dbUser);
    }).catch((err) => res.json(err));
});

//Gets all saved artciles from the database
app.get("/api/saved", (req, res) => {
    db.Article.find({
        saved: true
    }).then((dbUser) => {
        res.json(dbUser);
    }).catch((err) => res.json(err));
});

//Gets all artciles by id from the database
app.get("/api/articles/:id", (req, res) => {
    db.Article.find({
        _id: req.params.id
    }).populate("note")
    .then((dbUser) => {
        res.json(dbUser);
    }).catch((err) => res.json(err));
});

//Updated specific articles saved state
app.put("/api/articles/:id", (req, res) => {
    const id = req.params.id;
    let bool;

    db.Article.find(
        { "_id": id }
    ).then((dbUser) => {
        //res.json(dbUser);
        console.log(dbUser[0].saved);
        bool = !dbUser[0].saved;
        console.log(bool);
        res.json(dbUser);
        db.Article.update(
            { "_id": id },
            {
                $set: {
                    saved: bool
                }
            }
        ).then((dbUser) => {
            console.log("Saved updated");
        }).catch((err) => res.json(err));
    }).catch((err) => res.json(err));
});

//Note creation
app.post("/api/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  

//Delete all articles from the database
app.delete("/api/articles", (req, res) => {
    db.Article.remove().then((dbUser) => {
        res.json(dbUser);
    }).catch((err) => res.json(err));
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
