var app = angular.module('LoginForm',[]);



app.controller('Ctrl', function($scope, $rootScope,$location,$http,authSvc){
  $scope.vm = {
      formData: {
        email: '',
        password: ''
      }
  };


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





  $rootScope.isLogin = false;

var download = function(){
  console.log("hgiing");
  var apiUrl = "http://localhost:8080/api/downloadexcel/";
  $http.get(apiUrl)
          .then(function(response) {
            alert(response.data+"");
          });
}




  $scope.vm.submit = function(){
  var apiUrl = "https://mycirculateitround.herokuapp.com/api/login/?username="+$scope.vm.formData.email+"&password="+$scope.vm.formData.password;
        $http.get(apiUrl)
          .then(function(response) {
        var serverResponse = response.data;
        if(serverResponse.status){
        $rootScope.userinfo1 = serverResponse.data;
      }
      else 
      {

      }
    });
  } 


  //alert($rootScope.userinfo.info);

});