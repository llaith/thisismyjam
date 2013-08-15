/* An AngularJS module that provides an easy way to set up loading indicators for AJAX requests.
 *
 * How to use: make an attribute in the element that will be the loading indicator with the attribute 
 *  name matching in Angular to "loadingItem" and set the value of this attribute to the identifier for 
 *  the AJAX request it should be assigned to.
 *
 *  Now in the controller that sends the AJAX request add a key "loadingItemID" with the value matching 
 *  the identifier for this request from the attribute.
 *
 * Example:
 *  in the controller:
 *  {
 *    ... 
 *    $http.get('<url>', {"loadingItemID" : example});
 *    ...
 *  }
 *
 *  in the HTML template:
 *    ...
 *    <div x-loading-item="example">Loading</div>
 */
angular
  .module('loadingIndicator', [])
  .config(function($provide, $httpProvider, $compileProvider) {

    $httpProvider.interceptors.push(function($q, $rootScope) {
      return {
        'request' : function(config) {
          if ("loadingItemID" in config) {
            $rootScope.$broadcast("loadingStart." + config.loadingItemID);
          }
          return config || $q.when(config);
        },
        'response' : function(response) {
          if ("loadingItemID" in response.config) {
            $rootScope.$broadcast("loadingEnd." + response.config.loadingItemID);
          }
          return response || $q.when(response);
        }
      }
    });

    $compileProvider.directive('loadingItem', function() {
      return {
        link: function(scope, element, attrs) {

          element.hide();

          scope.$on("loadingStart." + attrs.loadingItem, function() {
            element.show();
          });

          scope.$on("loadingEnd." + attrs.loadingItem, function() {
            element.hide();
          });

          }
        };
      });
  });