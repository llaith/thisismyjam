/* Heavily influenced by Tomaka17's article here: 
http://blog.tomaka17.com/2012/12/random-tricks-when-using-angularjs/ 
*/

/* An AngularJS module that provides a directive "appMessages" to provide a global AJAX error/success 
 * messsaging area.
 */
angular
  .module('appMessenger', [])
  .config(function($provide, $httpProvider, $compileProvider) {
    'use strict';
    
    var linkedElements = $();

    var sendMessage = function(content, messageType, time) {
      $('<div/>')
        .addClass('message')
        .addClass(messageType)
        .hide()
        .slideDown('slow')
        .delay(time)
        .slideUp('slow', function() { $(this).remove(); })
        .appendTo(linkedElements)
        .text(content);
    };

    $httpProvider.responseInterceptors.push( function($timeout, $q) {
        return function(promise) {
          return promise.then(
            function(successResponse) {
              if (successResponse.config.method.toUpperCase() != 'GET') {
                sendMessage('Success', 'successMessage', 3000);
              }
              return successResponse;
            }, 

            function(errorResponse) {
              switch (errorResponse.status) {
                case 400:
                  sendMessage('Bad request', 'errorMessage', 5000);
                  break;
                case 401:
                  sendMessage('Wrong username or password', 'errorMessage', 5000);
                  break;
                case 403:
                  sendMessage("Forbidden", 'errorMessage', 5000);
                  break;
                case 500:
                  sendMessage('Internal server error', 'errorMessage', 5000);
                  break;
                default:
                  sendMessage('Unknown error: ' + errorResponse.status, 'errorMessage', 5000);  
              }
              return $q.reject(errorResponse);
            });
        };
    });

  $compileProvider.directive('appMessages', function() {
    var directiveDefinitionObject = {
      link: function(scope, element, attrs) { linkedElements.push($(element));}
    };
    return directiveDefinitionObject;
  });

  });