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


app.get('/', function (req, res) {
	//res.setHeader('Cache-Control', 'no-cache');
	res.render('index', { 
   		taskArray:tasks
   	})
  	console.log(tasks);
})


app.post('/updateItem', function(req,res) {
	tasks.forEach(function(taskItem){
		if (taskItem.taskid == req.body.id) {
			taskItem.status = req.body.status;
		};
	});
	res.json(JSON.stringify(tasks));	
});


app.post('/create', function(req, res) {
	taskimport = req.body.pendenz;
	console.log("Das ist der Import: " + taskimport);
	task = {
		taskid: 1 + id,
		task: 	taskimport,
		status: 'unchecked'
	};
	tasks.push(task);
	id++;
	res.redirect('/');
});


app.get('/listTasks', function(req, res) {
	res.json(JSON.stringify(tasks));
});

app.get('/listClosedTasks', function(req, res) {
	var closedTasks = tasks.filter(function(taskItem){
		if (taskItem.status == 'checked'){
			return true;
		}
		return false;
	});
	res.json(JSON.stringify(closedTasks));
});

app.get('/listOpenTasks', function(req, res) {
	var openTasks = tasks.filter(function(taskItem){
		if (taskItem.status == 'unchecked'){
			return true;
		}
		return false;
	});
	res.json(JSON.stringify(openTasks));
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
