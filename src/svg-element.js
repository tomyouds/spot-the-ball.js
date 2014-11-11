// SVG helper functions based on svg.js API
SVG.Element = function(name, parent, nonSvg) {
  if (nonSvg) {
    this.node = document.createElement(name);
  }
  else {
    this.node = document.createElementNS('http://www.w3.org/2000/svg', name);
  }
  this.parent = parent;
};

SVG.Element.prototype.attr = function(attributes, value) {
  if (typeof attributes === 'object') {
    for (var v in attributes) {
      this.attr(v, attributes[v]);
    }
  }
  else {
    this.node.setAttribute(attributes, value.toString());
  }

  return this;
};

SVG.Element.prototype.style = function(attributes, value) {
  applyCSS(this.node, attributes, value);

  return this;
};

var applyCSS = function(node, attributes, value) {
  if (typeof attributes === 'object') {
    for (var v in attributes) {
      applyCSS(node, v, attributes[v]);
    }
  }
  else {
    node.style[camelCase(attributes)] = value;
  }
};

SVG.Element.prototype.image = function(src) {
  var elem = new SVG.Element('img', this, true);
  elem.attr({src: src, width: '100%'});
  elem.style({position: 'absolute', top: 0, left: 0});
  this.node.parentNode.appendChild(elem.node);
  return elem;
};

SVG.Element.prototype.circle = function(size) {
  var elem = new SVG.Element('circle');
  var radius = size/2;
  elem.attr({r: radius});
  this.node.appendChild(elem.node);
  return elem;
};

SVG.Element.prototype.rect = function(w, h) {
  var elem = new SVG.Element('rect');
  elem.attr({width: w, height: h});
  this.node.appendChild(elem.node);
  return elem;
};

SVG.Element.prototype.text = function(content) {
  var elem = new SVG.Element('text');
  var tspan = new SVG.Element('tspan');
  tspan.node.appendChild(document.createTextNode(content));
  elem.node.appendChild(tspan.node);
  this.node.appendChild(elem.node);
  return elem;
};

SVG.Element.prototype.group = function() {
  var elem = new SVG.Element('g');
  this.node.appendChild(elem.node);
  return elem;
};

SVG.Element.prototype.hide = function() {
  return this.style('opacity', '0');
};

SVG.Element.prototype.show = function() {
  return this.style('opacity', '1');
};

SVG.Element.prototype.on = function(event, func) {
  this.node.addEventListener(event, func);
};

SVG.Element.prototype.move = function(x, y) {
  this.attr({cx: x, cy: y});
};