'use strict';

var _ = require('lodash'),
    config = require('../../config').Config,
    db = require('../wrapper'),

    explodeMessages = function (results) {
        var words = [];
        _.each(results, function (result) {
            words = words.concat(result.message.split(' '));
        });
        return words;
    };

exports.getTicketWords = function (req, res) {
    db.getAll('ticket').sortBy('createdAt:desc').from(config.db.index)
        .then(function (result) {
            var words = explodeMessages(result);
            res.json({'results': words});
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

exports.getTickets = function (req, res) {
    var start = 0,
        limit = 100,
        page = 1;

    if (req.query.page) {
        page = parseInt(req.query.page, 10);
    }

    if (req.query.limit) {
        limit = parseInt(req.query.limit, 10);
    }

    start = (page - 1) * limit;

    db.query('retroId:' + req.params.retroId).start(start).sortBy('createdAt:desc').size(limit + 1).of('ticket').from(config.db.index)
        .then(function (result) {

            var links = {
                self: '/retrospectives/' + req.params.retroId + '/tickets/?page=' + page + '&limit=' + limit,
                find: {
                    href: '/retrospectives/' + req.params.retroId + '/tickets{?id}',
                    templated: true
                }
            };

            if (page - 1) {
                links.previous = '/retrospectives/' + req.params.retroId + '/tickets/?page=' + (page - 1) + '&limit=' + limit;
            }

            if(result.length > limit) {
                links.next = '/retrospectives/' + req.params.retroId + '/tickets/?page=' + (page + 1) + '&limit=' + limit;
                result.pop();
            }

            var tickets = {};
            _.each(result, function(ticket, index) {
                tickets[index] = {
                    data: ticket,
                    links: {
                        self: '/retrospectives/' + ticket.retroId + '/tickets/' + ticket.id
                    }
                };
                if (result[index-1]) {
                    var previous = result[index-1];
                    tickets[index].links.previous = '/retrospectives/' + previous.retroId + '/tickets/' + previous.id;
                }
                if (result[index+1]) {
                    var next = result[index+1];
                    tickets[index].links.next = '/retrospectives/' + next.retroId + '/tickets/' + next.id;
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
                    'tickets': tickets
                }
            });
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

exports.getTicket = function (req, res) {
    db.query('_id:' + req.params.ticketId).of('ticket').from(config.db.index)
        .then(function (result) {
            res.json(result);
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

exports.deleteTicket = function (req, res) {
    db.delete('ticket').withId(req.params.ticketId).from(config.db.index)
        .then(function (result) {
            console.log(result);
            res.send(204);
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

exports.putTicket = function (req, res) {
    req.body.retroId = req.params.retroId;
    db.put(req.body).ofType('ticket').withId(req.params.ticketId).into(config.db.index)
        .then(function (result) {
            res.json(result);
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};

exports.postTicketToRetrospective = function (req, res) {
    // @TODO: perhaps move retroId into req.body
    //  from the frontend?
    req.body.retroId = req.params.retroId;
    db.post(req.body).ofType('ticket').into(config.db.index)
        .then(function (result) {
            res.json(result);
        })
        .fail(function (err) {
            console.log(err);
            res.json(err);
        });
};
