var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
const hostname = "localhost";

//APP CONFIG
//mongoose.connect("mongodb://localhost:27017/blog", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connect("mongodb+srv://vidhiBlog:15022000@blogdata.3vdr1.mongodb.net/Blogdb?retryWrites=true&w=majority", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MONGOOSE CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//ROUTES
app.get("/", (req,res)=>{
    res.redirect("/blogs");
});

app.get("/blogs", (req,res)=>{
    Blog.find({}, (err, blogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});

//NEW
app.get("/blogs/new", (req,res)=>{
    res.render("new");
});

//CREATE
app.post("/blogs", (req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog)=>{
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

//SHOW
app.get("/blogs/:id", (req,res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT
app.get("/blogs/:id/edit", (req,res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE
app.put("/blogs/:id", (req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

//DELETE
app.delete("/blogs/:id", (req,res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, ()=>{
    console.log("Server started!");
});