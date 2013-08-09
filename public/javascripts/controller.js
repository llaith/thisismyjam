'use strict';

/* Controllers */

function resultsControl($scope, $http) {

  	$scope.search = function(){
  		$http.get('/search', {'params': {"query" : $scope.search_query} }).success( function(data) {
  			$scope.tracks = data.results.trackmatches.track;
  			console.log(data);
  		});
  	};
}