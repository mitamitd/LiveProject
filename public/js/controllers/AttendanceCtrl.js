var app = angular.module('AttendanceView',[])
.controller('AttendanceController', function($http,$scope, $rootScope,$location,webapis){
$scope.userinfo = $rootScope.userinfo.info.class_code;
$scope.teacherclasses = "";
var currDate = new Date();
$scope.attOp = 'P';   

$scope.attOption = [
"P","A","O"]

$scope.isAttMarked = false;
$scope.isAttAlreadyMark = false;
$scope.isAttMarkReq = false;
$scope.attDataLoaded = true;
$scope.msg = "";
$scope.submit = function(){
    var apiUrl = webapis.getSubmitAttUrl();
    var students_att = [];
    for (var i = 0; i<$scope.students.length; i++) {
      students_att.push({updated_by:$rootScope.userinfo.info.user_id,class_code:$scope.teacherclasses,data:$scope.students[i]});
    };
        
    $http.post(apiUrl,students_att)
          .then(function(response) {
            var serverResponse = response.data;
            if(serverResponse.status){
            $scope.isAttMarked = true;
            $scope.isAttMarkReq = false;
            }
    });
  }


$scope.checkForAttendance = function()
{
  $scope.msg = "";
  if($scope.teacherclasses== "")
  {
    alert("Please select class first");
    return;
  }
  $scope.attDataLoaded = false;
  var apiUrl = webapis.getUrlOfCurrentDateAttendaceOfClass($scope.teacherclasses,$rootScope.userinfo.info.school_code);
     $http.get(apiUrl)
          .then(function(response) {
            var todayAttRes = response.data;
             if(todayAttRes.status){
                if(todayAttRes.data.length>0)
                  {
                  $scope.isAttAlreadyMark = true;
                  $scope.isAttMarkReq = false;
                  $scope.attDataLoaded = true;
                  }
                  else
                  {
                    $scope.isAttAlreadyMark = false;
                    $scope.loadData();
                  }
                }
                else 
                    {
                    alert("working5")
                    }
    });
}



$scope.loadData = function(){
          var apiUrl = webapis.loadStudentOfClassOfCurrentDate($scope.teacherclasses,$rootScope.userinfo.info.school_code);
        $http.get(apiUrl)
          .then(function(response) {
              var serverResponse = response.data;
              if(serverResponse.status)
              {
               
                  $scope.attDataLoaded = true;
                  if(serverResponse.data.length>0)
                  {
                   $scope.students = serverResponse.data;
                   $scope.isAttMarkReq = true;
                  }
                 else
                 {
                  $scope.isAttMarkReq = false;
                  $scope.msg = "No Student found in this class";
                  }
              }                
    });
}
});