var app = angular.module('CommonService',[])
app.service('commonservice', function($mdDialog) {
    this.showAlert = function(ev,title,description,okbutton) {
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title(title)
        .textContent(description)
        .ariaLabel('Alert Dialog')
        .ok(okbutton)
        .targetEvent(ev)
    );
  };

  this.showAlert = function(ev,description) {
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title("Alert Dialog")
        .textContent(description)
        .ariaLabel('Alert Dialog')
        .ok('Ok Got it!!')
        .targetEvent(ev)
    );
  };
this.showAlert = function(description) {
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title("Alert Dialog")
        .textContent(description)
        .ariaLabel('Alert Dialog')
        .ok('Ok Got it!!')
        .targetEvent()
    );
  };

this.showConfirmAlert = function(content,okbuttontext,cancelbuttontext,okfun,cancelfun){
var confirm = $mdDialog.confirm()
          .title('Alert Dialog')
          .textContent(content)
          .ariaLabel('Alert Dialog')
          .ok(okbuttontext)
          .cancel(cancelbuttontext);
          $mdDialog.show(confirm).then(function() {
                okfun();
                }, 
                function() {
                    cancelfun();
                });
}
   
});