'use strict';

var db = require('../wrapper');

exports.ping = function (req, res) {
    db.ping()
        .then(function(state) {
            res.json({'result': state});
        })
        .fail(function (err) {
            res.json({'result': err});
        });
};
