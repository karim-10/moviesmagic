const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const FavItem = require("./models/favItem");
const fetch = require("node-fetch");
const PORT = process.env.PORT || 3023;
app.set("view engine", "ejs");
app.use(express.static("public"));
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.FAVURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("connected data");
    app.listen(PORT, () => {
      console.log("server at http://localhost:3023");
    });
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  let myData;
  fetch(
    `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      //   console.log(data);
      myData = data;
      res.render("home", { myData: myData });
    })
    .catch((err) => console.log(err));
});

app.get("/moviesItem/:id", (req, res) => {
  let myData;
  fetch(
    "https://api.themoviedb.org/3/movie/" +
      req.params.id +
      "?api_key=" +
      process.env.APIKEY
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      myData = data;
      // console.log("data here: ", myData);
      res.render("moviesItem", { myData: myData });
    })
    .catch((err) => console.log(err));
});

app.get("/myFavourite", (req, res) => {
  FavItem.find()
    .then((result) => {
      res.render("myFavourite", { FavItem: result });
      console.log(result);
    })
    .catch((err) => console.log(err));
});

app.get("/addToFavourite/:id", (req, res) => {
  fetch(
    "https://api.themoviedb.org/3/movie/" +
      req.params.id +
      "?api_key=" +
      process.env.APIKEY
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      let newFavItem = new FavItem({
        backdrop_path: data.backdrop_path,
        vote_average: data.vote_average,
        popularity: data.popularity,
        title: data.title,
        status: data.status,
        genres: data.genres,
        overview: data.overview,
        release_date: data.release_date,
        poster_path: data.poster_path,
      });
      newFavItem
        .save()
        .then((result) => {
          console.log("new Fav saved");
          res.redirect("/myFavourite");
        })
        .catch((err) => console.log(err));
    });
});

app.get("/FavouriteItem/:id", (req, res) => {
  FavItem.findById(req.params.id)
    .then((result) => {
      res.status(200).render("FavouriteItem", { FavItem: result });
    })
    .catch((err) => console.log(err));
});
app.get("/removeFavourite/:id", (req, res) => {
  FavItem.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(201).redirect("/myFavourite");
      // res.redirect("myFavourite", { FavItem: result });
    })
    .catch((err) => console.log(err));
});

app.post("/search", (req, res) => {
  let myData;
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${req.body.search}&page=1&include_adult=false`
  )
    .then((response) => response.json())
    .then((result) => {
      myData = result;
      res.status(200).render("home", { myData: result });
    });
});
