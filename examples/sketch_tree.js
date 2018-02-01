var data, info;
var treevis;

function preload() {
  data = loadJSON("data/example_scan.json");
}

function setup() {
  var w = 800;
  var h = 600;
  _mouseAction = false;
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
  treevis.setInset(3);
  treevis.onSelected(function(v, name, x, y, w, h, level, maxLevel, numChildren) {
    select("#info").html(name);
  });
  //treevis.interaction(false);
}

function draw() {
  background(255);
  treevis.draw();
}

function mousePressed() {
  if (mouseButton == RIGHT) {
    treevis.up();
  } else {
    treevis.select(mouseX, mouseY);
  }
}