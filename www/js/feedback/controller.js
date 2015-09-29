/**
 * Created by gudonghui on 15/6/25.
 */
starter.controller('feedbackCtrl',['$rootScope','$scope','$ionicLoading','$state','$interval','$timeout','$http','$ionicActionSheet','$cordovaToast',feedback]);

function feedback($rootScope,$scope,$ionicLoading,$state,$interval,$timeout,$http,$ionicActionSheet,$cordovaToast) {

    var photos = [];

    function openphoto(index) {

        var pictureSource;   // picture source
        var destinationType; // sets the format of returned value

        //选择单张图片
        function onDeviceReady() {
            pictureSource = navigator.camera.PictureSourceType;
            destinationType = navigator.camera.DestinationType;
            function onSuccess(imageData) {

                photos[0] = "data:image/jpeg;base64," + imageData;
                $scope.photos = photos;

                $scope.fileList = dataURItoBlob("data:image/jpeg;base64,"+imageData);

            }

            function onFail() {
                showError($ionicLoading,'提交失败');
            }

            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 5,
                allowEdit: false,
                destinationType: destinationType.DATA_URL,
                sourceType: index == 1 ? pictureSource.PHOTOLIBRARY : pictureSource.CAMERA });

        }

        document.addEventListener("deviceready", onDeviceReady, false);
    }

    $scope.showActionsheet = function () {

        $ionicActionSheet.show({
            titleText: '菜单',
            buttons: [
                { text: '打开相机' },
                { text: '打开相册' }
            ],
            cancelText: '取消',
            cancel: function () {
                openphoto(index);
            },
            buttonClicked: function (index) {
                openphoto(index);
                return true;
            },
            destructiveButtonClicked: function () {
                return true;
            }
        });
    };


    $scope.opinionhide=function() {
        $rootScope.opinions = false;
    };

    $scope.goonshopping=function()
    {
        $rootScope.opinions = false;
        $state.go("homePage");
    };
    //提交
    $scope.feedBackCommit=function()
    {

        if($scope.opinionLabel == "" || $scope.opinionLabel == undefined){

            $cordovaToast.showShortBottom("请输入您要反馈信息");

        }else{

            var fd = new FormData();

            fd.append("reason",$scope.opinionLabel);
            fd.append("files",$scope.fileList);
            fd.append("key",window.localStorage.getItem("key"));

            $http.post(http_customerFeedback,fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data) {

                if(data.status == "SUCCESS"){
                    $scope.opinionLabel = "";
                    $scope.photos = [];
                    $rootScope.opinions = true;
                }else {
                    showError($ionicLoading,'提交失败');
                }
            });
        }

    };


    function dataURItoBlob(dataURI) {

        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++)
        {
            ia[i] = byteString.charCodeAt(i);
        }

        var bb = new Blob([ab], { "type": mimeString });

        return bb;
    }

    //刷新页面
    function reloadPageOnlyOnce(){

        url = location.href; //把当前页面的地址赋给变量 url

        var times = url.split("?"); //分切变量 url 分隔符号为 "?"

        if(times[1] != 1){ //如果?后的值不等于1表示没有刷新

            url += "?2"; //把变量 url 的值加入 ?1

            self.location.replace(url); //刷新页面

        }

    }





    //   	获取客服电话
    getTel($http,$scope,requestUrl);

    //  获取客服电话
    function getTel($http,$scope,requestUrl){

        var city=getStorage('city');

        $http.post(requestUrl+'custservice/getPhone',{"city":city})
            .success(function(data) {
                if(data.status == "SUCCESS"){
                    $scope.tel = data.data.phone+"";
                }
            })
    }


}
//$http.post("http://192.168.1.10:8080/kangnuo/custservice/getPhone",{"city":city}).success(function(data)