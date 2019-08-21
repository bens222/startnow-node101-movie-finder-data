const express = require('express');
const app = express();
var axios = require('axios')

// Requiring Morgan Logger to log each request
var morgan = require('morgan');
app.use(morgan('dev'));

// Establishing empty to object to cache movie data, so that we don't have to go OMDb every request
var cache = {};

// Setting up home route
app.get('/', function(req, res) {
    // Grab the "movie key" out of the request URL as a string
    var iReq = req.query.i
    var tReq = req.query.t
    
    // If the movie key has 'i=' do this axios get request
    if(iReq !== undefined) {
        // Checking to see if the movie data is in cache, if so send to client
        if(cache.hasOwnProperty(iReq) === true) {
            res.send(cache[iReq]);
        // If we don't have the data in cache make the axios get to OMDb
        } else {
        axios.get('http://www.omdbapi.com/?i=' + iReq + '&apikey=8730e0e')
            .then(function(response) {
                cache[iReq] = response.data; // Stores our new request in our cache
                res.send(response.data); // Sends data to Client
            }) 
            .catch(function(error) {
                if (error.response) {
                    console.log(error.response);
                }    
            })
        }
    // Same process as above for 'j='
    } else {
    tReq = tReq.replace(' ', '%20'); // Replaces the space in the string with %20 so the URL is correctly formatted
        if(cache.hasOwnProperty(tReq) === true) {
            res.send(cache[tReq]);
        } else {
        axios.get('http://www.omdbapi.com/?t=' + tReq + '&apikey=8730e0e')
            .then((response) => {
                cache[tReq] = response.data;
                res.send(response.data);
            })
            .catch(function(error) {
                if (error.response) {
                    console.log(error.response);
                }
            })
        }
    }

});

module.exports = app;