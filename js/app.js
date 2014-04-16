var Remote, typeIsArray,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

typeIsArray = function(value) {
  return {}.toString.call(value) === '[object Array]';
};

window.rlog = function(msg, time) {
  var $el, $new_el, bottom, offset, r;
  if (time == null) {
    time = 3000;
  }
  time = (r = msg.length * 100) > 3000 ? 3000 : r;
  offset = ($el = $('.debug_msg .debug_el:last')).offset();
  if (offset) {
    bottom = offset.top + 2 + $el.height();
  } else {
    bottom = 10;
  }
  $new_el = $("<p class='debug_el' style='top: " + bottom + "px'>" + msg + "</p>");
  return $new_el.appendTo('.debug_msg').fadeOut(time, function() {
    return $(this).remove();
  });
};

Remote = (function() {
  Remote.prototype.default_options = {
    receiver_ip: '192.168.178.26',
    receiver_port: 60128,
    ORIGINAL_HEIGHT: 2107,
    ORIGINAL_WIDTH: 897,
    IMG_RATIO: 0.2842809364548495,
    button_coordinates: {
      on_off: [38, 41, 30, 31],
      bd_dvd: [35, 86, 36, 20],
      custom: [36, 121, 36, 20],
      receiver: [35, 156, 36, 20],
      tv: [35, 191, 36, 20],
      tv_on_off: [35, 231, 36, 20],
      input: [35, 277, 36, 20],
      cbl_sat: [88, 85, 37, 20],
      aux: [88, 120, 37, 20],
      tv_cd: [88, 156, 37, 20],
      mute_zone1: [88, 191, 37, 20],
      vol_up_zone1: [93, 227, 30, 31],
      vol_down_zone1: [93, 258, 30, 38],
      game: [142, 85, 36, 21],
      am: [142, 120, 36, 21],
      net: [142, 155, 36, 21],
      display: [142, 191, 36, 21],
      ch_disc: [147, 226, 30, 31],
      album: [147, 257, 30, 38],
      source: [200, 40, 30, 31],
      pc: [198, 85, 36, 20],
      fm: [198, 120, 36, 20],
      usb: [198, 156, 36, 20],
      mute_zone2: [198, 191, 36, 20],
      vol_up_zone2: [200, 224, 34, 37],
      vol_down_zone2: [200, 261, 34, 39],
      guide: [46, 322, 23, 24],
      setup: [46, 402, 23, 24],
      arr_left: [77, 348, 25, 60],
      arr_top: [109, 314, 60, 26],
      arr_right: [170, 348, 25, 60],
      arr_bottom: [109, 408, 60, 26],
      enter: [113, 352, 43, 42],
      audio_home: [124, 449, 23, 24],
      "return": [201, 402, 23, 24],
      video: [201, 322, 23, 24]
    },
    translate_char2_eiscp: {
      on_off: ['PWR00', 'PWR01'],
      bd_dvd: 'SLI10',
      custom: '',
      receiver: '',
      tv: '',
      tv_on_off: '',
      input: '',
      cbl_sat: 'SLI01',
      aux: 'SLI03',
      tv_cd: 'SLI23',
      mute_zone1: ['AMT00', 'AMT01'],
      vol_up_zone1: 'MVLUP',
      vol_down_zone1: 'MVLDOWN',
      game: 'SLI02',
      am: 'SLI25',
      net: 'SLI2B',
      display: 'SLI26',
      ch_disc: '',
      album: '',
      source: '',
      pc: 'SLI05',
      fm: 'SLI24',
      usb: 'SLI2C',
      mute_zone2: ['ZMT00', 'ZMT01'],
      vol_up_zone2: 'ZVLUP',
      vol_down_zone2: 'ZVLDOWN',
      guide: 'OSDMENU',
      setup: 'OSDQUICK',
      arr_left: 'OSDLEFT',
      arr_top: 'OSDUP',
      arr_right: 'OSDRIGHT',
      arr_bottom: 'OSDDOWN',
      enter: 'OSDENTER',
      audio_home: 'OSDHOME',
      "return": 'OSDEXIT',
      video: 'MVLQSTN'
    },
    toggle_button_states: {},
    command_syntax: "/usr/local/bin/onkyo --host {{host}} --port {{port}} {{command}}"
  };

  function Remote() {
    this._makeCommand = __bind(this._makeCommand, this);
    this.handleResult = __bind(this.handleResult, this);
    this.executeShellCommand = __bind(this.executeShellCommand, this);
    this.onRemoteClick = __bind(this.onRemoteClick, this);
    this.saveIPAdress = __bind(this.saveIPAdress, this);
    this.onChangeSlider = __bind(this.onChangeSlider, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this._create_box = __bind(this._create_box, this);
    this.create_boxes = __bind(this.create_boxes, this);
    this._instantiateSlider = __bind(this._instantiateSlider, this);
    var rcvrip, _base, _base1, _base2;
    (_base = this.default_options).img_width || (_base.img_width = $('#front img').width());
    (_base1 = this.default_options).img_height || (_base1.img_height = $('#front img').height());
    (_base2 = this.default_options).IMG_RATIO || (_base2.IMG_RATIO = this.default_options.img_width / this.default_options.ORIGINAL_WIDTH);
    if (window.widget) {
      rcvrip = widget.preferenceForKey('onkyoip');
      if (rcvrip && rcvrip.length > 0) {
        this.default_options.receiver_ip = rcvrip;
      }
      $('#ip_adress').val(this.default_options.receiver_ip);
      this._instantiateSlider();
    }
    this.bindEvents();
  }

  Remote.prototype._instantiateSlider = function() {
    var cmd_string;
    cmd_string = this._makeCommand(this.default_options.receiver_ip, this.default_options.receiver_port, 'MVLQSTN');
    return window.widget.system(cmd_string, function() {}).onreadoutput = this.handleResult(true, false);
  };

  Remote.prototype.create_boxes = function() {
    var k, r, v, _ref, _results;
    r = this.default_options.IMG_RATIO;
    _ref = this.default_options.button_coordinates;
    _results = [];
    for (k in _ref) {
      v = _ref[k];
      _results.push(this._create_box(v[0], v[1], v[2], v[3]));
    }
    return _results;
  };

  Remote.prototype._create_box = function(x, y, w, h, time) {
    var $content;
    if (time == null) {
      time = 3000;
    }
    $content = $("<div class='testbox' style='left: " + x + "px; top: " + y + "px; width: " + w + "px; height: " + h + "px'></div>");
    return $content.appendTo('body').fadeOut(time);
  };

  Remote.prototype.bindEvents = function() {
    var gDoneButton, gInfoButton;
    $('#front img').on('click', this.onRemoteClick);
    gInfoButton = new AppleInfoButton($('#to_back .config_icon')[0], $('#front')[0], "white", "white", this.showBack);
    gDoneButton = new AppleGlassButton($('.done')[0], "Done", this.showFront);
    $('#ip_adress').on('change', this.saveIPAdress);
    console.log;
    $('#front').mouseenter(function() {
      console.log($('#to_back').css('opacity'));
      if ($('#to_back').css('opacity') !== '1') {
        return $('#to_back').fadeTo(500, 1);
      }
    }).mouseleave(function() {
      return $('#to_back').fadeTo(500, 0);
    });
    return $('#maxVol').on('change', this.onChangeSlider);
  };

  Remote.prototype.onChangeSlider = function(ev) {
    var cmd_string, val, val_hex, val_proc, _m;
    val = $(ev.target).val();
    val_proc = parseInt((val / 100) * 72);
    val_hex = (_m = val_proc.toString(16)).length < 2 ? "0" + _m : _m;
    cmd_string = this._makeCommand(this.default_options.receiver_ip, this.default_options.receiver_port, "MVL" + val_hex);
    return window.widget.system(cmd_string, function() {}).onreadoutput = this.handleResult(false, false);
  };

  Remote.prototype.saveIPAdress = function(e) {
    var text;
    if (window.widget) {
      text = $(e.target).val();
      if (text && text.length > 0) {
        widget.setPreferenceForKey(text, 'onkyoip');
        return this.default_options.receiver_ip = text;
      }
    }
  };

  Remote.prototype.onRemoteClick = function(e) {
    var bottom, button, button_text, left, right, top, x, y, _ref, _results;
    x = e.pageX;
    y = e.pageY;
    _ref = this.default_options.button_coordinates;
    _results = [];
    for (button_text in _ref) {
      button = _ref[button_text];
      left = button[0];
      top = button[1];
      right = button[0] + button[2];
      bottom = button[1] + button[3];
      if ((left <= x && x <= right) && (top <= y && y <= bottom)) {
        this._create_box(left, top, button[2], button[3]);
        this.executeShellCommand(button_text);
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Remote.prototype.executeShellCommand = function(cmd) {
    var cmd_string, last_state, r;
    if (window.widget && (r = this.default_options.translate_char2_eiscp[cmd])) {
      if (typeIsArray(r)) {
        last_state = this.default_options.toggle_button_states[cmd] || 0;
        r = this.default_options.translate_char2_eiscp[cmd][last_state];
        this.default_options.toggle_button_states[cmd] = last_state === 0 ? 1 : 0;
      }
      cmd_string = this._makeCommand(this.default_options.receiver_ip, this.default_options.receiver_port, r);
      return window.widget.system(cmd_string, function() {}).onreadoutput = this.handleResult(true, false);
    }
  };

  Remote.prototype.handleResult = function(should_update, should_rlog) {
    if (should_update == null) {
      should_update = true;
    }
    if (should_rlog == null) {
      should_rlog = true;
    }
    return function(result) {
      var MVL_MATCH, match, mvl, mvl_curr;
      MVL_MATCH = /MVL([0-9A-F]{2})/;
      if (match = result.match(MVL_MATCH)) {
        mvl_curr = parseInt(match[1], 16);
        mvl = parseInt((mvl_curr / 72) * 100);
        if (should_rlog) {
          rlog("Master Volume: " + mvl + "%");
        }
        if (should_update) {
          return $('#maxVol').val(mvl);
        }
      } else {
        if (should_rlog) {
          return rlog(result);
        }
      }
    };
  };

  Remote.prototype._makeCommand = function(ip, port, command) {
    return this.default_options.command_syntax.replace(/{{host}}/, ip).replace(/{{port}}/, port).replace(/{{command}}/, command);
  };

  Remote.prototype.showBack = function(e) {
    var $back, $front;
    if (window.widget) {
      $front = $('#front');
      $back = $('#back');
      widget.prepareForTransition('ToBack');
      $front.hide();
      $back.show();
      return setTimeout(function() {
        return widget.performTransition();
      }, 0);
    }
  };

  Remote.prototype.showFront = function(e) {
    var $back, $front;
    if (window.widget) {
      $front = $('#front');
      $back = $('#back');
      widget.prepareForTransition('ToFront');
      $front.show();
      $back.hide();
      return setTimeout(function() {
        return widget.performTransition();
      }, 0);
    }
  };

  return Remote;

})();

$(function() {
  window.remote = new Remote();
  if (window.widget) {
    return widget.onremove = function() {
      return window.remote = null;
    };
  }
});
