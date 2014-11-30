'use strict';

var SpotTheBall = require('./spot-the-ball');

new SpotTheBall(document.getElementById('spot-the-ball-demo'), {
  size: {x: 750, y: 500, ball: 35},
  solution: {x: 634, y: 455},
  challengeImage: 'challenge.jpg',
  solutionImage: 'solution.jpg',
  heatMap: [{"x":668,"y":458,"weight":0.6},{"x":607,"y":471,"weight":0.44},{"x":551,"y":450,"weight":0.59},{"x":566,"y":472,"weight":0.32},{"x":619,"y":453,"weight":0.67},{"x":640,"y":457,"weight":0.32},{"x":636,"y":434,"weight":0.28},{"x":603,"y":415,"weight":0.3},{"x":605,"y":397,"weight":0.4},{"x":649,"y":393,"weight":0.8},{"x":638,"y":411,"weight":0.26},{"x":688,"y":408,"weight":0.27},{"x":714,"y":407,"weight":0.41},{"x":716,"y":453,"weight":0.72},{"x":713,"y":475,"weight":0.96},{"x":698,"y":476,"weight":0.55},{"x":659,"y":480,"weight":0.67},{"x":594,"y":481,"weight":0.83},{"x":538,"y":477,"weight":0.37},{"x":499,"y":454,"weight":0.82},{"x":485,"y":471,"weight":0.59},{"x":482,"y":449,"weight":0.97},{"x":459,"y":480,"weight":0.22},{"x":459,"y":466,"weight":0.31},{"x":444,"y":435,"weight":0.24},{"x":423,"y":469,"weight":0.4},{"x":404,"y":450,"weight":0.61},{"x":383,"y":480,"weight":0.97},{"x":343,"y":480,"weight":0.92},{"x":348,"y":423,"weight":0.98},{"x":351,"y":425,"weight":0.66},{"x":382,"y":425,"weight":0.42},{"x":485,"y":417,"weight":0.96},{"x":517,"y":417,"weight":0.98},{"x":562,"y":366,"weight":0.49},{"x":567,"y":405,"weight":0.7},{"x":552,"y":347,"weight":0.63},{"x":610,"y":349,"weight":0.51},{"x":560,"y":335,"weight":0.57},{"x":557,"y":370,"weight":0.33}]
});