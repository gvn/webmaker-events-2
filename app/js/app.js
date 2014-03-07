angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'ui.bootstrap',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$httpProvider',
  function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
  }
]).
config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/add', {
      templateUrl: 'views/add.html',
      controller: 'addEventController'
    });

    $routeProvider.when('/events', {
      templateUrl: 'views/list.html',
      controller: 'eventListController'
    });

    $routeProvider.when('/events/:id', {
      templateUrl: 'views/detail.html',
      controller: 'eventDetailController'
    });

    $routeProvider.when('/edit/:id', {
      templateUrl: 'views/edit.html',
      controller: 'eventEditController'
    });

    $routeProvider.when('/', {
      templateUrl: 'views/home.html'
    });

    $routeProvider.otherwise({
      redirectTo: '/events'
    });
  }
]).
run(['$http', '$rootScope',
  function ($http, $rootScope) {
    $rootScope.config = {
      isEmbedded: false
    };

    if (document.location.search.match('embedded=true')) {
      $rootScope.config.isEmbedded = true;
    }

    // Jump to top of viewport when new views load
    $rootScope.$on('$locationChangeSuccess', function (event) {
      window.scrollTo(0, 0);
    });

  }
]);
