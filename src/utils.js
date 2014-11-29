var GUESS_COLORS = [
  'skyblue',
  'yellow',
  'orange'
];

var SVG = function(el) {
  var elem = new SVG.Element('svg', el);
  el.appendChild(elem.node);
  return elem;
};

var supportsSVG = function() {
  return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
};

var camelCase = function(s) {
  return s.toLowerCase().replace(/-(.)/g, function(m, g) {
    return g.toUpperCase();
  });
};

var localStorageKey = function(id, prefix) {
  if (prefix == null) {
    prefix = 'spot-the-ball';
  }

  return prefix + '.' + id;
};

var eventCoordinates = function(event) {
  x = event.clientX;
  y = event.clientY;

  if (webkit_mouse_bug44083 === 1 || (webkit_mouse_bug44083 === 0 && detectWebkitBug44083())) {
    x = event.pageX;
    y = event.pageY;
  }

  return {x: x, y: y};
};

// Safari bug getScreenCTM ignores scrolling
// https://bugs.webkit.org/show_bug.cgi?id=44083
// https://github.com/mbostock/d3/issues/1903
// https://github.com/mbostock/d3/blob/d6598447cc972385fc34ca10f542fc53ad174183/src/event/mouse.js
var webkit_mouse_bug44083 = /WebKit/.test(navigator.userAgent) ? 0 : -1;

var detectWebkitBug44083 = function() {
  if (window.scrollX || window.scrollY) {
    var svg = SVG(document.body).style({
      position: 'absolute',
      top: 0,
      left: 0,
      margin: 0,
      padding: 0,
      border: 'none'
    });

    var ctm = svg.node.getScreenCTM();
    document.body.removeChild(svg.node);
    webkit_mouse_bug44083 = !(ctm.f || ctm.e) ? 1 : -1;
    return webkit_mouse_bug44083;
  }

  webkit_mouse_bug44083 = 0;
  return webkit_mouse_bug44083;
};