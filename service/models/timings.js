var _ = require('lodash'),
    db = require('../wrapper');

exports.getTimings = function (req, res) {
    var start = 0;
    if (!_.isUndefined(req.params.start)) {
        start = req.params.start;
    }
    db.getAll('timing').sortBy('createdAt:desc').start(start).from('statistics')
        .then(function (result) {
            res.json({'results': result, 'total': result.total});
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

exports.postTiming = function (req, res) {
    db.post(req.body).ofType('timing').into('statistics')
        .then(function (result) {
            res.json(result);
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

