const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username already exists
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

// Check if username + password combo is correct
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// Register new user (so login actually works later!)
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

    req.session.authorization = { accessToken, username };
    return res
      .status(200)
      .json({ message: "User logged in", token: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid login" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message:"Review Added",
    book: books[isbn]
  });
});


// deleting a review

regd_users.delete("/auth/review/:isbn",(req,res)=>{
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }

  let reviews = books[isbn].reviews;

  if(reviews[username]){
    delete reviews[username];
    return res.status(200).json({
      message: "Review deleted"
    });
  }else{
    return res.status(404).json({
      message: "No review found"
    })
  }
})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
