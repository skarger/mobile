/* helpers */
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/* data */
var pages = {
	"p0" : "game.html",
	"p1" : "scores.html",
	"p2" : "gameover.html",	
}



function touchLink(dest) {
	window.location=dest;
}


function startup() {
	var pageCount = Object.size(pages);
	for (var i = 0; i < pageCount; i++) {
		(function(idx) {
			var button = document.getElementById("p" + i);
			var page = pages["p" + i];
			button.addEventListener("touchstart",function(){touchLink(page)},false)
		})(i);
	}
}