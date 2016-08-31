var myApp = angular
	.module("myApp",["ngRoute","ngSanitize", "ngCsv", "ui.bootstrap.modal"])
	.config(function($routeProvider,$locationProvider){
		$routeProvider
		.when('/',{
			templateUrl:"partials/login.html",
			controller:"loginCtrl"
		})
		.when('/logout',{
			templateUrl:"partials/logout.html",			
		})
		.when('/main',{
			templateUrl: "partials/home.html",		
		})
		.when('/list',{
			templateUrl:"partials/list.html",
			controller:"myCtrl1"
		})
		.when('/detail/:id',{
			templateUrl:"partials/detail.html",
			controller:"myCtrl2"
		})
		.when('/hire',{
			templateUrl:"partials/form1.html",
			controller:"personalCtrl"
		})
		.when('/next',{
			templateUrl:"partials/form2.html",
			controller:"hireCtrl"
		})
		.when('/enroll',{
			templateUrl:"partials/enroll.html",
			controller:""
		})
		$locationProvider.html5Mode(true);
	})

	.controller('loginCtrl',function($scope,$http,$location){
		var userPresent = false;
		$scope.verify = function(username,password){
			if (username != null && password != null){
				$http.get('/users').success(function(response){
					for(var i=0;i<response.length;i++){
						console.log(response[i].uname);
						console.log(response[i].password);
						if(response[i].uname == username && response[i].password == password){
							userPresent = true;
							break;
						}
					}
					if(userPresent == true){
						$location.url('/main');
					} else{
						alert("User not found, Please try again");
					}
					$scope.username = "";
					$scope.password = "";				
				});
			}else{
				alert("No username/password provided, please enter credentials and try again");
			}									
		};
	})

	.controller("myCtrl1",function($scope,$http){		
		$http.get('/cont').success(function(response){
			$scope.contactlist = response;
				var resp1 = [];					
				for(var cont_details=0;cont_details<response.length;cont_details++){
					var resp3 = response[cont_details];
					var resp2 = new Object();
					for(var kl in resp3){
						if(kl != "_id" && kl !="dob" && kl !="sDate" && kl !="eDate" && kl !="changes"){
							resp2[kl] = resp3[kl];
						}
						if(kl =="dob" || kl =="sDate" || kl =="eDate"){
							resp2[kl] = (resp3[kl].substr(5,2)+"/"+resp3[kl].substr(8,2)+"/"+resp3[kl].substr(0,4));
						}						
					}
					resp1.push(resp2);
				}
			$scope.getArray = resp1;
			$scope.getHeader = function(){
				return ["Softrams ID","First Name","Last Name","Personal Email","Gender","Date Of Birth","Phone","Work Email","Project","Client","Start Date","End Date","Title","Staff Type","Vendor","Time Card","Manager","Manager's Email" ,"Handbook","Contract Status","Rate","Vendor's Phone ","Vendor Email"];
			};
			$scope.clickFn = function(){
				console.log("click");
			};
			var activeCont = 0;
			for(var i=0;i<response.length;i++){
				if(response[i].contractStatus == "Active"){
					activeCont = activeCont + 1;
				}				
			}
			$scope.activeCont = activeCont;
		});
	})

	.controller("personalCtrl",function($scope,contService,$location){					
			$scope.gotData = function(contractor){
					contService.addPersonal($scope.contractor);
			};			
	})

	.controller("hireCtrl",function($scope,$http,contService, $location){
		$scope.contractor1 = contService.getPersonal();		
		$scope.enroll = function(contractor){
			var contractor2={};
			for(key in $scope.contractor1)
				contractor2[key] = $scope.contractor1[key];
			for(key in contractor)
				contractor2[key] = contractor[key];
			if($scope.contractor1 != null && contractor != null){		
				$http.post('/cont', contractor2).success(function(response){				
				});
				$location.url('/enroll');
			}else{
				alert("Please input all the data");				
			}
		};		
	})

	.controller("myCtrl2",function($scope,$http,$routeParams,$filter){		
		$http.get('/cont').success(function(response){
			var cont1 = new Object();
			$scope.cont1 = cont1;
			var changesIndicator = false;
			$scope.changesIndicator = changesIndicator;
			for(var i=0;i<response.length;i++){
				if(response[i].id == $routeParams.id){										
					$scope.cont = response[i];
					for (var ka in response[i]){
						if(ka != "_id"){
							$scope.cont1[ka] = $scope.cont[ka];
						}
						if(ka == "changes"){
							changesIndicator = true;
							$scope.changesIndicator = changesIndicator;							
							var message = $scope.cont[ka];
							for (var j in message) {
								
							};
							$scope.message = "";
						}
					}
					var contract = true;
					$scope.contract = contract;
					if(response[i].eDate == undefined){
						contract = false;
						$scope.contract = contract;
					}
					if(response[i].rate == undefined){
						rate = false;
						$scope.rate = rate;
					}					
					break;
				}
			}
			var editData = false;
			$scope.editData = editData;
			$scope.edit = function(id){
				editData = true;
				$scope.editData = editData;
			}		
		});
		$scope.open = function(){
			$scope.showModal = true;
		};
		$scope.ok = function(){
			$scope.showModal= false;
		};
		$scope.update = function(id){
			var change1 = new Object();
			for (var kz in $scope.cont1){
				if($scope.cont1[kz] != $scope.cont[kz]){
					change1[kz] = $scope.cont[kz];
					change1[kz+"New"] = $scope.cont1[kz];
				}
			}
			date = new Date();
			change1["dateChange"] = $filter('date')(new Date(), 'MM/dd/yyyy');
			$scope.cont1["change1"] = change1;
			console.log("cont3 object prepared!");
			$http.put('/cont/'+$scope.cont._id,$scope.cont1).success(function(response){				
				console.log("update successfull !");
				angular.forEach(response,function(value,key){
					console.log("key: "+ key + " Value :"+ value );
				});
			});
		};
	})

	.service('contService',function(){
		var contDetails;
		var addPersonal = function(newObj){
			contDetails = newObj;
		};
		var getPersonal = function(){
			return contDetails;
		};
		return{
			addPersonal:addPersonal,
			getPersonal:getPersonal
		};
	})

	.service('contDetail',function(){
		var contChanges;
		var addChanges = function(newObj){
			contChanges = newObj;
		};
		var getChanges = function(){
			return contChanges;
		};
		return{
			addChanges:addChanges,
			getChanges:getChanges
		};
	});	