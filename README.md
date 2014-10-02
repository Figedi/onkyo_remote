onkyo_remote
============

Onkyo Remote is a dashboard widget which can be used to control your receiver over the ethernet from your dashboard.
There is a built in binary `onkyo` from https://github.com/miracle2k/onkyo-eiscp . If that doesn't work, you have to compile
for your system from scratch
Other than that you should be fine.

Install
-------

Install the widget by simply double-clicking it, then add it to your dashboard with the `+` icon.

Reference
-------

For a current command reference, review http://blog.siewert.net/files/ISCP%20AV%20Receiver%20v124-1.xls

Development
-------

Dependencies:
* node, npm, gulp (globally)
* Run `npm install` from root for npm modules
* Run `bower install` from root for client dependencies

For development, use `gulp` to utilize a browsersync-environment

Build Version
-------

Use `gulp build` for default building process. Additionally you can pass
the `--wversion` flag for a custom version output number

Contribute
----------

If you want to contribute, simply fork the project and make a pull request


