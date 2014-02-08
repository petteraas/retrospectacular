'use strict';

var config = require('../../config').Config,
    db = require('../wrapper');

exports.getRetrospective = function (req, res) {
    db.query('_id:' + req.params.retroId).of('retrospective').from(config.db.index)
        .then(function (result) {
            res.json(result[0]);
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

exports.getRetrospectives = function (req, res) {
    var start = 0,
        limit = 10,
        page = 1;

    if (req.query.page) {
        page = parseInt(req.query.page, 10);
    }

    if (req.query.limit) {
        limit = parseInt(req.query.limit, 10);
    }

    // page is a human readable iterator
    // start is for the machines
    start = (page - 1) * limit;

    db.getAll('retrospective').sortBy('createdAt:desc').start(start).size(limit + 1).from(config.db.index)
        .then(function (result) {
            var links = {
                self : '/retrospectives?page=' + page + '&limit=' + limit,
                find : { href: '/retrospectives{?id}', templated: true }
            },
            retrospectives = {};

            if ( page - 1) {
                links.previous = '/retrospectives?page=' + (page - 1) + '&limit=' + limit;
            }

            if (result.length > limit) {
                links.next = '/retrospectives?page=' + (page + 1) + '&limit=' + limit;
            }

           _.each(result, function(retrospective, index) {
               retrospectives[index] = {
                   data: retrospective,
                   links: {
                       self: '/retrospectives/' + retrospective.id
                   }
               };
               if (result[index-1]) {
                retrospectives[index].links.previous = '/retrospectives/' + result[index-1].id;
               }
               if (result[index+1]) {
                   retrospectives[index].links.next = '/retrospectives/' + result[index+1].id;
               }
           });

           res.hal({
               data: {
                    total: result.total,
                    page: page,
                    limit: limit
               },
               links: links,
               embeds: {
                'retrospectives': retrospectives
               }
           });
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

exports.postRetrospective = function (req, res) {
    db.post(req.body).ofType('retrospective').into(config.db.index)
        .then(function (result) {
            res.json(result);
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

exports.putRetrospective = function (req, res) {
    db.put(req.body).ofType('retrospective').withId(req.params.retroId).into(config.db.index)
        .then(function (result) {
            res.json(result);
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

exports.deleteRetrospective = function (req, res) {
    db.delete('retrospective').withId(req.params.retroId).from(config.db.index)
        .then(function (result) {
            res.json(result);
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};
