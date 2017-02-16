(function(){
    angular
        .module("WebAppMaker")
        .controller("RegisterController", registerController);

    function registerController($location, UserService){
        var vm = this;

        // Event Handlers
        vm.register = register;

        function init(){

        }
        init();

        function register(user) {
            var user = UserService.createUser(user);
            if(user) {
                $location.url("/user/"+user._id);
            } else {
                vm.error = "Cannot create user";
            }
        }
    }
})();