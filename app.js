var express  	= require('express');
var path 		= require('path');
var bodyParser 	= require('body-parser');
var app 		= express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var jsonParser 	= bodyParser.json()

var tasks = [];
var task  = "";
var taskimport = "";
var id = 1;

// Router und Controller
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

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
	task = {
		taskid: 1 + id,
		task: 	taskimport,
		status: 'unchecked'
	};
	id++;
	tasks.push(task);
	res.json(JSON.stringify(tasks));
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

app.listen(process.env.PORT || 3000, function() {
  console.log('App listening on port 3000 oder so!');
});