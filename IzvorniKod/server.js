const express = require('express');
const app = express();

const path = require('path');

//middleware for sessions and connecting to database
const pg = require('pg');
const db = require('./db');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

//finding enviornment variables
const enviornment = require('./enviornments/enviornment');

//routes
const homeRouter = require('./routes/home.routes.js');
const itemRouter = require('./routes/item.routes.js');
const loginRouter = require('./routes/login.routes.js');
const logoutRouter = require('./routes/logout.routes.js');
const notificationsRouter = require('./routes/notifications.routes.js');
const pricesRouter = require('./routes/prices.routes.js');
const searchRouter = require('./routes/search.routes.js');
const signupRouter = require('./routes/signup.routes.js');
const profileRouter = require('./routes/profile.routes')
const addCommentRouter = require('./routes/addComment.routes')

//ejs middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//static files would be stored in 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

//middleware for decoding parameters
app.use(express.urlencoded({ extended: true }));

//session middleware
app.use(session({
    store: new pgSession({
        pool: db.pool,
        tableName: 'session'
    }),
    secret: enviornment.SessionSecret,
    resave: false,
    saveUninitialized: true
}));

//defining routes
app.use('/', homeRouter);
app.use('/item', itemRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/notifications', notificationsRouter);
app.use('/prices', pricesRouter);
app.use('/search', searchRouter);
app.use('/signup', signupRouter);
app.use('/profile', profileRouter);
app.use('/addComment', addCommentRouter)

app.listen(3000, () => console.log('Server running on port 3000'));