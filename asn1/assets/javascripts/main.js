/* helpers */
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};



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


function startup() {
	for (var i = 0; i < links.length; i++) {
		(function(idx) {
			var button = document.getElementById("l" + i);
			if (button) {			
				var link = links[i];
				button.addEventListener("touchstart",function(){touchLink(link)},false)
			}
		})(i);
	}
}

