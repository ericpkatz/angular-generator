angular.module('app')
  .factory('Generator', function($window, NavGenerator, ModelGenerators){
    return function(app){
      var camelCase = $window.camelCase;
      var deCamelCase = $window.deCamelCase;
      var inflect = $window.inflect;
      return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>${app.name}</title>

    <!-- THIRD PARTY LIBS -->

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

    <!-- APP CODE -->

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
          });
        $urlRouterProvider.otherwise('/${inflect.pluralize(camelCase(app.models[0].name))}');
      });

      ${ModelGenerators.code(app)}
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

    ${NavGenerator(app)}

    ${ModelGenerators.html(app)}

    <ui-view></ui-view>

  </div>

  <!-- TEMPLATES -->
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
  ${ModelGenerators.templates(app)}

</body>
</html>
        `;
    }
  });
