const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/database');

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect(db.mongoURI,{
    useMongoClient: true
}).then(()=>console.log('MongoDb connected')).catch(err=>console.log(err));



//handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Static Folder
app.use(express.static(path.join(__dirname,'public')));

//override middleware with post havin ?_method=DELETE
app.use(methodOverride('_method'));

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());


//Global variables
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//How middelware works
app.use(function(req,res,next){
    // console.log(Date.now());
    req.name ="Puranam Pradeep Picasso";
    next();
});

//Index Route
app.get('/',(req,res)=>{
    console.log(req.name);
    const title = 'Welcome VidJot';
    res.render('index', {
        title: title
    });
});

//About Route
app.get('/about',(req,res)=>{
    res.render('about');
});

//u

//Use routes
app.use('/ideas',ideas);
app.use('/users',users);

const port = process.env.PORT || 5000;

app.listen(port, ()=> {
     console.log(`server is ready on port ${port}`);
})