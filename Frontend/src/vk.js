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