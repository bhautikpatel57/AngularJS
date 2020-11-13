
var myApp = angular.module('app', ['ngRoute']);

myApp.config(function($routeProvider){
    $routeProvider
    .when('/',
    {
        controller: 'loginController',
        templateUrl: 'views/loginPage.html'
    }).when('/employeeList',
    {
        controller: 'employeeListController',
        templateUrl: 'views/employeeList.html'
    }).when('/employeeDetails',
    {
        controller: 'employeeDetailsController',
        templateUrl: 'views/employeeDetails.html'
    });
});

// navBarController
myApp.controller('navBarController', function($scope, $location){
    $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path()
    }
});

// login controller
myApp.controller('loginController', function($scope, $location, $window){
    $scope.procced = function(){
        if($scope.user !=  null || $scope.pass != null){
            $location.path('/employeeList');
        }else{
            alert('Invalid userID and Password');
        }
    }
    $scope.closeBrowser = function(){
        $window.close();
    }
});

// get data from json file
myApp.service('jsonService', function($http){
    this.getData = function(){
        return $http.get('empName.json');
    }
})

// service to handle the data
myApp.service('dataService', function(){
    this.passedData =[];
    this.empdata;
    this.checkwhat;

    this.addNewEmp = function(emp){
        this.passedData.push(emp);
    }  
});

// service to populate the data
myApp.service('populateData', function(){
    this.calculateAge = function(ag){
        var d = new Date();
        var cYear = d.getFullYear() - ag.getFullYear();
        return cYear;
    }
});

// -----------------------------------------------------------------------------------------------------

// employee list controller
myApp.controller('employeeListController', function($scope, $location, $window, jsonService, dataService){
   if(dataService.passedData.length == 0){
       jsonService.getData()
            .then(function(response){
                $scope.displayData = response.data;
                dataService.passedData = response.data;
    });
   }else{
       $scope.displayData= dataService.passedData;
   }
   //  delete employee
   $scope.deleteEmployee = function(index){
       var name = dataService.passedData[index].name;
       if($window.confirm("Are you sure you want to delete " + name)){
           dataService.passedData.splice(index, 1);
        }    
   }
   // edit employee
   $scope.editEmployee = function(index){
       dataService.checkwhat='edit';
       dataService.empdata = dataService.passedData[index];
    // console.log(dataService.empdata);
        $location.path('/employeeDetails');
      };

    $scope.addEmployee = function(){
        dataService.checkwhat='add';
        $location.path('/employeeDetails');  
    }
});

// -----------------------------------------------------------------------------------------------------------

// employee details controller
myApp.controller('employeeDetailsController', function($scope, $location, dataService, populateData){
 if(dataService.checkwhat==='add'){
    $scope.saveShow = true;
    $scope.saveEmployee = function(){
        var newEmp = {
            id: $scope.empID,
            name: $scope.empLastname + " " + $scope.empMname + ", " + $scope.empFirstname,
            birthday: $scope.empBday,
            age: populateData.calculateAge($scope.empBday) 
        }
        dataService.addNewEmp(newEmp);
        $location.path('/employeeList');
        dataService.checkwhat='';
    }
}
else if(dataService.checkwhat==='edit'){
        
        $scope.isDisabled = true;
        $scope.updateShow = true;
        $scope.saveShow = false;
    
        var str = dataService.empdata.name.split(" ");
        var mNameSplit = str[1];
        var newMName = mNameSplit.substring(0, 1);
        
        //convert mm/dd/yyyy to input type date format 
        var inputFormatterDate = new Date(dataService.empdata.birthday);

        // re-populating the data when clicked on edit
        $scope.empID = dataService.empdata.id;
        $scope.empFirstname = str[2];
        $scope.empMname = newMName;
        $scope.empLastname = str[0];
        $scope.empBday = inputFormatterDate;
        
        $scope.sendBack = function(){
            var updatedEmp = {
                id: $scope.empID,
                name: $scope.empLastname + " " + $scope.empMname + ", " + $scope.empFirstname,
                birthday: $scope.empBday,
                age: populateData.calculateAge($scope.empBday)
            }
            console.log(updatedEmp);
            for(var i=0; i < dataService.passedData.length; i++){
                if(dataService.passedData[i].id === $scope.empID){
                    dataService.passedData[i] = updatedEmp;
                    $location.path('/employeeList');
                }
            }
        }
    }
    $scope.returnToEmployee = function(){
        $location.path('/employeeList');
    }

});









