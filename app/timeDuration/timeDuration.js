var appModule = angular.module('timeDurationModule', []);
appModule.controller('SomeController', function ($scope) {
        $scope.email_notify_pref = 3600;
    })
    .directive('timeDuration', function () {
        var tpl = "<div>\
         <input type='text' ng-model='num' size='80'/>\
         <select ng-model = 'unit'>\
            <option value='seconds'>Seconds</option>\
            <option value='minutes'>Minutes</option>\
            <option value='hours'>Hours</option>\
            <option value='days'>Days</option>\
         </select>";
        return {
            restrict: 'E',
            template: tpl,
            require: 'ngModel',
            replace: true,
            link: function (scope, iElement, iAttrs, ngModelCtrl) {
                var multiplierMap = {seconds: 1, minutes: 60, hours: 3600, days: 86400};
                var multiplierTypes = ['seconds', 'minutes', 'hours', 'days'];

                ngModelCtrl.$formatters.push(function (modelValue) {
                    var unit = 'minutes', num = 0, i, unitName;

                    modelValue = parseInt(modelValue || 0);

                    for (i = multiplierTypes.length - 1; i >= 0; i--) {
                        unitName = multiplierTypes[i];

                        if (modelValue % multiplierMap[unitName] === 0) {
                            unit = unitName;
                            break;
                        }
                    }

                    if (modelValue) {
                        num = modelValue / multiplierMap[unit]
                    }

                    return {
                        unit: unit,
                        num: num
                    }
                });

                ngModelCtrl.$render = function () {
                    scope.unit = ngModelCtrl.$viewValue.unit;
                    scope.num = ngModelCtrl.$viewValue.num;
                };

                ngModelCtrl.$parsers.push(function (viewValue) {
                    var unit = viewValue.unit, num = viewValue.num, multiplier;
                    multiplier = multiplierMap[unit];
                    return num * multiplier;
                });

                scope.$watch('unit + num', function () {
                    ngModelCtrl.$setViewValue({unit: scope.unit, num: scope.num});
                });
            }
        };
    });