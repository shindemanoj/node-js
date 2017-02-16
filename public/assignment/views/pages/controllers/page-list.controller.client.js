(function(){
    angular
        .module("WebAppMaker")
        .controller("PageListController", pageListController);

    function pageListController($routeParams, PageService) {
        var vm = this;
        vm.websiteId = $routeParams.wid;
        vm.userId = $routeParams.uid;

        function init(){
            var pages = PageService.findPageByWebsiteId(vm.websiteId);
            vm.pages = pages;
        }
        init();
    }
})();