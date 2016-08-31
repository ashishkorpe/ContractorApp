var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('cont',['cont']);//db and collection
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());

app.get('/',function(req,res){
	console.log("this is Index page");
});

app.get('/cont',function(req,res){
	console.log("I received a get request");
	db.cont.find(function(err,docs){
		console.log(docs);
		res.json(docs);
	});
});

app.post('/cont',function(req,res){
	console.log("received a post request");
	console.log(req.body);
	db.cont.insert(req.body,function(err,doc){//inserts the data into the db &
		res.json(doc);//sends the data back to the browser
	});
});

app.get('/users',function(req,res){
	db.collection('users').find(function(err,docs){
		res.json(docs);
	});
});

app.put('/cont/:id',function(req,res){
	var id = req.params.id;
	db.cont.findAndModify({query:{_id:mongojs.ObjectId(id)},		
		update:{$set:{fName:req.body.fName,
					  lName:req.body.lName,
					  email:req.body.email,
					  sex:req.body.sex,
					  dob:req.body.dob,
					  tel:req.body.tel,
					  id:req.body.id,
					  workEmail:req.body.workEmail,
					  project:req.body.project,
					  client:req.body.client,
					  sDate:req.body.sDate,
					  eDate:req.body.eDate,
					  labor:req.body.labor,
					  staffType:req.body.staffType,
					  vendor:req.body.vendor,
					  timeCard:req.body.timeCard,
					  manager:req.body.manager,
					  managerEmail:req.body.managerEmail,
					  handbook:req.body.handbook,
					  contractStatus:req.body.contractStatus,
					  rate:req.body.rate,
					  vendNum:req.body.vendNum,
					  vendEmail:req.body.vendEmail,
					  changes:req.body.change1
					}},
		new:true},function(err,doc){
			res.json(doc);
		});
});

app.listen(3000);
console.log("server running on port 3000");