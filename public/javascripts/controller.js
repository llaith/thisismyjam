'use strict';

/* Controllers */

function jamsControl($scope, $http) {

	$http.get('/songs/list').success(function(data) {
		console.log(data);
		$scope.jams = data;
	});
}

function resultsControl($scope, $http) {

  	$scope.search = function(){
  		$http.get('/search', {'params': {"query" : $scope.search_query} }).success( function(data) {
  			$scope.tracks = data.results.trackmatches.track;
  			console.log(data);
  		});
  	};
}