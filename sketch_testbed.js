var data, info, options;
var vis = [];

var totalHeight, canvasWidth;

function preload() {
  data = loadJSON("examples/data/example_scan.json");
}

function setup() {

  var button = select("#allup");
  button.mousePressed(allUp);

  info = select("#info");

  var canv = createCanvas(windowWidth, windowHeight);
  canv.parent("container")

  background(255);

  var options = {
    children: "children",
    label: "name",
    value: "size"
  };

  //Sunburst Visualisations
  var tv;
  tv = createSunburst(data, options);
  init(tv);

  //Treemap Visualisation; customized
  tv = createTreemap(data, options);
  tv.setCorner(5);
  tv.setInset(5);
  tv.onFill((level, maxLevel) => fill(color(237, (255 - level / maxLevel * 255) * 2 / 3, 255)));
  init(tv);

  //Treemap Visualisation; different orientation
  tv = createSunburst(data, options);
  tv.setAngle(90, 360);
  init(tv);

  //Treemap Visualisation default
  tv = createTreemap(data, options);
  init(tv);


  windowResized();
}

function init(visu) {
  visu.onSelected(selected);
  vis.push(visu);
}

function selected(v, name) {
  select("#info").html(name);
}

function resizeAll() {
  var hg = canvasWidth / 3 * 2;
  hg = hg > 900 ? 900 : hg
  var border = canvasWidth / 20;
  totalHeight = border;
  for (let tv of vis) {
    tv.setBounds(border, totalHeight, canvasWidth - 2 * border, hg);
    if (hg > 700) {
      tv.setTextStyle(16);
    } else {
      tv.setTextStyle(12);
    }

    totalHeight += hg + border;
  }
}

function draw() {
  background(255);
  for (let tv of vis) tv.draw();
}

function mousePressed() {
  if (mouseButton == RIGHT) {
    for (let tv of vis) tv.up(mouseX, mouseY);
  } else {
    for (let tv of vis) tv.select(mouseX, mouseY);
  }
}

function allUp() {
  for (let tv of vis) tv.up();
}

function windowResized() {
  canvasWidth = windowWidth > 1200 ? 1200 : windowWidth - 40;
  resizeAll();
  resizeCanvas(canvasWidth, totalHeight);
}