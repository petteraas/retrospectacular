'use strict';

var config = require('../../config').Config,
    db = require('../wrapper'),
    q = require('q');

exports.getUser = function (req, res) {
    db.query('_id:' + req.params.userId).of('user').from(config.db.index)
        .then(function (result) {
            res.json(result[0]);
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

exports.getUserByName = function (name) {
    var defer = q.defer();

    db.query('displayName:' + name).of('user').from(config.db.index)
        .then(function (result) {
            // @FIXME: there must never exist a result[1]
            defer.resolve(result[0]);
        })
        .fail(function (err) {
            defer.reject(err);
        });

        return defer.promise;
};

exports.getUsers = function (req, res) {
    var start = 0,
        limit = 10,
        page = 1;

    if (req.query.page) {
        page = req.query.page;
    }

    if (req.query.limit) {
        limit = req.query.limit;
    }

    // page is a human readable iterator
    // start is for the machines
    start = (page - 1) * limit;

    db.getAll('user').sortBy('createdAt:desc').start(start).size(limit).from(config.db.index)
        .then(function (result) {
            res.json({'results': result, 'total': result.total});
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

exports.postUser = function (req, res) {
    db.post(req.body).ofType('user').into(config.db.index)
        .then(function (result) {
            res.json(result);
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

exports.putUser = function (req, res) {
    db.put(req.body).ofType('user').withId(req.params.userId).into(config.db.index)
        .then(function (result) {
            res.json(result);
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

exports.deleteUser = function (req, res) {
    db.delete('user').withId(req.params.userId).from(config.db.index)
        .then(function (result) {
            res.json(result);
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};
