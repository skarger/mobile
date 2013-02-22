/* helpers */
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function getAnimationString(elm) {
  var domPrefixes =  new Array("Webkit", "Moz", "O", "ms");
    for( var i = 0; i < domPrefixes.length; i++ ) {
      if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
        pfx = domPrefixes[ i ];
        animationstring = pfx + 'Animation';
        return animationstring;
      }
    }
	return null;
}

function getKeyFramePrefix(elm) {
  var domPrefixes =  new Array("Webkit", "Moz", "O", "ms");
    for( var i = 0; i < domPrefixes.length; i++ ) {
      if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
        pfx = domPrefixes[ i ];
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
        pfx = domPrefixes[ i ];
        transformstring = pfx + 'Transform';
        return transformstring;
      }
    }
	return null;
}


function removeRule() {
	if (window.insertedRule ) {
		window.insertedRule = 0;
		if (document.getElementById('animCSS')) {
			document.getElementById('animCSS').parentNode.removeChild();
		}
		//if( document.styleSheets && document.styleSheets.length ) {
		if( document.styleSheets) {
			console.log(document.styleSheets[0]);
			console.log("document.styleSheets[0].deleteRule( " + (document.styleSheets[0].cssRules.length - 1) + " )");
			document.styleSheets[0].deleteRule(document.styleSheets[0].cssRules.length - 1);
			//console.log(document.styleSheets[0].cssRules[2]);
		}
	}
}

function insertRule(rule) {
  try {
	var len1 = document.styleSheets[0].cssRules.length;	
	document.getElementById('db1').innerHTML += len1;

	window.insertedRule = 1;
	if( document.styleSheets && document.styleSheets.length ) {
		// insert as very last
		document.styleSheets[0].insertRule( rule, document.styleSheets[0].cssRules.length );
		document.getElementById('db3').innerHTML = "document.styleSheets[0].insertRule( " + rule + ", " + document.styleSheets[0].cssRules.length + " )";

	} else {
		var s = document.createElement( 'style' );
		s.id = "animCSS";
		s.innerHTML = rule;
		document.getElementsByTagName( 'head' )[ 0 ].appendChild( s );		
	}
	var len2 = document.styleSheets[0].cssRules.length;
	document.getElementById('db4').innerHTML += len2;
  } catch (e) {
	document.getElementById('db4').innerHTML = "ERROR inserting css rule: " + rule;
  }

}



/* data */
var links = [
	"main.html",
	"game.html",
	"scores.html",
	"gameover.html"
];





function touchLink(dest) {			
	window.location=dest;
}



function prepAnimation(elm) {
	animation = false,
	transformation = false,
	animationstring = 'animation',
	transformstring = 'transform',
	keyframeprefix = '',
	pfx = '';

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
		"transformstring" : transformstring,
		"keyframeprefix" : keyframeprefix
	}
	return animValues;
}

var prev = [20, 20];
var cur = [100, 100];

function x(elm, acc, anim) {
	var animationstring = anim.animationstring;
	var keyframeprefix = anim.keyframeprefix;

	var ruleName = "";
	ruleName = "mov";

	if (acc.x >= 0) {
		x_sign = "";
	} else {
		x_sign = "-";
	}

	if (acc.y >= 0) {
		y_sign = "";
	} else {
		y_sign = "-";
	}

	var moveKeyframes = '@' + keyframeprefix + 'keyframes mov { '+
					'from {' + keyframeprefix + 'transform:translate( ' + prev[0] + 'px, ' + prev[1] + 'px ) }'+
					' to {' + keyframeprefix + 'transform:translate(' + x_sign +  + cur[0] + 'px, ' + y_sign + cur[1] + 'px ) }'+
					'}';

	var temp = cur;
	cur = prev;
	prev = temp;

    rule = moveKeyframes;
    elm.style[ animationstring ] = 'mov 1s linear infinite';
	removeRule();
	insertRule(rule);

}

function motion() {
	if (window.DeviceMotionEvent) {
 		window.addEventListener('devicemotion', deviceMotionHandler, false);
	}
}


function deviceMotionHandler(eventData) {
	// this code is adapted from an example at http://www.html5rocks.com/en/tutorials/device/orientation/

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

	// Display the acceleration and calculated values
	document.getElementById("accel").innerHTML = rawAcceleration;

	var ball = document.getElementById("ball");
	if (ball) {
		if (!window.animValues) {
			window.animValues = prepAnimation(ball);
		}
		x(ball, acceleration, window.animValues);
	}
}



function startup() {
	hasDevOrientation();
	for (var i = 0; i < links.length; i++) {
		(function(idx) {
			var button = document.getElementById("l" + i);
			if (button) {			
				var link = links[i];
				button.addEventListener("touchstart",function(){touchLink(link)},false)
			}
		})(i);
	}
	motion();
}

function hasDevOrientation() {
	if (window.DeviceOrientationEvent) {
		document.getElementById("db1").innerHTML = "Has Dev Orientation";
	} else {
		document.getElementById("db1").innerHTML = "Does NOT Have Dev Orientation";
	}
}