'use strict';

var _ = require('lodash'),
    config = require('../../config').Config,
    db = require('../wrapper'),
    paginator = require('../lib/paginator'),

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
    var parameters = paginator.getParameters(req);

    db.query('retroId:' + req.params.retroId).start(parameters.start).sortBy('createdAt:desc').size(parameters.limit + 1).of('ticket').from(config.db.index)
        .then(function (result) {
            var links = {
                self: '/retrospectives/' + req.params.retroId + '/tickets/?page=' + parameters.page + '&limit=' + parameters.limit,
                find: {
                    href: '/retrospectives/' + req.params.retroId + '/tickets{?id}',
                    templated: true
                }
            },
            tickets = [];

            if (parameters.page - 1) {
                links.previous = '/retrospectives/' + req.params.retroId + '/tickets/?page=' + (parameters.page - 1) + '&limit=' + parameters.limit;
            }

            if(result.length > parameters.limit) {
                links.next = '/retrospectives/' + req.params.retroId + '/tickets/?page=' + (parameters.page + 1) + '&limit=' + parameters.limit;
                result.pop();
            }

            result.forEach(function(ticket, index) {
                var links = {
                    self: paginator.getItemLink('ticket', ticket)
                };

                if (result[index-1]) {
                    links.previous = paginator.getItemLink('ticket', result[index - 1]);
                }

                if (result[index+1]) {
                    links.next = paginator.getItemLink('ticket', result[index + 1]);
                }

                tickets.push({
                    data: ticket,
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
