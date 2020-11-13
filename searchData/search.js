
var myApp = angular.module('app', []);

myApp.controller('searchController', function($scope, $http){
    // call to get data from JSON file
    $http({
        method: 'GET',
        url: 'MOCK_DATA.JSON'
    }).then(function mySuccess(response){
        $scope.myData = response.data;
    },function myError(response){
        $scope.myData = response.statusText;
    });

    // search for word
    $scope.searchForWord = function(){
        $scope.jList = $scope.myData;
    }
    // clear the textField
    $scope.clearSearch = function(){
        $scope.searchWord = null;
    }

});