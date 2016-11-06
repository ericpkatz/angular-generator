angular.module('app')
  .factory('ModelGenerator', function($window){
      var camelCase = $window.camelCase;
      var deCamelCase = $window.deCamelCase;
      var inflect = $window.inflect;
      function code(app, model){
        return `
      //model ${ model.name }
      angular.module('${app.name}')
      .config(function($stateProvider, $urlRouterProvider){
        $stateProvider
          .state('${inflect.pluralize(camelCase(model.name))}', {
            url: '/${inflect.pluralize(camelCase(model.name))}',
            templateUrl: '/browser/templates/${inflect.pluralize(camelCase(model.name))}.html',
            resolve: {
              items: function(${model.name}){
                return ${model.name}.findAll();
              }
            },
            controller: function($scope, items, ${model.name}, toaster, $uibModal){
              $scope.items = items;
              $scope.delete = function(item){
                var $modalInstance = $uibModal.open({
                  templateUrl: '/browser/templates/confirm.html',
                  controller: function($scope){
                    $scope.type = '${camelCase(model.name)}';
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
                    ${model.name}.destroy(item)
                      .then(function(deleted){
                        toaster.pop('success', '${camelCase(model.name)} deleted', deleted );
                      });
                  })
                  .catch(function(){
                    console.log('cancel');
                  });
              };
              $scope.create = function(){
                ${model.name}.create($scope.item)
                  .then(function(created){
                    $scope.item = {};
                    return created;
                  })
                  .then(function(created){
                    toaster.pop('success', '${camelCase(model.name)} created', created );
                  });
              }
            }
          })
          .state('${inflect.pluralize(camelCase(model.name))}.${camelCase(model.name)}', {
            url: '/:id',
            templateUrl: '/browser/templates/${camelCase(model.name)}.html',
            resolve: {
              item: function(${model.name}, $stateParams){
                return ${model.name}.findById($stateParams.id);
              }
            },
            controller: function($scope, item, ${model.name}, $state, toaster){
              $scope.item = angular.copy(item, {});
              $scope.update = function(){
                ${model.name}.update($scope.item)
                  .then(function(){
                    toaster.pop('success', '${camelCase(model.name)} update', $scope.item );
                    $state.go('${inflect.pluralize(camelCase(model.name))}');
                  });
              };
            }
          });
      })
      .directive('${camelCase(model.name)}Status', function(){
        return {
          templateUrl: '/browser/templates/${camelCase(model.name)}Status.html',
          scope: {},
          controller: function($scope, ${model.name}){
            $scope.items = ${model.name}.items;
          }
        };
      })
      .factory('${model.name}', function($q){
        var _items = [
          { id: 1, name: 'Foo' },
          { id: 2, name: 'Bar' }
        ];
        return {
          items: _items,
          findById: function(id){
            var toReturn = _items.filter(function(_item){
              return _item.id == id;
            })[0];
            return $q.when(toReturn);
          },
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
          update: function(item){
            var toUpdate = _items.filter(function(_item){
              return _item.id === item.id;
            })[0];
            _items.splice(_items.indexOf(toUpdate), 1, item);
            return $q.when(item);
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
          `;
      };

      function templates(app, model){
        return `
  <script type='text/ng-template' id='/browser/templates/${inflect.pluralize(camelCase(model.name))}.html'>
    <form name='form'>
      <div class='form-group'>
        <input class='form-control' ng-model='item.name' required placeholder='Add a ${camelCase(model.name)}' />
      </div>
      <div class='form-group'>
        <button class='btn btn-primary' ng-disabled='form.$invalid' ng-click='create()'>Create a ${camelCase(model.name)}</button>
      </div>
    </form>
    <ul class='list-group'>
      <li ng-repeat='item in items' class='list-group-item'>
        <a ui-sref='${inflect.pluralize(camelCase(model.name))}.${camelCase(model.name)}({ id: item.id })'>{{ item.name }} {{ item.id }}</a>
        <div class='btn-group pull-right'>
          <button class='btn btn-secondary btn-primary' ng-click='delete(item)'>
            Delete
          </button>
        </div>
        <div class='clearfix'></div>
      </li>
    </ul>
    <ui-view><ui-view>
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

  <script type='text/ng-template' id='/browser/templates/${camelCase(model.name)}.html'>
    <form name='form' class='well'>
      <div class='form-group'>
        <input class='form-control' ng-model='item.name' required />
      </div>
      <div class='form-group'>
        <button class='btn btn-primary' ng-disabled='form.$invalid' ng-click='update()'>Update your ${camelCase(model.name)}</button>
        <a class='btn btn-default' ui-sref='${inflect.pluralize(camelCase(model.name))}'>Cancel</a>
      </div>
    </form>
  </script>

  <script type='text/ng-template' id='/browser/templates/${camelCase(model.name)}Status.html'>
    <div class='well'>
      There are currently {{ items.length }} ${inflect.pluralize(model.name)}.
    </div>
  </script>
  `;
      }
      function html(app, model){
        return `
        <${decamelCase(model.name, '-')}-status></${decamelCase(model.name, '-')}-status>
        `;
      }

      function link(app, model){
        return `
      <li ui-sref-active='active'>
        <a ui-sref='${inflect.pluralize(camelCase(model.name))}'>${inflect.pluralize(camelCase(model.name))}</a>
      </li>
      `;
      }
      return {
        link: link,
        html: html,
        code: code,
        templates: templates
      };
  });
