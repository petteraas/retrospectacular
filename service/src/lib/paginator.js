'use strict';

var getRetroId = function (type, item) {
    if (type==='ticket') {
        return item.retroId;
    } else {
        return item.id;
    }
};

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
    };
};

exports.getItemLink = function (type, item) {
    var link = '/retrospectives',
        retroId = 0;

    if (!item.id) {
        return false;
    }

    retroId = getRetroId(type, item);
    link += '/' + retroId;

    if (type === 'ticket') {
        link += '/tickets/' + item.id;
    }
    return {
        link : link
    };
};

exports.getBulkLinks = function (baseUrl, parameters, results) {
    var links = {
        self: baseUrl + '?page=' + parameters.page + '&limit=' + parameters.limit,
        find: {
            href: baseUrl + '{?id}',
            templated: true
        }
    };

    if (parameters.page - 1) {
        links.previous = baseUrl + '?page=' + (parameters.page - 1) + '&limit=' + parameters.limit;
    }

    if (results.length > parameters.limit) {
        links.next = baseUrl + '?page=' + ( parameters.page + 1) + '&limit=' + parameters.limit;
    }
    return links;
};
