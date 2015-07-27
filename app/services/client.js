var request = require('request');
var mongoose = require('mongoose');
var FileCookieStore = require('tough-cookie-filestore');
var path = require('path');
var loginConfig = require('../../config/login.json');
var jar = request.jar(new FileCookieStore(path.join(__dirname, '../../config/cookies.json')));
var Task = mongoose.model('Task');
request = request.defaults({jar: jar});

var Client = {
    token: null,
    login: login,
    getToken: getToken,
    runTask: runTask
};

module.exports = Client;

var userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/43.0.2357.130 Chrome/43.0.2357.130 Safari/537.36';
var origin = 'http://asylamba.com';

/**
 * Login and update token.
 * @param {Function} callback
 */
function login(callback) {
    request.post({
        url: 'http://asylamba.com/action/a-connect',
        form: {
            'data-browser': '{}',
            email: loginConfig.email,
            password: loginConfig.password,
            'stay-connected': 'on'
        },
        headers: {
            'User-Agent': userAgent,
            Origin: origin,
            Referer: 'http://asylamba.com/connexion'
        }
    }, function (err, httpResponse, body) {
        if(err) {
            return callback(err);
        }

        getToken(callback);
    });
}

/**
 * Update token
 * @param {Function} callback
 */
function getToken(callback) {
    request.get({
        url: 'http://asylamba.com/action/a-serverconnection/server-7?',
        headers: {
            'User-Agent': userAgent,
            Origin: origin,
            Referer: 'http://asylamba.com/serveurs'
        }
    }, function (err, httpResponse, body) {
        if(err) {
            return callback(err);
        }

        Client.token = body.match(/href="[^"]+token-([^"]+)"/i)[1];

        if (typeof callback === "function") {
            callback();
        }
    });
}

/**
 * Run a Task
 * @param {ObjectId} taskId
 * @param {Function} callback - Called when finished, with first param as error if any
 * @param {Number} [maxRetry=3]
 */
function runTask(taskId, callback, maxRetry) {
    Task.findById(taskId, function(err, task) {
        if(err) {
            return callback(err);
        }

        console.log('>> Running task ' + task._id);

        // Start by login in
        login(function() {
            // Build URL based on params
            var params = task.params
                .map(function(param) {
                    if('token' === param.name) {
                        param.value = Client.token;
                    }

                    return param.name + '-' + param.value;
                })
                .join('/');

            var query = {
                url: 'http://game.asylamba.com/s7/action/' + params,
                headers: {
                    'User-Agent': userAgent,
                    'Host': 'game.asylamba.com'
                }
            };

            if(task.referer) {
                query.headers.Referer = task.referer;
            }

            if('post' === task.method) {
                query.form = task.post_data
            }

            // Run query
            request[task.method](query, function(err, httpResponse, body) {
                if(err) {
                    return callback(err);
                }

                var response = body.match(/<ul id="alert">[^<]*<li[^>]+data-content="([^"]+)"/i);

                // Error
                if (null === response) {

                    console.log("/!\\ Login failed");

                    maxRetry = maxRetry || 3;

                    if(--maxRetry) {
                        return runTask(task._id, callback, maxRetry);
                    }

                    callback('Could not login 3 times in a row, task aborted.');
                }

                // Success
                else {
                    response = response[1];

                    console.log("Task completed : " + response);

                    task.repeated++;
                    task.responses.push(response);
                    task.save(function (err) {
                        if (err) {
                            return callback(err);
                        }

                        callback();
                    });
                }
            });
        });
    })
}