/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
>> @author Thomas Lhoest - tlhoest@gmail.com
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
>> adapted from : mrdoob / http://mrdoob.com
*/ 

THREE.PointerLockControls = function (camera, position) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );
    this.camera = camera;

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	this.floorY = position.y;

	var yawObject = new THREE.Object3D();
	yawObject.position.x = position.x;
	yawObject.position.y = position.y;
	yawObject.position.z = position.z;
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var isOnObject = false;
	var canJump = true;
	var isFlying = false;

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
			break;

			case 37: // left
			case 65: // a
				moveLeft = true; 
			break;

			case 40: // down
			case 83: // s
				moveBackward = true;
			break;

			case 39: // right
			case 68: // d
				moveRight = true;
			break;

			case 32: // space
				//if ( canJump === true ) 
					//velocity.y = 10;
					isFlying = true;
				//canJump = false;
			break;
		}
	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
			break;
			case 32: // space
					isFlying = false;
			break;
		}
	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

    this.getPosition = function () {
        return {
            x: yawObject.position.x,
            y: yawObject.position.y,
            z: yawObject.position.z
        };
    };

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();

    this.getOrientation = function () {

        var m = pitchObject.matrixWorld;

        var f = new THREE.Vector3(0,0,-1);
        var fWorld = f.applyMatrix4(m);
        var front = fWorld.sub(pitchObject.position).normalize();

        var u = new THREE.Vector3(0,1,0);
        var uWorld = u.applyMatrix4(m);
        var up = uWorld.sub(pitchObject.position).normalize();

        return {front: front,up: up};
    };

	this.update = function(delta, speed) {

		if ( scope.enabled === false ) return;

		delta *= 0.1;

		velocity.x += ( - velocity.x ) * 0.08 * delta;
		velocity.z += ( - velocity.z ) * 0.08 * delta;

		if (isFlying) {
			velocity.y = 5;
		} else {
			velocity.y -= 0.25 * delta;
		}

		if ( moveForward ) velocity.z -= speed * delta;
		if ( moveBackward ) velocity.z += speed * delta;
		if ( moveLeft ) velocity.x -= speed * delta;
		if ( moveRight ) velocity.x += speed * delta;

		if ( isOnObject === true ) {
			velocity.y = Math.max( 0, velocity.y );
		}

		yawObject.translateX( velocity.x );
		yawObject.translateY( velocity.y ); 
		yawObject.translateZ( velocity.z );

		// landing
		if ( yawObject.position.y < this.floorY ) {

			velocity.y = 0;
			yawObject.position.y = this.floorY;

			//canJump = true;
		}
	};
};