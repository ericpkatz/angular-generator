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
          if($state.current.name === 'generator'){
            init();
            $state.go('generator.generated', { app: JSON.stringify($scope.app) });

          }
          $scope.schema = {
            type: "object",
            required: ['name'],
            properties: {
              name: {
                type: "string",
                title: "Name",
                description: "Application name.",
                pattern: "^[A-Za-z]+$"
              },
              required: ['models'],
              models: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: {
                      type: "string",
                      title: "Name",
                      pattern: "^[A-Za-z]+$"
                    },
                    data: {
                      type: "string",
                      title: "Data"
                    },
                  }
                }
              }
            }
          };


          $scope.form = [
            "*"
          ];
          var defaultData = [
            { id: 1, name: 'Moe'},
            { id: 2, name: 'Larry'},
          ];

          function init(){
            $scope.app = {
              name: 'Foo',
              models: [
                { name: 'Person', data: JSON.stringify(defaultData) } 
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
            if($scope.app.models.length == 0)
              return toaster.pop({ type: 'error', timeout: 3000, title: 'App needs at least one model.' });
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
