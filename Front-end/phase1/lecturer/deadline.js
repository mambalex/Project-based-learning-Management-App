angular.module('modalTest',['ui.bootstrap','dialogs.main'])

  .controller('dialogTestCtrl',function($scope,dialogs){
    //== Variables ==//
    $scope.data = {
      dt: new Date()
    };
    
    //== Methods ==//
    $scope.launch = function(){
      var dlg = dialogs.create('/dialogs/custom.html','customDialogCtrl',$scope.data);
      dlg.result.then(function(data){
        $scope.data = data;
      });
    }; // end launch
  }) // end dialogTest

  .controller('customDialogCtrl',function($log,$scope,$modalInstance,data){
    $scope.data = data;
    $scope.opened = false;
    
    //== Listeners ==//
    $scope.$watch('data.dt',function(val,old){
      $log.info('Date Changed: ' + val);
      $scope.opened = false;
    });
    
    //== Methods ==//
    $scope.setDate = function(){
      if(!angular.isDefined($scope.data.dt))
        $scope.data.dt = new Date(); // today
    };
    $scope.setDate();
    
    $scope.open = function($event){
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    }; // end open
    
    $scope.done = function(){
      $modalInstance.close($scope.data);
    }; // end done
  }) // end customDialogCtrl

  .config(function(dialogsProvider){
    // this provider is only available in the 4.0.0+ versions of angular-dialog-service
    dialogsProvider.useBackdrop(true);
    dialogsProvider.useEscClose(true);
    dialogsProvider.useCopy(false);
    dialogsProvider.setSize('sm');
  }) // end config

  .run(function($templateCache){
    $templateCache.put('/dialogs/custom.html','<div class="modal-header"><h4 class="modal-title">Date Picker Test</h4></div><div class="modal-body"><p class="input-group"><input type="text" class="form-control" datepicker-popup="dd-MMMM-yyyy" ng-model="data.dt" datepicker-mode="year" is-open="opened" show-button-bar="false" /><span class="input-group-btn"><button class="btn btn-default" ng-click="open($event)"><span class="glyphicon glyphicon-calendar"></span></button></span></p></div><div class="modal-footer"><button class="btn btn-default" ng-click="done()">Done</button></div>');
  }); // end run