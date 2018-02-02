class Sunburst extends Treevis {
	/**
	 * Constructs the Sunburst object.
	 *
	 * @param      {object}  json_data  The json data
	 * @param      {object}  props      The properties
	 */
	constructor(json_data, props) {
		super(json_data, props);
		this.__angle1__ = 0;
		this.__angle2__ = 360;
		this.__isTextVisible__ = true;
	}

	__sun_burst__(v, brother, level, angle1, angle2, is_drawing) {
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

	__fill__(isDir, brother, level, maxLevel, v) {
		if (isDir) {
			fill(color(255, 255, 255));
		} else {
			fill(color(255, 255 - (brother % 2) * 255, 0));
		}
	}

	__draw__(name, label, brother, isDir, level, angle1, angle2, center_x, center_y, diameter) {

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
	setTextVisible(value) {
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
	setBounds(xpos, ypos, w, h) {
		super.setBounds(xpos, ypos, w, h);
		var shorter_dim = this.__dimensions__.width < this.__dimensions__.height ?
			this.__dimensions__.width : this.__dimensions__.height;
		this.__stp__ = (shorter_dim) / (this.__maxLevel__ + 1);
	}
	/**
	 * Sets the angle(s).
	 *
	 * @param      {number}  angle1  The orientatiob 
	 * @param      {number}  angle2  The spread
	 */
	setAngle(angle1, angle2) {
		this.__angle1__ = angle1;
		this.__angle2__ = angle2 === undefined ? 360 : angle2;
	}
	/**
	 * Draws the sunburst visualisation
	 *
	 * @param      {boolean}  is_drawing  Indicates if drawing or not (scanning only)
	 */
	draw(is_drawing) {
		// Draw (no arg) or scan only: is_drawing = false
		if (arguments.length == 0) {
			is_drawing = true;
		}
		this.__sun_burst__(this.__root__, 1, 1, this.__angle1__, this.__angle2__, is_drawing);
		this.__action__ = false;
	}
}