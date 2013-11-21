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
      video: 'OSDVIDEO'
    },
    toggle_button_states: {}
  };

  function Remote() {
    this.executeShellCommand = __bind(this.executeShellCommand, this);
    this.onRemoteClick = __bind(this.onRemoteClick, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this._create_box = __bind(this._create_box, this);
    this.create_boxes = __bind(this.create_boxes, this);
    var _base, _base1, _base2;
    (_base = this.default_options).img_width || (_base.img_width = $('.fg img').width());
    (_base1 = this.default_options).img_height || (_base1.img_height = $('.fg img').height());
    (_base2 = this.default_options).IMG_RATIO || (_base2.IMG_RATIO = this.default_options.img_width / this.default_options.ORIGINAL_WIDTH);
    this.bindEvents();
  }

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
    return $('.fg img').on('click', this.onRemoteClick);
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
    var last_state, r;
    if (window.widget && (r = this.default_options.translate_char2_eiscp[cmd])) {
      if (typeIsArray(r)) {
        last_state = this.default_options.toggle_button_states[cmd] || 0;
        r = this.default_options.translate_char2_eiscp[cmd][last_state];
        this.default_options.toggle_button_states[cmd] = last_state === 0 ? 1 : 0;
      }
      return window.widget.system("/usr/local/bin/octl " + r + " " + this.default_options.receiver_ip + " " + this.default_options.receiver_port);
    }
  };

  return Remote;

})();

$(function() {
  return window.remote = new Remote();
});
