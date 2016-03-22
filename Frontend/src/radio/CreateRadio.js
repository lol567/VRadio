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
