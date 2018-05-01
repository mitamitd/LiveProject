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
  $scope.allSections = ["A","B","C","D","E","F"];
  $scope.listOfClasses = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"];

   $scope.allClasses  = []
  $scope.getAllClassesOfSchool = function()
  {
    var apiUrl = webapis.getAllClassesOfSchool($rootScope.userinfo.info.user_id,$scope.selected_school);
    
     $scope.progress_bar_school = true;
    $http.get(apiUrl).then(function(response){
    var classes = response.data;
             if(classes.status=="success"){
                $scope.allClasses = classes.data;
                $scope.progress_bar_school = false;
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
             if(schools.status=="success"){
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


  $scope.selected_school_obj = {};
  $scope.setSchoolName = function(){
  $scope.class_details.school_name = $scope.selected_school_obj.school_name;
  $scope.class_details.school_code = $scope.selected_school_obj.school_code;
  }

  $scope.addClass = function(){
    var apiUrl = webapis.getAddClassUrl($rootScope.userinfo.info.user_id);
    $scope.progress_bar_school = true;
    
    $http.post(apiUrl,$scope.class_details).then(function(response){
                var class_res = response.data;
               $scope.progress_bar_school = false;
             if(class_res.status=="success"){
                commonservice.showAlert("Class Added Successfully!!");
                
                $scope.enableClassList(true);
                $scope.getAllClassesOfSchool();
             }
             else{

                commonservice.showAlert(class_res.msg+"");
             }
      });
  }
  });