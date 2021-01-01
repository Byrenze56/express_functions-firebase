const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllScreams, postOneScream, getScream } = require('./handlers/screams');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');


//scream routes-----------------------------------------------------------------------------------------

app.post('/scream', FBAuth, postOneScream);
app.get('/screams', getAllScreams);
app.get('/scream/:screamId', getScream);

//-----Signup route----------------------------------------------------------------------

app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user/', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);