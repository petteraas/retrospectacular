'use strict';

exports.getParameters = function(req) {
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
    start = (page -1) * limit;

    return {
        start: start,
        page: page,
        limit: limit
    }
};
