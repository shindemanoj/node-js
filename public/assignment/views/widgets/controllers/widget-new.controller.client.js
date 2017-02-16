(function(){
    angular
        .module("WebAppMaker")
        .controller("NewWidgetController", NewWidgetController);

    function NewWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;

        vm.createWidget = createWidget;

        function init() {
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
        }
        init();

        //Event Handlers
        vm.createWidget = createWidget;

        function createWidget(widgetType) {
            newWidget = {};
            newWidget._id =  (new Date()).getTime().toString();
            newWidget.widgetType = widgetType;

            WidgetService.createWidget(vm.pageId, newWidget);
            $location.url("/user/" + vm.userId +"/website/" +vm.websiteId + "/page/" + vm.pageId + "/widget/" + newWidget._id);
        }

    }
})();