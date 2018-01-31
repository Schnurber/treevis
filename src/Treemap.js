class Treemap extends Treevis {
  /**
   * Constructs the Treemap object.
   *
   * @param      {object}  json_data  The json data
   * @param      {object}  props      The properties
   */
  constructor(json_data, props) {
    super(json_data, props);
    this.__MINW__ = 0;
    this.__MINH__ = 0;
    this.__inset__ = 0;
    this.__corner__ = 0;
    this.__first_orientation__ = true;
  }

  __tree_map__(v, level, orientation, x, y, w, h, is_drawing) {
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
        var wminus = w - ((numChildren + 1) * this.__inset__);
        nw = size / fSize * wminus;
        nh = h - this.__inset__ * 2;
      } else {
        var hminus = h - ((numChildren + 1) * this.__inset__);
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

  __walk_tree_map__(v, name, x, y, w, h, level, maxLevel, numChildren, is_drawing) {

    if (w < this.__MINW__ || h < this.__MINH__) return;
    if (this.__action__ &&
      this.__selection__.x >= x &&
      this.__selection__.x <= x + w &&
      this.__selection__.y >= y &&
      this.__selection__.y <= y + h) {
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

  __draw__(name, label, x, y, w, h, v, level, maxLevel, numChildren) {
    this.__fill__(level, maxLevel, v);
    if (this.__corner__ > 0)  {
      rect(x, y, w, h, this.__corner__);
    } else {
      rect(x, y, w, h);
    }

    textAlign(LEFT);
    fill(0);
    text(label, x + 1, y + this.__textSize__);
  }
  __fill__(level, maxLevel, v) {
    var c = level / maxLevel * 255;
    fill(color(237, (255 - c) * 2 / 3, 255 - c));
  }
  /**
   * Draws the Treemap.
   *
   * @param      {boolean}  is_drawing  Indicates if drawing or scanning only
   */
  draw(is_drawing) {
    // Draw (no arg) or scan only: is_drawing = false
    if (arguments.length == 0) {
      is_drawing = true;
    }
    this.__tree_map__(this.__root__, 1, this.__first_orientation__, this.__dimensions__.x, this.__dimensions__.y,
      this.__dimensions__.width, this.__dimensions__.height, is_drawing);
    this.__action__ = false;
  }
  /**
   * Sets the inset.
   *
   * @param      {number}  val     The padding value 
   */
  setInset(val) {
    this.__inset__ = val;
  }
  /**
   * Sets the corner radius.
   *
   * @param      {number}  val     The radius
   */
  setCorner(val) {
    this.__corner__ = val;
  }
}