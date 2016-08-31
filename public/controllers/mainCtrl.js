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
			// controller:""			
		})
		.when('/main',{
			templateUrl: "partials/home.html",
			// controller:"homeCtrl"			
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

	// .controller("homeCtrl",function($scope,$http){
	// 	// console.log("Index page");
	// 	// $http.get('/').success(function(response){
	// 	// 	console.log(response);
	// 	// });
	// })
	
	.controller('loginCtrl',function($scope,$http,$location){
		var userPresent = false;
		$scope.verify = function(username,password){
			if (username != null && password != null){
				$http.get('/users').success(function(response){
					// console.log("entered username : "+ username);
					// console.log("entered passowrd : "+ password);
					for(var i=0;i<response.length;i++){
						console.log(response[i].uname);
						console.log(response[i].password);
						if(response[i].uname == username && response[i].password == password){
							userPresent = true;
							//$location.url('/main');
							break;
						}
						// }else if(i==response.length){
						// 	alert("User not found, Please try again");
						// }
					}
					if(userPresent == true){
						$location.url('/main');
					} else{
						alert("User not found, Please try again");
					}
					// console.log("done searching");
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
			// console.log("got the data from the database");
			// console.log(response);
			$scope.contactlist = response;
			// $scope.getArray = response;
				var resp1 = [];					
				for(var cont_details=0;cont_details<response.length;cont_details++){
					var resp3 = response[cont_details];
					var resp2 = new Object();
					for(var kl in resp3){
						// console.log(typeof key);
						if(kl != "_id" && kl !="dob" && kl !="sDate" && kl !="eDate" && kl !="changes"){
							// console.log("key :"+ kl);
							// console.log("value :"+ resp3[kl]);
							// var key1 = kl.substring(0,key.length);
							// var key = kl.valueOf();
							// var value = resp3[kl];
							// resp2.key = value;
							resp2[kl] = resp3[kl];
						}
						if(kl =="dob" || kl =="sDate" || kl =="eDate"){
							resp2[kl] = (resp3[kl].substr(5,2)+"/"+resp3[kl].substr(8,2)+"/"+resp3[kl].substr(0,4));
						}						
					}
					resp1.push(resp2);
				}
				// resp1.push(resp2);
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
					// console.log(response[i].contractStatus);
					activeCont = activeCont + 1;
				}				
			}
			$scope.activeCont = activeCont;
			// console.log("active contractors: "+$scope.activeCont);
			// var message = "Ashish is an awesome typist ! ;)";
			// // $scope.message = message;
			// $scope.message = contDetail.getChanges();
		});
		// $scope.backup = function(){
		// 	console.log("chalo bulawa aaya hai");
		// 	angular.forEach(response,function(value,key){
		// 	 	console.log("key: "+ key + " Value :"+ value );
		// 	});
		// };
	})

	.controller("personalCtrl",function($scope,contService,$location){					
			$scope.gotData = function(contractor){
				// if(this.contractor != null){
					// console.log($scope.contractor.dob);
					// $scope.contractor.dob = $scope.contractor.dob.substr(0,9);
					// angular.forEach($scope.contractor,function(value,key){
					// 	console.log("key: "+ key + " Value :"+ value );
					// });
					// var targetDate = $scope.contractor['dob'];
					// console.log(typeof(targetDate));
					// console.log(typeof(targetDate.value));
					// targetDate = targetDate.substr(5,2);
					// 
					// for(var j=0;j<$scope.contractor.length;j++){
						// var targetDate = $scope.contractor.dob.value;
						// console.log(typeof(targetDate));
					// }
					contService.addPersonal($scope.contractor);
					// console.log("after adding to the service");
					// console.log("$scope.contractor: "+ $scope.contractor);
					// console.log("posted the data: "+ $scope.contractor+" to the service");
					// $location.url('/next');
				// }else{
				// 	alert("Please input Data");
				// }
			};			
	})

	.controller("hireCtrl",function($scope,$http,contService, $location){
		// $scope.hired = "contractor hired!";
		$scope.contractor1 = contService.getPersonal();
		// console.log("$scope.contractor1 from the service: "+$scope.contractor1);
		// $scope.contractor2 = {};
		
		$scope.enroll = function(contractor){
			var contractor2={};
			for(key in $scope.contractor1)
				contractor2[key] = $scope.contractor1[key];
			for(key in contractor)//$scope.contractor -> contractor
				contractor2[key] = contractor[key];
				// var mm = contractor2.dob['sDate'].substr(5,2);
				// console.log(mm);
				// contractor2.dob = contractor2.dob.substr(5,2)+'/'+contractor2.dob.substr(8,2)+'/'+contractor2.dob.substr(0,4);
				// conntactor2.sDate = conntactor2.sDate.substr(5,2)+'/'+conntactor2.sDate.substr(8,2)+'/'+conntactor2.sDate.substr(0,4);
				// contractor2.eDate = contractor2.eDate.substr(5,2)+'/'+contractor2.eDate.substr(8,2)+'/'+contractor2.eDate.substr(0,4);
			// console.log(" combined object: "+contractor2);
			// angular.forEach(contractor2,function(value,key){
			// 	console.log("key: "+ key + " Value :"+ value );
			// });
			if($scope.contractor1 != null && contractor != null){		
				$http.post('/cont', contractor2).success(function(response){				
					// console.log("data posted to db:"+ contractor2);
				});
				$location.url('/enroll');
			}else{
				alert("Please input all the data");				
			}
		};		
	})

	.controller("myCtrl2",function($scope,$http,$routeParams,$filter){		
		$http.get('/cont').success(function(response){
			// console.log("got the data from the database");
			// console.log("response : "+response);
			// console.log("$scope: "+ $scope);
			// console.log("$routeParams.id: "+ $routeParams.id);
			// console.log("response length: "+response.length);
			// angular.forEach($scope.contactlist,function(value,key){
			// 	console.log("value.id: "+value.id);
			// 	console.log("$routeParams.id: "+ $routeParams.id);
			// 	if(value.id == $routeParams.id){
			// 		console.log("match!");
			// 		$scope.cont = response[value.id-1];					
			// 	}
			// });
			// console.log("$scope.contactlist.length:" +$scope.contactlist.length);
			// console.log("$routeParams.id: "+ $routeParams.id);
			var cont1 = new Object();
			$scope.cont1 = cont1;
			for(var i=0;i<response.length;i++){
				if(response[i].id == $routeParams.id){
					// console.log("inside first IF condition");										
					$scope.cont = response[i];
					for (var ka in response[i]){
						if(ka != "_id"){
							$scope.cont1[ka] = $scope.cont[ka];
						}
						if(ka == "changes"){
							console.log("changya aala re aala!");
							// contDetail.addChanges($scope.cont1[ka]);
							var message = $scope.cont[ka];
							for (var j in message) {
								
							};
							$scope.message = "";
						}
					}
					// $scope.cont1 = response[i];
					// angular.forEach(response[i],function(value,key){
					// 	console.log("key: "+ key + " Value :"+ value );
					// });
						var contract = true;
						$scope.contract = contract;
						// console.log("contract before IF condition : " +contract);
						// console.log("$scope.contract before IF: "+ $scope.contract);
					 	if(response[i].eDate == undefined){
					 		// console.log("inside second IF condition");
							// console.log(response[i].eDate);
							contract = false;
							$scope.contract = contract;
							// console.log("contract after IF condition : " + contract);
							// console.log("$scope.contract after IF: "+ $scope.contract);
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
		$scope.update = function(id){
			//put a for loop to check what has changed
			var change1 = new Object();
			// angular.forEach($scope.cont1,function(key,value){
			// 	if($scope.cont1[key] != $scope.cont[key]){
			// 		cont3[key] = $scope.cont[key];
			// 	}
			// });
			// $http.put('/cont/'+$scope.cont._id,cont3).success(function(response){
			for (var kz in $scope.cont1){
				if($scope.cont1[kz] != $scope.cont[kz]){
					change1[kz] = $scope.cont[kz];
					change1[kz+"New"] = $scope.cont1[kz];
				}				
				//if condition checking for a changes field
			}
			date = new Date();
			// cont3["dateChange"] = date;
			change1["dateChange"] = $filter('date')(new Date(), 'MM/dd/yyyy');
			//work for more changes
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