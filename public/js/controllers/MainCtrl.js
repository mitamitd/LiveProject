var app=angular.module('MainCtrl', []);
//session localstorage socket
app.factory('authSvc',
        function($http, $q, $window, $rootScope) {
            self = this
            self.userinfo = null
            storage_key = 'school-project-userinfo'
            setAuthHeader = function() {
                $http.defaults.headers.common['Username'] = self.userinfo.username
                console.log('authicated login3')
              }
              unsetAuthHeader = function(){
                $http.defaults.headers.common['Username'] = null
              }
            self.onlogin = function(uname, data) {
                self.userinfo = {
                    username: uname,
                    mobile:data.mobile,
                    name:data.name,
                    agency_code:data.agency_code,
                    client_code:data.client_code,
                    project_code:data.project_code,
                    designation:data.designation,
                    user_type:data.user_type,
                    info:data

                }
                
                console.log('authicated login1')
                $window.localStorage[storage_key] = JSON.stringify(self.userinfo)
                console.log('authicated login2')
                $rootScope.userinfo = self.userinfo
                setAuthHeader()
              }
            self.init = function(){
                console.log('initializing autSrv');
                
                if ($window.localStorage[storage_key]){
                    storage = $window.localStorage[storage_key]
                    self.userinfo = JSON.parse(storage)
                    
                    console.log(self.userinfo)
                    setAuthHeader()
                    console.log('loading ... userinfo')
                    }}

            self.logout = function(){
                $window.localStorage[storage_key] = null;
                storage = $window.localStorage[storage_key]
                self.userinfo = JSON.parse(storage)
                $rootScope.userinfo = self.userinfo
                unsetAuthHeader()
              }
            self.login = function(username, password) {
                deferred = $q.defer()
                
                $http.get("https://mycirculateitround.herokuapp.com/api/login/?username="+username+"&password="+password+"&source=WEB")
                .success(function(result){
                    if (result.isError){
                      console.log('login error')
                        deferred.reject(result)
                      }
                    else{
                      console.log('authicated login')
                        self.onlogin(username, result.data)
                        deferred.resolve(self.userinfo)}
                      }
                )
                return deferred.promise
                }
            self.getUserInfo = function() {
                console.log('Getting userinfo')
                console.log(self.userinfo)
                return self.userinfo
                }
            self.init()
            return { 
              login: self.login, getUserInfo: self.getUserInfo, onlogin: self.onlogin, init: self.init
            }
          }
);

app.controller('MainController', function($scope, $rootScope,$http,$location,authSvc) {
  /*$rootScope.userinfo = {
    "info" : {
  "first_name":""
}
  }
    $scope.userinfo = {
        username : $rootScope.userinfo.info.first_name,
        class:$rootScope.userinfo.info.class
    };
    $rootScope.userinfo.info.first_name = "";*/
    
this.settings = {
      printLayout: true,
      showRuler: true,
      showSpellingSuggestions: true,
      presentationMode: 'edit'
    };
    this.sampleAction = function(name, ev) {
      $mdDialog.show($mdDialog.alert()
        .title(name)
        .textContent('You triggered the "' + name + '" action')
        .ok('Great')
        .targetEvent(ev)
      );
    };


    $scope.attendance = function(){
        
        $location.path('/attendance');
    }
    $scope.attendanceReport = function(){
     $location.path('/class_attendance_report'); 
    }
    $scope.addSchools = function(){
     $location.path('/add_schools');
    }
    $scope.addClasses = function(){
     $location.path('/add_classes'); 
    }
    
    

	$scope.tagline = 'To the moon and back!';

    $scope.data = [];
    $scope.load_data = function(){
        console.log('a')
        $http.get("http://localhost:8080/test/").then(function(res) {
            if (res.isError) {
                alert(res.msg);
            } else {
                $scope.data = res.data;
                alert(JSON.stringify($scope.data));
            }
//            $scope.data = res.data;
//
//            alert(JSON.stringify($scope.data));
//            $scope.$watch('data',function(){
//                $scope.data = res.data;
//            });
        })
    }
});
app.filter('keyboardShortcut', function($window) {
    return function(str) {
      if (!str) return;
      var keys = str.split('-');
      var isOSX = /Mac OS X/.test($window.navigator.userAgent);
      var seperator = (!isOSX || keys.length > 2) ? '+' : '';
      var abbreviations = {
        M: isOSX ? '⌘' : 'Ctrl',
        A: isOSX ? 'Option' : 'Alt',
        S: 'Shift'
      };
      return keys.map(function(key, index) {
        var last = index == keys.length - 1;
        return last ? key : abbreviations[key];
      }).join(seperator);
    };
  });

  