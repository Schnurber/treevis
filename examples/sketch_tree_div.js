var data, info;
var treevis;
var root;
var txt = "";
var _mouseAction;

function preload() {
  data = loadJSON("data/example_scan.json");
}

function setup() {
  var w = 800;
  var h = 600;
  createCanvas(w, h);
  info = createDiv("Nothing selected");
  info.id("info");
  info.position(10, h + 10);

  background(255);
  treevis = createTreemap(
    data, {
      children: "children",
      label: "name",
      value: "size"
    });
  treevis.setInset(4);
  treevis.onDraw(function(name, label, x, y, w, h, v, level, maxLevel, numChildren) {
    var c = level / maxLevel * 255;
    var el = createDiv(label);
    el.position(x, y);
    el.size(w, h);
    var col = name.endsWith(".js") ? "rgb(255,255,0)" :
      "rgb(" + 255 + "," + (255 - c) + "," + (255 - c) + ")";
    el.style("background-color", col);
    el.style("border", "1px solid black");
    el.id("e" + Math.floor(x) + "-" + Math.floor(y));
  });
  treevis.onSelected(function(v, name, x, y, w, h, level, maxLevel, numChildren) {
    select("#info").html(name);
  });

  treevis.setInteraction(false);
  treevis.draw();
}

function mousePressed() {
  treevis.select(mouseX, mouseY);
  treevis.draw(false);
}