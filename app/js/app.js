
var app = angular.module('app', ['ui.bootstrap', 'ngRoute']);
var url_api = 'https://lendingfronttest.herokuapp.com/';
var html_path = 'dist/html/';


// Routing

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: html_path + 'home.html',
        controller: 'HomeController'
    }).when('/register', {
        templateUrl: html_path + 'register.html',
        controller: 'RegisterController'
    }).
    otherwise({
        templateUrl: html_path + '404.html',
        controller: 'HomeController'
    });
});


// $http Service

app.service('apiConn', function($http) {

    function serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }

    this.api = function(url, params, success, error){
        var full_url = url_api + url + '?callback=JSON_CALLBACK&' + serializeObj(params);
        $http({method: 'JSONP', url: full_url }).
            then(success, error);
    };

});

// LocalStorage Factory

app.factory("db", function(){
    return {
        get : function(key) {
            return localStorage.getItem(key)
        },
        set : function(key, val) {
            return localStorage.setItem(key, val)
        },
        unset : function(key) {
            return localStorage.removeItem(key)
        },
        clear : function(){
            return localStorage.clear()
        }
    }
});


// Controllers

app.controller('HomeController', function($scope){

});

app.controller('RegisterController', function($scope, apiConn, db, $location){

    $scope.userData = {};
    $scope.session = false;
    $scope.error_message = false;

    $scope.save_data = function(){
        $scope.session = true;
        angular.forEach($scope.userData, function(value, key) {
            db.set(key, value)
        });
    };

    $scope.logout = function(){
        db.clear();
        $scope.session = false;
        $location.path('/');
    };

    $scope.register = function(){
        $scope.save_data();
        $('#step1').fadeOut("slow", function(){
            $('#step2').fadeIn("slow");
        });
    };

    $scope.register_business = function(){
        $scope.error_message = false;
        $scope.save_data();
        apiConn.api("validate_loan", $scope.userData,
        function(response){ // success
            if (response.data.status == 200){
                $scope.result_message = response.data.data;
                $('#step2').fadeOut("slow", function(){
                    $('#step3').fadeIn("slow");
                });
            }else{
                $scope.error_message = response.data.data;
            }
        },
        function(response){ // error
            $scope.error_message = response.data.data|| "Request failed";
        });
    };

    $scope.go_to_step_1 = function(){
        $('#step2').fadeOut("slow", function(){
            $('#step1').fadeIn("slow");
        });
        $scope.error_message = false;
    };

    $scope.go_to_step_2 = function(){
        $('#step3').fadeOut("slow", function(){
            $('#step2').fadeIn("slow");
        });
    };
});
