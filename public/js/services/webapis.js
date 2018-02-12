var app = angular.module('WebApi',[])
app.service('webapis', function($mdDialog) {
    
    /*--------  Url */
   // this.baseUrl = "https://mycirculateitround.herokuapp.com";
    this.baseUrl = "http://localhost:8080";
  


  /* ----Login Screen--*/ 
  this.getLoginUrl = function(username,password){
    var url = this.baseUrl+"/api/login/?username="+username+"&password="+password+"&source=WEB";
    return url;
  };

  /*---- Attendance Screen ----- */
  this.getSubmitAttUrl = function(){
    var url = this.baseUrl+"/api/submit_att/?";
    return url;
  };

  this.getUrlOfCurrentDateAttendaceOfClass = function(class_code,school_code){
    var url = this.baseUrl+"/api/check_students_att/?class_code="+class_code+"&school_code="+school_code;
    return url;
  };
  this.loadStudentOfClassOfCurrentDate = function(class_code,school_code){
    var url = this.baseUrl+"/api/load_data/?class_code="+class_code+"&school_code="+school_code;
    return url;
  };


  /*------Report Screen-------*/
  this.getUrlForClassAttDateRange = function(username,school_code,class_code,sdate,edate){
    var url = this.baseUrl+"/api/getClassAtt/?username="+username+"&school_code="+school_code+"&class_code="+class_code+"&sdate="+sdate+"&edate="+edate;
    return url;
  };
  this.getUrlForStudentOfClass = function(teacherclasses,school_code){
      var url = this.baseUrl+"/api/getClassStudents/?class_code="+teacherclasses+"&school_code="+school_code;
      return url;
  };



/*---Add Schools*/
this.getUrlForAddSchool = function(username){
 var url = this.baseUrl+"/api/add_schools/?username="+username;
 return url;  
}




});