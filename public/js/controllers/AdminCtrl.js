var app = angular.module('AdminCtrl',[])
.controller('AdminCtrl', function($http,$scope, $rootScope,$location,commonservice,webapis){

$scope.school_details = {
	"school_name": "",
    "school_code": "",
    "head_school_name": "NA",
    "head_school_code": "NA"
}
$scope.isSchoolAdded = false;
$scope.progress_bar_school = false;
$scope.errmsg = false;
$scope.add_schools = function(ev){
    var apiUrl = webapis.getUrlForAddSchool($rootScope.userinfo.info.user_id);
	$scope.progress_bar_school = true;
  	$http.post(apiUrl,$scope.school_details)
          .then(function(response) {
            $scope.progress_bar_school = false;
            var serverResponse = response.data;
            if(serverResponse.status=="success"){
            $scope.isSchoolAdded = true;
            }
            else
            {
                commonservice.showAlert(ev,serverResponse.msg+"");
            }
    });
};

});