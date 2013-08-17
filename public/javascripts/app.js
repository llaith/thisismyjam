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
      //corresponds to showing the "more" button in the results list
      //condition one: tracks exists (is not null)
      //condition two: the number of results we're showing now is less than the number we have
    	return ($scope.tracks && $scope.maxResults < $scope.tracks.length );
    };

  	$scope.search = function(){
      $scope.maxResults = 5;
  		$http.get('/search', 
        {	'params': {"query" : $scope.search_query},
        	'loadingItemID' : 'search' }
      	).success( function(data) {
    			$scope.tracks = data.results.trackmatches.track;
  		});
  	};

    $scope.submit = function(index) {
      var track = $scope.tracks[index];

      //clear out the other results while we're waiting on the request for better user feedback
      $scope.tracks = [track]; 

      $http.post('/jam/song', track, {'loadingItemID': ("jam.submit." + index) }).success(function(data) {
        $scope.tracks = null;
        $rootScope.addToJamsList(track);
      });
    };
}]);