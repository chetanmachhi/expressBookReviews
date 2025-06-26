const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const { SECRET_KEY } = require('../config');


let users = [{"username" : "chetan", "password" : "1"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.some(user => user.username === username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  try{
    const username = req.body.username
    const password = req.body.password
    if(!username || !password)
    {
      return res.status(400).send("provide user and pass!")
    }
    else if(!isValid(username))
    {
      return res.status(404).send("user dont exist please register!")
    }
    else if(!authenticatedUser(username, password))
    {
      return res.status(401).send("not correct username and password!")
    }

    const token = jwt.sign({username}, SECRET_KEY, {expiresIn: "1h"})
    req.session.token = token
    return res.status(200).send("user logged in!!!")
  }catch (error){
    res.status(500).send("intenal error")
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  try{
    const isbn = parseInt(req.params.isbn)
    if(!isbn){return res.status(401).send("please provide the isbn number to put the review!")}
  
    const book = books[isbn]
    if(!book){return res.status(401).send("no book found for given isbn")}

    const username = req.user.username
    const review = req.body.review
    book.reviews[username] = review
return res.status(200).json({
  message: `Review added/updated successfully for user: ${username}`,
  currentReviews: book.reviews
});
  }catch(error){
          console.log(error)
      return res.status(500).json({message: "something gone wrong!"});
  }
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  try{
      const isbn = parseInt(req.params.isbn)
      if(!isbn){return res.status(401).send("please provide isbn id!")}

      const book = books[isbn]
      if(!book){return res.status(404).send("no book found for the isbn id!")}

      const username = req.user.username
      delete books[isbn].reviews[username]
      return res.status(200).json({
  message: `deleted review for user: ${username}`,
  currentReviews: book.reviews
});

  }catch(error){
      console.log(error)
      return res.status(500).json({message: "something gone wrong!"});
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
