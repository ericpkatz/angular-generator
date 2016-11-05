angular.module('app')
  .factory('Generator', function(){
    return function(app){
      app.model.camelCase = app.model.name.slice(0, 1).toLowerCase() + app.model.name.slice(1);
      return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>JS Bin</title>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.2/angular-ui-router.js"></script>
    <script src="https://code.jquery.com/jquery.min.js"></script>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/2.0.0/toaster.min.css" rel="stylesheet" />
    <script src="https://code.angularjs.org/1.5.8/angular-animate.min.js" ></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/2.0.0/toaster.min.js"></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.2.0/ui-bootstrap-tpls.js'></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.2.0/ui-bootstrap.js'></script>
    <script>
      angular.module('${app.name}', ['ui.router','toaster', 'ui.bootstrap','ui.bootstrap.tpls' ])
      .run(function($rootScope, toaster){
        $rootScope.appName = '${app.name}';
      })
      .config(function($sceProvider){
        $sceProvider.enabled(false);
      })
      .config(function($stateProvider, $urlRouterProvider){
        $stateProvider
          .state('home', {
            url: '/',
            templateUrl: '/browser/templates/home.html'
          })
          .state('about', {
            url: '/about',
            templateUrl: '/browser/templates/about.html'
          })
          .state('${app.model.camelCase}s', {
            url: '/${app.model.camelCase}s',
            templateUrl: '/browser/templates/${app.model.camelCase}s.html',
            resolve: {
              items: function(${app.model.name}){
                return ${app.model.name}.findAll();
              }
            },
            controller: function($scope, items, ${app.model.name}, toaster, $uibModal){
              $scope.items = items;
              $scope.delete = function(item){
                //TODO $uibModal
                var $modalInstance = $uibModal.open({
                  templateUrl: '/browser/templates/confirm.html',
                  controller: function($scope){
                    $scope.type = '${app.model.camelCase}';
                    $scope.item = item;

                    $scope.ok = function(){
                      $modalInstance.close();
                    };
                    $scope.cancel = function(){
                      $modalInstance.dismiss();
                    };
                  }
                })

                $modalInstance.result
                  .then(function(){
                    ${app.model.name}.destroy(item)
                      .then(function(deleted){
                        toaster.pop('success', '${app.model.camelCase} deleted', deleted );
                      });
                  })
                  .catch(function(){
                    console.log('cancel');
                  });
              };
              $scope.create = function(){
                ${app.model.name}.create($scope.item)
                  .then(function(created){
                    $scope.item = {};
                    return created;
                  })
                  .then(function(created){
                    toaster.pop('success', '${app.model.camelCase} created', created );
                  });
              }
            }
          });
        $urlRouterProvider.otherwise('/${app.model.camelCase}s');
      })
      .factory('${app.model.name}', function($q){
        var _items = [
          { id: 1, name: 'Foo' },
          { id: 2, name: 'Bar' }
        ];
        return {
          findAll: function(){
            var dfd = $q.defer();
            dfd.resolve(_items);
            return dfd.promise;
          },
          destroy: function(item){
            var toDestroy = _items.filter(function(_item){
              return _item.id === item.id;
            })[0];
            var dfd = $q.defer();
            _items.splice(_items.indexOf(toDestroy), 1);
            dfd.resolve(toDestroy);
            return dfd.promise;
          },
          create: function(item){
            var copy = angular.copy(item, {});
            var maxId = _items.reduce(function(max, item){
              if(item.id > max)
                max = item.id;
              return max;
            }, 0);
            copy.id = ++maxId;
            _items.push(copy);
            var dfd = $q.defer();
            dfd.resolve(copy);
            return dfd.promise;
          }
        };
      });
    </script>
   <style>
    #mainNav {
      margin-bottom: 10px;
    }
   </style>
  </head>
<body ng-app='${app.name}'>
  <toaster-container toaster-options="{'time-out': 1000}"></toaster-container>
  <div class='container'>
  <h1>My Angular App "{{appName}}"</h1>
  <ul id='mainNav' class='nav nav-tabs'>
    <li ui-sref-active='active'>
      <a ui-sref='home'>Home</a>
    </li>
    <li ui-sref-active='active'>
      <a ui-sref='about'>About</a>
    </li>
    <li ui-sref-active='active'>
      <a ui-sref='${app.model.camelCase}s'>${app.model.name}s</a>
    </li>
  </ul>
  <ui-view></ui-view>
  </div>
  <script type='text/ng-template' id='/browser/templates/home.html'>
    <div class='well'>
      Welcome to My Autogenerated Angular App Named: {{ appName }} 
    </div>
  </script>
  <script type='text/ng-template' id='/browser/templates/about.html'>
    <div class='well'>
      This is a placeholder for the About Page.
    </div>
  </script>
  <script type='text/ng-template' id='/browser/templates/${app.model.camelCase}s.html'>
    <form name='form'>
      <div class='form-group'>
        <input class='form-control' ng-model='item.name' required placeholder='Add a ${app.model.camelCase}' />
      </div>
      <div class='form-group'>
        <button class='btn btn-primary' ng-disabled='form.$invalid' ng-click='create()'>Create a ${app.model.camelCase}</button>
      </div>
    </form>
    <ul class='list-group'>
      <li ng-repeat='item in items' class='list-group-item'>
        {{ item.name }} {{ item.id }}
        <div class='btn-group pull-right'>
          <button class='btn btn-secondary btn-primary' ng-click='delete(item)'>
            Delete
          </button>
        </div>
        <div class='clearfix'></div>
      </li>
    </ul>
  </script>
  <script type='text/ng-template' id='/browser/templates/confirm.html'>
    <div class="modal-header">
        <h3 class="modal-title" id="modal-title">Are You sure?!!</h3>
    </div>
    <div class="modal-body" id="modal-body">
      Do you really want to delete this {{ type }}?
      <pre>
        {{ item }}
      </pre>
    </div>
    <div class="modal-footer">
        <button class="btn btn-primary" type="button" ng-click="ok()">OK</button>
        <button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>
    </div>
  </script>
</body>
</html>
        `;
    }
  });
