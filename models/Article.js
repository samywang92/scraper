const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// result.link = $(this).children("a").attr("href");
// result.title = $(this).children("a").children("h2").text();
// result.date = $(this).children("a").children("date").text();
// result.img = $(this).children("a").children("banner").children("img").attr("data-src");
// result.imgAlt = $(this).children("a").children("banner").children("img").attr("alt");
// result.saved = false;

const ArticleSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    img:{
        type: String,
        required: true
    },
    imgAlt:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    },
    saved:{
        type: Boolean,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId, //always use this to ref another object being stored in the DB
        ref: "Note" // the actual ref name
    }
})

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;