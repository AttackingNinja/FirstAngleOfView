Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTk0NThiYS1hMDE3LTQ0ZjMtYjBjNS1hZDU1NjczMGZlZGMiLCJpZCI6MzUzMCwiaWF0IjoxNTM3OTUyNjUyfQ.kVpSC5FbwuzHKN4t-MLV4g1oxVUwYrVjaA6UHto-lw0';
var viewer = new Cesium.Viewer('cesiumContainer');
var scene = viewer.scene;
var canvas = scene.canvas;
var ellipsoid = viewer.scene.globe.ellipsoid;
/*function getPosition()
{
    //得到当前三维场景
    var scene = viewer.scene;
    //得到当前三维场景的椭球体
    var ellipsoid = scene.globe.ellipsoid;
    var entity = viewer.entities.add(
        {
        label : {
            show : false
        }
    });
    var longitudeString = null;
    var latitudeString = null;
    var height = null;
    var cartesian = null;
    // 定义当前场景的画布元素的事件处理
    var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
    handler.setInputAction(function(movement)
    {
        //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
        cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
        if (cartesian)
        {
            //将笛卡尔坐标转换为地理坐标
            var cartographic = ellipsoid.cartesianToCartographic(cartesian);
            //将弧度转为度的十进制度表示
            longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            //获取相机高度
            height = Math.ceil(viewer.camera.positionCartographic.height);
            entity.position = cartesian;
            entity.label.show = true;
            entity.label.text = '(' + longitudeString + ', ' + latitudeString + "," + height + ')' ;
        }
        else {
            entity.label.show = false;
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
    handler.setInputAction(function(wheelment) {
        height = Math.ceil(viewer.camera.positionCartographic.height);
        entity.position = cartesian;
        entity.label.show = true;
        entity.label.text = '(' + longitudeString + ', ' + latitudeString + "," + height + ')' ;
    }, Cesium.ScreenSpaceEventType.WHEEL);
}*/
function onClick()
{
    var handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction(function (movement)
    {
        var cartesian = viewer.camera.pickEllipsoid(movement.position,ellipsoid);
        if(cartesian)
        {
            var cartographic = ellipsoid.cartesianToCartographic(cartesian);
            viewer.camera.flyTo(
                {
                    destination: Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 1.6),
                    orientation:{
                        heading : viewer.camera.heading,
                        pitch : Cesium.Math.toRadians(0),
                        roll:viewer.camera.roll
                    },
                    duration:1
                }
            );
            scene.screenSpaceCameraController.enableRotate = false;
            scene.screenSpaceCameraController.enableTranslate = false;
            scene.screenSpaceCameraController.enableZoom = false;
            scene.screenSpaceCameraController.enableTilt = false;
            scene.screenSpaceCameraController.enableLook = false;
            document.addEventListener('keydown',function (e) {
                switch (e.keyCode) {
                    case 'W'.charCodeAt(0):
                        viewer.camera.moveForward(1);
                    case 'S'.charCodeAt(0):
                        viewer.camera.moveBackward(1);
                    //case 'A'.charCodeAt(0):
                        viewer.camera.moveLeft(1);
                    //case 'D'.charCodeAt(0):
                        viewer.camera.moveRight(1);
                }
            })
            /*while(true)
            {
                document.addEventListener('keydown',function (e) {
                    window.alert(e.keyCode)
                },false)
            }*/
        }
    },Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
onClick();
