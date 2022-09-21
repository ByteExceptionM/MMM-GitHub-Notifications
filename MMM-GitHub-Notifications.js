Module.register('MMM-GitHub-Notifications', {
    data: null,

    defaults: {
        updateInterval: 10 * 60 * 1000,
        maxNotifications: 1,
        autoHide: false
    },

    start: function () {
        this.getJson();
        this.scheduleUpdate();
    },

    scheduleUpdate: function () {
        var self = this;

        setInterval(function () {
            self.getJson();
        }, this.config.updateInterval);
    },

    getJson: function () {
        this.sendSocketNotification('MMM-GitHub-Notifications_GET', this.config);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'MMM-GitHub-Notifications_RESULT') {
            this.data = payload.data;
            this.updateDom(500);

            console.log(this.data);
        }
    }

});