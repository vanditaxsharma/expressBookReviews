const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({
        username: username,
        password: password,
      });
      return res.status(200).json({ message: "User successfully registered" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "unable to register user" });
});

// Get the book list available in the shop
// public_users.get("/", function (req, res) {
//   //Write your code here
//   return res.send(JSON.stringify(books, null, 4));
// });

public_users.get("/", async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        resolve(books);
      });
    };

    const allBooks = await getBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (err) {
    return res.status(500).json({ message: "Error fetching Books" });
  }
});

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   res.send(books[isbn]);
// });

public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const getBooksByIsbn = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book Not Found");
    }
  });

  getBooksByIsbn
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   const results = [];
//   for (let key in books) {
//     if (books[key].author === author) {
//       results.push(books[key]);
//     }
//   }
//   if (results.length) {
//     res.status(200).json(results);
//   } else {
//     res.status(400).send("Not Found");
//   }
// });

public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;

  const getBooksByAuthor = new Promise((resolve, reject) => {
    const results = [];
    for (let key in books) {
      if (books[key].author === author) {
        results.push(books[key]);
      }
    }

    if (results.length > 0) {
      resolve(results);
    } else {
      reject("No books found");
    }
  });

  getBooksByAuthor
    .then((booksByAuthor) => res.status(200).json(booksByAuthor))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//   const results = [];
//   for (let key in books) {
//     if (books[key].title === title) {
//       results.push(books[key]);
//     }
//   }
//   if (results.length) {
//     res.status(200).json(results);
//   } else {
//     res.status(400).send("Not Found");
//   }
// });

public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;

  const getBooksByTitle = new Promise((resolve, reject) => {
    const results = [];
    for (let key in books) {
      if (books[key].title === title) {
        results.push(books[key]);
      }
    }

    if (results.length > 0) {
      resolve(results);
    } else {
      reject("No books found with this title");
    }
  });

  getBooksByTitle
    .then((booksByTitle) => res.status(200).json(booksByTitle))
    .catch((err) => res.status(404).json({ message: err }));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].review);
});

module.exports.general = public_users;
