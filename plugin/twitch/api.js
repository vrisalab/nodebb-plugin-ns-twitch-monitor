/**
 * Created by Nicolas on 6/21/15.
 */
(function (Api) {
    'use strict';

    var _            = require('lodash'),
        async        = require('async'),
        objectAssign = require('object-assign'),
        request      = require('request'),

        settings     = require('../settings');

    var baseUrl     = 'https://api.twitch.tv/helix',
        apiVersion3 = 'application/vnd.twitchtv.v3+json';
    var apiVersion5 = 'application/vnd.twitchtv.v5+json';

    function createRequest(data, callback) {
        var path  = data.path,
            query = data.query,
            force = data.force;

        async.waterfall([
            async.apply(settings.get),
            function (settingsData, next) {
                if (_.isEmpty(settingsData.clientId) && !force) {
                    return next(new Error('Client ID is empty'));
                }

                next(null, {
                    url    : [baseUrl, path].join('/'),
                    method : 'GET',
                    qs     : query,
                    json   : true,
                    headers: {
                        //'Accept'   : apiVersion5,
                        'Client-ID': data.clientId || settingsData.clientId,
                        'Authorization': data.token || settingsData.token

                    }
                });
            },
            function (options, next) {
                request(options, function (error, response, body) {
                    if (error) {
                        return next(error);
                    }
                    next(null, {statusCode: response.statusCode, body: body});
                });
            }
        ], function (error, response) {
            if (error) {
                return callback(error);
            }
            callback(null, response);
        });
    }

    Api.getChannel = function (channelName, callback) {
        async.waterfall([
            async.apply(createRequest, {
                path: 'users?login=' + channelName,
                force: false
            }),
            function (response, next) {
                if (!response.body.data[0]) {
                    return next(null, {statusCode: 404});
                }
                var id = transform(response, transformEntity).data.id;
                createRequest({
                    path: 'users?id=' + id,
                    force: false
                }, next);
            },
            function (response, next) {
                return next(null, transform(response, transformEntity));
            }
        ], callback);
    };

    Api.getStreams = function (channels, done) {
        var query = "limit=100";
        for (let i = 0; i < channels.length; i++)
            query = query + "&user_id=" + channels[i];
        async.waterfall([
            async.apply(createRequest, {
                path : 'streams?' + query,
                query: {},
                force: false
            }),
            function (response, callback) {
                // Fix issue with Twitch API inconsistency
                // In some cases, `streams` will not be available, where it should be an empty array
                if (typeof response.body['data'] == 'undefined' || response.body['data'][0]) {
                    callback(null, response);
                } else {
                    callback(new Error('Streams are not available. Value: ' + response.body['data']));
                }
            },
            function (response, callback) {
                return callback(null, transform(response, function (payload) {
                    var streams = [], stream;
                    payload['data'].forEach(function (payloadStream) {
                        stream = transformEntityStream(payloadStream);
                        stream.channel = {name: stream.user_id};
                        streams.push(stream);
                    });
                    return streams;
                }))
            }
        ], done);
    };

    Api.validateClientId = function (clientId, callback) {
        createRequest({
            path    : '',
            clientId: clientId,
            force   : true
        }, callback);
    };

    function transform(incomingMessage, implementation) {
        var result = {
            statusCode: incomingMessage.statusCode,
            data      : {}
        };

        // Apply transformation only if OK response
        if (incomingMessage.statusCode === 200) {
            result.data = implementation(incomingMessage.body);
        }

        return result;
    }

    function transformEntity(data) {
        return objectAssign({}, {'twitch_id': data['data'][0]['id']}, _.omit(data['data'][0], ['_id', '_links']));
        cons
    }


    function transformEntityStream(data) {
        return objectAssign({}, {'twitch_id': data['user_id']}, _.omit(data, ['_id', '_links']));
    }

})(module.exports);
