var app = angular.module('AddStudentsCtrl',[])
    .controller('AddStudentsCtrl', function($http,$scope, $rootScope,$location,commonservice,webapis){
        $scope.userinfo = $rootScope.userinfo.info.class_code;
        $scope.user_type = [
            "teacher",
            "student"
        ]
        $scope.allSections = ["A","B","C","D","E","F"];

        $scope.listOfClasses = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"];

        $scope.user_detail = {
            "roll_no":"",
            "user_id": "",
            "first_name": "",
            "last_name": "",
            "user_type": "",
            "class_name":"",
            "section":"",
            "class_code": "",
            "school_name":"",
            "school_code": ""
        }





        $scope.progress_bar_class = false;

        $scope.selected_class = "";
        $scope.selected_section = "";

        $scope.isUserMatched = function(user){
            return (user.user_type=='student') && (user.class_code==($scope.selected_class+$scope.selected_section));
        }

        $scope.getAllSections = function(){
            var sections = []
            for(var i=0;i<$scope.allClasses.length;i++)
            {
                if(sections.indexOf($scope.allClasses[i].section)===-1){
                    sections.push($scope.allClasses[i].section);
                }
            }

            return sections;
        }

        $scope.allStudentsOfSchoolAndClass  = []
        $scope.getAllStudentOfSchoolAndClass = function()
        {
            var apiUrl = webapis.getAllStudentsOfSchoolAndClass($rootScope.userinfo.info.user_id,$scope.selected_school_obj.school_code,$scope.selected_class+$scope.selected_section);

            $scope.progress_bar_school = true;
            $http.get(apiUrl).then(function(response){
                var users = response.data;
                if(users.status=="success"){
                    $scope.allStudentsOfSchoolAndClass = users.data;
                    $scope.progress_bar_school = false;
                }
                else{
                    commonservice.showAlert(users.msg+"");
                }
            });
        }

        $scope.allClasses  = []
        $scope.getAllClassesOfSchool = function()
        {
            var apiUrl = webapis.getAllClassesOfSchool($rootScope.userinfo.info.user_id,$scope.selected_school_obj.school_code);

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


        $scope.isenableUserList = true;

        $scope.enableUserList = function(value){
            $scope.isenableUserList = value;
        }


        $scope.allSchools  = []
        $scope.getAllSchools = function()
        {
            var apiUrl = webapis.getAllSchools($rootScope.userinfo.info.user_id);
            $scope.progress_bar_school = true;
            $http.get(apiUrl).then(function(response){
                var schools = response.data;
                if(schools.status=="success"){
                    $scope.allSchools = schools.data;
                    $scope.selected_school_obj = $scope.allSchools[0];
                    $scope.progress_bar_school = false;
                    $scope.getAllUsersOfSchool();
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
            $scope.user_detail.school_name = $scope.selected_school_obj.school_name;
            $scope.user_detail.school_code = $scope.selected_school_obj.school_code;
        }


        $scope.addUser = function(){
            $scope.setSchoolName();
            commonservice.showConfirmAlert('Selected School is '+$scope.user_detail.school_name,'Confirm','Cancel',function(){

                var apiUrl = webapis.addUserToDBUrl($rootScope.userinfo.info.user_id);
                $scope.progress_bar_school = true;

                $http.post(apiUrl,$scope.user_detail).then(function(response){
                    $scope.progress_bar_school = false;
                    var user_data = response.data;
                    if(user_data.status=="success")
                    {
                        commonservice.showAlert("User added successfully");
                        $scope.enableUserList(true);

                        $scope.getAllUsersOfSchool();
                        $scope.getAllClassesOfSchool();
                    }
                    else
                    {
                        commonservice.showAlert(user_data.msg+"");
                    }
                });

            },function(){

            });

        }

    });