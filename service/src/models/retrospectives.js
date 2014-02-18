'use strict';

var config = require('../../config').Config,
    db = require('../wrapper'),
    paginator = require('../lib/paginator');

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
    var parameters = paginator.getParameters(req);

    db.getAll('retrospective').sortBy('createdAt:desc').start(parameters.start).size(parameters.limit + 1).from(config.db.index)
        .then(function (result) {
            var links = paginator.getBulkLinks('/retrospectives', parameters, result),
            retrospectives = [];

            if (links.next) {
                result.pop();
            }

            result.forEach(function(retrospective, index) {
                var links = {
                    self: paginator.getItemLink('retrospective', retrospective)
                };

                if (result[index-1]) {
                    links.previous = paginator.getItemLink('retrospective', result[index - 1]);
                }

                if (result[index + 1]) {
                    links.next = paginator.getItemLink('retrospective', result[index + 1]);
                }

                retrospectives.push({
                    data: retrospective,
                    links: links
                });
            });

            res.hal({
                data: {
                    total: result.total,
                    page: parameters.page,
                    limit: parameters.limit
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
