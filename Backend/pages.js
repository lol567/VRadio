exports.mainPage = function(req, res) {
    res.render('mainPage', {
        pageTitle: 'Radio'
    });
};

exports.air = function(req, res) {
    res.render('air', {
        pageTitle: 'Audio Streamer'
    });
};

exports.online = function(req, res) {
    res.render('online', {
        pageTitle: 'Online Radio'
    });
};

exports.createRadio = function(req, res) {
    res.render('createRadio', {
        pageTitle: 'Create radio'
    });
};