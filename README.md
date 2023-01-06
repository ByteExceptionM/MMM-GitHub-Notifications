# MMM-GitHub-Notifications
[MagicMirror](https://github.com/MichMich/MagicMirror) Module which creates a table with intractable unread GitHub notifications.


## Installation
1. Clone this repository inside your MagicMirror's `modules` folder

   `cd ~/MagicMirror/modules`

   `git clone https://github.com/ByteExceptionM/MMM-GitHub-Notifications`.


## Config
You can add the following options to the `config.js` file:


| Option             | Description
|--------------------|-----------
| `authToken`        | The GitHub authentication token for the requests.<br><br>**Type:** `string` <br>Required: `true`
| `updateInterval`   | Interval of updating notifications.<br><br>**Type:** `int`(milliseconds) <br>Default: `60.000 milliseconds`
| `maxContentLength` | Maximum length of notification content.<br><br>**Type:** `int` <br>Default: `30`
| `maxNotifications` | Maximum of shown notifications.<br><br>**Type:** `int` <br>Default: `5`<br>Max: `20`


Here is an example of an entry in `config.js`
```
{
	module: "MMM-GitHub-Notifications",
	position: "top_center",
	config: {
		authToken: "GITHUB AUTH TOKEN",
	}
},
```
