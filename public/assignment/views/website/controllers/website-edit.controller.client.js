(function(){
    angular
        .module("WebAppMaker")
        .controller("EditWebsiteController", editWebsiteController);

    function editWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;

        //Event Handlers
        vm.deleteWebsite = deleteWebsite;
        vm.updateWebsite = updateWebsite;

        function init() {
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function (websites) {
                    vm.websites = websites;
                })
            WebsiteService
                .findWebsiteById(vm.websiteId)
                .success(function (website) {
                    vm.website = website;
                })
        }
        init();

        function deleteWebsite () {
            var answer = confirm("Are you sure?");
            if(answer) {
                WebsiteService
                    .deleteWebsite(vm.websiteId)
                    .success(function () {
                        $location.url("/user/"+vm.userId+"/website");
                    })
                    .error(function () {
                        vm.error = 'unable to remove website';
                    });
            }
        };

        function updateWebsite (website) {
            WebsiteService
                .updateWebsite(vm.websiteId, website)
                .success(function (website) {
                    $location.url("/user/"+vm.userId+"/website");
                })
                .error(function (err) {
                   vm.error = 'unable to update website';
                });
        };
    }
})();