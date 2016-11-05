angular.module('app', ['ui.router', 'toaster', 'ui.bootstrap'])
  .config(function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/browser/templates/home.html',
        controller: function($scope, $uibModal){
          $scope.open = function(){
            var modalInstance = $uibModal.open({
              templateUrl: '/browser/templates/modal.html',
              controller: function($scope){
                $scope.ok = function(){
                  modalInstance.close();
                }
                $scope.cancel = function(){
                  modalInstance.dismiss();
                }

              }
            });
            modalInstance.result
              .then(function(){
                console.log('you clicked ok');
              })
              .catch(function(){
                console.log('you clicked cancel');
              })
          };

        }
      })
      .state('generator', {
        url: '/generator',
        templateUrl: '/browser/templates/generator.html',
        controller: function($scope, $state, $stateParams, toaster){
          function init(){
            $scope.app = {
              name: 'Foo',
              model: {
                name: 'Bar'
              }
            };
          }
          init();
          $scope.$on('APP_LOADED', function(ev, data){
            $scope.app = data;
          });

          $scope.reset = function(){
            init();
            toaster.pop({ type: 'success', title: 'Generator Reset' });
            $state.go('generator');
          };

          $scope.generate = function(){
            toaster.pop({ type: 'success', title: 'App being generated' });
            var app = JSON.stringify($scope.app);
            $state.go('generator.generated', { app: app });
          };
        }
      })
      .state('generator.generated', {
        url: '/:app',
        templateUrl: '/browser/templates/generated.html',
        resolve: {
          code: function($stateParams, Generator){
            return Generator(JSON.parse($stateParams.app));
          }
        },
        controller: function($scope, code, $stateParams, $rootScope, $sce){
          $rootScope.$broadcast('APP_LOADED', JSON.parse($stateParams.app)); 
          $scope.code = code;
          $scope.html = $sce.trustAsHtml(code);
        }
      });

    $urlRouterProvider.otherwise('/generator');
  });
