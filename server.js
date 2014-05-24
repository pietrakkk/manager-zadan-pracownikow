var http = require('http');
var express = require('express');
var app = express();
var connect = require('connect');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sessionStore = new connect.session.MemoryStore();
var url = require('url');

var mysql = require('mysql');
var sqlInfo = {
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'manager_pracownikow'
	}


var sessionSecret = 'wielkiSekret44';
var sessionKey = 'connect.sid';
var server;
var sio;


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});


passport.use(new LocalStrategy(
    function (username, password, done) {
  		  client = mysql.createConnection(sqlInfo);
        client.query("select username,role,name,surname from Employee where username='"+username+"' AND password='"+password+"';",function (err,rows){
        
        var user;

        if(typeof rows !== 'undefined'){
          user = rows[0];
        }

        if(err){
        	console.log(err);

        return done(err);           
    	}
    	if(!user){
         	return done(null,false);           
    	}
    		return done(null, {
                username: username,
                role: user.role
            })
    	});
    }
));

app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.session({
    store: sessionStore,
    key: sessionKey,
    secret: sessionSecret
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));


app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/fail',
                                   failureFlash: true })
);

app.get('/fail', function (req, res) {
    return res.render('public/login.ejs',{error: "Niepoprawne dane logowania"});
});

app.get('/', function (req, res) {
  if(!req.user){
		res.render('public/login.ejs',{ error:''});
	}
	if(req.user && req.user.role === 'admin'){
    return res.render('admin.ejs',{username: req.user.username});
	}
  if(req.user && req.user.role === 'user'){
    return res.render('user.ejs', {username: req.user.username});
  }
});

app.get('/logout', function (req, res) {
    console.log('Zakończenie sesji użytkownika');
    req.logout();
    client.end(function(err) {
      console.log("Rozłączono z bazą danych");
  });
    return res.render('public/login.ejs',{error:""});
});

server = http.createServer(app);

server.listen(3000, function () {
    console.log('Serwer pod adresem http://localhost:3000/');
});

