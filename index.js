const express = require("express");
const ejs = require("ejs");
const methodOverride = require('method-override')
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 8080;

// override with POST having ?_method=patch
app.use(methodOverride('_method'))

// require path
const path = require("path");
const { log } = require("console");

// set the view engine

app.set("view engine", "ejs");

//create the views and public folder and join the path
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// debugging the path
console.log("Views path:", path.join(__dirname, "views")); // Log views path
console.log("Public path:", path.join(__dirname, "public")); // Log public path

// add middleware so that client side req understand the express
app.use(express.urlencoded({ extended: true }));

// posts array to store all the posts

let posts = [
  {
    id: uuidv4(),
    username: "ravindra",
    content: "Hard work is important",
  },
  {
    id: uuidv4(),
    username: "suraj",
    content: "Education is a powerful weapon.",
  },

  {
    id: uuidv4(),
    username: "arpit",
    content: "I have gotten my first internship.",
  },
];

// create index api
app.get("/", (req, res) => {
  res.send("all route are working");
});

// this api show the posts
app.get("/posts", (req, res) => {
  res.render("index", { posts });
});

// this route show the form to create the new post
app.get("/posts/new", (req, res) => {
  res.render("newPost");
});

// this route takes username and content from the form and push the data in the posts array
app.post("/posts", (req, res) => {
  let { username, content } = req.body;
  const id = uuidv4();
  posts.push({ id, username, content });
  console.log(req.body);
  res.redirect("/posts");
});

// this api show the post in details

app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  console.log(id);
  let post = posts.find((p) => id === p.id);
  res.render("show", { post });
});

app.get("/posts/edit/:id", (req, res) => {
    // res.send("patch req is working");
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    console.log(`edit post: ${post.content}`);
    res.render("edit", {post})

})

app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    // console.log(post)
    let new_content = req.body.content;
    // console.log(new_content);
    // res.send("patch req is working");
    
    post.content = new_content;
    res.redirect("/posts");

})

// method Override is used to convert the get or post to patch or delete. html form only send post and get request
app.delete("/posts/:id", (req, res) => {
    let {id} = req.params;
    posts = posts.filter((p) => id !== p.id);
    // console.log(post)
    res.redirect("/posts");
})
// server is listening
app.listen(port, () => {
  console.log("listening at port: 8080");
});
