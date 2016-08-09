///<reference path="./babylon.d.ts"/>

/* 
 * Code adapted from Raanan Weber example
 * @link https://www.sitepoint.com/using-babylon-js-build-3d-games-web/
 * 
 * NOTE: this assumes the 'canvas' variable was created in index.html
 */

var createScene = function () {

    var scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    //scene.debugLayer.show();
    //new BABYLON.VRDeviceOrientationFreeCamera("VR-With-Dist", new BABYLON.Vector3(0, 0, 0), scene, true);
    //new BABYLON.VRDeviceOrientationFreeCamera("VR-No-Dist", new BABYLON.Vector3(0, 0, 0), scene, false);

    // FPS camera for non-VR experiences


    // Use the Device Orientation Camera - http://doc.babylonjs.com/classes/2.4/DeviceOrientationCamera
    new BABYLON.DeviceOrientationCamera("Orientation", new BABYLON.Vector3(0, 0, 0), scene);

    // WebVR Free Camera - http://doc.babylonjs.com/classes/2.4/WebVRFreeCamera
    new BABYLON.WebVRFreeCamera("VR-With-Dist", new BABYLON.Vector3(0, 0, 0), scene, true);
    new BABYLON.WebVRFreeCamera("VR-No-Dist", new BABYLON.Vector3(0, 0, 0), scene, false);


    // TODO: add pageup and pagedown motion
    // http://www.babylonjs-playground.com/#1EVRXC

    // Light the scene.
    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    light.groundColor = new BABYLON.Color3(.5, .5, .5);

    // Create the skybox.
    var skybox = BABYLON.Mesh.CreateBox("skybox", 200.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    /////////////////////////
    // Create scene box.
    var box = BABYLON.Mesh.CreateBox("box", 6.0, scene);

 
    // Procedural textures, https://github.com/BabylonJS/Babylon.js/tree/master/proceduralTexturesLibrary
    var marbleMaterial = new BABYLON.StandardMaterial("box", scene);
    var marbleTexture = new BABYLON.MarbleProceduralTexture("marble", 512, scene);
    marbleTexture.numberOfTilesHeight = 2;
    marbleTexture.numberOfTilesWidth = 2;
    marbleMaterial.ambientTexture = marbleTexture;
    marbleMaterial.diffuseColor = BABYLON.Color3.Green();

    // Attach material to mesh
    box.material = marbleMaterial;

    /////////////////////////
    // Create scene sphere.
    var sphere = BABYLON.Mesh.CreateSphere("sphere", 10.0, 10.0, scene);
    var brickMaterial = new BABYLON.StandardMaterial("brick", scene);
    var brickTexture = new BABYLON.BrickProceduralTexture("brick", 512, scene);
    brickTexture.numberOfTilesHeight = 2;
    brickTexture.numberOfTilesWidth = 2;
    brickMaterial.ambientTexture = brickTexture;
    brickMaterial.diffuseColor = BABYLON.Color3.Red();

    // Attach material to mesh
    sphere.material = brickMaterial;

    /////////////////////////
    // Create scene plane
    var plan = BABYLON.Mesh.CreatePlane("plane", 10.0, scene);
    var grassMaterial = new BABYLON.StandardMaterial("grass", scene);
    var grassTexture = new BABYLON.GrassProceduralTexture("grass", 512, scene);
    grassMaterial.backFaceCulling = false;
    grassTexture.numberOfTilesHeight = 2;
    grassTexture.numberOfTilesWidth = 2;
    grassMaterial.ambientTexture = grassTexture;
    grassMaterial.diffuseColor = BABYLON.Color3.White();

    plan.material = grassMaterial;

    /////////////////////////
    // Animate the plane
    // http://doc.babylonjs.com/tutorials/Animations
    // NOTE: Making lighting work on both sides is complex, check
    // http://www.babylonjs-playground.com/#K6SNA#13
    var animationPlan = new BABYLON.Animation("planeAnimation", "rotation.x", 20, 
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    // An array with all animation keys
    var pkeys = []; 

    //At the animation key 0, the value of rotation is "1"
    pkeys.push({
        frame: 0,
        value: 0
    });

    //At the animation key 80, the value of rotation is "0.2"
    pkeys.push({
        frame: 150,
        value: Math.PI/6
    });

    pkeys.push({
        frame:300,
        value: 0
    })

    animationPlan.setKeys(pkeys);
    plan.animations.push(animationPlan);
    scene.beginAnimation(plan, 0, 300, true);

    /////////////////////////
    // Create cylinder.
    var cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 3, 3, 3, 6, 1, scene, false);
    var roadMaterial = new BABYLON.StandardMaterial("road", scene);
    var roadTexture = new BABYLON.RoadProceduralTexture("road", 512, scene);
    roadTexture.numberOfTilesHeight = 2;
    roadTexture.numberOfTilesWidth = 2;
    roadMaterial.ambientTexture = roadTexture;
    roadMaterial.diffuseColor = BABYLON.Color3.White();

    cylinder.material = roadMaterial;

    /////////////////////////
    // Create torus.
    var torus = BABYLON.Mesh.CreateTorus("torus", 5, 1, 10, scene, false);
    var woodMaterial = new BABYLON.StandardMaterial("wood", scene);
    var woodTexture = new BABYLON.WoodProceduralTexture("wood", 512, scene);
    woodTexture.numberOfTilesHeight = 2;
    woodTexture.numberOfTilesWidth = 2;
    woodMaterial.ambientTexture = woodTexture;
    woodMaterial.diffuseColor = BABYLON.Color3.White();

    torus.material = woodMaterial;


    /////////////////////////
    // Animate the plane
    // http://doc.babylonjs.com/tutorials/Animations
    var animationTorus = new BABYLON.Animation("torusAnimation", "rotation.y", 20, 
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    // An array with all animation keys
    var tkeys = []; 

    //At the animation key 0, the value of rotation is "1"
    tkeys.push({
        frame: 0,
        value: 0
    });

    //At the animation key 80, the value of rotation is "0.2"
    tkeys.push({
        frame: 200,
        value: 2 * Math.PI
    });

    animationTorus.setKeys(tkeys);
    torus.animations.push(animationTorus);
    scene.beginAnimation(torus, 0, 200, true);


    // Position the objects.
    box.position = new BABYLON.Vector3(-10, 0, 0);
    sphere.position = new BABYLON.Vector3(0, 10, 0);
    plan.position.z = 10;
    plan.rotation = new BABYLON.Vector3(Math.PI/3, Math.PI/5, 0);
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