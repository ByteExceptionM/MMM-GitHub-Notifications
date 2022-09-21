var NodeHelper = require('node_helper');
var axios = require('axios');

var notifications = [];

module.exports = NodeHelper.create({
    start: function () {
        console.log('MMM-GitHub-Notifications helper started...');
    },

    getNotifications: function (config) {
        var headers = {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: 'Bearer ' + config.authToken
            }
        }

        axios
            .get('https://api.github.com/notifications?participating=true&per_page=' + Math.min(config.maxNotifications, 20), headers)
            .then((response) => {
                notifications = [];

                response.data.forEach(element => {
                    notifications.push({
                        id: element.id,
                        title: element.subject.title,
                        type: element.subject.type,
                        reason: element.reason,
                        repository: element.repository.name,
                        date: element.updated_at
                    });
                });

                this.sendSocketNotification('MMM-GitHub-Notifications_RESULT', { data: notifications });
            })
            .catch((exc) => console.error('[MMM-GitHub-Notifications] Error occurred : ' + exc));
    },

    markNotificationAsRead: function (config, notificationId) {
        var headers = {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: 'Bearer ' + config.authToken
            }
        }

        axios
            .patch('https://api.github.com/notifications/threads/' + notificationId, null, headers)
            .then((response) => this.getNotifications(config))
            .catch((exc) => console.error('[MMM-GitHub-Notifications] Error occurred : ' + exc));
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'MMM-GitHub-Notifications_GET') {
            this.getNotifications(payload.config);
        } else if (notification === 'MMM-GitHub-Notifications_READ') {
            this.markNotificationAsRead(payload.config, payload.notificationId);
        }
    }

});