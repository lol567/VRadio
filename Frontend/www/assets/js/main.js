(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Nazar on 19.03.2016.
 */

var API_URL = "http://localhost:5050";

function backendGet(url, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'GET',
        success: function(data){
            callback(null, data);
        },
        fail: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

function backendPost(url, data, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'POST',
        contentType : 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            callback(null, data);
        },
        fail: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

exports.getRadioList = function(callback) {
    backendGet("/api/get-radio-list/", callback);
};

exports.createRadio = function(info, callback) {
    backendPost("/api/create-radio/", info, callback);
};

exports.createUser = function(info, callback) {
    backendPost("/api/create-user/", info, callback);
};

exports.postNewOnlineRadio = function(info, callback){
    backendPost("/api/new-radio-online/", info, callback);
};

exports.getOnlineRadio = function(callback){
    backendGet("/api/get-radio-online/", callback);
};
},{}],2:[function(require,module,exports){
$(function () {
    var client,
        recorder,
        context,
        bStream,
        contextSampleRate = (new AudioContext()).sampleRate;
    resampleRate = 8000,
        worker = new Worker('assets/js/worker/resampler-worker.js');

    worker.postMessage({cmd:"init",from:contextSampleRate,to:resampleRate});

    worker.addEventListener('message', function (e) {
        if (bStream && bStream.writable)
            bStream.write(convertFloat32ToInt16(e.data.buffer));
    }, false);

    $("#start-rec-btn").click(function () {
        client = new BinaryClient('ws://localhost:9001');
        client.on('open', function () {
            bStream = client.createStream({sampleRate: resampleRate});
        });

        if (context) {
            recorder.connect(context.destination);
            return;
        }

        var session = {
            audio: true,
            video: false
        };


        navigator.getUserMedia(session, function (stream) {
            context = new AudioContext();
            var audioInput = context.createMediaStreamSource(stream);
            var bufferSize = 0; // let implementation decide

            recorder = context.createScriptProcessor(bufferSize, 1, 1);

            recorder.onaudioprocess = onAudio;

            audioInput.connect(recorder);

            recorder.connect(context.destination);

        }, function (e) {

        });
    });

    function onAudio(e) {
        var left = e.inputBuffer.getChannelData(0);

        worker.postMessage({cmd: "resample", buffer: left});

        drawBuffer(left);
    }

    function convertFloat32ToInt16(buffer) {
        var l = buffer.length;
        var buf = new Int16Array(l);
        while (l--) {
            buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
        }
        return buf.buffer;
    }

    //https://github.com/cwilso/Audio-Buffer-Draw/blob/master/js/audiodisplay.js
    function drawBuffer(data) {
        var canvas = document.getElementById("canvas"),
            width = canvas.width,
            height = canvas.height,
            context = canvas.getContext('2d');

        context.clearRect (0, 0, width, height);
        var step = Math.ceil(data.length / width);
        var amp = height / 2;
        for (var i = 0; i < width; i++) {
            var min = 1.0;
            var max = -1.0;
            for (var j = 0; j < step; j++) {
                var datum = data[(i * step) + j];
                if (datum < min)
                    min = datum;
                if (datum > max)
                    max = datum;
            }
            context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
        }
    }

    $("#stop-rec-btn").click(function () {
        recorder.disconnect();
        client.close();
    });
});

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
},{}],3:[function(require,module,exports){
$(function(){
    //This code will execute when the page is ready
    var API = require('./API');
    var Player = require('./radio/Player');
    var vk = require('./vk');
    var air = require('./air');
    var create = require('./radio/CreateRadio');
});
},{"./API":1,"./air":2,"./radio/CreateRadio":4,"./radio/Player":5,"./vk":6}],4:[function(require,module,exports){
/**
 * Created by Nazar on 20.03.2016.
 */

/**
 * Created by Nazar on 15.02.2016.
 */
var nameValidate = false;
var styleValidate = false;
var descriptionValidate = false;
var imgValidate = false;

var API = require('../API');

$('#inputName').keyup(function(){
    var name = $('#inputName').val();
    if (!isStringWithLetter(name)||name=='') {
        $('.name-help-block').css("display", "inline");
        $('.name-group').addClass('has-error');
        $('.name-help-block').addClass('danger');
        nameValidate = false;
    }else{
        $('.name-group').removeClass('has-error');
        $('.name-group').addClass('has-success');
        $('.name-help-block').css("display", "none");
        nameValidate = true;
    }
});

$('#inputStyle').keyup(function(){
    var style = $('#inputStyle').val();
    if (!isStringWithLetter(style)||style=='') {
        $('.style-help-block').css("display", "inline");
        $('.style-group').addClass('has-error');
        $('.style-help-block').addClass('danger');
        styleValidate = false;
    }else{
        $('.style-group').removeClass('has-error');
        $('.style-group').addClass('has-success');
        $('.style-help-block').css("display", "none");
        styleValidate = true;
    }

});

$('#inputDescription').keyup(function(){
    var description = $('#inputDescription').val();
    if (description=='') {
        $('.description-help-block').css("display", "inline");
        $('.description-group').addClass('has-error');
        $('.description-help-block').addClass('danger');
        descriptionValidate = false;
    }else{
        $('.description-group').removeClass('has-error');
        $('.description-group').addClass('has-success');
        $('.description-help-block').css("display", "none");
        descriptionValidate = true;
    }
});

$('#inputImg').change(function(){
    var img = $('#inputImg').value;
    // TODO upload img
    if (img=='') {
        $('.img-help-block').css("display", "inline");
        $('.img-group').addClass('has-error');
        $('.img-help-block').addClass('danger');
        imgValidate = false;
    }else{
        $('.img-group').removeClass('has-error');
        $('.img-group').addClass('has-success');
        $('.img-help-block').css("display", "none");
        imgValidate = true;
    }
});

function isStringWithLetter(str){
    var res = true;
    for(var i= 0; i<str.length; i++){
        if(!isLetter(str.charAt(i))&&str.charAt(i)!=' '){
            res = false;
        }
    }
    return res;
}

function isLetter(ch){
    return ch.toLowerCase() != ch.toUpperCase();
}


$('.next-step-button').click(function(){
    if(nameValidate&&styleValidate&&descriptionValidate&&imgValidate){
        API.createRadio({
            name: $('#inputName').val(),
            style: $('#inputStyle').val(),
            description: $('#inputDescription').val(),
            img: $('#inputImg').val()
        }, function(err, result) {
            if (err) {
                alert("Can't create");
            } else {
                console.log("Radio create");
            }
        });
        window.location = "/";
    }else{
        if(!nameValidate){
            $('.name-help-block').css("display", "inline");
            $('.name-group').addClass('has-error');
            $('.name-help-block').addClass('danger');
        }
        if(!styleValidate){
            $('.style-help-block').css("display", "inline");
            $('.style-group').addClass('has-error');
            $('.style-help-block').addClass('danger');
        }
        if(!descriptionValidate){
            $('.description-help-block').css("display", "inline");
            $('.description-group').addClass('has-error');
            $('.description-help-block').addClass('danger');
        }
        if(!imgValidate){
            $('.img-help-block').css("display", "inline");
            $('.img-group').addClass('has-error');
            $('.img-help-block').addClass('danger');
        }
    }
});

},{"../API":1}],5:[function(require,module,exports){
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

},{"../API":1}],6:[function(require,module,exports){
/**
 * Created by Nazar on 02.03.2016.
 */
var Player = require('./radio/Player');
var API = require('./API');

VK.init({
    apiId: 5141500
});

function authInfo(response){
    if (response.session) {
        VK.api('audio.get',{audio: response.session.mid},function(data) {
            if (data.response) {
                $.each( data.response, function( index, value ){
                    $('#playlist').append('<li song="'+value.title+'" artist="'+value.artist+'" url="'+value.url+'">'+value.title+'</li>');;
                });
                Player.init();
            }else{
                console.log('error');

            }
        });
        VK.api('users.get',{user_ids: response.session.mid},function(data) {

            /*API.createUser({
                name: data.response[0].first_name + ' ' + data.response[0].last_name,
                id: data.response[0].uid,
                admin: false,
                created_at: new Date().toGMTString()
            }, function (err, result) {
                if (err) {
                    alert("Can't create user");
                } else {
                    console.log('user created');
                }
            });*/
        });
    } else {
        alert('not auth');
    }

}

function getUserInfo(response){
    if (response.session) {
        console.log(response);
    }else{
        console.log('error');
    }
}

VK.UI.button('login_button');

$('#login_button').click(function(){
    VK.Auth.login(authInfo, 8);
    $('.login').hide();
});
},{"./API":1,"./radio/Player":5}]},{},[3]);
