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
      console.log("starting search");
  		$http.get('/search', {'params': {"query" : $scope.search_query} }).success( function(data) {
  			$scope.tracks = data.results.trackmatches.track;
        console.log("search finished");
        $scope.resultsLoading = false;
  			$scope.showMoreResultsButton = true;
  		});
  	};
}