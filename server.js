'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const server = express();
server.use(cors());
const superagent = require('superagent');


server.use(express.static('./public')); //point the static root at the public folder
server.use(express.urlencoded({ extended: true }));
server.set('view engine', 'ejs');


// TEST IS OK 
// server.get('/hello',(request ,response) =>{ 
//     response.render('pages/index')

// }) ;

//HOME ROUTE IS OK 
server.get('/', (request, response) => {
    response.render('pages/index')

});


//TO SHOW THE RESULTS
server.post('/searches', (request, response) => {
    // response.status(200).send('hihhihi') //connected with the form in index.ejs
    let url = 'https://www.googleapis.com/books/v1/volumes?q=';

    // console.log(url)
    // console.log(request.body)  //{ 'search ': 'amman', choose: 'title' } 
    // scince <input name ="search" /> and <input type="radio" name="choose" value="title"> in index.ejs

    if (request.body.choose === 'title') {
        url = url + request.body.search;
        // console.log(request.body.search)
    } else if (request.body.choose === 'author') {
        url = url + request.body.search;
        // console.log(request.body.search)
    }
    superagent(url)
        .then(data => {
            // console.log(data.body)
            let allBooks = data.body.items;
            let books = allBooks.map(book => {
                return new Book(book);
            });
            console.log('books : \n\n\n\n\n', books);
            response.render('pages/searches/show', { books: books })  // to connect server.js with show.ejs<% books.forEach((book)=> 
        })
        .catch(error => {
            response.render('pages/error');
        });

})




function Book(data) {
//  use the keys names inside the ejs file
//The PIPE (||) used to avoid error if the data is undefined
    this.author = (data.volumeInfo.authors && data.volumeInfo.authors[0]) || 'Nothing to show ';
    this.title = data.volumeInfo.title;
    this.isbn = (data.volumeInfo.industryIdentifiers && data.volumeInfo.industryIdentifiers[0].identifier) || 'Nothing to show ';
    this.image_url = (data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail) || 'Nothing to show ';
    this.description = data.volumeInfo.description;
}



server.listen(PORT, () => console.log(` App listening to ${PORT}`));