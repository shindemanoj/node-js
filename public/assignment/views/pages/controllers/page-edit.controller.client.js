(function(){
    angular
        .module("WebAppMaker")
        .controller("EditPageController", EditPageController);

    function EditPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;

        //Event Handlers
        vm.deletePage = deletePage;
        vm.updatePage = updatePage;

        function init() {
            PageService
                .findPageByWebsiteId(vm.websiteId)
                .success(function (pages) {
                    vm.pages = pages;
                })
            PageService
                .findPageById(vm.pageId)
                .success(function (page) {
                    vm.page = page;
                })
        }
        init();

        function deletePage () {
            var answer = confirm("Are you sure?");
               if(answer) {
                PageService
                    .deletePage(vm.pageId)
                    .success(function () {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                    })
                    .error(function () {
                        vm.error = 'unable to remove page';
                    });
            }
        };

        function updatePage (page) {
            vm.pages = PageService
                .updatePage(vm.pageId, page)
                .success(function (page) {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                })
                .error(function (err) {
                    vm.error = 'unable to update page';
                });
        };
    }
})();