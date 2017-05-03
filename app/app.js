
angular.module('app', ['ngRoute', 'ngResource'])

  .factory('Contacts', ['$resource', function($resource) {
	  return $resource('/contacts/:id', null, {
		  'update': { method:'PUT' }
	  });
  }])

    .controller('ContactsController', ['$scope', 'Contacts', function ($scope, Contacts) {
	    $scope.contacts = Contacts.query();
	    $scope.sortKey = 'firstName';
	    $scope.reverse = false;
	    $scope.sort = function(keyname) {
		    	$scope.sortKey = keyname;
			$scope.reverse = !$scope.reverse;
	    }
	    $scope.save = function() {
		    if(!$scope.newContact || $scope.newContact.length < 1) return;
		    var contact = new Contacts({ firstName: $scope.newContact });
		    contact.$save( function() {
			    $scope.contacts.push(contact);
			    $scope.newContact = '';
		    });
	    }

    }])

    .controller('ContactDetailsController', ['$scope', '$http', '$routeParams', 'Contacts', '$location', function ($scope, $http, $routeParams, Contacts, $location) {
	    $scope.contact = Contacts.get({id: $routeParams.id });
	    if (awsEnabled) {
		    $http.get('/contacts/' + $routeParams.id + '/s3url').then( function( resp ) {
		    	$scope.s3geturl = resp.data.url;
		    });
	    }
	    $scope.update = function() {
		    var newContactData = $scope.contact;
		    $scope.updatedContact = Contacts.update({id: $scope.contact._id}, newContactData);
	    }
	    $scope.remove = function() {
		    Contacts.remove({id: $scope.contact._id}, function() {
			    $location.url('/');
		    });
	    }
	    $scope.upload = function() {
		    if ( $scope.file ) {
			    $http.post('/contacts/' + $routeParams.id + '/s3url', {type: $scope.file.type, size: $scope.file.size }).then( function(resp) {
				    $http.put( resp.data.url, $scope.file, { headers: {'Content-Type': $scope.file.type }}).then(function(resp) {
					$scope.s3geturl = $scope.s3geturl + '&' + Date.now();
				    });
			    })
		    } else {
			    alert('No File Selected');
		    }
	    }
    }])

    .directive('myFile', function() {
	    return {
		    restrict: 'AE',
		    scope: {
			    file: '@'
		    },
		    link: function( scope, el, attrs) {
			    el.bind('change', function(event) {
				    var files = event.target.files;
				    var file = files[0];
				    scope.file = file;
				    scope.$parent.file = file;
				    scope.$apply();
			    });
		    }
	    };
    })

    .directive('myErrorSrc', function() {
	    return {
		    link: function(scope, element, attrs) {
			    element.bind('error', function() {
				    if (attrs.src != attrs.myErrorSrc) {
					    attrs.$set('src', attrs.myErrorSrc);
				    }
			    });
		    }
	    }
    })

    .config(['$routeProvider', function ($routeProvider) {
	    $routeProvider.when('/', {
		    templateUrl: '/contacts.html',
		    controller: 'ContactsController'
	    })
	    .when('/:id', {
		    templateUrl: '/contactDetails.html',
		    controller: 'ContactDetailsController'
	    });
    }]);

