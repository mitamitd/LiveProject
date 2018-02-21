var app = angular.module('AddClassCtrl',[])
.controller('AddClassCtrl', function($http,$scope, $rootScope,$location,commonservice,webapis){

$scope.class_details = {
"class_name": "",
"section":"",
  "class_code": "",
  "school_name": "NA",
  "school_code": "NA"
}
$scope.isClassAdded = false;
$scope.progress_bar_class = false;
$scope.errmsg = false;
$scope.enableClassList = false;
$scope.add_class = function(ev){
  var apiUrl = webapis.getUrlForAddClass($rootScope.userinfo.info.user_id);
$scope.progress_bar_class = true;
	$http.post(apiUrl,$scope.class_details)
        .then(function(response) {
          $scope.progress_bar_class = false;
          var serverResponse = response.data;
          if(serverResponse.status=="success"){
          $scope.isClassAdded = true;
          }
          else
          {
              commonservice.showAlert(ev,serverResponse.msg+"");
          }
  });
};

  $scope.allClasses  = []
$scope.getAllClassesOfSchool = function()
{
  var apiUrl = webapis.getAllClassesOfSchool($rootScope.userinfo.info.user_id,$scope.selected_school);
  
  $scope.progress_bar_class = true;
  $http.get(apiUrl).then(function(response){
  var classes = response.data;
           if(classes.status){
              $scope.allClasses = classes.data;
              $scope.progress_bar_class = false;
           }
           else{
              commonservice.showAlert(schools.msg+"");
           }
});
  
}


$scope.isenableClassList = true;

$scope.enableClassList = function(value){
$scope.isenableClassList = value;
}


$scope.selected_school = "";
$scope.allSchools  = []
$scope.getAllSchools = function()
{
  var apiUrl = webapis.getAllSchools($rootScope.userinfo.info.user_id);
  $scope.progress_bar_school = true;
  $http.get(apiUrl).then(function(response){
  var schools = response.data;
           if(schools.status){
              $scope.allSchools = schools.data;
              $scope.selected_school = $scope.allSchools[0].school_code;
              $scope.progress_bar_school = false;
              $scope.getAllClassesOfSchool();              
           }
           else{
              commonservice.showAlert(schools.msg+"");
           }
});
  
}
$scope.getAllSchools();

$scope.isenableSchoolList = true;



});