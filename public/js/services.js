angular.module('GameServices', []).
factory('nautilus', ['$rootScope', function($rootScope) {
    return {
        connect: function(host, onIndex) {
            Nautilus.createClient({
                host: host,
                onmessage: function(apply) {
                    $rootScope.$apply(function() {
                        apply()
                    })
                },
                onIndex : onIndex
            })
        }
    }
}])