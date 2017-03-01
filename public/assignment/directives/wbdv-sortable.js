(function () {
    angular
        .module('WebAppMaker')
        .directive('wbdvDirectives', wbdvDirectives);

    function wbdvDirectives() {
        function linkFunc(scope, element, attributes) {
            element.sortable({axis: 'y'});
        }
        return {
            link: linkFunc
        };
    }
})();