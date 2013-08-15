var myjamModule = angular.module('myjam', ['appMessenger', 'loadingIndicator']).controller();

/* Controllers */

myjamModule.controller('jamsControl', ['$scope', '$http', function($scope, $http) {
	'use strict';

	$http.get('/songs/list', {'loadingItemID' : 'list'}).
    success(function(data) {
  		$scope.jams = data;
  	});
}]);

myjamModule.controller('resultsControl', ['$scope', '$http', function($scope, $http) {
	'use strict';

    //number of results to show, starts at 5, is a variable so we can show more
    $scope.maxResults = 5;
    //visibility of the show more results button, only toggled when a search is performed
    $scope.showMoreResultsButton = false;

    $scope.moreResults = function() {
        $scope.maxResults += 5;
        if ($scope.maxResults >= 15){
          $scope.showMoreResultsButton = false;
        }
    };

  	$scope.search = function(){
  		$http.get('/search', 
        {'params': {"query" : $scope.search_query},
         'loadingItemID' : 'search' }
      ).success( function(data) {
        
  			$scope.tracks = data.results.trackmatches.track;
  			$scope.showMoreResultsButton = true;
  		});
  	};

    $scope.submit = function(artist, track, mbid) {
      $http.post('/jam/song', {"artist": artist, "track": track, "mbid": mbid});
      $scope.tracks = null;
      $scope.showMoreResultsButton = false;
    };
}]);