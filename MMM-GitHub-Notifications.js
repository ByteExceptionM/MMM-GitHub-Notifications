Module.register('MMM-GitHub-Notifications', {
    notifications: [],

    defaults: {
        updateInterval: 10 * 60 * 1000,
        maxNotifications: 5,
        autoHide: false
    },

    start: function () {
        this.getNotifications();
        this.scheduleUpdate();
    },

    scheduleUpdate: function () {
        var self = this;

        setInterval(function () { self.getNotifications() }, this.config.updateInterval);
    },

    getNotifications: function () {
        this.sendSocketNotification('MMM-GitHub-Notifications_GET', { config: this.config });
    },

    getStyles: function () {
        return ['./MMM-GitHub-Notifications.css'];
    },

    getHeader: function () {
        return 'GitHub Notifications';
    },

    getDom: function () {
        var table = document.createElement('table');
        table.classList.add('notificationsTable');

        if (this.notifications.length == 0) {
            if (this.config.autoHide) {
                table.classList.add('hidden');
                return table;
            }

            var row = document.createElement('tr');
            table.append(row);

            var cell = document.createElement('td');
            row.append(cell);
            cell.append(document.createTextNode('No new notifications'));
            cell.setAttribute('colspan', '4');

            return table;
        }

        this.notifications.forEach(element => {
            var row = this.getTableRow(element);
            table.appendChild(row);
        });

        return table;
    },

    getTableRow: function (notification) {
        var self = this;

        var row = document.createElement('tr');

        var title = notification.title;

        if (title.length > 30)
            title = notification.title.substring(0, 30).trim() + '...';

        var titleNode = document.createElement('td');
        titleNode.append(document.createTextNode(title));
        titleNode.classList.add('colTitle');

        var repoNode = document.createElement('td');
        repoNode.append(document.createTextNode(notification.repository))

        row.append(titleNode);
        row.append(repoNode);

        row.addEventListener('click', function () {
            self.sendSocketNotification('MMM-GitHub-Notifications_READ', {
                config: self.config,
                notificationId: notification.id
            });
        });

        return row;
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'MMM-GitHub-Notifications_RESULT') {
            this.notifications.pop();
            this.notifications = payload.data;
            this.updateDom();
        }
    }

});