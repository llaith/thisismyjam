var myjamModule = angular.module('myjam', ['appMessenger', 'loadingIndicator']);

/* Controllers */

myjamModule.controller('jamsControl', ['$scope', '$http', function($scope, $http) {
	'use strict';

	$http.get(
		'/songs/list', {'loadingItemID' : 'list'}
	).success(function(data) {
  		$scope.jams = data;
  	});
}]);

myjamModule.controller('resultsControl', ['$scope', '$http', function($scope, $http) {
	'use strict';

    //number of results to show, starts at 5. Is a variable so we can increase it dynamically
    $scope.maxResults = 5;

    $scope.moreResults = function() {
        $scope.maxResults += 5;
    };

    $scope.showMoreResultsButton = function() {
    	return !($scope.maxResults >= 15 || $scope.tracks);
    };

  	$scope.search = function(){
  		$http.get('/search', 
        {	'params': {"query" : $scope.search_query},
        	'loadingItemID' : 'search' }
      	).success( function(data) {
  			$scope.tracks = data.results.trackmatches.track;
  		});
  	};

    $scope.submit = function(artist, track, mbid) {
      $http.post('/jam/song', {"artist": artist, "track": track, "mbid": mbid});
      $scope.tracks = null;
    };
}]);