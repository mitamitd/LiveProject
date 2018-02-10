var app = angular.module('AdminCtrl',[])
.controller('AdminCtrl', function($http,$scope, $rootScope,$location){

$scope.school_details = {
	"school_name": "",
    "school_code": "",
    "head_school_name": "NA",
    "head_school_code": "NA"
}
$scope.isSchoolAdded = false;
$scope.progress_bar_school = false;
$scope.add_schools = function(){
	var apiUrl = "https://mycirculateitround.herokuapp.com/api/add_schools/?";
	$scope.progress_bar_school = true;
	$http.post(apiUrl,$scope.school_details)
          .then(function(response) {
          	alert('response'+response.data);
            var serverResponse = response.data;
            if(serverResponse.status){
            $scope.isSchoolAdded = true;
            $scope.progress_bar_school = false;
            }
            else
            {
                alert(serverResponse.msg+"");
            }
    });
};

});