(function(){
    angular
        .module("WebAppMaker")
        .controller("EditWidgetController", EditWidgetController);

    function EditWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.widgetId = $routeParams.wgid;

        //Event Handleres
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;
        vm.createWidget = createWidget;
        vm.sendToFlickr = sendToFlickr;

        function init() {
            WidgetService
                .findWidgetById(vm.widgetId)
                .success(function (widget) {
                    vm.widget = widget;
                })
        }
        init();

        function sendToFlickr(){
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/"+ vm.widgetId +"/flickr" );
        }

        function createWidget(widgetType) {
            newWidget = {};
            newWidget.type = widgetType;

            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function(widget){
                    $location.url("/user/" + vm.userId +"/website/" +vm.websiteId + "/page/" + vm.pageId + "/widget/" + widget._id);
                })
                .error(function () {
                    vm.error = 'sorry could not create widget';
                });
        }

        function updateWidget() {
            WidgetService
                .updateWidget(vm.widgetId, vm.widget)
                .success(function (widget) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget" );
                })
                .error(function (err) {
                    vm.error = 'unable to update widget';
                });
        }

        function deleteWidget() {
            var answer = confirm("Are you sure?");
            if(answer) {
                WidgetService
                    .deleteWidget(vm.widgetId)
                    .success(function () {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget" );
                    })
                    .error(function () {
                        vm.error = 'unable to remove widget';
                    });
            }
        }
    }
})();