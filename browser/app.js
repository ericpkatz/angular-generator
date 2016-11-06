angular.module('app', ['ui.router', 'toaster', 'ui.bootstrap', 'hljs', 'schemaForm'])
  .config(function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/browser/templates/home.html',
        controller: function($scope){
        }
      })
      .state('generator', {
        url: '/generator',
        templateUrl: '/browser/templates/generator.html',
        controller: function($scope, $state, $stateParams, toaster){
          $scope.schema = {
            type: "object",
            properties: {
              name: { type: "string", minLength: 2, title: "Name", description: "Application name." },
              models: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: "string", minLength: 2, title: "Name"},
                  }
                }
              }
            }
          };


          $scope.form = [
            "*",
            {
              type: 'actions',
              items: [
                {
                  type: "submit",
                  title: "Generate",
                  style: 'btn-success'
                },
                {
                  type: "button",
                  title: "Reset",
                  onClick: 'reset()'
                }
              ]
            }
            
          ];

          function init(){
            $scope.app = {
              name: 'Foo',
              models: [
                { name: 'Bar'}
              ]
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
            try{
              return Generator(JSON.parse($stateParams.app));
            }
            catch(er){
              console.log(er);
            }
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
