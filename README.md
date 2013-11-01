onkyo_remote
============

Onkyo Remote is a dashboard widget which can be used to control your receiver over the ethernet from your dashboard.
It requires you to have installed `octl` (see https://github.com/janten/onkyo-eiscp-remote-mac and compile from scratch).
Other than that you should be fine.

Install
-------

Install the widget by simply double-clicking it, then add it to your dashboard with the `+` icon.

Compile
-------

To compile a new version of the widget, either copy the files manually to the base widget (Onyko Remote.wdgt)
or use the small script `make_widget', you can pass aditional parameters to the script.

### Usage:

`./make_widget [-h] [-f] [-v] arg [-o] arg [-n] arg`

### Options:
```
-h   Display this help message and exit.
-f   Force overwrite of existing widgets, defaults to false.
-v   Specify version, defaults to "0.1", affects release folder.
-o   Change Output-Folder (defaults to "./releases/0.1/").
-n   Change Widget-Name (defaults to "Onkyo Remote").
```

Contribute
----------

If you want to contribute, simply fork the project and make a pull request


