/* global require */ 

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
  database: 'manager_zadan'
  };
var sessionSecret = 'wielkiSekret44';
var sessionKey = 'connect.sid';
var server;
var client;

server = http.createServer(app);

server.listen(3000, function () {
    console.log('Serwer pod adresem http://localhost:3000/');


});

var tempUsername;

var io = require('socket.io').listen(server);



io.sockets.on('connection', function(socket){
   var data = {
      id_employee: socket.manager.handshaken[socket.id].query.id_user,
      id_socket:socket.id
   };
    insertSocketConnection(data);

    console.log("SOCKET ID: " +data.id_socket);
    console.log("EMPLOYEE ID: " +data.id_employee);
    
    //dodawanie zadania i wysyłanie do konkretnych użytkowników
    socket.on('addTask', function (task_data) {
    addTask(task_data);
    client = mysql.createConnection(sqlInfo);
    console.log(task_data);
    client.query("select id_socket from SocketStore where id_employee="+task_data.id_employee+";",function (err,rows){
               
          console.log("ROWS LENGTH:"+rows.length);

          if(err){
            console.log(err);
          }else{
              client.query("SELECT * from Tasks ORDER BY id_task DESC LIMIT 1;",function (err,task_data){
            for(var i = 0 ; i < rows.length ; i++){
               // console.log(rows[i].id_socket);
                io.sockets.socket(rows[i].id_socket).emit("task",task_data[0]);  
            }
             console.log("TASK DATA: "+task_data[0].id_task);
             if(err){
                console.log(err);
             }
           });
          }
      });
      console.log("Własnie dodałem zadanie");   
    });

    //zatwierdzania zadania i wysyłanie go do użytkownika
    socket.on("confirm_task",function(confirm_id) {
      client = mysql.createConnection(sqlInfo);
      client.query("select id_employee from Employee where role=\"admin\";",function (err,admin){
          if(err){
            console.log(err);
          }
          client.query("select id_socket from SocketStore where id_employee="+admin[0].id_employee+";",function (err,admin_socket){
             
              for(var i = 0 ; i < admin_socket.length ; i++){
                io.sockets.socket(admin_socket[i].id_socket).emit("confirm_task_to_admin", confirm_id);
              }
          if(err){
            console.log(err);
          }
          });    
      });
    });

    socket.on("end_task",function(end_id) {
    client.query("select id_employee from Tasks where id_task="+end_id+";",function (err,employee_row){
          var id = employee_row[0].id_employee;
          client.query("select id_socket from SocketStore where id_employee="+id+";",function (err,id_socket){
             
              for(var i = 0 ; i < id_socket.length ; i++){
                io.sockets.socket(id_socket[i].id_socket).emit("end_task_to_employee", end_id);
              }
          if(err){
            console.log(err);
          }
          });    
    //   console.log("zmieniono status zadania!");
      });
     // client.end();
    });
   socket.on("project_delete",function() {
       socket.broadcast.emit('deleted_projects');
   });

});

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
            });
      });
      client.end();
    }
));
app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.session({
    store: sessionStore,
    key: sessionKey,
    secret: sessionSecret
}));
app.use(express.json());
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
    return res.render('user/user.ejs', {username: req.user.username});
  }
});

//pobieranie id obecnie zalogowanego użytkownika
app.post('/current_user', function (req, res) {
  if(!req.user){
    res.redirect('public/login.ejs');
  }
  if(req.user &&  (req.user.role === 'admin' || req.user.role === 'user')  ){
     client = mysql.createConnection(sqlInfo);
    client.query("SELECT id_employee FROM Employee WHERE username=\'"+req.user.username+"\';",function (err,rows){
      if(err){
        console.log("Błąd w pobieraniu id");
      }else{
        if(rows.length > 0){
          console.log("POBRANE ID_EMPLOYEE: "+rows[0].id_employee);
          return res.send({id_employee: rows[0].id_employee});
        }else{
          return res.redirect('public/login.ejs',{error:""});
        }
      }
        return res.redirect('public/login.ejs',{error:""});
    });
    client.end();
  }else{
     return res.render('public/login.ejs',{error:""});
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


//wyświetla zadania w panelu ADMIN
app.post('/admin_tasks', function (req, res) {
  if(req.user && req.user.role === 'admin'){
      client = mysql.createConnection(sqlInfo);
       client.query('SELECT t.id_task,p.name,t.description,t.status FROM Tasks t LEFT JOIN Project p ON t.id_project=p.id_project WHERE status!="ZAMKNIĘTE" ORDER BY t.id_task DESC;',function (err,rows){
          
          if(err){
            console.log("Bład w pobieraniu zadań admina:  "+err);
          }
          console.log(rows);
          res.send(rows);
       });
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});

//wyświetla zadania w panelu USER
app.post('/user_tasks', function (req, res) {

  if(req.user && req.user.role === 'user'){
       client = mysql.createConnection(sqlInfo);
       client.query('SELECT t.id_task,p.name,t.description,t.status FROM Tasks t LEFT JOIN Project p ON t.id_project=p.id_project WHERE id_employee='+req.body.id_employee+' AND status!="ZAMKNIĘTE" ORDER BY t.id_task DESC;',function (err,rows){
          if(err){
            console.log("Bład w pobieraniu zadań usera:  "+err);
          }
          console.log(rows);
          res.send(rows);
       });
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});

//zmiana statusu zadania w bazie
app.post('/update_task_status', function (req, res) {
  if(req.user && (req.user.role === 'user' || req.user.role === 'admin') ){
    updateTaskStatus(req.body.id_task,req.body.status);
    res.send(true);
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});

//przesyła widok zadań do panelu ADMIN
app.get('/tasks_for_admin', function (req, res) {
  if(req.user && req.user.role === 'user' || req.user.role === 'admin') {
      res.render('task/tasks.ejs',{error:""});
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});

//przesyła widok zadań do panelu USER
app.get('/tasks_for_user', function (req, res) {
  if(req.user && req.user.role === 'user'){
      res.render('user/user_tasks.ejs',{error:""});
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});


//przesyła widok nowego pracownika ADMIN
app.get('/new_employee', function (req, res) {
  if(req.user && req.user.role === 'admin'){
      return res.render('employee/new_employee.ejs');
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});


//edytuje dane pracownika
app.post('/edit_employee_confirm', function (req, res) {
  console.log(req.body);
  if(req.user && req.user.role === 'admin'){
     editEmployee(req.body);
     return res.render('admin/admin.ejs',{username: req.user.username});
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});


//zwraca widok zadań
app.get('/page_tasks', function (req, res) {
  if(req.user && req.user.role === 'admin'){
    return res.render('task/tasks.ejs');
  }else{
     return res.redirect('public/login.ejs',{error:""});
  }
});

//zwraca widok edycji danych
app.get('/edit_employee', function (req, res) {
  if(req.user && req.user.role === 'admin'){
    return res.render('employee/edit.ejs');
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

app.get('/project_details', function (req, res) {
  if(req.user && req.user.role === 'admin'){
    return res.render('projects/details.ejs');
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});

app.post('/project_by_id', function (req, res) {
  var id_project = req.body.id_project;
  if(req.user && req.user.role === 'admin'){
      client = mysql.createConnection(sqlInfo);
      client.query('SELECT id_project,name,description FROM Project WHERE id_project=\''+id_project+'\';',function (err,rows){
         client.query('SELECT id_employee FROM ProjectEmployee WHERE id_project=\''+id_project+'\';',function (err,employee_rows){
              var data = {
                employee_data: rows,
                employee_rows:employee_rows
              };
        if(err){
          console.log("Bład w pobieraniu projektu po id: "+err);           
        }else{
           res.send(data);
        }
      });
    });
    // client.end();
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});


app.post('/project_name', function (req, res) {
  var id_project = req.body.id_project;
  if(req.user &&  (req.user.role === 'admin' || req.user.role === 'user') ){
      client = mysql.createConnection(sqlInfo);
      client.query('SELECT name FROM Project WHERE id_project=\''+id_project+'\';',function (err,rows){
          if(err){
              console.log("Bład w pobieraniu projektu po name: "+err);   
          }else{
              res.send(rows[0]);
          }
      });
    // client.end();
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});

//pobiera pracownika według id_project
app.post('/employee_by_id_project', function (req, res) {
  var id = req.body.id_project;

  if(req.user && req.user.role === 'admin'){
      client = mysql.createConnection(sqlInfo);
      client.query('SELECT id_employee FROM ProjectEmployee WHERE id_project=\''+id+'\';',function (err,rows){
          if(err){
              console.log("Bład w pobieraniu user po id: "+err);   
          }else{
               res.send(rows);
          }
      });
      client.end();
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});

//pobiera pracownika według jego id
app.post('/employee_by_id', function (req, res) {
  var id = req.body.id_employee;
  if(req.user && req.user.role === 'admin'){
      client = mysql.createConnection(sqlInfo);
      client.query('SELECT id_employee,username,name,surname FROM Employee WHERE id_employee=\''+id+'\';',function (err,rows){
        if(err){
          console.log("Błąd w pobieraniu użytkownika po id: " + err);
        }else{
          res.send(rows[0]);
        }
      });
      client.end();
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
      console.log("Bład w pobieraniu userów: "+err);           
    }else{
        return res.send(rows); 
    } 
    });
    client.end();
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
      data.role = 'user';
      delete data.confirm_password;
      addEmployee(data);
      return res.redirect('/');
   }else{
      return res.render('public/login.ejs',{error:""});
   }
});

//usuwa pracownika z bazy danych i ustawia status zadan jako nieprzydzielony
app.post('/delete_employee', function (req, res) {
  console.log(req.body);
  if(req.user && req.user.role === 'admin'){
      deleteEmployee(req.body.id_employee);
      res.send(true);
   }else{
      return res.render('public/login.ejs',{error:""});
   }
});

//usuwa pracownika z danego projektu i usuwa id pracownika z zadania
app.post('/delete_from_project', function (req, res) {
  var id_employee = req.body.id_employee; 
  if(req.user && req.user.role === 'admin'){
     deleteEmployeeFromProject(id_employee);
      return res.send(true);
   }else{
      return res.render('public/login.ejs',{error:""});
   }
});

//dodaje pracownika do projektu
app.post('/add_to_project', function (req, res) {

  if(req.user && req.user.role === 'admin'){
     addEmployeeToProject(req.body);
      return res.send(true);
   }else{
      return res.render('public/login.ejs',{error:""});
   }
});

//sprawdza czy użytkownik istnieje w bazie danych
app.post('/check_username', function (req, res) {
  var username = req.body.username;
  if(req.user && req.user.role === 'admin'){
    client = mysql.createConnection(sqlInfo);
    client.query('SELECT username FROM Employee WHERE username=\''+username+"\';",function (err,rows){
      if(err){
        console.log("Błąd w sprawdzaniu czy user jest w bazie: " + err);           
      }else{
         if(rows){
            if(rows[0]){
              return res.send(true);  
            }else{
              return res.send(false);  
            }
        }else{
          return res.send(false);  
        }
      }
    });
    client.end();
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});

//sprawdza czy podana nazwa projektu nie istnieje w bazie danych
app.post('/check_projectname', function (req, res) {
  var projectname = req.body.name;
  if(req.user && req.user.role === 'admin'){
    client = mysql.createConnection(sqlInfo);
    client.query('SELECT name FROM Project WHERE name=\''+projectname+"\';",function (err,rows){
    if(err){
      console.log("Błąd w sprawdzaniu nazwy projektu: "+err);           
    }
    if(rows){
      if(rows[0]){
        return res.send(true);  
      }else{
        return res.send(false);  
      }
    }else{
       return res.send(false);  
    }
    });
    client.end();
  }else{
     return res.render('public/login.ejs',{error:""});
  }
});


//dodaje nowy projekt do bazy danych
app.post('/add_project', function (req, res) {

  if(req.user && req.user.role === 'admin'){
      var data = req.body;
      // var team = data['team'];
          var team = data.team;
      // delete data['team'];
          delete data.team;
      addProject(data,team);
      return res.redirect('/');
   }else{
      return res.render('public/login.ejs',{error:""});
   }
});

//usuwa projekt z bazy danych
app.post('/delete_project', function (req, res) {
  if(req.user && req.user.role === 'admin'){
    deleteProject(req.body.id_project);
    res.send(true);
   }else{
      return res.render('public/login.ejs',{error:""});
   }
});



//przesyła liste obecnych projektów
app.get('/projects', function (req, res) {
  if(req.user && req.user.role === 'admin'){
       client = mysql.createConnection(sqlInfo);
         client.query('SELECT id_project,name,description FROM  Project;',function (err,employee_rows){
            if(err){
              console.log("Błąd w pobieraniu projektów: "+err);           
            }else{
               return res.send(employee_rows);
            }   
         });
         client.end();
  }else{
       return res.render('public/login.ejs',{error:""});
  }
});

/////////////////////database queriies/////////////////////////////

var addEmployee = function(data) {
    client = mysql.createConnection(sqlInfo);
    var sql = client.query('INSERT INTO Employee SET ? ;',data,function (err,rows){
    if(err){
      console.log("Błąd w dodawaniu usera: "+err);           
    }
  });
    client.end();
};

var addTask = function(data) {
    client = mysql.createConnection(sqlInfo);
    var sql = client.query('INSERT INTO Tasks SET ?;',data,function (err,rows){
    if(err){
      console.log("Błąd w dodawaniu zadania:" +err);           
    }
  });
    client.end();
};

var addProject = function(data,team) {
    client = mysql.createConnection(sqlInfo);
    var sql = client.query('INSERT INTO Project SET ? ;',data,function (err,rows){
    if(err){
      console.log("Błąd w dodawaniu projektu: "+err);           
    }else{
      if(team && team.length > 0){
         client.query('SELECT id_project FROM Project WHERE name=\''+data.name+"\';",function (err,rows){  
          if(err){
            console.log("Błąd w pobieraniu projektu po name:" +err);
          }else{
               console.log("PROJECT: "+rows);
          var id_project = rows[0].id_project;
          var tempJSON;
          for(var i = 0 ; i < team.length ; i++){
              tempJSON = {
                id_project: id_project,
                id_employee: team[i]
              };
             insertIntoProjectEmployee(tempJSON);
          }
        }
      });
     // client.end();
    }
  }
});
};

var insertIntoProjectEmployee = function(tempJSON) {
   client = mysql.createConnection(sqlInfo);
   client.query('INSERT INTO ProjectEmployee SET ? ;',tempJSON,function (err,rows){
                 if(err){
                    console.log("Błąd w dodawnaiu pracownika:" +err);           
                  }
              });
};

var deleteEmployeeFromProject = function(id_employee) {
   client = mysql.createConnection(sqlInfo);
   client.query('DELETE FROM ProjectEmployee WHERE id_employee='+id_employee+';',function (err,rows){
                 if(err){
                    console.log("Błąd w dodawaniu do ProjectEmployee: "+err);           
                  }

              });
    client.query('UPDATE Tasks SET id_employee=null WHERE id_employee='+id_employee+';',function (err,rows){
                 if(err){
                    console.log("Błąd w update TASK: "+err);           
                  }
              });
  client.end();
};

var deleteProject = function(id_project) {
    client = mysql.createConnection(sqlInfo);
    var sql = client.query('DELETE FROM Project WHERE id_project='+id_project+';',function (err,rows){
    if(err){
      console.log("Błąd w usuwaniu projektu: "+err);           
    }
  });
    sql = client.query('DELETE FROM ProjectEmployee WHERE id_project='+id_project+';',function (err,rows){
    if(err){
      console.log(err);           
    }
  });
    sql = client.query('DELETE FROM Tasks WHERE id_project='+id_project+';',function (err,rows){
    if(err){
      console.log("Błąd w usuwaniu zadania: "+ err);           
    }
  });

    client.end();
};


var addEmployeeToProject = function(data) {
   client = mysql.createConnection(sqlInfo);
    var sql = client.query('INSERT INTO ProjectEmployee SET ?;',data,function (err,rows){
    if(err){
      console.log("Błąd w dodawaniu osoby do projektu: "+err);           
    }
  });
    client.end();
};


var editEmployee = function(data) {
   client = mysql.createConnection(sqlInfo);
    var sql = client.query('UPDATE Employee SET ? WHERE id_employee=\''+data.id_employee+'\';',data,function (err,rows){
    if(err){
      console.log("Błąd w update pracownika:" +err);           
    }
  });
    client.end();
};

var deleteEmployee = function(id_employee){
  client = mysql.createConnection(sqlInfo);
 var sql = client.query('DELETE FROM Employee WHERE id_employee='+id_employee+';',function (err,rows){
    if(err){
      console.log("Błąd w usuwaniu pracownika: "+err);           
    }
  });
  client.query('UPDATE Tasks SET id_employee=null WHERE id_employee='+id_employee+';',function (err,rows){
    if(err){
      console.log("Błąd w update Task przy usuwaniu pracownika: "+err);           
    }
  });
    client.end();
};

var insertSocketConnection = function(data) {
   client = mysql.createConnection(sqlInfo);
    var sql = client.query('INSERT INTO SocketStore SET ?;',data,function (err,rows){
    if(err){
      console.log("Błąd w dodawaniu do SocketStore: "+err);           
    }
  });
    client.end();
};

var updateTaskStatus = function(id_task,status) {
    console.log(id_task +""+ status);
   client = mysql.createConnection(sqlInfo);
   client.query('UPDATE Tasks SET status=\"'+status+'\" WHERE id_task='+id_task+';',function (err,rows){
    if(err){
      console.log("Błąd w update task status: "+err);           
    }
  });
   // client.end();
};
