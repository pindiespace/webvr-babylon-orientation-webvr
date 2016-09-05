///<reference path="./babylon.d.ts"/>

/* 
 * Code adapted from Raanan Weber example
 * @link https://www.sitepoint.com/using-babylon-js-build-3d-games-web/
 * 
 * More examples on BabylonJS Playground (search "webvrfreecamera")
 * @link http://doc.babylonjs.com/playground
 * 
 * NOTE: this assumes the 'canvas' variable was created in index.html
 */

/** 
 * Create a scene.
 * @param {Object} engine an instance of the BabylonJS engine.
 * @param {HTML5CanvasElement} canvas an HTML5 <canvas> instance.
 */
var createScene = function ( engine, canvas ) {

    var scene = new BABYLON.Scene( engine );

    scene.clearColor = new BABYLON.Color3( 0, 0, 0 );

    //scene.debugLayer.show();
    //new BABYLON.VRDeviceOrientationFreeCamera("VR-With-Dist", new BABYLON.Vector3(0, 0, 0), scene, true);
    //new BABYLON.VRDeviceOrientationFreeCamera("VR-No-Dist", new BABYLON.Vector3(0, 0, 0), scene, false);

    // FPS camera for non-VR experiences
    new BABYLON.ArcRotateCamera( "ArcRotate", -1.5, 1.4, 20, new BABYLON.Vector3( 0, -2, 3 ), scene );

    // Use the Device Orientation Camera - http://doc.babylonjs.com/classes/2.4/DeviceOrientationCamera
    // NOTE: we alter the position of the camera here to match the WebVR cameras, so approx the same scene is shown
    //new BABYLON.DeviceOrientationCamera("Orientation", new BABYLON.Vector3(0, 20, 0), scene);

    // WebVR Free Camera - http://doc.babylonjs.com/classes/2.4/WebVRFreeCamera

    // Barrel distortion turned on

    new BABYLON.WebVRFreeCamera( "VR-With-Dist", new BABYLON.Vector3( 0, 0, -10 ), scene, true );

    // Barrel distortion turned off

    new BABYLON.WebVRFreeCamera( "VR-No-Dist", new BABYLON.Vector3( 0, 0, -10 ), scene, false);

    // For smartphones without WebVR (native or polyfill)

    new BABYLON.VRDeviceOrientationFreeCamera( "VR-Dev-Orientation", new BABYLON.Vector3( 0, 0, -10), scene );

    // TODO: add pageup and pagedown controls for up/down motion on desktop
    // http://www.babylonjs-playground.com/#1EVRXC

    // Light the scene.
    var light = new BABYLON.HemisphericLight( "hemi", new BABYLON.Vector3( 0, 1, 0 ), scene );
    light.groundColor = new BABYLON.Color3( .5, .5, .5 );

    // Create the skybox.
    var skybox = BABYLON.Mesh.CreateBox( "skybox", 200.0, scene );
    var skyboxMaterial = new BABYLON.StandardMaterial( "skyBox", scene );
    skyboxMaterial.backFaceCulling = false;

    // Cube texture ripped of from David Rousset example
    // https://www.davrous.com/2014/02/19/coding4fun-tutorial-creating-a-3d-webgl-procedural-qrcode-maze-with-babylon-js/
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture( "./textures/skybox", scene, ['_px.png', '_py.png', '_pz.png', '_nx.png', '_ny.png', '_nz.png'] );
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3( 0, 0, 0 );
    skyboxMaterial.specularColor = new BABYLON.Color3( 0, 0, 0 );
    skybox.material = skyboxMaterial;


    /////////////////////////
    // Create scene box.
    var box = BABYLON.Mesh.CreateBox("box", 6.0, scene);

 
    // Procedural textures, https://github.com/BabylonJS/Babylon.js/tree/master/proceduralTexturesLibrary
    var marbleMaterial = new BABYLON.StandardMaterial( "box", scene );
    var marbleTexture = new BABYLON.MarbleProceduralTexture( "marble", 512, scene );
    marbleTexture.numberOfTilesHeight = 2;
    marbleTexture.numberOfTilesWidth = 2;
    marbleMaterial.ambientTexture = marbleTexture;
    marbleMaterial.diffuseColor = BABYLON.Color3.Green();

    // Attach material to mesh
    box.material = marbleMaterial;

    /////////////////////////
    // Create scene sphere.
    var sphere = BABYLON.Mesh.CreateSphere( "sphere", 10.0, 10.0, scene );
    var brickMaterial = new BABYLON.StandardMaterial( "brick", scene );
    var brickTexture = new BABYLON.BrickProceduralTexture( "brick", 512, scene );
    brickTexture.numberOfTilesHeight = 2;
    brickTexture.numberOfTilesWidth = 2;
    brickMaterial.ambientTexture = brickTexture;
    brickMaterial.diffuseColor = BABYLON.Color3.Red();

    // Attach material to mesh
    sphere.material = brickMaterial;

    /////////////////////////
    // Create scene plane
    var plan = BABYLON.Mesh.CreatePlane( "plane", 10.0, scene );
    var grassMaterial = new BABYLON.StandardMaterial( "grass", scene );
    var grassTexture = new BABYLON.GrassProceduralTexture( "grass", 512, scene );
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
    var animationPlan = new BABYLON.Animation( "planeAnimation", "rotation.x", 20, 
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );

    // An array with all animation keys
    var pkeys = []; 

    //At the animation key 0, the value of rotation is "1"
    pkeys.push( {
        frame: 0,
        value: 0
    } );

    //At the animation key 80, the value of rotation is "0.2"
    pkeys.push( {
        frame: 150,
        value: Math.PI/6
    } );

    pkeys.push( {
        frame:300,
        value: 0
    } );

    animationPlan.setKeys( pkeys );
    plan.animations.push( animationPlan );
    scene.beginAnimation( plan, 0, 300, true );

    /////////////////////////
    // Create cylinder.
    var cylinder = BABYLON.Mesh.CreateCylinder( "cylinder", 3, 3, 3, 6, 1, scene, false );
    var roadMaterial = new BABYLON.StandardMaterial( "road", scene );
    var roadTexture = new BABYLON.RoadProceduralTexture( "road", 512, scene );
    roadTexture.numberOfTilesHeight = 2;
    roadTexture.numberOfTilesWidth = 2;
    roadMaterial.ambientTexture = roadTexture;
    roadMaterial.diffuseColor = BABYLON.Color3.White();

    cylinder.material = roadMaterial;

    /////////////////////////
    // Create torus.
    var torus = BABYLON.Mesh.CreateTorus( "torus", 5, 1, 10, scene, false );
    var woodMaterial = new BABYLON.StandardMaterial( "wood", scene );
    var woodTexture = new BABYLON.WoodProceduralTexture( "wood", 512, scene );
    woodTexture.numberOfTilesHeight = 2;
    woodTexture.numberOfTilesWidth = 2;
    woodMaterial.ambientTexture = woodTexture;
    woodMaterial.diffuseColor = BABYLON.Color3.White();

    torus.material = woodMaterial;

    /////////////////////////
    // Animate the plane to rock back and forth
    // http://doc.babylonjs.com/tutorials/Animations
    var animationTorus = new BABYLON.Animation( "torusAnimation", "rotation.y", 20, 
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );

    // An array with all animation keys
    var tkeys = []; 

    //At the animation key 0, the value of rotation is "1"
    tkeys.push( {
        frame: 0,
        value: 0
    } );

    //At the animation key 80, the value of rotation is "0.2"
    tkeys.push( {
        frame: 200,
        value: 2 * Math.PI
    } );

    animationTorus.setKeys( tkeys );
    torus.animations.push( animationTorus );
    scene.beginAnimation( torus, 0, 200, true );

    // Position the objects.
    box.position = new BABYLON.Vector3( -10, 0, 0 );

    // Position the box.
    sphere.position = new BABYLON.Vector3( 0, 10, 0 );

    // Position the rocking plane.
    plan.position.z = 10;
    plan.rotation = new BABYLON.Vector3( Math.PI/3, Math.PI/5, 0 );

    // Position the Cylinder.
    cylinder.position.z = -10;
    cylinder.position.y = -3;

    // Position the Torus.
    torus.position.x = 10;

    return scene;
};

/** 
 * Assign the active camera. Current versionso of BabylonJS
 * can have only one active camera at a time.
 * @param {Boolean} vr whether or not to use a vr-like camera (allowing 
 * stereo view and distortion). The actual WebVR API is only used if it 
 * is present via native or polyfill.
 * @param {Boolean} distortion whether or not to apply barrel distortion 
 * to the scene. If we use webvr-polyfill, it is always on.
 */
var setCamera = function ( vr, distortion ) {

    var cameraId;

    scene.activeCamera && scene.activeCamera.detachControl( canvas );



    if ( navigator.getVRDisplays ) {

        // Native WebVR or webvr-polyfill are present

        if ( vr ) {

            console.log( 'use WebVRFreeCamera' );

            cameraId = distortion ? 'VR-With-Dist' : 'VR-No-Dist';

        } else {

            console.log( 'use ArcRotate camera' );

            cameraId = 'ArcRotate';
        }

    } else {

        // No webvr, use internal Babylon deviceOrientation rather than true VR

        if( vr ) {

            console.log( 'use VRDeviceOrientation camera');

            cameraId = "VR-Dev-Orientation";

        } else {

            console.log( ' use ArcRotate camera' );

            cameraId = 'ArcRotate';

        }

    }

    // Set the active camera

    scene.setActiveCameraByID( cameraId );

    scene.activeCamera.attachControl( canvas );

};

/** 
 * Set scaling low res vs. high-res
 */
var setRatio = function ( factor ) {

    engine._hardwareScalingLevel *= factor;

    engine._hardwareScalingLevel = Math.max(engine._hardwareScalingLevel, 1 / window.devicePixelRatio);

    engine.resize();

};


