const express = require('express')
const favicon = require('express-favicon');
const bodyParser = require('body-parser');
const app = express()

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug')

var tasks = [{taskid:1, task:'Pendenz EINS', status:'checked'},{taskid:2, task:'Pendenz ZWEI', status:'unchecked'}];
var task  = "";
var taskimport = "";
var id = 2;


app.use(favicon(__dirname + '/public/favicon_144.png'));

// #######################
//  HOME = list all tasks
// #######################
app.get('/', function (req, res) {
	res.render('index', { 
   		taskArray:tasks
   	})	
})

// #######################
//  CREATE
// #######################
app.post('/tasks/', function(req,res) {
	taskimport = req.body.pendenz;
	console.log("Folgende Pendenz wurde importiert: " + taskimport);
	task = {
		taskid: 1 + id,
		task: 	taskimport,
		status: 'unchecked'
	};
	tasks.push(task);
	id++;
	console.log('Die Liste auf dem Server besteht aus: ');
	console.log(tasks);
	res.redirect('/');
});

// #######################
//  UPDATE
// #######################
app.post('/task', function(req,res) {
	tasks.forEach(function(taskItem){
		if (taskItem.taskid == req.body.id) {
			taskItem.status = req.body.status;
		};
	});
	res.redirect('/');	
});

// #######################
//  list all
// #######################
app.get('/tasks', function(req, res) {
	res.redirect('/');
});

// #######################
//  list open/closed
// #######################
app.get('/tasks/:filter', function(req, res) {
	if (req.params.filter == 'CLOSED') {
		var closedTasks = tasks.filter(function(taskItem){
			if (taskItem.status == 'checked'){
				return true;
			}
			return false;
		});
		res.render('index', { 
   			taskArray:closedTasks
   		})	
	} // end closed
	else if (req.params.filter == 'OPEN') {
		var openTasks = tasks.filter(function(taskItem){
			if (taskItem.status == 'unchecked'){
				return true;
			}
			return false;
		}); // end filter
		res.render('index', { 
   			taskArray:openTasks
   		})	
	} // end open
	else
		res.redirect('/')
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
