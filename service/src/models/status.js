'use strict';

var db = require('../wrapper');

exports.ping = function (req, res) {
    db.ping()
        .then(function(status) {
            res.json({'result': status});
        })
        .fail(function (err) {
            res.json({'result': err});
        });
};
