function boot() {
	var theQuote= RiTa.randomItem(quotations);
	var theFont= RiTa.randomItem(fontFamilies);
	var quoteAuthor = theQuote.author;
	var quoteText = theQuote.text;
	var keyword = findNouns(quoteText);
	getImages();	
	function getImages () {
		$.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
		{
			tags: keyword,
			tagmode: "any",
			format: "json"
		},
		function(data) {
			var rnd = Math.floor(Math.random() * data.items.length);
			var desc = (data.items[rnd]['description']);
			var dims = desc.substring(desc.indexOf("width="));
			var nums = /\d+/g;
			var numsTot = (dims.match(nums));
			var width=numsTot[0];
			var height=numsTot[1];
			if (landscapeCheck(width, height)) {
				var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");	
				document.getElementById("theImage").setAttribute("src", image_src);
				document.getElementById("theText").style.fontFamily = (theFont);
				document.getElementById("theText").innerHTML = (quoteText + "<br> — " + quoteAuthor);
			}
			else {
				getImages();
			}
		});
		setTimeout(
			function() {
				$(".output").fadeIn(2000);
		}, 1000);
	}
	
	function landscapeCheck(width, height) {
		if (width > height) {
			return true;
		}	
		else {
			return false;
		}
	}
	
	function findNouns(qt) {
		var s = qt.split(" ");
		var array = [];
		for (i=0;i<s.length;i++) {
			if (RiTa.isNoun(s[i]) && !RiTa.isW_Question(s[i]) && !RiTa.isAdjective(s[i]) &&!RiTa.isAdverb(s[i])) {
				array.push(s[i]);
			}
		}
		if (array.length != 0) {
			return RiTa.randomItem(array);
		}
		else {
			return "cat";
		}
	}
}