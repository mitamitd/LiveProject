angular.module('myApp', [
    'ngMaterial',
    'ngMessages',
    'ngRoute',
    'ngAria',
    'ngAnimate',
    'AttendanceView',
    'AttendanceReport',
    'LoginForm',
    'MainCtrl',
    'AdminCtrl'
])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider,authSvc) {

    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'Ctrl'
        })
        .when('/attendance', {
            templateUrl: 'views/attendance.html',
            controller: 'AttendanceController',
            resolve: {
             //   authSvc.init();
                auth:['authSvc','$rootScope',function(authSvc, $rootScope)
                {
                    var userinfo = authSvc.getUserInfo()
                $rootScope.userinfo = userinfo
                if(userinfo)
                {
                    $rootScope.isLogin = true;
                }
                }
                ]
                
            }
        }).when('/class_attendance_report', {
            templateUrl: 'views/class_attendance_report.html',
            controller: 'ClassAttReportController'
        }).when('/add_schools', {
            templateUrl: 'views/add_schools.html',
            controller: 'AdminCtrl'
        });

    $locationProvider.html5Mode(true);

}]);