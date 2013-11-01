######
# Onkyo remote control javascript class, uses octl (thx to https://github.com/janten/onkyo-eiscp-remote-mac!)
# for communication of widget <> receiver
#
# NOTE: octl must be in /usr/local/bin 
#
######
#compile with -bare in coffeescript or window widget doesnt work..apparently

typeIsArray = (value) -> return {}.toString.call( value ) is '[object Array]'
#toastlogger for debugging
window.rlog = (msg, time=3000) ->
	time = if (r = msg.length*100) > 3000 then 3000 else r
	#create el upon last .debug_el

	offset = ($el = $('.debug_msg .debug_el:last')).offset()
	if offset
		bottom = offset.top+2+$el.height() #offset + gap+height = bottom of element
	else 
		bottom = 10 #base

	$new_el = $("<p class='debug_el' style='top: #{bottom}px'>#{msg}</p>")
	$new_el.appendTo('.debug_msg').fadeOut time, -> $(@).remove()

class Remote
	default_options:
		receiver_ip: '192.168.178.26' #currently 192.168.178.26
		receiver_port: 60128
		ORIGINAL_HEIGHT: 2107
		ORIGINAL_WIDTH: 897
		IMG_RATIO: 0.2842809364548495 #for 255x600
		button_coordinates:
			#button: [left, top, x, y]
			#converted to 255x600
			on_off: [38, 41, 30, 31]
			bd_dvd: [35, 86, 36, 20]
			custom: [36, 121, 36, 20]
			receiver: [35, 156, 36, 20]
			tv: [35, 191, 36, 20]
			tv_on_off: [35, 231, 36, 20]
			input: [35, 277, 36, 20]
			cbl_sat: [88, 85, 37, 20]
			aux: [88, 120, 37, 20]
			tv_cd: [88, 156, 37, 20]
			mute_zone1: [88, 191, 37, 20]
			vol_up_zone1: [93, 227, 30, 31]
			vol_down_zone1: [93, 258, 30, 38]
			game: [142, 85, 36, 21]
			am: [142, 120, 36, 21]
			net: [142, 155, 36, 21]
			display: [142, 191, 36, 21]
			ch_disc: [147, 226, 30, 31]
			album: [147, 257, 30, 38]
			source: [200, 40, 30, 31]
			pc: [198, 85, 36, 20]
			fm: [198, 120, 36, 20]
			usb: [198, 156, 36, 20]
			mute_zone2: [198, 191, 36, 20]
			vol_up_zone2: [200, 224, 34, 37]
			vol_down_zone2: [200, 261, 34, 39]
			guide: [46, 322, 23, 24]
			setup: [46, 402, 23, 24]
			arr_left: [77, 348, 25, 60]
			arr_top: [109, 314, 60, 26]
			arr_right: [170, 348, 25, 60]
			arr_bottom: [109, 408, 60, 26]
			enter: [113, 352, 43, 42]
			audio_home: [124, 449, 23, 24]
			return: [201, 402, 23, 24]
			video: [201, 322, 23, 24]


			#original_coordinates for original height
			#1st rows
			# on_off: [101, 110, 107, 110]
			# bd_dvd: [91,271,130,71]
			# custom: [92,398,130,71]
			# receiver: [91,523,130,71]
			# tv: [91,646,130,71]
			# tv_on_off: [91,789,129,70]
			# input: [90,953,129,71]
			# #2nd row
			# cbl_sat: [279,269,131,72]
			# aux: [279,394,131,72]
			# tv_cd: [279,520,131,72]
			# mute_zone1: [279,647,131,72]
			# vol_up_zone1: [296,775,106,110]
			# vol_down_zone1: [296,885,106,135]
			# #3rd row
			# game: [473,268,130,75]
			# am: [473,392,130,75]
			# net: [473,518,130,75]
			# display: [473,645,130,75]
			# ch_disc: [490,773,106,110]
			# album: [490,883,106,135]
			# #4th row
			# source: [678,107,107,110]
			# pc: [670, 269, 129, 73]
			# fm: [670,393, 129, 73]
			# usb: [670, 520, 129, 73]
			# mute_zone2: [670, 645, 129, 73]
			# vol_up_zone2: [679,765,120,133]
			# vol_down_zone2: [679,898,120,138]
			# #menu buttons and arrows
			# guide: [130,1115,83,84]
			# setup: [130,1401,83,84]
			# arr_left: [239,1208,91,213]
			# arr_top: [352,1085,213,93]
			# arr_right: [571,1208,91,213]
			# arr_bottom: [352,1422,213,93]
			# enter: [369,1222,152,151]
			# audio_home: [406,1568,83,84]
			# return: [681,1400,83,84]
			# video: [681,1115,83,84]
			# #other buttons not enabled right now
		translate_char2_eiscp:
			#either string (one way) or array (off/on)
			on_off: ['PWR00', 'PWR01']
			bd_dvd: 'SLI10'
			custom: '' #kA
			receiver: '' #kA
			tv: '' #kA
			tv_on_off: '' #kA
			input: '' #kA
			#2nd row
			cbl_sat: 'SLI01'
			aux: 'SLI03'
			tv_cd: 'SLI23'
			mute_zone1: ['AMT00','AMT01']
			vol_up_zone1: 'MVLUP'
			vol_down_zone1: 'MVLDOWN'
			#3rd row
			game: 'SLI02'
			am: 'SLI25'
			net: 'SLI2B'
			display: 'SLI26'
			ch_disc: '' #kA
			album: '' #kA
			#4th row
			source: ''
			pc: 'SLI05'
			fm: 'SLI24'
			usb: 'SLI2C'
			mute_zone2: ['ZMT00','ZMT01']
			vol_up_zone2: 'ZVLUP'
			vol_down_zone2: 'ZVLDOWN'
			#menu buttons and arrows
			guide: 'OSDMENU'
			setup: 'OSDQUICK'
			arr_left: 'OSDLEFT'
			arr_top: 'OSDUP'
			arr_right: 'OSDRIGHT'
			arr_bottom: 'OSDDOWN'
			enter: 'OSDENTER'
			audio_home: 'OSDHOME'
			return: 'OSDEXIT'
			video: 'OSDVIDEO'
		toggle_button_states: {} #object maintaining the current state of a toggle button, e.g. 'mute_zone1: 1' whereas 1 represents on, 0 off

	constructor: ->
		@default_options.img_width ||= $('.fg img').width()
		@default_options.img_height ||= $('.fg img').height()
		@default_options.IMG_RATIO ||= @default_options.img_width/@default_options.ORIGINAL_WIDTH
		@bindEvents()
		
		#debug
		# @create_boxes()
		# if window.widget
		# 	rlog window.widget
		# 	if window.widget.system
		# 		rlog window.widget.system("/usr/bin/which octl", null).outputString
		# 	else
		# 		rlog "widget.system not defined"
		# else
		# 	rlog "widget not defined"

	create_boxes: => #for debugging the spaces
		r = @default_options.IMG_RATIO
		for k,v of @default_options.button_coordinates
			#v is the array of coordinates
			$('body').append("<div class='testbox' style='left: #{v[0]}px; top: #{v[1]}px; width: #{v[2]}px; height: #{v[3]}px'></div>")
	bindEvents: =>
		($r = $('.fg img')).on 'click', '', { offset: $r.offset() }, @onRemoteClick
		#insert ip and port forms here

	onRemoteClick: (e) =>
		offset = e.data.offset
		x = e.clientX - offset.left + $(window).scrollLeft();
		y = e.clientY - offset.top + $(window).scrollTop();
		r = @default_options.IMG_RATIO
		for button_text, button of @default_options.button_coordinates
			# for resizing, not implemented yet
			# left = (r*button[0]).toFixed(0)
			# top = (r*button[1]).toFixed(0)
			# width = (r*button[0]+r*button[2]).toFixed(0)
			# height = (r*button[1]+r*button[3]).toFixed(0)
			left = button[0]
			top = button[1]
			right = button[0]+button[2]
			bottom = button[1]+button[3]
			#console.log "left: #{left}, top: #{top}, right: #{right}, bottom: #{bottom}, x: #{x}, y: #{y}"

			if left <= x <= right && top <= y <= bottom
				@executeShellCommand(button_text)#
				break
	
	executeShellCommand: (cmd) =>
		if window.widget && (r = @default_options.translate_char2_eiscp[cmd])
			if typeIsArray(r)
				#r = [on, off] ==> choose the right index based on last state
				last_state = @default_options.toggle_button_states[cmd] || 0 # idx, defaults to off
				r = @default_options.translate_char2_eiscp[cmd][last_state] #get the command
				@default_options.toggle_button_states[cmd] = if last_state == 0 then 1 else 0 #toggle idx
			window.widget.system("/usr/local/bin/octl #{r} #{@default_options.receiver_ip} #{@default_options.receiver_port}")
			#result = window.widget.system("/usr/local/bin/octl #{r} #{@default_options.receiver_ip} #{@default_options.receiver_port}" , null).outputString
			#rlog "executed cmd with result: #{result}"
$ ->
	window.remote = new Remote()