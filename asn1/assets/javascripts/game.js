function startup() {
	var day = new Date();
	window.startTime = day.getTime();
	window.score = 0;

	var b = document.getElementById("playpause");
	b.addEventListener("touchstart",pause,false);

	motion();
}

function motion() {
	if (window.DeviceMotionEvent) {
 		play();
	}
}

function deviceMotionHandler(eventData) {
	// this function is adapted from an example at http://www.html5rocks.com/en/tutorials/device/orientation/

	// Grab the acceleration including gravity from the results
	var acceleration = eventData.accelerationIncludingGravity;

	// Display the raw acceleration data
	var rawAcceleration = "[" +  Math.round(acceleration.x) + ", " + 
	Math.round(acceleration.y) + ", " + Math.round(acceleration.z) + "]";
	
	// Z is the acceleration in the Z axis, and if the device is facing up or down
	var facingUp = 1;
	if (acceleration.z < 0) {
		facingUp = -1;
	}

	// Display the acceleration
	//document.getElementById("accel").innerHTML = rawAcceleration;
	var ball = document.getElementById("ball");
	if (ball) {
		if (!window.animValues) {
			window.animValues = prepAnimation(ball);
		}
		setRule(ball, acceleration, window.animValues);
	}
}


function setRule(ball, acc, anim, val) {
	var val = anim.moveRuleCount;
	anim.moveRuleCount++;

	var ams = anim.animationstring;
	var amns = anim.animationnamestring;
    var kfp = anim.keyframeprefix;
	var rule = computeMoveRule(anim, acc, kfp, val);

	removeRule();
	insertRule(rule);

	ball.style[ams] = 'mov' + val + ' 1s linear forwards';
	ball.style[amns] = 'mov' + val;
}

function computeMoveRule(anim, acc, kfp, val) {
	var start_x = anim.coord_x;
	var start_y = anim.coord_y;

	// when the device changes from portrait to landscape mode,
	// the accelerometers maintain their orientation relative to the device,
	// but the viewport rotates 90 degrees so we need rotated movement functions
	var new_coords = getNewCoordinates(anim, acc, start_x, start_y);
	var new_x = new_coords.x, new_y = new_coords.y;
	
	window.animValues.coord_x = new_x;
	window.animValues.coord_y = new_y;

	var goalParams = getGoal();
	var goal = document.getElementById('goal');
	goal.style["top"] = goalParams.goalMid + "px";

	if (start_x >= goalParams.goalEdge && 
		(start_y >= goalParams.goalTop && start_y <= goalParams.goalBottom)) {
		endGame("win");
	}

    // the only way i can get this to work in webkit is to rename the rule to (mov + val) every time
	// eventually it will overflow, but i gave up on re-using the same rule name after many tries
	// when re-using the rule name it would get stuck on the first rule
	// although that was not a problem with gecko, only webkit
	var trn = computeTranslation(start_x, start_y, new_x, new_y, kfp);
	var rule = '@' + kfp + 'keyframes mov' + val + ' {' + trn + '}';
	return rule;
}


function getNewCoordinates(anim, acc, start_x, start_y) {
	if ( shouldStop(acc, start_x, start_y) ) {
		var coords = stop(anim, acc, start_x, start_y);
		var new_x = coords.x, new_y = coords.y;
	} else {
		var coords = roll(anim, acc, start_x, start_y);
		var new_x = coords.x, new_y = coords.y;
	}
	return { "x" : new_x, "y" : new_y };
}

function computeTranslation(start_x, start_y, new_x, new_y, kfp) {
	var trn = 'from {' + kfp + 'transform:translate( ' + start_x + 'px, ' + start_y + 'px ); } ' + 
			  'to {' + kfp + 'transform:translate( ' + new_x + 'px, ' + new_y + 'px ); }';
	return trn;
}


function removeRule() {
	if (window.insertedRule ) {
		window.insertedRule = 0;

		if (document.getElementById('animCSS')) {
			document.getElementById('animCSS').parentNode.removeChild();
		}
		if( document.styleSheets && document.styleSheets.length ) {
			document.styleSheets[0].deleteRule(document.styleSheets[0].cssRules.length - 1);
		}

	}
}


function insertRule(rule) {
  try {
	window.insertedRule = 1;
	if( document.styleSheets && document.styleSheets.length ) {
		// insert as very last
		document.styleSheets[0].insertRule( rule, document.styleSheets[0].cssRules.length );
	} else {
		var s = document.createElement( 'style' );
		s.id = "animCSS";
		s.innerHTML = rule;
		document.getElementsByTagName( 'head' )[ 0 ].appendChild( s );		
	}
  } catch (e) {
	document.getElementById('db4').innerHTML = "ERROR inserting css rule: " + rule;
  }
}




function getAnimationString(elm) {
  var domPrefixes =  new Array("Webkit", "Moz", "O", "ms");
	for( var i = 0; i < domPrefixes.length; i++ ) {
	  if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
		var pfx = domPrefixes[ i ];
		animationstring = pfx + 'Animation';
		return animationstring;
	  }
	}
	return null;
}

function getAnimationNameString(elm) {
  var domPrefixes =  new Array("Webkit", "Moz", "O", "ms");
	for( var i = 0; i < domPrefixes.length; i++ ) {
	  if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
		var pfx = domPrefixes[ i ];
		animationnamestring = pfx + 'AnimationName';
		return animationnamestring;
	  }
	}
	return null;
}

function getKeyFramePrefix(elm) {
  var domPrefixes =  new Array("Webkit", "Moz", "O", "ms");
	for( var i = 0; i < domPrefixes.length; i++ ) {
	  if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
		var pfx = domPrefixes[ i ];
		keyframeprefix = '-' + pfx.toLowerCase() + '-';
		return keyframeprefix;
	  }
	}
	return null;
}

function getTransformString(elm) {
  var domPrefixes =  new Array("Webkit", "Moz", "O", "ms");
	for( var i = 0; i < domPrefixes.length; i++ ) {
	  if( elm.style[ domPrefixes[i] + 'Transform' ] !== undefined ) {
		var pfx = domPrefixes[ i ];
		transformstring = pfx + 'Transform';
		return transformstring;
	  }
	}
	return null;
}

function prepAnimation(elm) {
	var animation = false,
	transformation = false,
	animationstring = 'animation',

	transformstring = 'transform',
	keyframeprefix = '';

	if ( !window.requestAnimationFrame ) {
	  window.requestAnimationFrame = ( function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(  callback, fps ) {
		  window.setTimeout( callback, 1000 / fps );
		};
	  } )();
	}


	if( elm.style.animationName ) { animation = true; }
	if( elm.style.transform ) { transformation = true; }    
    elm.style[ animationstring ] = '';

	if( animation === false ) {
    	animationstring = getAnimationString(elm);
		if (animationstring) {
			keyframeprefix = getKeyFramePrefix(elm);
			animationnamestring = getAnimationNameString(elm);
			animation = true;
		}
	}

	if( transformation === false ) {
    	transformstring = getTransformString(elm);
		if (transformstring) {
			transformation = true;
		}
	}

	var animValues = {
		"animationstring" : animationstring,
		"animationnamestring" : animationnamestring,
		"transformstring" : transformstring,
		"keyframeprefix" : keyframeprefix,
		"moveRuleCount" : 0,
		"pixelChange" : 3,
		"coord_x" : 0,
		"coord_y" : 0
	}
	return animValues;
}

function getWalls() {
	// first the bounding walls, which should always exist
	var edges = viewport();
	var vwidth = edges.width;
	var vheight = edges.height;

	var wallObstacles = {
		"topWall" : 0,
		"bottomWall" : vheight - 30,
		"leftWall" : 0,
		"rightWall" : vwidth - 30
	};

	return wallObstacles;
}

function getGoal() {
	var edges = viewport();
	var vwidth = edges.width;
	var vheight = edges.height;
	var goal = {
		"goalTop" : (vheight / 2) - 5,
		"goalMid" : vheight / 2,
		"goalBottom" : (vheight / 2) + 5,
		"goalEdge" : vwidth - 30
	};
	return goal;
}

function pause() {
	removeRule();
	window.removeEventListener('devicemotion',deviceMotionHandler, false);
	var b = document.getElementById("playpause");
	b.innerHTML = "Resume";
	b.removeEventListener("touchstart",pause,false);
	b.addEventListener("touchstart",play,false);
}

function play() {
	var b = document.getElementById("playpause");
	b.innerHTML = "Pause";
	b.removeEventListener("touchstart",play,false);
	b.addEventListener("touchstart",pause,false);
	window.addEventListener('devicemotion',deviceMotionHandler, false);
}

function endGame(status) {
	// cleanup
	var ball = document.getElementById("ball");
	ball.style["display"] = "none";
	var playpause = document.getElementById("playpause");
	playpause.style["display"] = "none";
	pause();

	// result
	var m1 = document.getElementById("wl");
	m1.style["display"] = "block";
	if (status === "win") {
		m1.innerHTML = "You Win!";
	} else {
		m1.innerHTML = "You Lose. Maybe you should consider another hobby.";
	}

	// score
	window.score += 50;
	var m2 = document.getElementById("score");
	m2.style["display"] = "block";
	m2.innerHTML = "Score: " + window.score;

	// time
	var day = new Date();
	var endTime = day.getTime();
	var diff = endTime - window.startTime;
	var seconds = (diff / 1000);
	var m3 = document.getElementById("time");
	m3.style["display"] = "block";
	m3.innerHTML = "Time: " + Math.round(seconds) + "s";



	function goMain() {
		window.location="main";
	}
	setTimeout(goMain,4000); 
}

function roll(anim, acc, start_x, start_y) {
	if ( inPortraitMode() ) {
		if ( acc.x > 0 ) {
			var new_x = start_x + anim.pixelChange;
		} else {
			var new_x = start_x - anim.pixelChange;
		}
		if ( acc.y > 0 ) {
			var new_y = start_y - anim.pixelChange;
		} else {
			var new_y = start_y + anim.pixelChange;
		}
	} else {
		if ( acc.x > 0 ) {
			var new_y = start_y + anim.pixelChange;
		} else {
			var new_y = start_y - anim.pixelChange;
		}
		if ( acc.y > 0 ) {
			var new_x = start_x + anim.pixelChange;
		} else {
			var new_x = start_x - anim.pixelChange;
		}
	}
	return { "x" : new_x, "y" : new_y };
}

function shouldStop(acc, x, y) {
	var obs = getWalls();
	var g = getGoal();
	if ( inPortraitMode() ) {
		return ( (acc.x < 0 && x <= obs.leftWall) ||
				 (acc.x >= 0 && x >= obs.rightWall) ||
				 (acc.y >= 0 && y <= obs.topWall) ||
				 (acc.y < 0 && y >= obs.bottomWall) );
	} else {
		return ( (acc.x < 0 && y <= obs.topWall) ||
				 (acc.x >= 0 && y >= obs.bottomWall) ||
				 (acc.y >= 0 && x >= obs.rightWall) ||
				 (acc.y < 0 && x <= obs.leftWall) );
	}
}

function stop(anim, acc, x, y) {
	var obs = getWalls();
	if ( inPortraitMode() ) {
		if (acc.x < 0 && x <= obs.leftWall) {
			var new_x = x;
		} else if (acc.x >= 0 && x >= obs.rightWall) {
			var new_x = x;
		}
		if (acc.y >= 0 && y <= obs.topWall) {
			var new_y = y;
		} else if (acc.y < 0 && y >= obs.bottomWall) {
			var new_y = y;
		}
	} else {
		if (acc.x < 0 && y <= obs.topWall) {
			var new_y = y;
		} else if (acc.x >= 0 && y >= obs.bottomWall) {
			var new_y = y;
		}
		if (acc.y >= 0 && x >= obs.rightWall) {
			var new_x = x;
		} else if (acc.y < 0 && x <= obs.leftWall) {
			var new_x = x;
		}
	}

	// it's possible that we only stopped along one dimension. fill in the missing value.
	var rollCoordinates = roll(anim, acc, x, y);

	if (!new_x) {
		var new_x = rollCoordinates.x;
	}
	if (!new_y) {
		var new_y = rollCoordinates.y;
	}
	return { "x" : new_x, "y" : new_y };
}

function inPortraitMode() {
	return (window.innerHeight > window.innerWidth);
}

function viewport() {
	var d = document.documentElement || document.body;
	return { width : d[ 'clientWidth' ] , height : d[ 'clientHeight' ] }
}