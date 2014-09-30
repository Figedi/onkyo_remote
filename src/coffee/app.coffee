######
# Onkyo remote control javascript class, uses octl (thx to
# https://github.com/janten/onkyo-eiscp-remote-mac!)
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
      on_off: [ 30, 32,30,31]
      bd_dvd: [ 27, 77,36,20]
      custom: [ 28,112,36,20]
      receiver: [ 27,147,36,20]
      tv: [ 27,182,36,20]
      tv_on_off: [ 27,222,36,20]
      input: [ 27,268,36,20]
      cbl_sat: [ 80, 76,37,20]
      aux: [ 80,111,37,20]
      tv_cd: [ 80,147,37,20]
      mute_zone1: [ 80,182,37,20]
      vol_up_zone1: [ 85,218,30,31]
      vol_down_zone1: [ 85,249,30,38]
      game: [134, 76,36,21]
      am: [134,111,36,21]
      net: [134,146,36,21]
      display: [134,182,36,21]
      ch_disc: [139,217,30,31]
      album: [139,248,30,38]
      source: [192, 31,30,31]
      pc: [190, 76,36,20]
      fm: [190,111,36,20]
      usb: [190,147,36,20]
      mute_zone2: [190,182,36,20]
      vol_up_zone2: [192,215,34,37]
      vol_down_zone2: [192,252,34,39]
      guide: [ 38,313,23,24]
      setup: [ 38,393,23,24]
      arr_left: [ 69,339,25,60]
      arr_top: [101,305,60,26]
      arr_right: [162,339,25,60]
      arr_bottom: [101,399,60,26]
      enter: [105,343,43,42]
      audio_home: [116,440,23,24]
      return: [193,393,23,24]
      video: [193,313,23,24]
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
      video: 'MVLQSTN'#'OSDVIDEO'
    # object maintaining the current state of a toggle button, e.g.
    # 'mute_zone1: 1' whereas 1 represents on, 0 off
    toggle_button_states: {}
    #command_syntax: "/usr/local/bin/onkyo --host {{host}} --port {{port}} {{command}}"
    command_syntax: "octl {{command}} {{host}} {{port}}"
    #
  constructor: ->

    @default_options.img_width ||= $('#front img').width()
    @default_options.img_height ||= $('#front img').height()
    @default_options.IMG_RATIO ||= @default_options.img_width/@default_options.ORIGINAL_WIDTH
    if window.widget
      rcvrip = widget.preferenceForKey 'onkyoip'
      @default_options.receiver_ip = rcvrip if rcvrip && rcvrip.length > 0
      $('#ip_adress').val(@default_options.receiver_ip)
      @_instantiateSlider()
    @bindEvents()

    #debug
    #@_createBoxes()
    # if window.widget
    #   rlog window.widget
    #   if window.widget.system
    #     rlog window.widget.system("/usr/bin/which octl", null).outputString
    #   else
    #     rlog "widget.system not defined"
    # else
    #   rlog "widget not defined"

  _instantiateSlider: =>
    cmd_string = @_makeCommand(@default_options.receiver_ip, @default_options.receiver_port, 'MVLQSTN')
    window.widget.system(cmd_string, @handleResult(true, false));

  _createBoxes: => #for debugging the spaces
    r = @default_options.IMG_RATIO
    for k,v of @default_options.button_coordinates
      #v is the array of coordinates
      @_createBox(v[0],v[1],v[2], v[3])

  _createBox: (x,y,w,h, time=3000) =>
    $content = $("<div class='testbox' style='left: #{x}px; top: #{y}px; width: #{w}px; height: #{h}px'></div>")
    $content.appendTo('body').fadeOut(time)

  bindEvents: =>
    $('#front img').on 'click', @onRemoteClick
    gInfoButton = new AppleInfoButton $('#to_back .config_icon')[0], $('#front')[0], "white", "white", @showBack
    gDoneButton = new AppleGlassButton $('.done')[0], "Done", @showFront
    $('#ip_adress').on 'change', @saveIPAdress
    $('#front').on 'mouseenter', ->
      $('#to_back').fadeTo(500,1) if $('#to_back').css('opacity') != '1'
    $('#front').on 'mouseleave', -> $('#to_back').fadeTo(500,0)

    $('#maxVol').on 'mouseup', @onChangeSlider
    $('#maxVol').on 'change', false

  onChangeSlider: (ev) =>
    val = parseInt($(ev.target).val()) #is dec 0-72
    val_hex =  if (_m = val.toString(16)).length < 2 then "0#{_m}" else _m
    cmd_string = @_makeCommand(@default_options.receiver_ip, @default_options.receiver_port, "MVL#{val_hex}")
    window.widget.system(cmd_string, @handleResult(false, false))

  saveIPAdress: (e) =>
    if window.widget
      text = $(e.target).val()
      if text && text.length > 0
        widget.setPreferenceForKey text, 'onkyoip'
        @default_options.receiver_ip = text

  onRemoteClick: (e) =>

    x = e.pageX
    y = e.pageY
    #r = @default_options.IMG_RATIO
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
      if left <= x <= right && top <= y <= bottom
        #console.log "left: #{left}, top: #{top}, right: #{right}, bottom: #{bottom}, x: #{x}, y: #{y}"
        @_createBox(left, top, button[2], button[3])
        console.log "click", button_text
        @executeShellCommand(button_text)#
        break

  executeShellCommand: (cmd) =>
    if window.widget && (r = @default_options.translate_char2_eiscp[cmd])
      if typeIsArray(r)
        #r = [on, off] ==> choose the right index based on last state
        last_state = @default_options.toggle_button_states[cmd] || 0 # idx, defaults to off
        r = @default_options.translate_char2_eiscp[cmd][last_state] #get the command
        @default_options.toggle_button_states[cmd] = if last_state == 0 then 1 else 0 #toggle idx
      cmd_string = @_makeCommand(@default_options.receiver_ip, @default_options.receiver_port, r)
      window.widget.system(cmd_string,  @handleResult(true, false))

  handleResult: (should_update = true , should_rlog = true) => #for debug purposes, allows to log the mvl in textform
    (result) ->
      MVL_MATCH = /MVL([0-9A-F]{2})/
      if match = result.match(MVL_MATCH) #max vol = 72 dec (hex 48)
        mvl = parseInt(match[1], 16)
        rlog "Master Volume: #{mvl}%" if should_rlog
        $('#maxVol').val(mvl) if should_update
      else
        rlog result if should_rlog


  _makeCommand: (ip, port, command) =>
    @default_options.command_syntax.replace(/{{host}}/, ip).replace(/{{port}}/, port).replace(/{{command}}/, command)


  showBack: (e) ->
    widget.prepareForTransition('ToBack') if window.widget
    $('#front').hide()
    $('#back').show()
    setTimeout((-> widget.performTransition()),0) if window.widget

  showFront: (e) ->
    widget.prepareForTransition('ToFront') if window.widget
    $('#front').show()
    $('#back').hide()
    setTimeout((-> widget.performTransition()),0) if window.widget


$ ->
  window.remote = new Remote()
  if window.widget
    widget.onremove = -> window.remote = null

