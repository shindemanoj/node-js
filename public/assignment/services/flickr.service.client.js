(function () {
    angular
        .module("WebAppMaker")
        .factory("FlickrService", FlickrService);

    function FlickrService($http) {
        var api = {
            "searchPhotos": searchPhotos,
        };
        return api;


        function searchPhotos(searchTerm) {
            var key = "b3001ca24649ea241e67455c69360170";
            var secret = "1157bf2889156db7";
            var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();