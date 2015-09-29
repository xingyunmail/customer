/**
 * Created by sunhao on 15/7/9.
 */
starter.directive('backButton', function(){
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {
            element.bind('click', goBack);

            function goBack() {
                history.back();
                scope.$apply();
            }
        }
    }
});


starter.directive('menuButton', function(){
    return {
        restrict: 'E',
        templateUrl:'view/menuButton.html',
        link: function(scope, element, attrs) {

            var key = window.localStorage.getItem("key");
            scope.loginAndRegis = true;

            if (key) {
                if (key.indexOf("uuid") >= 0) {// key里面有uuid 没有登录
                    scope.loginAndRegis = true;
                } else {// key里面没有uuid 已登录
                    scope.loginAndRegis = false;
                }
            } else {
                scope.loginAndRegis = true;
            }

            scope.menuShow = false;

            //var menuButton = angular.element(element.find('button')[0]);

            element.css({
                marginLeft:'75%'
            });
            element.on("click", function () {

                if (scope.menuShow == true)
                {
                    scope.menuShow = false;
                }
                else if(scope.menuShow == undefined || scope.menuShow == false)
                {
                    scope.menuShow = true;
                }
                scope.$apply();
            });
            element.on("blur", function () {
                console.log(scope.menuShow);
                if (scope.menuShow == true)
                {
                    scope.menuShow = false;
                }
                else
                {
                    scope.menuShow = true;
                }

            });
        }
    }
});



starter.directive('radioButton', function ($parse) {
    return {
        require: '?ngModel',
        restrict: 'E',
        link: function (scope, element, attrs, ngModel) {

            //console.log(ngModel);
            //
            var modelGetter = $parse(attrs.ngModel);
            ngModel.$modelValue = modelGetter(scope);

            var elements = element.find("button");

            if (elements != undefined && elements.length > 0) {

                var setClickCss = function (i) {

                    var e = angular.element(elements[i]);

                    e.on("click", function () {
                        //清楚其他元素
                        for (var j = 0; j < elements.length; j++) {
                            var elem = angular.element(elements[j]);
                            if (elem != undefined) {
                                elem.removeClass('monthButton-click');
                            }
                        }

                        ngModel.$setViewValue(e.val());

                        e.addClass('monthButton-click');

                        scope.$apply();

                    });

                }

                for (var i = 0; i < elements.length; i++) {
                    var elem = angular.element(elements[i]);

                    if (elem != undefined) {
                        //console.log(ngModel.$modelValue);
                        if(ngModel.$modelValue != undefined && ngModel.$modelValue == elem.val())
                        {
                            elem.removeClass('monthButton-click');
                            elem.addClass('monthButton-click');
                        }
                        else
                        {
                            elem.removeClass('monthButton-click');
                        }
                    }
                    var setCss = new setClickCss(i);
                }
            }

        }
    }
});
