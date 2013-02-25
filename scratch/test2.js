function getMoveFunctions() {
	// when the device changes from portrait to landscape mode,
	// the accelerometers maintain their orientation relative to the device,
	// but the viewport rotates 90 degrees so we need rotated movement functions
	if ( inPortraitMode() ) {
		var down = function (start, kfp) {
			var trn = 'from {' + kfp + 'transform:translate( 0px, ' + start + 'px ); } to {' + kfp + 'transform:translate( 0px, ' + (start + 1) + 'px ); }';
			return trn;
		};
		
		var up = function (start, kfp) {
			var trn = 'from {' + kfp + 'transform:translate( 0px, ' + start + 'px ); } to {' + kfp + 'transform:translate( 0px, ' + (start - 1) + 'px ); }';
			return trn;
		};
		
		var right = function (start, kfp) {
			var trn = 'from {' + kfp + 'transform:translate( ' + start + 'px, 0px ); } to {' + kfp + 'transform:translate( ' + (start + 1) + 'px, 0px ); }';
			return trn;
		};
		
		var left = function (start, kfp) {
			var trn = 'from {' + kfp + 'transform:translate( ' + start + 'px, 0px ); } to {' + kfp + 'transform:translate( ' + (start - 1) + 'px, 0px ); }';
			return trn;
		};
	} else {
		var down = function (start, kfp) {
			var trn = 'from {' + kfp + 'transform:translate( ' + start + 'px, 0px ); } to {' + kfp + 'transform:translate( ' + (start + 1) + 'px, 0px ); }';
			return trn;
		};
		
		var up = function (start, kfp) {
			var trn = 'from {' + kfp + 'transform:translate( ' + start + 'px, 0px ); } to {' + kfp + 'transform:translate( ' + (start - 1) + 'px, 0px ); }';
			return trn;
		};

		var left = function (start, kfp) {
			var trn = 'from {' + kfp + 'transform:translate( 0px, ' + start + 'px ); } to {' + kfp + 'transform:translate( 0px, ' + (start + 1) + 'px ); }';
			return trn;
		};
		
		var right = function (start, kfp) {
			var trn = 'from {' + kfp + 'transform:translate( 0px, ' + start + 'px ); } to {' + kfp + 'transform:translate( 0px, ' + (start - 1) + 'px ); }';
			return trn;
		};
	}

	var move = {
		"down" : down,
		"up" : up,
		"right" : right,
		"left" : left
	};
	return move;
}