var app = angular.module('LoginForm',[]);

app.controller('Ctrl', function($scope, $rootScope,$location,$http,authSvc){
  $scope.vm = {
      formData: {
        email: '',
        password: ''
      }
  };

        $rootScope.isLogin = false;
        $scope.msg = 'Please login!';
        $rootScope.isLogin = false
        $scope.login = function(){
            if ($scope.vm.formData.email == ''){
                $scope.msg = 'Please Enter Username!'
                return;}
            if ($scope.vm.formData.password == ''){
                $scope.msg = 'Please Enter Password!'
                return;}
                console.log('authicated loginyyyyyy')
           authSvc.login($scope.vm.formData.email, $scope.vm.formData.password)
            .then(function(obj){
               
                $rootScope.isLogin = true
                $rootScope.userinfo1 = obj.info.user_id;
                console.log('login success')
                console.log(obj);
                $scope.msg = 'Login Successful!'
                $location.path('/attendance')
              },function(err){
                if(err.status == 'err')
                    $scope.msg = err.msg
                console.log(err)
                $rootScope.isLogin = false
              }
            )
          }


  
});