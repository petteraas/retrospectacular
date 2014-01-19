var db = require('../wrapper'),
    q = require('q'),

    handleError = function (err) {
        console.log(err);
    },

    handleDbExists = function (exists) {
        if (exists) {
            console.log('db exists, deleting it');
            return db.destroyIndex('statistics');
        }
    },

    createDb = function () {
        console.log('creating new db');
        return db.createIndex('statistics');
    },

    postRetrospective = function () {
        var defer = q.defer();

        console.log('posting statistics');

        db.post({'name': 'Sprint 1'}).ofType('retrospective').into('retrospectives')
            .then(function (result) {
                console.log(result);
                defer.resolve(result);
            })
            .fail(function (err) {
                defer.reject(err);
            });

        return defer.promise;
    },

    postTickets = function (retrospective) {
        var promises = [];

        console.log('posting tickets');

        tickets.forEach(function (ticket) {
            var defer = q.defer();

            ticket.retroId = retrospective.id;

            db.post(ticket).ofType('ticket').into('retrospectives')
                .then(function (result) {
                    defer.resolve(result);
                })
                .fail(function (err) {
                    defer.reject(err);
                });
        });

        return q.all(promises);
    };

db.checkIndexExists('statistics')
    .then(handleDbExists)
    .then(createDb)
    //.then(postRetrospective)
    //.then(postTickets)
    .fail(handleError);
