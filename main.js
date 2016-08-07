///<reference path="./babylon.d.ts"/>

var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0, 0);
    //scene.debugLayer.show();
    //new BABYLON.VRDeviceOrientationFreeCamera("VR-With-Dist", new BABYLON.Vector3(0, 0, 0), scene, true);
    //new BABYLON.VRDeviceOrientationFreeCamera("VR-No-Dist", new BABYLON.Vector3(0, 0, 0), scene, false);
    new BABYLON.DeviceOrientationCamera("Orientation", new BABYLON.Vector3(0, 0, 0), scene);

    new BABYLON.WebVRFreeCamera("VR-With-Dist", new BABYLON.Vector3(0, 0, 0), scene, true);
    new BABYLON.WebVRFreeCamera("VR-No-Dist", new BABYLON.Vector3(0, 0, 0), scene, false);

    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    light.groundColor = new BABYLON.Color3(.5, .5, .5);


    var skybox = BABYLON.Mesh.CreateBox("skybox", 100.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    var box = BABYLON.Mesh.CreateBox("box", 6.0, scene);

    var sphere = BABYLON.Mesh.CreateSphere("sphere", 10.0, 10.0, scene);

    var plan = BABYLON.Mesh.CreatePlane("plane", 10.0, scene);

    var cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 3, 3, 3, 6, 1, scene, false);

    var torus = BABYLON.Mesh.CreateTorus("torus", 5, 1, 10, scene, false);

    box.position = new BABYLON.Vector3(-10, 0, 0);
    sphere.position = new BABYLON.Vector3(0, 10, 0);
    plan.position.z = 10;
    cylinder.position.z = -10;
    torus.position.x = 10;


    return scene;
}

var setCamera = function (vr, distortion) {
    scene.activeCamera && scene.activeCamera.detachControl(canvas);
    var cameraId = vr ? (distortion ? "VR-With-Dist" : "VR-No-Dist") : "Orientation";
    scene.setActiveCameraByID(cameraId);
    scene.activeCamera.attachControl(canvas);
}

var setRatio = function (factor) {
    engine._hardwareScalingLevel *= factor;
    engine._hardwareScalingLevel = Math.max(engine._hardwareScalingLevel, 1 / window.devicePixelRatio);
    engine.resize();
}