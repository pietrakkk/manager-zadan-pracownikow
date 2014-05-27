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

////////////////////logowanie/////////////////////////////////////////
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
app.use(express.json());4
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

/////////////////////////////routes//////////////////////////////////////////////

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
    return res.render('admin/admin.ejs',{username: req.user.username});
  }
  if(req.user && req.user.role === 'user'){
    return res.render('employee/user.ejs', {username: req.user.username});
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

app.get('/tasks', function (req, res) {
  if(req.user && req.user.role === 'user' || req.user.role === 'admin'){
    return res.send({tasks:"feagareg"});
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});

app.get('/new_employee', function (req, res) {
  if(req.user && req.user.role === 'admin'){
      return res.render('employee/new_employee.ejs');
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});

app.get('/add_employee', function (req, res) {
  if(req.user && req.user.role === 'admin'){
      //dodawanie pracownika
      return res.render('employee/new_employee.ejs');
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});


app.get('/page_tasks', function (req, res) {
  if(req.user && req.user.role === 'admin'){
    return res.render('task/tasks.ejs');
  }else{
     return res.redirect('public/login.ejs',{error:""});
  }
});

app.get('/all_projects', function (req, res) {
  if(req.user && req.user.role === 'admin'){
    return res.render('projects/projects.ejs');
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});
app.get('/new_project', function (req, res) {
  if(req.user && req.user.role === 'admin'){
    return res.render('projects/new.ejs');
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});

app.get('/employees_list', function (req, res) {
  if(req.user && req.user.role === 'admin'){
    return res.render('employee/employees.ejs');
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});

app.get('/employees', function (req, res) {
  if(req.user && req.user.role === 'admin'){
     client = mysql.createConnection(sqlInfo);
    client.query('SELECT id_employee,name,surname FROM Employee WHERE role=\'user\';',function (err,rows){
    if(err){
      console.log(err);           
    }
       return res.send(rows);  
    });
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});

app.get('/new_task', function (req, res) {
  if(req.user && req.user.role === 'admin'){
    return res.render('task/new_task.ejs');
  }else{
     return res.send('public/login.ejs',{error:""});
  }
});

app.post('/add_employee', function (req, res) {
  console.log(req.body);
  if(req.user && req.user.role === 'admin'){
      var data = req.body;
      data['role'] = 'user';
      delete data['confirm_password'];

      addEmployee(data);
      return res.redirect('/');
   }else{
      return res.render('public/login.ejs',{error:""});
   }
});


app.post('/check_username', function (req, res) {
  var username = req.body.username;
  if(req.user && req.user.role === 'admin'){
    client = mysql.createConnection(sqlInfo);
    client.query('SELECT username FROM Employee WHERE username=\''+username+"\';",function (err,rows){
    console.log(rows);
    if(err){
      console.log(err);           
    }
    if(rows[0]){
      return res.send(true);  
    }else{
       return res.send(false);  
    }
    });
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});

/////////////////////database queriies/////////////////////////////

var addEmployee = function(data) {
    client = mysql.createConnection(sqlInfo);
    var sql = client.query('INSERT INTO Employee SET ? ;',data,function (err,rows){

    if(err){
      console.log(err);           
    }
  });
};

server = http.createServer(app);

server.listen(3000, function () {
    console.log('Serwer pod adresem http://localhost:3000/');
});
