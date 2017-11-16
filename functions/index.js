const functions = require('firebase-functions');
const firebase = require('firebase-admin');
//Change
var express = require('express');
//
const engines = require('consolidate');


//Change
var firebaseApp = firebase.initializeApp(
    functions.config().firebase
);
//


function getvalue() {
    const ref = firebaseApp.database().ref();
    return ref.once('value').then(snap => snap.val());
}

//CHANGES
var path = require('path');
var app = express();
//

//CHANGES
app.use(express.static(path.join(__dirname, '/../public')));
//
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');


app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    getvalue().then(value => {
        response.render('index', { value: JSON.stringify(value) });
    });
});

app.get('/value.json', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    getvalue().then(value => {
        response.json(value);
    });
});

app.get('/custom', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.render('custom', {title: 'Custom Route Generation' });
});

app.get('/maps', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.render('maps');
});


exports.app = functions.https.onRequest(app);
