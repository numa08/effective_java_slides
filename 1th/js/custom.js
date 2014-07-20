/* custom behavior *//* custom behavior */
(function  () {
	window.addEventListener("load", function() {
		var script = document.getElementsByTagName('head')[0].getElementsByTagName('script')[0];
		script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js");
	}, false);		
})();

$(function(){
	//Add Footer
	$("#slides").prepend(function  () {
		var link = $("<div>", {
			"class" : "left",
		}).append($("<a>", {
			target  : "_blank",
			href 	: "https://twitter.com/numa08",
			text    : "@numa08"
		}));

		var hashtag = $("<ul>")
		.append($("<li>",{
			"class" : "hashtag"
		})
		.append($("<img>", {
			"src"	: "https://g.twimg.com/Twitter_logo_blue.png",
			"class" : "logo"
		}))
		.append($("<a>", {
			text : "#effectivejava",
			target : "_blank",
			href : "https://twitter.com/intent/tweet?text=1th&hashtags=effectivejava&url=" + encodeURIComponent(window.location.origin  +window.location.pathname)
		})));

		var footer = $("<div>", {
			"class" : "footer",
		}).append(link)
		.append(hashtag);

		return footer;
	}());

	//Add Header
	$("#slides").prepend(function  () {
		var slideTitle = $("<div>", {
			"class" : "left"
		}).append($("<a>", {
			"class" : "topbar_link",
			text : "1th",
			href : ""
		}));
		var eventTitle = $("<a>", {
			"class" : "topbar_link right",
			text : "Reading a Effective Java",
			href : ""
		});
		var topbar = $("<div>", {
			"class" : "topbar"
		}).append(slideTitle)
		.append(eventTitle);

		return topbar;
	}());
});