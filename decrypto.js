var wordList;

function loadWordList() {
	var wordList;

	$.ajax({
            url : "wordlist.txt",
            dataType: "text",
            success : function (data) {
            	wordList = data.split("\n");
            },
            async: false
        });
	return wordList;
}

function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

function sfc32(a, b, c, d) {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}

var my_random = function() {
  return Math.random;
}

_.random = function(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(my_random() * (max - min + 1));
};

function pickWords(numWords) {
	return _.sample(wordList, numWords);
}

function generateCode() {
	var code = _.sample([1,2,3,4], 3);
	Cookies.set("code", code);
	setCode(code);
	$('#codeModal').modal('show');
}

function setCode(code) {
	for(idx = 0; idx < 3; idx++) {
		$('#code' + idx).text(code[idx]);
	}
	$('#revealCodeButton').show();
}

function setWords(words) {
	for(idx = 0; idx < 4; idx++) {
		$('#word' + idx).text(words[idx]);
	}
}

function loadWords() {
	return Cookies.getJSON("words");
}

function loadCode() {
	var code = Cookies.getJSON("code");
	if (code) {
		setCode(code);
	} else {
		$('#revealCodeButton').hide();
	}
}

var seed = function() { return 0; };

function newGame() {
  var seedkey = document.getElementById("gameseed").value;
  if (seedkey.length > 0) {
    seed = xmur3(seedkey);
  } else {
    seed = xmur3((new Date()).toJSON());
  }
  my_random = sfc32(seed(), seed(), seed(), seed());
	var words = pickWords(4);
	Cookies.set("words", words);
	Cookies.remove("code");

  seed = xmur3((new Date()).toJSON());
  my_random = sfc32(seed(), seed(), seed(), seed());

	$('#revealCodeButton').hide();
	return words;
}

function toggleFullScreen() {
	if (screenfull.isFullscreen) {
		screenfull.exit();
	} else {
		screenfull.request();
	}
	setFullScreenIcon();
}

function setFullScreenIcon() {
    if (screenfull.isFullscreen) {
		$('#enableFullScreen').hide();
		$('#disableFullScreen').show();
    } else {
		$('#enableFullScreen').show();
		$('#disableFullScreen').hide();
    }
}

function startNewGame() {
	setWords(newGame());
}

function disableScreenLock() {
	var noSleep = new NoSleep();
	noSleep.enable();
}

function initScreenfull() {
	var noSleep = new NoSleep();

	if (screenfull.enabled) {
		screenfull.on('change', () => {
			if (screenfull.isFullscreen) {
				noSleep.enable();
			} else {
				noSleep.disable();
			}
		});
        setInterval(setFullScreenIcon, 200);
    } else {
        $('#fullScreenButton').hide();
        $('#disableScreenLockModal').modal('show');
    }
}

function initialize() {
	initScreenfull();

	wordList = loadWordList();
	loadCode();

  seed = xmur3((new Date()).toJSON());
  my_random = sfc32(seed(), seed(), seed(), seed());

	var words = loadWords();

	if (words) {
		setWords(words);
	} else {
		/*
		startNewGame();
		$('#newGameModalCancelButton').hide();
		$('#newGameModal').modal({
			show: true,
			keyboard: false,
			backdrop: 'static'
		});
		*/
		$('#newGameModal').modal('show');
	}
}
