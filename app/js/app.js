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
run(['$http', '$rootScope', 'jquery',
  function ($http, $rootScope, $) {
    $rootScope.config = {
      isEmbedded: false
    };

    function receiveMessage(event) {
      // Send current height & hash back
      // Sending parsable strings instead of objects due to IE limitations
      //
      // http://caniuse.com/#feat=x-doc-messaging

      event.source.postMessage('wme-height:' + $('html').height(), event.origin);
      event.source.postMessage('wme-hash:' + window.location.hash, event.origin);
    }

    if (document.location.search.match('embedded=true')) {
      $rootScope.config.isEmbedded = true;
      $('body').attr('id', 'wmo-embedded');
      window.addEventListener('message', receiveMessage, false);
    }

    // Jump to top of viewport when new views load
    $rootScope.$on('$locationChangeSuccess', function (event) {
      window.scrollTo(0, 0);
    });

  }
]);
