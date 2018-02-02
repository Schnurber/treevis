"use strict";

(function () {
	/**
  * Treevis
  * @author     Dieter Meiller <d.meiller@oth-aw.de>
  * @version    1.0
  *
  */

	/**
  * Creates a Treemap visualisation object.
  *
  * @param      {object}   json_data  The json data
  * @param      {object}   props      The properties
  * @return     {Treemap}  The new Treemap instance
  */
	p5.prototype.createTreemap = function (json_data, props) {
		return new Treemap(json_data, props);
	};

	/**
  * Creates a Sunburst visualisation object.
  *
  * @param      {object}   json_data  The json data
  * @param      {object}   props      The properties
  * @return     {Sunburst}  The new Sunburst instance
  */
	p5.prototype.createSunburst = function (json_data, props) {
		return new Sunburst(json_data, props);
	};
})();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Treevis = function () {
  /**
   * Generic the Treevis object.
   *
   * @param      {<type>}  json_data  The json data
   * @param      {<type>}  props      The properties
   */
  function Treevis(json_data, props) {
    _classCallCheck(this, Treevis);

    this.__maxSize__ = 0;
    this.__maxLevel__ = 0;
    this.__parents__ = [];
    this.__action__ = false;
    this.__selection__ = {
      x: 0,
      y: 0
    };
    this.__is_interactive__ = true;
    this.__textSize__ = 12;
    this.__textFont__ = "Arial";
    // Clone
    this.__tree__ = JSON.parse(JSON.stringify(json_data));
    this.__root__ = this.__tree__;
    this.__props__ = props;
    this.scan_tree(this.__tree__, 1);
    this.setBounds(0, 0, width, height);
  }

  _createClass(Treevis, [{
    key: "scan_tree",
    value: function scan_tree(v, level) {
      if (level > this.__maxLevel__) this.__maxLevel__ = level;
      if (v[this.__props__.value] === undefined) {
        v[this.__props__.value] = 0;
      }
      if (v[this.__props__.children] === undefined) {
        v[this.__props__.children] = [];
      }
      var children = v[this.__props__.children];
      var numChildren = children.length;
      var fSize = 0;
      for (var i = 0; i < numChildren; i++) {
        fSize += this.scan_tree(children[i], level + 1);
      }
      fSize += v[this.__props__.value];
      if (fSize > this.__maxSize__) this.__maxSize__ = fSize;
      v[this.__props__.value] = fSize;
      return fSize;
    }

    /**
     * draws the visualisation
     * @abstract
     * @param      {boolean}  is_drawing  Indicates if drawing or scanning
     */

  }, {
    key: "draw",
    value: function draw(is_drawing) {
      throw new Error('must be implemented by subclass!');
    }

    /**
     * Spezifies a new function for generating labels out of names
     *
     * @param      {<type>}  func    The function
     */

  }, {
    key: "onGetLabel",
    value: function onGetLabel(func) {
      this.__getLabel__ = func;
    }
  }, {
    key: "__label__",
    value: function __label__(name) {
      if (name !== undefined) {
        return this.__getLabel__(name);
      } else {
        return "";
      }
    }
  }, {
    key: "__getLabel__",
    value: function __getLabel__(name) {
      return name.substring(name.lastIndexOf("/") + 1);
    }

    /**
     * Sets the text style.
     *
     * @param      {number}  size    The size
     * @param      {string}  font    The font (optional)
     */

  }, {
    key: "setTextStyle",
    value: function setTextStyle(size, font) {
      this.__textSize__ = size;
      textSize(size);
      if (font !== undefined) {
        this.__textFont__ = font;
        textFont(font);
      }
    }

    /**
     * Sets the interaction.
     *
     * @param      {boolean}  onoff   if it is interacive for clicks
     */

  }, {
    key: "setInteraction",
    value: function setInteraction(onoff) {
      this.__is_interactive__ = onoff;
    }
    /**
     * can be called e.g. from mouseClicked
     *
     * @param      {number}  x       mouse or finger x pos
     * @param      {number}  y       mouse or finger y pos
     */

  }, {
    key: "select",
    value: function select(x, y) {
      this.__action__ = true;
      this.__selection__.x = x;
      this.__selection__.y = y;
    }
    /**
     * Specifies the callback function for selcting
     *
     * @param      {<type>}  func    The function
     */

  }, {
    key: "onSelected",
    value: function onSelected(func) {
      this.__selected__ = func;
    }
  }, {
    key: "__selected__",
    value: function __selected__(v, name, x, y, w, h, level, maxLevel, numChildren) {}
    // overwrite this for more interaction

    /**
     * Go up one level in the tree
     *
     * @param      {number}  mx      x pos (optional)
     * @param      {number}  my      y pos (optional)
     */

  }, {
    key: "up",
    value: function up(mx, my) {
      // up weather coordinates are inside or not if coordinates
      if (mx !== undefined && my !== undefined) {
        var isInside = false;
        if (mx >= this.__dimensions__.x && my >= this.__dimensions__.y && mx <= this.__dimensions__.x + this.__dimensions__.width && my <= this.__dimensions__.y + this.__dimensions__.height) {
          isInside = true;
        }
        if (!isInside) return;
      }
      if (this.__parents__.length > 0) {
        this.__root__ = this.__parents__.pop();
        this.__first_orientation__ = !this.__first_orientation__;
      }
    }
    /**
     * A new drawing function can be specified here
     *
     * @param      {<type>}  func    The function
     */

  }, {
    key: "onDraw",
    value: function onDraw(func) {
      this.__draw__ = func;
    }
    /**
     * A new fill function can be specified here
     *
     * @param      {<type>}  func    The function
     */

  }, {
    key: "onFill",
    value: function onFill(func) {
      this.__fill__ = func;
    }
    /**
     * Sets the bounds.
     *
     * @param      {<type>}  xpos    The xpos
     * @param      {<type>}  ypos    The ypos
     * @param      {<type>}  w       The width
     * @param      {<type>}  h       The height
     */

  }, {
    key: "setBounds",
    value: function setBounds(xpos, ypos, w, h) {
      this.__dimensions__ = {
        x: xpos,
        y: ypos,
        width: w,
        height: h
      };
    }
  }]);

  return Treevis;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Treemap = function (_Treevis) {
  _inherits(Treemap, _Treevis);

  /**
   * Constructs the Treemap object.
   *
   * @param      {object}  json_data  The json data
   * @param      {object}  props      The properties
   */
  function Treemap(json_data, props) {
    _classCallCheck(this, Treemap);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Treemap).call(this, json_data, props));

    _this.__MINW__ = 0;
    _this.__MINH__ = 0;
    _this.__inset__ = 0;
    _this.__corner__ = 0;
    _this.__first_orientation__ = true;
    return _this;
  }

  _createClass(Treemap, [{
    key: "__tree_map__",
    value: function __tree_map__(v, level, orientation, x, y, w, h, is_drawing) {
      var name = v[this.__props__.label];
      var fSize = v[this.__props__.value];
      var children = v[this.__props__.children];
      var numChildren = children.length;
      this.__walk_tree_map__(v, name, x, y, w, h, level, this.__maxLevel__, numChildren, is_drawing);
      var xpos = x + this.__inset__;
      var ypos = y + this.__inset__;
      var nw = 0,
          nh = 0;
      for (var i = 0; i < numChildren; i++) {
        var child = children[i];
        var size = child[this.__props__.value];
        if (orientation) {
          var wminus = w - (numChildren + 1) * this.__inset__;
          nw = size / fSize * wminus;
          nh = h - this.__inset__ * 2;
        } else {
          var hminus = h - (numChildren + 1) * this.__inset__;
          nh = size / fSize * hminus;
          nw = w - this.__inset__ * 2;
        }
        this.__tree_map__(child, level + 1, !orientation, xpos, ypos, nw, nh, is_drawing);
        if (orientation) {
          xpos += nw + this.__inset__;
        } else {
          ypos += nh + this.__inset__;
        }
      }
    }
  }, {
    key: "__walk_tree_map__",
    value: function __walk_tree_map__(v, name, x, y, w, h, level, maxLevel, numChildren, is_drawing) {

      if (w < this.__MINW__ || h < this.__MINH__) return;
      if (this.__action__ && this.__selection__.x >= x && this.__selection__.x <= x + w && this.__selection__.y >= y && this.__selection__.y <= y + h) {
        this.__selected__(v, name, x, y, w, h, level, maxLevel, numChildren);
        if (this.__root__ !== v && this.__is_interactive__) {
          this.__parents__.push(this.__root__);
          this.__root__ = v;
          this.__action__ = false;
          this.__first_orientation__ = !this.__first_orientation__;
        }
      }
      if (is_drawing) {
        var label = this.__label__(name);
        if (numChildren != 0 || textWidth(label) >= w - 5 || h <= this.__textSize__) {
          label = "";
        }
        this.__draw__(name, label, x, y, w, h, v, level, maxLevel, numChildren);
      }
    }
  }, {
    key: "__draw__",
    value: function __draw__(name, label, x, y, w, h, v, level, maxLevel, numChildren) {
      this.__fill__(level, maxLevel, v);
      if (this.__corner__ > 0) {
        rect(x, y, w, h, this.__corner__);
      } else {
        rect(x, y, w, h);
      }

      textAlign(LEFT);
      fill(0);
      text(label, x + 1, y + this.__textSize__);
    }
  }, {
    key: "__fill__",
    value: function __fill__(level, maxLevel, v) {
      var c = level / maxLevel * 255;
      fill(color(237, (255 - c) * 2 / 3, 255 - c));
    }
    /**
     * Draws the Treemap.
     *
     * @param      {boolean}  is_drawing  Indicates if drawing or scanning only
     */

  }, {
    key: "draw",
    value: function draw(is_drawing) {
      // Draw (no arg) or scan only: is_drawing = false
      if (arguments.length == 0) {
        is_drawing = true;
      }
      this.__tree_map__(this.__root__, 1, this.__first_orientation__, this.__dimensions__.x, this.__dimensions__.y, this.__dimensions__.width, this.__dimensions__.height, is_drawing);
      this.__action__ = false;
    }
    /**
     * Sets the inset.
     *
     * @param      {number}  val     The padding value 
     */

  }, {
    key: "setInset",
    value: function setInset(val) {
      this.__inset__ = val;
    }
    /**
     * Sets the corner radius.
     *
     * @param      {number}  val     The radius
     */

  }, {
    key: "setCorner",
    value: function setCorner(val) {
      this.__corner__ = val;
    }
  }]);

  return Treemap;
}(Treevis);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sunburst = function (_Treevis) {
	_inherits(Sunburst, _Treevis);

	/**
  * Constructs the Sunburst object.
  *
  * @param      {object}  json_data  The json data
  * @param      {object}  props      The properties
  */
	function Sunburst(json_data, props) {
		_classCallCheck(this, Sunburst);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Sunburst).call(this, json_data, props));

		_this.__angle1__ = 0;
		_this.__angle2__ = 360;
		_this.__isTextVisible__ = true;
		return _this;
	}

	_createClass(Sunburst, [{
		key: "__sun_burst__",
		value: function __sun_burst__(v, brother, level, angle1, angle2, is_drawing) {
			var name = v[this.__props__.label];
			var fSize = v[this.__props__.value];
			var children = v[this.__props__.children];
			var numChildren = children.length;

			//Selected?
			if (this.__action__) {
				var dx = this.__selection__.x - this.__dimensions__.x - this.__dimensions__.width / 2;
				var dy = this.__selection__.y - this.__dimensions__.y - this.__dimensions__.height / 2;
				var m_dist = sqrt(dx * dx + dy * dy);
				var click_level = 2 + parseInt(abs(m_dist / this.__stp__ * 2));
				if (click_level === level) {
					var selang = (360 + degrees(atan2(dy, dx))) % 360;
					if (selang >= (360 + angle1) % 360 && selang <= (360 + angle1) % 360 + (360 + angle2) % 360) {
						this.__action__ = false;
						this.__selected__(v, name, angle1, angle2, level, this.__maxLevel__, numChildren);

						if (numChildren > 0 && this.__root__ !== v && this.__is_interactive__) {
							this.__parents__.push(this.__root__);
							this.__root__ = v;
						}
					}
				}
			}
			var cangle1 = angle1;
			var cangle2 = 0;
			for (var i = 0; i < numChildren; i++) {
				var child = children[i];
				var size = child[this.__props__.value];
				cangle2 = size / fSize * angle2;
				this.__sun_burst__(child, i, level + 1, cangle1, cangle2, is_drawing);
				cangle1 += cangle2;
			}

			if (is_drawing) {
				var diameter = (level - 1) * this.__stp__;
				var center_x = this.__dimensions__.x + this.__dimensions__.width / 2;
				var center_y = this.__dimensions__.y + this.__dimensions__.height / 2;
				var label = this.__label__(name);
				this.__draw__(name, label, brother, numChildren > 0, level, angle1, angle2, center_x, center_y, diameter, v);
			}
		}
	}, {
		key: "__fill__",
		value: function __fill__(isDir, brother, level, maxLevel, v) {
			if (isDir) {
				fill(color(255, 255, 255));
			} else {
				fill(color(255, 255 - brother % 2 * 255, 0));
			}
		}
	}, {
		key: "__draw__",
		value: function __draw__(name, label, brother, isDir, level, angle1, angle2, center_x, center_y, diameter) {

			this.__fill__(isDir, brother, level, this.__maxLevel__);
			if (angle2 >= 359) {
				ellipse(center_x, center_y, diameter, diameter);
			} else if (angle1 + angle2 > angle1) {
				arc(center_x, center_y, diameter, diameter, radians(angle1), radians(angle1 + angle2), PIE);
			}
			// Text
			if (this.__isTextVisible__ && !isDir && angle2 > 5) {
				var len = diameter / 2 + this.__stp__ / 6;
				var angl = angle1 + angle2 / 2;

				var sn = sin(radians(angl));
				var cs = cos(radians(angl));
				fill(0);
				translate(center_x + cs * len, center_y + sn * len);
				rotate(radians(angl));
				if (angl > 90 && angl < 270) {
					scale(-1, -1);
					textAlign(RIGHT);
				} else {
					scale(1, 1);
					textAlign(LEFT);
				}
				text(label, 0, this.__textSize__ / 2);
				resetMatrix();
			}
		}
		/**
   * Sets the text visible or invisible.
   *
   * @param      {boolean}  value   The value true / false
   */

	}, {
		key: "setTextVisible",
		value: function setTextVisible(value) {
			this.__isTextVisible__ = value;
		}
		/**
   * Sets the bounds.
   *
   * @param      {number}  xpos    The xpos
   * @param      {number}  ypos    The ypos
   * @param      {number}  w       The width
   * @param      {number}  h       The height
   */

	}, {
		key: "setBounds",
		value: function setBounds(xpos, ypos, w, h) {
			_get(Object.getPrototypeOf(Sunburst.prototype), "setBounds", this).call(this, xpos, ypos, w, h);
			var shorter_dim = this.__dimensions__.width < this.__dimensions__.height ? this.__dimensions__.width : this.__dimensions__.height;
			this.__stp__ = shorter_dim / (this.__maxLevel__ + 1);
		}
		/**
   * Sets the angle(s).
   *
   * @param      {number}  angle1  The orientatiob 
   * @param      {number}  angle2  The spread
   */

	}, {
		key: "setAngle",
		value: function setAngle(angle1, angle2) {
			this.__angle1__ = angle1;
			this.__angle2__ = angle2 === undefined ? 360 : angle2;
		}
		/**
   * Draws the sunburst visualisation
   *
   * @param      {boolean}  is_drawing  Indicates if drawing or not (scanning only)
   */

	}, {
		key: "draw",
		value: function draw(is_drawing) {
			// Draw (no arg) or scan only: is_drawing = false
			if (arguments.length == 0) {
				is_drawing = true;
			}
			this.__sun_burst__(this.__root__, 1, 1, this.__angle1__, this.__angle2__, is_drawing);
			this.__action__ = false;
		}
	}]);

	return Sunburst;
}(Treevis);