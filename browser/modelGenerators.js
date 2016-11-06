angular.module('app')
  .factory('ModelGenerators', function($window, ModelGenerator){
      var camelCase = $window.camelCase;
      var deCamelCase = $window.deCamelCase;
      var inflect = $window.inflect;
      function code(app){
        return app.models.reduce(function(memo, model){
          memo += ModelGenerator.code(app, model);
          return memo;
        }, '');
      };

      function templates(app){
        return app.models.reduce(function(memo, model){
          memo += ModelGenerator.templates(app, model);
          return memo;
        }, '');
      }

      function html(app){
        return app.models.reduce(function(memo, model){
          memo += ModelGenerator.html(app, model);
          return memo;
        }, '');
      }

      function link(app){
        return app.models.reduce(function(memo, model){
          memo += ModelGenerator.link(app, model);
          return memo;
        }, '');
      }

      return {
        html: html,
        code: code,
        templates: templates,
        link: link
      };
  });
