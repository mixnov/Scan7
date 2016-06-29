angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicModal, $timeout, $http, $rootScope, $ionicLoading, $state) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {
        username: "mikhail",
        password: "bosun"
    };

    var user_data = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.showSpinner = function() {
        $ionicLoading.show({
            template: '<p>Loging in...</p><ion-spinner></ion-spinner>'
        });
    };

    $scope.showMessage = function() {
        $ionicLoading.show({
            template: '<h3>You are not logged in!</h3><h3>Please login.</h3>'
        });
    };

    $scope.hide = function() {
        $ionicLoading.hide();
    };

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    $scope.showProfile = function() {
        if ($rootScope.connection) {
            $state.go('tab.profile');
        } else {
            $scope.showMessage($ionicLoading);
            $timeout(function() {
                $scope.hide($ionicLoading);
                $scope.closeLogin();
            }, 1000);

        }
    };

    $scope.showScan = function() {
        if ($rootScope.connection) {
            $state.go('tab.scan');
        } else {
            $scope.showMessage($ionicLoading);
            $timeout(function() {
                $scope.hide($ionicLoading);
                $scope.closeLogin();
            }, 1000);

        }
    };

    $scope.showLookup = function() {
        if ($rootScope.connection) {
            $state.go('tab.lookup');
        } else {
            $scope.showMessage($ionicLoading);
            $timeout(function() {
                $scope.hide($ionicLoading);
                $scope.closeLogin();
            }, 1000);

        }
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {

        if (!$rootScope.connection) {
            // Start showing the progress
            $scope.showSpinner($ionicLoading);

            link = "http://bosun-dev5.cloudapp.net/api/account/?a=" + $scope.loginData.username;
            $http.get(link)
                .success(function(data) {
                    user_data = data;
                })
                .error(function() {
                    alert("error");
                })
                .then(function() {
                    console.log(user_data);
                    connection = true;
                    var ath = user_data.ath;
                    var tkn = user_data.tkn;
                    var pswd = $scope.loginData.password;
                    // $('#stage').html('<p> Section 1 </p>');
                    // $('#stage').append('<p>ath: ' + ath + '</p>');
                    // $('#stage').append('<p>tkn : ' + tkn + '</p>');
                    console.log(ath);
                    console.log(tkn);
                    console.log(user_data);
                    var encrypted_password = md5(md5(ath + pswd) + ":" + ath + ":" + tkn);
                    console.log(encrypted_password);
                    // $('#stage').append('<p>encrypted_password: ' + encrypted_password + '</p>');
                    // var encrypted_password1 = myMD5(myMD5([ath] + pswd) + ":" + ath + ":" + tkn);
                    // console.log(encrypted_password1);
                    link = 'http://bosun-dev5.cloudapp.net/api/account/?a=' + $scope.loginData.username + '&p=' + encrypted_password;
                    $http.get(link)
                        .success(function(data) {
                            user_data = data;

                        })
                        .error(function(jqXHR, textStatus, ex) {
                            console.log(textStatus + " - " + ex + " - " + jqXHR.responseText);
                        })
                        .then(function(data) {
                            link = 'http://bosun-dev5.cloudapp.net/api/account/';
                            $http.get(link)
                                .success(function(data) {
                                    $rootScope.client = data.client[0];
                                    $rootScope.connection = true;
                                })
                                .error(function(jqXHR, textStatus, ex) {
                                    console.log(textStatus + " - " + ex + " - " + jqXHR.responseText);
                                })
                                .then(function(data) {
                                    console.log(data);
                                })
                            console.log(data);
                        })
                })
                .finally(function($ionicLoading) {})
            console.log('Doing login', $scope.loginData);
        }

        $timeout(function() {
            $scope.hide($ionicLoading);
            $scope.closeLogin();
        }, 1000);
        if (!$rootScope.connection) {
            $state.go('tab.profile');
        }
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
    };

})

.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);

})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };

})

.controller("ScanCtrl",

    function($scope, $cordovaBarcodeScanner, $ionicPlatform) {

        $scope.scanBarcode = function() {
            $cordovaBarcodeScanner.scan()

            .then(function(imageData) {
                alert(imageData.text);
                console.log("Barcode Format -> " + imageData.format);
                console.log("Cancelled -> " + imageData.cancelled);
            }, function(error) {
                console.log("An error happened -> " + error);
            })
            {
                "preferFrontCamera" : false,
                "showFlipCameraButton" : true,
                "orientation" : "landscape"                
            };
        };

        $scope.scan = function() {
            $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner.scan().then(function(barcodeData) {
                    alert(JSON.stringify(barcodeData));
                }, function(error) {
                    alert(JSON.stringify(error));
                });
            });
        }

    });
