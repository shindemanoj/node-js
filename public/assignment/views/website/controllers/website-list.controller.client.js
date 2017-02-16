(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", websiteListController);

    function websiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;

        function init(){
            var websites = WebsiteService.findWebsitesByUser(vm.userId);
            vm.websites = websites;
        }
        init();
    }
})();