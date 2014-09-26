var fontMaps = {};

function initializeFont(fontname) {
	if ( typeof fontMaps[fontname] == "undefined")
		fontMaps[fontname] = {};
	try {
		var obj = JSON.parse(Titanium.Filesystem.getFile('fontmaps/' + fontname + '.json').read().text);
		var fontmap = obj.icons;
		for (var i = 0; i < fontmap.length; i++) {
			var font = fontmap[i].properties.name;
			var code = fontmap[i].properties.code;
			//console.log("Found: " + fontname + " / " + font + " / " + code);
			fontMaps[fontname][font] = String.fromCharCode(code);
		}
	} catch (fontParseError) {
		console.log("*** There was a font parsing error.  " + "Did you copy your font's selection.json file " + "into the assets folder of your application and name it " + fontname + ".json?");
		console.log("*** fontParseError: " + fontParseError);
	}
}

var getIconAsText = function(iconname) {
	initializeFont("icomoon");
	return ( typeof iconname == "string" ? fontMaps["icomoon"][iconname] : String.fromCharCode(iconname));
	//return label;
};

var getIconAsLabel = function(color, iconname, size, options) {
	if ( typeof fontMaps["icomoon"] == "undefined")
		initializeFont("icomoon");
	var label = Ti.UI.createLabel({
		height : size + "dp",
		width : size + "dp",
		font : {
			fontFamily : "icomoon",
			fontSize : size + "sp"
		},
		text : ( typeof iconname == "string" ? fontMaps["icomoon"][iconname] : String.fromCharCode(iconname)),
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		color : color
	});
	if ( typeof options == "object") {
		for (var attr in options) {
			label[attr] = options[attr];
		}
	}
	return label;
};

var getIconAsBlob = function(color, iconname, size, options) {
	var view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE
	});
	view.add(getIconAsLabel(color, iconname, size, options));
	return view.toImage(null, true);
};

var getIcon = function(color, iconname, size, options) {
	var filename = Ti.Utils.md5HexDigest("icomoon." + iconname + color+"." + size + ( typeof options == "object" ? JSON.stringify(options) : "")) + ".png";
	//console.log("icon filename:" + filename);

	var path = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, filename);
	if (path.exists()) {
		//console.log("*** returning cached version");
		return path.nativePath;
	} else {
		//console.log("*** creating new file: " + path.nativePath);
		var blob = getIconAsBlob(color, iconname, size, options);
		console.log(blob.apiName);
		if (Ti.Android) {
			// this is a workaround for Android because toImage() does not return a blob on Android
			// https://jira.appcelerator.org/browse/TIMOB-3268
			// Android toImage() returns a dictionary (with width, height, x, y, cropRect and media)
			path.write(blob.media);
		} else {
			path.write(blob);
		}
		return path.nativePath;
	}
};


exports.getIconAsText = getIconAsText;
exports.getIcon = getIcon;