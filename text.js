function boot() {
	var theQuote= RiTa.randomItem(quotations);
	var theFont= RiTa.randomItem(fontFamilies);
	var quoteAuthor;
	var quoteText;
	if (shuf) {
		quoteText = markovOutput();
		quoteAuthor = (theQuote.author + " (not)");
	}
	else {
		quoteText = theQuote.text;
		quoteAuthor = theQuote.author;
	}
	var keyword = findNouns(quoteText);
	if (inco) {
		var keywordArray = 	dataMUSE('https://api.datamuse.com/words?rel_ant='+keyword);
		if (keywordArray.length!=0) {
			keyword = RiTa.randomItem(keywordArray);
		}
	}
	var r = randomColor();
	var g = randomColor();
	var b = randomColor();
	$(".text-block").css("background-color","rgba("+r+","+g+","+b+",0.3");
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
	
	function randomColor() {
		 return Math.floor(Math.random() * Math.floor(255));
	}
	
	function markovOutput() {
		var rm = new RiMarkov(3);
		rm.loadText(allTheQuotes);
		return rm.generateSentence();
	}
	
	function dataMUSE (myURL) {
		var json = (function () {
			var json = null;
			$.ajax({
				'async': false,
				'global': false,
				'url': myURL,
				'dataType': "json",
				'success': function (data) {
					json = data;
				}
			});
			return json;
		})();		
		var amb = JSON.stringify(json);
		amb = amb.replace(/[.,\/#!?'"$%\^&\*;:{}\[\]=\-_`~()]/g,"");
		amb = amb.replace(/word/g , " ");
		amb = amb.replace(/score/g, " ");
		amb = amb.replace(/[0-9]/g, " "); 
		amb = amb.replace(/numSyllables/g, " "); 
		amb = amb.replace(/\s+/g,' ').trim();
		amb = amb.split(" ");
		return amb;
	}
}