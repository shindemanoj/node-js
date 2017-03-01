(function(){
    angular
        .module("WebAppMaker")
        .controller("NewPageController", NewPageController);

    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;

        //Event Handlers
        vm.createPage = createPage;

        function init() {
            var pages = PageService
                .findPageByWebsiteId(vm.websiteId)
                .success(function (pages) {
                    vm.pages = pages;
                })
        }
        init();

        function createPage (page) {
            PageService
                .createPage(vm.websiteId, page)
                .success(function(page){
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                })
                .error(function () {
                    vm.error = 'sorry could not create page';
                });
        };
    }
})();