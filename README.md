# p5.treevis
![p5.treevis](p5treevis.png)

With this library, one can create and customize a [treemap](https://en.wikipedia.org/wiki/Treemapping) or a [sunburst](https://en.wikipedia.org/wiki/Pie_chart#Ring_chart_/_Sunburst_chart_/_Multilevel_pie_chart) visualisation from any json object tree.

The json object tree should be an object with the following structure:

```EBNF
<Node> ::= 
{
   <Name> : string,
   <Value> : number,
   <Children> : [ <Node>, ... ]
}
```

For leaf nodes, &lt;Children&gt; is optional. For parent nodes, &lt;Name&gt; and &lt;Value&gt; are optional.

Example:

```json
{
   "children":[
      {
         "name":"a",
         "size":1
      },
      {
         "children":[
            {
               "name":"b",
               "size":2
            },
            {
               "name":"c",
               "size":3
            }
         ]
      }
   ]
}
```

The property names &lt;Name&gt;, &lt;Value&gt; and &lt;Children&gt; must be specified in a parameter-object (see example code below).

If you want, you can generate a json file containing a json tree out from any folder at your disk. Just scan it with my python script (use [scandir.py](scanner/scandir.py) in the scanner folder)

Following command scans project directory ../ and write into file
```shell
python scandir.py ../ > ../examples/data/test.json
```

## Live examples
  + [Testbed with several examples in one large canvas](https://oth-aw.github.io/treevis/)
  + [Basic Sunburst example](https://oth-aw.github.io/treevis/examples/index_sunburst.html)
  + [Basic Treemap example](https://oth-aw.github.io/treevis/examples/)
  + [Treemap example without canvas](https://oth-aw.github.io/treevis/examples/index_div.html)
  
 
## Installation
Just include the scripts.
```html
<script src="addons/p5.dom.min.js"></script>
<script src="addons/p5.treevis.js"></script>
```

## Basic usage
This is a complete example for displaying and drawing with interaction
Please look in the source code of examples to see how to customize.
Or look in the well documented source files in the src folder.

```javascript
var treevis, data;

function preload() {
  // Loads json tree
  data = loadJSON("data/example_scan.json");
}

function setup() {
  createCanvas(800, 600);
  // Description of json properties
  // 'children' is an array with child objects
  // 'name' is identifier
  // 'size' is content value
  var properties = {
      children: "children",
      label: "name",
      value: "size"
  };
  // creates a new Sunburst object
  treevis = createSunburst(data, properties);
  //callback function
  treevis.onSelected((v, name) => console.log("Selected: "+name));
}

function draw() {
  background(255);
  // draws sunburst
  treevis.draw();
}

function mouseClicked() {
  if (mouseButton == RIGHT) {
    // navigate out
    treevis.up();
  } else {
    // navigate in
    treevis.select(mouseX, mouseY);
  }
}
```
## p5.treevis documentation

#### createTreemap()
###### treemap = createTreemap(json_data, props)
Creates a new treemap visualisation

Rounds corners
```javascript
treemap.setCorner(5);
```

Makes inset
```javascript
treemap.setInset(5);
```

#### createSunburst()
###### sunburst = createSunburst(json_data, props)
Creates a new sunburst visualisation

Sets a different angle and draws a full circle
```javascript
sunburst.setAngle(90, 360);
```
Sets text invisible
```javascript
sunburst.setTextVisible(false);
```

## This works on both treemaps and sundbursts:

Callback function
```javascript
treevis.onSelected((v, name) => console.log("Selected: "+name));
```

Sets size and position
```javascript
treevis.setBounds(100,100,400,400);
```

Customize fill
```javascript
treevis.onFill((level, maxLevel) => fill(color(237, (255 - level / maxLevel * 255) * 2 / 3, 255)));
```

Navigates in when mouse is pressed
```javascript
function mousePressed() {
    treevis.select(mouseX, mouseY);
}
```

Navigates out when mouse is pressed
```javascript
function mouseClicked() {
  treevis.up(mouseX, mouseY);
}
```

Navigates up without test if pressed mouse position is inside visualisation
```javascript
treevis.up();
```

Custom function for building label out of name property
```javascript
treevis.onGetLabel(name => name.substring(name.lastIndexOf("-") + 1));
```

Interaction off, no navigation in or out
```javascript
treevis.setInteraction(false);
```

Custom font size
```javascript
treevis.setTextStyle(14);
```

Custom font size and type
```javascript
treevis.setTextStyle(14, 'Times');
```
