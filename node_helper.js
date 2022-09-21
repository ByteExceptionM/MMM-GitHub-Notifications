var NodeHelper = require('node_helper');
var axios = require('axios');

module.exports = NodeHelper.create({
    start: function () {
        console.log('MMM-GitHub-Notifications helper started...');
    },

    getNotifications: function (config) {
        var self = this;

        var headers = {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: 'Bearer ' + config.authToken
            }
        }

        axios
            .get('https://api.github.com/notifications?participating=true&per_page=' + Math.max(config.maxNotifications, 15), headers).then((response) => {
                var notifications = [];

                response.data.forEach(element => {
                    notifications.push({
                        title: element.subject.title,
                        type: element.subject.type,
                        reason: element.reason,
                        repository: element.repository.name
                    });
                });

                notifications.forEach(element => {
                    console.log(element);
                });

                self.sendSocketNotification('MMM-GitHub-Notifications_RESULT', {
                    data: notifications
                });
            })
            .catch((exc) => {
                console.error('[MMM-GitHub-Notifications] Error occurred : ' + exc)
            });
    },

    updateNotificationLastReadTime: function (config) {
        var self = this;

        var headers = {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: 'Bearer ' + config.authToken
            }
        }

        var requestBody = {
            last_read_at: new Date().toISOString,
            read: true
        }

        axios
            .put('https://api.github.com/notifications', JSON.stringify(requestBody), headers).then((response) => {
                console.log(response);

                self.getNotifications(config);
            })
            .catch((exc) => {
                console.error('[MMM-GitHub-Notifications] Error occurred : ' + exc)
            });

    },

    socketNotificationReceived: function (notification, config) {
        if (notification === 'MMM-GitHub-Notifications_GET') {
            this.getNotifications(config);
        }
    }

});