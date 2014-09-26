
/* set detail */
var audiofile = "https://dl.dropboxusercontent.com/s/1i0m628cvnqjhcg/AbdullahZaenKehidupanSetelahKematian.mp3";
var durasi = 6095000, durasi_txt = "101:35";


/* do not change anything from here on. unless you know what you're doing */
var icon = require("icomoonlib");
var the_interval, sound;
$.share.title = icon.getIconAsText("share");
$.playable.title = icon.getIconAsText("play");
$.backward.title = icon.getIconAsText("backward");
$.reset.title = icon.getIconAsText("stop");
$.forward.title = icon.getIconAsText("forward");

$.index.open();

function doShare(){
	var intent = Ti.Android.createIntent({
	    action: Ti.Android.ACTION_SEND,
	    type: "text/plain"
	});
	
	intent.putExtra(Ti.Android.EXTRA_TEXT, "Unduh dan install audiobook "+$.title.text+" oleh "+$.author.text+". Tersedia di Google Playstore untuk Android. Sekarang.");
	intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
    Ti.Android.currentActivity.startActivity(intent);
}

function playstop(e){
	if ($.playable.title == icon.getIconAsText("play")){
		var lastplayed = parseInt(Titanium.App.Properties.getString("lastplayed","0"));
		sound.setTime(lastplayed);
		$.playable.title = icon.getIconAsText("pause");
		sound.play();
	} else {
		clearInterval(the_interval);
		$.playable.title = icon.getIconAsText("play");
		sound.pause();
	}
}

function timeUpdate(){
	var datetime = sound.getTime();
	Titanium.App.Properties.setString("lastplayed",datetime);
	var minutes = Math.floor(datetime/60000);
	var seconds = Math.floor((datetime-minutes*60000)/1000);
	minutes = (minutes < 10) ? "0"+minutes : minutes;
	seconds = (seconds < 10) ? "0"+seconds : seconds;
	$.playing_status.text = minutes+":"+seconds+" / "+durasi_txt;
}

function doStop(){
	clearInterval(the_interval);
	$.playable.title = icon.getIconAsText("play");
	sound.stop();
}
function doBackward(){
	lastplayed = (sound.getTime() < 30000) ? 0 : sound.getTime() - 30000;
	sound.setTime(lastplayed);
}
function doForward(){
	lastplayed = (sound.getTime() > durasi-30000) ? durasi : sound.getTime() + 30000;
	sound.setTime(lastplayed);
}

$.index.addEventListener("open",function(){
	sound = Titanium.Media.createSound({url:audiofile,preload:true,allowBackground:true});
	
	sound.addEventListener("change",function(e){
		e.bubbles = false;
		switch(e.state){
			case 1:
			    $.playing_status.text = "Playing";
			    break;
			case 2:
			    $.playing_status.text = "Paused";
			    break;
			case 3:
			    the_interval = setInterval(timeUpdate,1000);
			    break;
			case 4:
			    $.playing_status.text = "Buffering..";
			    break;
			case 5:
			    $.playing_status.text = "Stopped";
			    break;
			case 6:
			    $.playing_status.text = "Stopping";
			    break;
		}
	});
	
	sound.addEventListener("complete",function(e){
		doStop();
	});

	
});