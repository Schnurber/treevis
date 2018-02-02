class Treevis {
  /**
   * Generic the Treevis object.
   *
   * @param      {<type>}  json_data  The json data
   * @param      {<type>}  props      The properties
   */
  constructor(json_data, props) {

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

  scan_tree(v, level) {
    if (level > this.__maxLevel__) this.__maxLevel__ = level;
    if (v[this.__props__.value] === undefined ) {
      v[this.__props__.value] = 0;
    }
    if (v[this.__props__.children] === undefined ) {
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
  draw(is_drawing) {
    throw new Error('must be implemented by subclass!');
  }

  /**
   * Spezifies a new function for generating labels out of names
   *
   * @param      {<type>}  func    The function
   */
  onGetLabel(func) {
    this.__getLabel__ = func;
  }
  __label__(name) {
    if (name !== undefined) {
      return this.__getLabel__(name);
    } else {
      return "";
    }
  }
  __getLabel__(name) {
    return name.substring(name.lastIndexOf("/") + 1);
  }

  /**
   * Sets the text style.
   *
   * @param      {number}  size    The size
   * @param      {string}  font    The font (optional)
   */
  setTextStyle(size, font) {
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
  setInteraction(onoff) {
    this.__is_interactive__ = onoff;
  }
  /**
   * can be called e.g. from mouseClicked
   *
   * @param      {number}  x       mouse or finger x pos
   * @param      {number}  y       mouse or finger y pos
   */
  select(x, y) {
    this.__action__ = true;
    this.__selection__.x = x;
    this.__selection__.y = y;
  }
  /**
   * Specifies the callback function for selcting
   *
   * @param      {<type>}  func    The function
   */
  onSelected(func) {
    this.__selected__ = func;
  }

  __selected__(v, name, x, y, w, h, level, maxLevel, numChildren) {
    // overwrite this for more interaction
  }
  /**
   * Go up one level in the tree
   *
   * @param      {number}  mx      x pos (optional)
   * @param      {number}  my      y pos (optional)
   */
  up(mx, my) {
    // up weather coordinates are inside or not if coordinates
    if (mx !== undefined && my !== undefined) {
      var isInside = false;
      if (mx >= this.__dimensions__.x && my >= this.__dimensions__.y &&
        mx <= this.__dimensions__.x + this.__dimensions__.width &&
        my <= this.__dimensions__.y + this.__dimensions__.height) {
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
  onDraw(func) {
    this.__draw__ = func;
  }
  /**
   * A new fill function can be specified here
   *
   * @param      {<type>}  func    The function
   */
  onFill(func) {
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
  setBounds(xpos, ypos, w, h) {
    this.__dimensions__ = {
      x: xpos,
      y: ypos,
      width: w,
      height: h
    };
  }
}