var mushroominator = require('mushroominator');

function loadXMLDoc(fileName) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", fileName, false);
  xmlhttp.send(null);
  return xmlhttp.responseText;
}

function parse(fileName) {
  parser = new DOMParser();
  var text = loadXMLDoc(fileName);
  xmlDoc = parser.parseFromString(text, "text/xml");
  var ps_elements = xmlDoc.getElementsByTagName("ps_element");

parseTag = function(element, tagName) {
  return element.getElementsByTagName(tagName)[0].innerHTML;
}

var threePSElements = [];
for (let ps_element of ps_elements) {
    var element_id = parseTag(ps_element, "element_id");
    var element_type = parseTag(ps_element, "element_type");
    var x = parseTag(ps_element, "x");
var y = parseTag(ps_element, "y");
var z = parseTag(ps_element, "z");
var rot_x = parseTag(ps_element, "rot_x");
var rot_y = parseTag(ps_element, "rot_y");
var rot_z = parseTag(ps_element, "rot_z");

    var type, element;

switch (element_type) {
  case "rectangle_540_540":
    type = mushroominator.PSElementType.Rectangle;
    element = mushroominator.PSElement.rectangle_540_540;
    break;

    case "beam_7_495":
      type = mushroominator.PSElementType.Beam;
      element = mushroominator.PSElement.beam_7_495;
      break;
}

var threePSElement = {
   type : type,
    element : element,
     pos : [x, y, z],
      rotation : [rot_x, rot_y, rot_z]
     };

threePSElements.push(threePSElement);
}

return threePSElements;
}

exports.parse = parse;
