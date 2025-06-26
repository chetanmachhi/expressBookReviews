const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password
  if(!username || !password)
  {
    res.status(400).send("please provide name and password!")
  }
  if(isValid(username))
  {
    return res.status(404).send("username is not available choose another!")
  }

    const user = {"username": username, "password": password}
    users.push(user)
    return res.status(200).send("User registered now login please!")
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  try{
    return res.status(200).json(books)
  }catch(error){
    console.log(json(error))
    return res.status(300).json({message: "something gone wrong!"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  try{
      const isbn = req.params.isbn
      const bookByIsbn = books[isbn]
      if(!bookByIsbn){
        return res.status(404).send("Book is not found!")
      }
      return res.status(200).json(bookByIsbn)
    }catch (error){
      console.log(error)
      return res.status(500).json({message: "something gone wrong!"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  try{

    const author = req.params.author
    if(!author){return res.status(404).send("Author is needed to search!")}
    const authorBooks= []
    for(let id in books)
      {
        if (books[id].author === author)
          {
            authorBooks.push(books[id])
          }
        }
    return res.status(200).json({authorBooks});
      }catch (error){
        console.log(error)
        return res.status(500).json({message: "something gone wrong!"});
      }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  try{
    const title = req.params.title
    if(!title){return res.status(404).send("title is needed to search!")}
    const bookByTitle = []
    for(let id in books)
    {
      if(title === books[id].title)
      {
        bookByTitle.push(books[id])
      }
    }
    return res.status(200).json(bookByTitle)
  }catch (error){
        console.log(error)
        return res.status(500).json({message: "something gone wrong!"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  try{
    const isbn = req.params.isbn
    if(!isbn){return res.status(400).send("isbn is needed to search!")}

    const book = books[isbn]
    if(!book){return res.status(404).send("book does not exist")}

    return res.status(200).json(book.reviews)

  }catch(error){
        console.log(error)
        return res.status(500).json({message: "something gone wrong!"});
  }
});

module.exports.general = public_users;
