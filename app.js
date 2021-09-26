//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const https = require("https");

const homeStartingContent =
  "Click on ADD BLOG button to add blog";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.DB, {useNewUrlParser: true});

const postSchema = {

  title: String,
 
  content: String
 
};

const contactSchema = {
  name: String,
  email: String,
  number: String,
  query: String
};

const Post = mongoose.model("Post", postSchema);

const Contact = mongoose.model("Contact",contactSchema);


app.get("/", function (req, res) {
  
  const url = "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw&type=single";
  var jokePage ="test";

  https.get(url,function(response){
    console.log(response.statusCode);
    
    response.on("data",function(data){
      const jokeData = JSON.parse(data);
      jokePage = jokeData.joke;

      Post.find({}, function(err, posts){
        res.render("home", {
          startingContent: homeStartingContent,
          posts: posts,
          jokePage: jokePage
          });
     
      });
    });
  });

  
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.post("/contact",function(req,res){
  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    number: req.body.number,
    query: req.body.query
  });

  contact.save(function(er){
    if(!er){
      res.redirect("/");
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose",function(req,res){
    
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
   
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId",function(req,res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){

    res.render("post", {
 
      title: post.title,
 
      content: post.content
    });
 
  });
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/success",function(req,res){
  res.redirect("/");
});

let port = process.env.PORT;

if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started");
});
