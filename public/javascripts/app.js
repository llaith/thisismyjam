var myjamModule = angular.module('myjam', ['appMessenger', 'loadingIndicator']);

/* Controllers */

myjamModule.controller('jamsControl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
	'use strict';

  $scope.listAnimation = {enter: 'opacityAnimation-repeat-enter',
                        leave: 'opacityAnimation-repeat-leave',
                        move: 'opacityAnimation-repeat-move'};

	$http.get(
		'/songs/list', {'loadingItemID' : 'list'}
	).success(function(data) {
  		$scope.jams = data;
  	});

  /* Global function to add an element to the local list of jams.
   * Seems weird to put this into a service or what have you so for now it's just a simple function 
   * callable anywhere to be able to add items to the jams list, as in the case of submitting a track to 
   * be "jammed" and calling this function to reflect it on the page too, for better user feedback. 
   */
  $rootScope.addToJamsList = function(newJam) {
    var newJamLocal = newJam;
    newJamLocal["local"] = "local";
    $scope.jams.unshift(newJamLocal);
  };

}]);

myjamModule.controller('resultsControl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
	'use strict';


    $scope.listAnimation = {enter: 'opacityAnimation-repeat-enter',
                        leave: 'opacityAnimation-repeat-leave',
                        move: 'opacityAnimation-repeat-move'};

    //number of results to show, starts at 5. Is a variable so we can increase it dynamically through the binding
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