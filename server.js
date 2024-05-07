require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const Emitter = require('events')
// const webRoutes = require('./routes/web');

const PORT = process.env.PORT || 3040; 

// MongoDB connection URI
const mongoURI = process.env.MONGO_URL;

// Connect to MongoDB
mongoose.connect(mongoURI); 

// Get the default connection
const db = mongoose.connection;

// Event listener for MongoDB connection open
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Event listener for MongoDB connection error
db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});



// Session store setup
const mongoStore = new MongoStore({
    mongooseConnection: db,
    collection: 'sessions'
});

//Event emiiter
 const eventEmitter = new Emitter()
 app.set('eventEmitter', eventEmitter)


// Session middleware configuration
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Passport configuration
const passportInit = require('./app/config/passport');
passportInit(passport);
// Passport middleware initialization (after session middleware)
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware
app.use(flash());

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Global middleware

app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


// Set template engine and layout
app.use(expressLayouts);
app.set('views', path.join(__dirname, '/resources/views'));

app.set('view engine', 'ejs');

require('./routes/web')(app)

// Start the server

const server =    app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});


//socket
const io = require('socket.io')(server)
io.on('connection',(socket)=>{
    //join 
    
    socket.on('join',(orderId)=>{
       
        socket.join(orderId)

    })
})
eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)

})

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})