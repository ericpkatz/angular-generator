angular.module('app')
  .factory('NavGenerator', function($window){
      var camelCase = $window.camelCase;
      var deCamelCase = $window.deCamelCase;
      var inflect = $window.inflect;
      return function(app){
        return `
    <ul id='mainNav' class='nav nav-tabs'>
      <li ui-sref-active='active'>
        <a ui-sref='home'>Home</a>
      </li>
      <li ui-sref-active='active'>
        <a ui-sref='about'>About</a>
      </li>
      <li ui-sref-active='active'>
        <a ui-sref='${inflect.pluralize(camelCase(app.model.name))}'>${inflect.pluralize(camelCase(app.model.name))}</a>
      </li>
    </ul>
          `;
      }
  });
