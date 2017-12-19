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

// home = list all tasks
app.get('/', function (req, res) {
	res.render('index', { 
   		taskArray:tasks
   	})	
})


// CREATE task
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
	res.send("hello world");
	//res.redirect('/');
	console.log('du dürftest gar nicht angezeigt werden');
});





// UPDATE task
app.post('/task', function(req,res) {
	tasks.forEach(function(taskItem){
		if (taskItem.taskid == req.body.id) {
			taskItem.status = req.body.status;
		};
	});
	res.json(JSON.stringify(tasks));	
});

// list all tasks
app.get('/tasks', function(req, res) {
	res.json(JSON.stringify(tasks));
});

// list closed/open tasks
app.get('/tasks/:filter', function(req, res) {
	if (req.params.filter == 'CLOSED') {
		var closedTasks = tasks.filter(function(taskItem){
		if (taskItem.status == 'checked'){
			return true;
		}
		return false;
		});
		res.json(JSON.stringify(closedTasks))
	}
	else if (req.params.filter == 'OPEN') {
		var openTasks = tasks.filter(function(taskItem){
		if (taskItem.status == 'unchecked'){
			return true;
		}
		return false;
		}); // end filter
		res.json(JSON.stringify(openTasks))
	} // end open
	else
		res.redirect('/')
});

// list open tasks
app.get('/tasks?filter=OPEN', function(req, res) {
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
