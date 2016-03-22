/**
 * Created by Nazar on 29.02.2016.
 */
var audio;
var API = require('../API');

//Hide Pause Initially
$('#pause').hide();

function init(){
    initAudio($('#playlist li:first-child'));
    choose_list();
}


function initAudio(element){
    var title = element.text();
    var artist = element.attr('artist');
    var url = element.attr('url');
    //Create a New Audio Object
    audio = new Audio(url);

    if(!audio.currentTime){
        $('#duration').html('0.00');
    }
    $('#audio-player .title').text(title);
    $('#audio-player .artist').text(artist);

    $('#playlist li').removeClass('active');
    element.addClass('active');
}

//Play Button
$('#play').click(function(){
    audio.play();
    console.log(audio);
    /*API.postNewOnlineRadio({
        name:'test',
        list:'',
        currentMusic:''+audio.src,
        date:new Date().toGMTString()
    }, function(err, result) {
        if (err) {
            alert("Can't post");
        } else {
            console.log("Radio online create");
        }
    });*/
    $('#play').hide();
    $('#pause').show();
    $('#duration').fadeIn(400);
    showDuration();
});

//Pause Button
$('#pause').click(function(){
    audio.pause();
    $('#pause').hide();
    $('#play').show();
});

$('#pause-online').hide();

$('#play-online').click(function(){

});

$('#pause-online').click(function(){
    $('#pause-online').hide();
    $('#play-online').show();
});

//Next Button
$('#next').click(function(){
    next();
});

function next(){
    var audio_volume = audio.volume;
    audio.pause();
    var next = $('#playlist li.active').next();
    if (next.length == 0) {
        next = $('#playlist li:first-child');
    }
    initAudio(next);
    $('#play').hide();
    $('#pause').show();
    audio.play();
    audio.volume = audio_volume;
    showDuration();
}

//Prev Button
$('#prev').click(function(){
    var audio_volume = audio.volume;
    audio.pause();
    var prev = $('#playlist li.active').prev();
    if (prev.length == 0) {
        prev = $('#playlist li:last-child');
    }
    $('#play').hide();
    $('#pause').show();
    initAudio(prev);
    audio.play();
    audio.volume = audio_volume;
    showDuration();
});

//Volume Control
$('#volume').change(function(){
    audio.volume = parseFloat(this.value / 10);
});

function choose_list() {
    $('#playlist li').click(function () {
        var audio_volume = audio.volume;
        audio.pause();
        initAudio($(this));
        $('#play').hide();
        $('#pause').show();
        $('#duration').fadeIn(400);
        audio.play();
        audio.volume = audio_volume;
        showDuration();
    });
}

//Time Duration
function showDuration() {
    $(audio).bind('ended', function () {
       next();
    });
    $(audio).bind('timeupdate', function () {
        //Get hours and minutes
        var s = parseInt(audio.currentTime % 60);
        var m = parseInt((audio.currentTime / 60) % 60);
        //Add 0 if seconds less than 10
        if (s < 10) {
            s = '0' + s;
        }
        $('#duration').html(m + '.' + s);
        var value = 0;
        if (audio.currentTime > 0) {
            value = Math.floor((100 / audio.duration) * audio.currentTime);
        }
        $('#progress').css('width', value + '%');

    });
}

exports.init=init;
