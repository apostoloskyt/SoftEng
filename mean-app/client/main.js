var myApp = angular.module('myApp', ['ngRoute','angular-filepicker']);


//Configure client side routing. If restricted = true, only available to logged in users
//For each route there is a controller in controllers.js
myApp.config(function ($routeProvider,filepickerProvider) {

  filepickerProvider.setKey('AOVfS0QKLSge5NiH9YD9fz');
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      controller: 'homeController',
      access: {restricted: false,admin:false}
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'loginController',
      access: {restricted: false,admin:false}
    })
    .when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'registerController',
      access: {restricted: false,admin:false}
    })
  .when('/register_provider', {

      templateUrl: 'partials/register_provider.html',
      controller: 'registerProviderController',
      access: {restricted: false,admin:false}
    })
    .when('/welcome_provider',{
      templateUrl:'partials/welcome_provider.html',
      access:{restricted:true,admin:false}
    })
    .when('/events',{
      templateUrl:'partials/events.html',
      controller:'eventsController',
      access:{restricted:false,admin:false}
    })
    .when('/events-location',{
      templateUrl:'partials/events-location.html',
      controller:'locationController',
      access:{restricted:true,admin:false}
    })
    .when('/terms',{
      templateUrl:'partials/terms.html',
      access:{restricted:false,admin:false}
    })
    .when('/about',{
      templateUrl:'partials/about.html',
      access:{restricted:false,admin:false}
    })
    .when('/contact',{
      templateUrl:'partials/contact.html',
      access:{restricted:false,admin:false}
    })
    .when('/faq',{
      templateUrl:'partials/faq.html',
      access:{restricted:false,admin:false}
    })
    .when('/donate',{
      templateUrl:'partials/donate.html',
      access:{restricted:false,admin:false}
    })
    .when('/profile',{
      templateUrl:'partials/profile.html',
    controller:'profileController',
      access:{restricted:true,admin:false}
    })
    .when('/admin',{
      templateUrl:'partials/admin.html',
      controller:'adminController',
      access:{restricted:true, admin:true}
    })
    .when('/addEvent',{
      templateUrl:'partials/addEvent.html',
      controller:'manipulateEventsController',
      access:{restricted:true,admin:false}
    })
    .when('/transfer',{
      templateUrl:'partials/transfer.html',
      controller:'transferController',
      access:{restricted:true, admin:false}
    })
    .when('/singleEvent:id?',{
      templateUrl:'partials/single_event.html',
      controller:'manipulateEventsController',
      access:{restricted:false, admin:false}
    })
	.when('/public_profile',{
      templateUrl:'partials/public_profile.html',
      controller:'manipulateEventsController',
      access:{restricted:false,admin:false}
    })
    .when('/buyticket:id?',{
      templateUrl:'partials/buyticket.html',
      controller:'manipulateEventsController',
      access:{restricted:true, admin:false}
    })
    .when('/providerhistory',{
      templateUrl:'partials/providerhistory.html',
      controller:"manipulateEventsController",
      access:{restricted:true, admin:false}
    })
    .when('/reset/:uID',{
      templateUrl:'partials/reset.html',
      controller:"resetController",
      access:{restricted:false,admin:false}
    })
    .when('/checkemail',{
      templateUrl:'partials/checkyouremail.html',
      access:{restricted:false,admin:false}
    })   
    .otherwise({
      redirectTo: '/',
      access:{restricted:false, admin:false}
    });

    
});


//When changing route, check if next page is restricted and if user is logged in
//If not, redirect them to /login
myApp.run(function ($rootScope, $location, $route, AuthService,RedirectToUrlAfterLogin) {
  
  //Where to redirect the user after they have logged in  
  var loginRedirectURL;


  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      if (current&&next.originalPath=="/login"&&current.originalPath!="/login"){
        //loginRedirectURL = current.originalPath;
        RedirectToUrlAfterLogin.url= current.originalPath; 
      }
      else{
        AuthService.getUserStatus()
        .then(function(){
          if (next.access != undefined && next.access.restricted && !AuthService.isLoggedIn()){

            $location.path('/login');
            $route.reload();
          }


        });
      }
  });
});