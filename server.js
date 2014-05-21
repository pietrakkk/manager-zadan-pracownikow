var http = require('http');
var express = require('express');
var app = express();
var connect = require('connect');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sessionStore = new connect.session.MemoryStore();

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

// Konfiguracja passport.js
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});


passport.use(new LocalStrategy(
    function (username, password, done) {
  		  client = mysql.createConnection(sqlInfo);
        client.query("select username,role from Employee where username='"+username+"' AND password='"+password+"';",function (err,rows){
        
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
                                   failureRedirect: '/',
                                   failureFlash: true })
);

app.get('/', function (req, res) {
	
	if(!req.user){
		return res.redirect('/login.html');
	}
	if(req.user && req.user.role === 'admin'){
		return res.redirect('admin.html');
	}
  if(req.user && req.user.role === 'user'){
    return res.redirect('user.html');
  }
    
});

app.get('/logout', function (req, res) {
    console.log('Zakończenie sesji użytkownika');
    req.logout();
    client.end(function(err) {
      console.log("Rozłączono z bazą danych");
  });
    return res.redirect('/');
});


app.get('/admin', function (req, res) {
	if(req.user != null && req.user.role === 'admin'){
		return res.redirect('admin.html');
	}
  if(req.user != null && req.user.role === 'user'){
    return res.redirect('user.html');
  }
	return res.redirect('login.html');   
});

app.get('/user', function (req, res) {
  if(req.user != null && req.user.role === 'user'){
    return res.redirect('user.html');
  }
  if(req.user != null && req.user.role === 'admin'){
    return res.redirect('admin.html');
  }
  return res.redirect('login.html');   
});

server = http.createServer(app);

server.listen(3000, function () {
    console.log('Serwer pod adresem http://localhost:3000/');
});

