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
            if(user){
                var user = UserService.findUserByCredentials(user.username, user.password);
                if(user) {
                    $location.url("/user/"+user._id);
                } else {
                    vm.error = "User not found";
                }
            }
            else{
                vm.error = "Enter required information";
            }
        }
    }
})();