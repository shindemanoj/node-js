(function(){
    angular
        .module("WebAppMaker")
        .controller("LoginController", loginController);

    function loginController($location, UserService){
        var vm = this;

        // Event Handlers
        vm.login = login;

        function init(){

        }
        init();


        function login(user) {
            var promise = UserService.findUserByCredentials(user.username, user.password);
            promise
                .success(function (user) {
                    var loginUser = user;
                    if(loginUser != null) {
                        $location.url('/user/' + loginUser._id);
                    } else {
                        vm.error = 'user not found';
                    }
                })
                .error(function(err) {
                    vm.error = 'user not found';
                });
        }
    }
})();