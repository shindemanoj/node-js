(function(){
    angular
        .module("WebAppMaker")
        .controller("ProfileController", profileController);

    function profileController($routeParams, UserService){
        var vm = this;
        var userId = $routeParams['uid'];

        // Event Handlers
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        function init(){
            var user = UserService.findUserById(userId);
            vm.user = user;
        }
        init();
        
        function updateUser(newUser) {
            var user = UserService.updateUser(userId, newUser);
            vm.user = user;
            if(user != null) {
                vm.message = "User Successfully Updated!"
            } else {
                vm.error = "Unable to update user";
            }
        }

        function deleteUser(userId) {
            var users = UserService.deleteUser(userId);
            vm.users = users;
            if(users != null) {
                vm.message = "User Successfully Deleted!"
            } else {
                vm.error = "Unable to delete user";
            }
        }
    }
})();