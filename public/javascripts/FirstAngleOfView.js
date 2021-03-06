Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTk0NThiYS1hMDE3LTQ0ZjMtYjBjNS1hZDU1NjczMGZlZGMiLCJpZCI6MzUzMCwiaWF0IjoxNTM3OTUyNjUyfQ.kVpSC5FbwuzHKN4t-MLV4g1oxVUwYrVjaA6UHto-lw0';
var viewer = new Cesium.Viewer('cesiumContainer');
var scene = viewer.scene;
var canvas = scene.canvas;
var ellipsoid = viewer.scene.globe.ellipsoid;
var handler = new Cesium.ScreenSpaceEventHandler(canvas);
var walkModeSwitch = "off";
var e_down;
function mouseControlSwitch(setSwitch) {
    if (setSwitch == true) {
        scene.screenSpaceCameraController.enableRotate = true;
        scene.screenSpaceCameraController.enableTranslate = true;
        scene.screenSpaceCameraController.enableZoom = true;
        scene.screenSpaceCameraController.enableTilt = true;
        scene.screenSpaceCameraController.enableLook = true;
    }
    else if (setSwitch == false) {
        scene.screenSpaceCameraController.enableRotate = false;
        scene.screenSpaceCameraController.enableTranslate = false;
        scene.screenSpaceCameraController.enableZoom = false;
        scene.screenSpaceCameraController.enableTilt = false;
        scene.screenSpaceCameraController.enableLook = false;
    }
}

function walkModeOnClick() {
    handler.setInputAction(function (movement) {
        var cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
        if (cartesian) {
            var cartographic = ellipsoid.cartesianToCartographic(cartesian);
            viewer.camera.flyTo(
                {
                    destination: Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 1.6),
                    orientation: {
                        heading: viewer.camera.heading,
                        pitch: Cesium.Math.toRadians(0),
                        roll: viewer.camera.roll
                    },
                    duration: 1,
                    complete: function () {
                        document.getElementById("heightNumber").innerHTML= viewer.camera.positionCartographic.height.toFixed(2);
                    }
                }
            );
            if (walkModeSwitch == "choosePosition") {
                walkModeSwitch = "on";
                mouseControlSwitch(false);
                document.getElementById("walkModeButton").style.color = "#fff";
                document.getElementById("walkModeButton").style.fill = "#fff";
                document.getElementById("walkModeButton").style.background = "#48b";
                document.getElementById("walkModeButton").style.borderColor = "#aef";
                document.getElementById("walkModeButton").style.boxShadow = "0 0 8px #fff";
                document.getElementById("cesiumContainer").style.cursor = "default";
                document.getElementById("viewerControlBoxContainer").style.visibility = "visible";
                document.getElementById("heightShowerBoxContainer").style.visibility = "visible";
            }
            document.addEventListener('keydown', function (e) {
                switch (e.keyCode) {
                    case 38://W
                        if(Cesium.Math.toDegrees(viewer.camera.pitch)<=15)
                            viewer.camera.lookUp(Cesium.Math.toRadians(1));
                        break;
                    case 40://S
                        if(Cesium.Math.toDegrees(viewer.camera.pitch)>=1)
                            viewer.camera.lookDown(Cesium.Math.toRadians(1));
                        break;
                    case 37://A
                        viewer.camera.lookLeft(Cesium.Math.toRadians(1));
                        break;
                    case 39://D
                        viewer.camera.lookRight(Cesium.Math.toRadians(1));
                        break;
                    case 81://Q
                        viewer.camera.moveUp(0.1);
                        document.getElementById("heightNumber").innerHTML= viewer.camera.positionCartographic.height.toFixed(2);
                        break;
                    case 69://E
                        if (viewer.camera.positionCartographic.height >= 1.7)
                        {
                            viewer.camera.moveDown(0.1);
                            document.getElementById("heightNumber").innerHTML= viewer.camera.positionCartographic.height.toFixed(2);
                        }
                        break;
                    case 87://up
                        viewer.camera.moveForward(1);
                        break;
                    case 83://down
                        viewer.camera.moveBackward(1);
                        break;
                    case 65://left
                        viewer.camera.moveLeft(1);
                        break;
                    case 68://right
                        viewer.camera.moveRight(1);
                        break;
                }
            })
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function setWalkModeButtonOnStyle() {
    if (walkModeSwitch == "off") {
        document.getElementById("cesiumContainer").style.cursor = "url(/images/walkManCursor.ico),auto";
        walkModeSwitch = "choosePosition";
        walkModeOnClick(walkModeSwitch);
    }
    else if (walkModeSwitch == "on") {
        walkModeSwitch = "off";
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        var cartographic = ellipsoid.cartesianToCartographic(viewer.camera.positionWC);
        viewer.camera.flyTo(
            {
                destination: Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 1000),
                duration: 1
            }
        );
        document.getElementById("walkModeButton").style.color = "rgb(255, 255, 255)";
        document.getElementById("walkModeButton").style.fill = "none"
        document.getElementById("walkModeButton").style.background = "#303336";
        document.getElementById("walkModeButton").style.borderColor = "none";
        document.getElementById("walkModeButton").style.boxShadow = "rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px";
        document.getElementById("cesiumContainer").style.cursor = "default";
        document.getElementById("viewerControlBoxContainer").style.visibility = "hidden";
        document.getElementById("heightShowerBoxContainer").style.visibility = "hidden";
        document.getElementById("heightNumber").innerHTML="-";
        mouseControlSwitch(true);
    }
    else
    {
        walkModeSwitch = "off";
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        document.getElementById("walkModeButton").style.color = "rgb(255, 255, 255)";
        document.getElementById("walkModeButton").style.fill = "none"
        document.getElementById("walkModeButton").style.background = "#303336";
        document.getElementById("walkModeButton").style.borderColor = "none";
        document.getElementById("walkModeButton").style.boxShadow = "rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px";
        document.getElementById("cesiumContainer").style.cursor = "default";
    }
}
function onMoveUpButtonDown() {
    viewer.camera.moveUp(0.1);
    document.getElementById("heightNumber").innerHTML= viewer.camera.positionCartographic.height.toFixed(2);
    e_down = setInterval(function () {
        viewer.camera.moveUp(0.1);
        document.getElementById("heightNumber").innerHTML= viewer.camera.positionCartographic.height.toFixed(2);
    },100);
}
function onMoveDownButtonDown() {
    if (viewer.camera.positionCartographic.height >= 1.7)
    {
        viewer.camera.moveDown(0.1);
        document.getElementById("heightNumber").innerHTML= viewer.camera.positionCartographic.height.toFixed(2);
    }
    e_down = setInterval(function () {
        if (viewer.camera.positionCartographic.height >= 1.7)
        {
            viewer.camera.moveDown(0.1);
            document.getElementById("heightNumber").innerHTML= viewer.camera.positionCartographic.height.toFixed(2);
        }
    },100);
}
function onRotateLeftButtonDown() {
    viewer.camera.lookLeft(Cesium.Math.toRadians(1));
    e_down = setInterval(function () {
        viewer.camera.lookLeft(Cesium.Math.toRadians(1));
    },50);
}
function onRotateRightButtonDown() {
    viewer.camera.lookRight(Cesium.Math.toRadians(1));
    e_down = setInterval(function () {
        viewer.camera.lookRight(Cesium.Math.toRadians(1));
    },50);
}
function onButtonUp() {
    clearInterval(e_down);
}