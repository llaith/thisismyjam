'use strict';

/* Controllers */

function jamsControl($scope, $http) {

	$http.get('/songs/list').
    success(function(data) {
  		$scope.jams = data;
  	});
}

function resultsControl($scope, $http) {

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
      $scope.resultsLoading = true;
      $scope.tracks = null

  		$http.get('/search', {'params': {"query" : $scope.search_query} }).success( function(data) {
  			$scope.tracks = data.results.trackmatches.track;
        $scope.resultsLoading = false;
  			$scope.showMoreResultsButton = true;
  		});
  	};

    $scope.submit = function(artist, track, mbid) {
      $http.post('/jam/song', {"artist": artist, "track": track, "mbid": mbid});
      $scope.tracks = null;
      $scope.showMoreResultsButton = false;
    };
}