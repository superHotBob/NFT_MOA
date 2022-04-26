const express = require("express");
const app = express();
app.set('view engine', 'pug');

const my_request = {
    get_404: function(req, res) {
        res.send(`<h1 style="margin-top: 40vh;text-align: center;">
        404! This is an invalid URL.</h1>`);
    },
    get_hello: function(req, res) {
        res.render('index', { title: 'My server', message: 'Hello My Friend!'});
    }
}    
 
 module.exports = my_request