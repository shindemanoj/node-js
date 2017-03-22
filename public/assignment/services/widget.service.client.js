(function () {
    angular
        .module("WebAppMaker")
        .service("WidgetService", WidgetService);

    function WidgetService($http) {

        var api = {
            "createWidget": createWidget,
            "findWidgetsByPageId": findWidgetsByPageId,
            "findWidgetById": findWidgetById,
            "updateWidget" : updateWidget,
            "deleteWidget": deleteWidget,
            "updateWidgetOrder":updateWidgetOrder
        };
        return api;

        function createWidget(pageId, widget) {
            return $http.post("/api/page/"+pageId+"/widget", widget);
        }

        function findWidgetsByPageId(pageId) {
            return $http.get("/api/page/"+pageId+"/widget");
        }

        function findWidgetById(widgetId) {
            return $http.get("/api/widget/"+widgetId);
        }

        function updateWidget(widgetId, newWidget){
            return $http.put("/api/widget/"+widgetId, newWidget);
        }

        function deleteWidget(widgetId) {
            return $http.delete("/api/widget/"+widgetId);
        }

        function updateWidgetOrder(pageId, startIndex, endIndex) {
            return $http.put("/page/"+pageId+"/widget?initial="+startIndex+"&final="+endIndex);
        }
    }
})();