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