var app = angular.module('AttendanceReport',[])
.controller('ClassAttReportController', function($http,$scope, $rootScope,$location){

    $scope.userinfo = $rootScope.userinfo.info.class_code;

    $scope.teacherclasses = "";
	var currDate = new Date();
	
	var sdate = currDate.getFullYear()+'-'+currDate.getMonth()+'-'+1;
    $scope.sdatemodel = new Date(currDate.getFullYear(),currDate.getMonth(),1);
	edate = currDate.getFullYear()+'-'+(currDate.getMonth()+1)+'-'+currDate.getDate();
	$scope.edatemodel = new Date();
	
    $scope.$watch('sdatemodel', function (newValue, oldValue, scope) {
        sdate =  newValue.getFullYear()+'-'+(newValue.getMonth()+1)+'-'+newValue.getDate();
        });
    $scope.$watch('edatemodel', function (newValue, oldValue, scope) {
        edate =  newValue.getFullYear()+'-'+(newValue.getMonth()+1)+'-'+newValue.getDate();
        });

    $scope.classAttLoaded = true;
    var classAttData = [];

   
    $scope.datadetail = function()
    {
        alert(JSON.stringify($rootScope.userinfo.info)+"")
    }
    $scope.datadetail();
	
    $scope.loadClassReport = function()
	{
        if($scope.teacherclasses=="")
        {
            alert("Please select class first!!");
            return;
        }
        $scope.classAttLoaded = false;
		var apiUrl = "https://mycirculateitround.herokuapp.com/api/getClassAtt/?username="+$rootScope.userinfo.info.user_id+"&school_code="+$rootScope.userinfo.info.school_code+"&class_code="+$scope.teacherclasses+"&sdate="+sdate+"&edate="+edate;
        $http.get(apiUrl)
          .then(function(response) {
                var attRes = response.data;
                if(attRes.status){
                    if(attRes.data.length>0)
                        {
                        classAttData = attRes.data;
                        var apiClassStudents = "https://mycirculateitround.herokuapp.com/api/getClassStudents/?class_code="+$scope.teacherclasses+"&school_code="+$rootScope.userinfo.info.school_code;  
                        $http.get(apiClassStudents)
                        .then(function(response1) {
                            var studentData = response1.data;
                            $scope.classAttLoaded = true;
                            if(studentData.status){
                                if(studentData.data.length>0)
                                    {
                                    $scope.allStudents = studentData.data;
                                    enumerateDaysBetweenDates();
                                    arrangeAllStudentsData();
                                    }
                                    else
                                    {
                                        alert("No student found of this class!!");
                                    }
                                }
                                else
                                {
                                    alert(studentData.msg+"");
                                }
                            });
                        }
                        else{
                            $scope.allStudents = [];
                            $scope.classAttLoaded = true;
                             alert("No any attendance of this class found!!");
                            }
                    }
                    else 
                        {
                        alert("working5")
                        }
                });
	}
    $scope.allBtwDates = [];

    var enumerateDaysBetweenDates = function() {
        
            var dates = [];
            var startDate = moment(sdate).startOf('day');
            var lastDate = moment(edate).startOf('day');
            dates.push(moment(startDate).format('YYYY-MM-DD'));
            while(startDate.add(1, 'days').diff(lastDate) < 1) {
            console.log(startDate.toDate());
            dates.push(moment(startDate).format('YYYY-MM-DD'));
            }
            $scope.allBtwDates = dates;
        };

    var arrangeAllStudentsData = function()
    {
        
     for(var k=0;k<$scope.allStudents.length;k++){
        $scope.allStudents[k].studnetDetailAttArr = [];
        for(var i=0;i<$scope.allBtwDates.length;i++)
        {
            var isDateFound = false;
            for(var j=0;j<classAttData.length;j++){
                var updatedon = classAttData[j].updated_on;
                if($scope.allBtwDates[i]==updatedon.date_YYYYMMDD && $scope.allStudents[k].user_id==classAttData[j].data.user_id)
                {
                    isDateFound = true;
                    $scope.allStudents[k].studnetDetailAttArr.push(classAttData[j].data); 
                    break;
                }
            }
            if(!isDateFound){
                $scope.allStudents[k].studnetDetailAttArr.push({"att":"-"});
            }
        }
    }
    };
});