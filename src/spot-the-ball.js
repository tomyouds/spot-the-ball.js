function SpotTheBall(element, options) {
  if (supportsSVG()) {
    this.element = element;
    this.options = options || {};

    // Scale font-size based on viewBox width
    this.fontSize = 0.021333333*options.size.x;

    // Block all actions after guess is made
    this.complete = false;

    applyCSS(this.element, {
      'padding-top': (this.options.size.y/this.options.size.x)*100 + '%',
      width: '100%',
      display: 'block',
      height: 'auto',
      position: 'relative'
    });

    this.preloadImages(function() {
      // Create SVG elements
      this.createElements();

      // Add heatmap
      this.addHeatMap();

      if (this.options.id && localStorage.getItem(localStorageKey(this.options.id))) {
        var savedGuess = JSON.parse(localStorage.getItem(localStorageKey(this.options.id)));
        this.focus();
        this.makeGuess(savedGuess.guess.x, savedGuess.guess.y, true);
      }

      // Display bootstrapped guesses
      this.guesses = [];

      if (this.options.guesses) {
        this.options.guesses.forEach(function(guess, i) {
          this.displayGuess(guess.x, guess.y, GUESS_COLORS[i%GUESS_COLORS.length], false);
        }, this);
      }

      this.element.className = (this.element.className + ' ' + (this.complete ? 'complete' : 'incomplete')).trim();

      // Listen for events
      this.eventListeners();
    }.bind(this));
  }
  else {
    element.innerHTML = 'You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to play.';
  }
}

SpotTheBall.prototype = {
  createElements: function() {
    // Clear root element
    this.element.textContent = '';

    this.container = SVG(this.element).attr({
      viewBox: '0 0 ' + this.options.size.x + ' ' + this.options.size.y
    });

    this.container.style({
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      overflow: 'hidden',
      cursor: 'pointer'
    });


    this.challengeImage = this.container.image(this.options.challengeImage, this.options.size.x, this.options.size.y).attr('class', 'challenge');
    this.solutionImage = this.container.image(this.options.solutionImage, this.options.size.x, this.options.size.y).attr('class', 'solution').hide();

    // Fix for moving images on opacity change
    [this.challengeImage, this.solutionImage].forEach(function(img) {
      img.style({
        '-webkit-backface-visibility': 'hidden',
        'backface-visibility': 'hidden',
        '-webkit-transform': 'rotate(0)',
        'transform': 'rotate(0)'
      });
    });

    this.element.appendChild(this.challengeImage.node);
    this.element.appendChild(this.solutionImage.node);

    this.element.appendChild(this.container.node);

    this.heatMap = this.container.group().attr('class', 'heat-map').style({opacity: 0});

    this.cursor = this.container.circle(this.options.size.ball-8).attr({
      'class': 'cursor',
      fill: 'none',
      'stroke-width': '8',
      stroke: 'purple',
      opacity: 0.75,
      cx: this.options.size.x/2,
      cy: this.options.size.y/2
    }).hide();

    this.overlay = this.container.group().attr('class', 'overlay');
    this.overlay.rect(this.options.size.x, this.options.size.y).attr({fill: '#000', opacity: 0.5});

    var label;

    if(('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) {
      label = 'Touch where you think the ball is';
    }
    else {
      label = 'Click where you think the ball is';
    }


    this.addLabel({x: this.options.size.x/2, y: this.options.size.y/2, 'text-anchor': 'middle', 'alignment-baseline': 'middle'}, label, this.overlay);
  },

  preloadImages: function(next) {
    // Preload images
    var preloadChallenge = document.createElement('img');
    var preloadSolution = document.createElement('img');
    var loaded = 0;

    var preloaded = function() {
      loaded++;
      if (loaded >= 2) {
        next();
      }
    };

    preloadChallenge.onload = preloaded;
    preloadSolution.onload = preloaded;

    preloadChallenge.src = this.options.challengeImage;
    preloadSolution.src = this.options.solutionImage;
  },


  eventListeners: function() {
    this.container.on('mousemove', (function(event) {
      if (this.complete) return;

      this.focus();

      var point = this.scalePoint(eventCoordinates(event));

      this.cursor.move(point.x, point.y);
    }).bind(this));

    this.container.on('mouseleave', this.blur.bind(this));
    // this.container.on('mouseenter', this.focus.bind(this));

    this.container.on('touchstart', (function(event) {
      if (this.complete) return;
      window.clearTimeout(this.resetTimer);
      this.removeConfirmBox();
      this.focus();

      var point = this.scalePoint(eventCoordinates(event.touches[0]));
      this.cursor.move(point.x, point.y);

      event.preventDefault();
    }).bind(this));

    this.container.on('touchmove', (function(event) {
      if (this.complete) return;

      var point = this.scalePoint(eventCoordinates(event.touches[0]));
      this.cursor.move(point.x, point.y);

      event.preventDefault();
    }).bind(this));

    this.container.on('touchend', (function(event) {
      if (this.complete) return;

      var point = this.scalePoint(eventCoordinates(event.changedTouches[0]));
      this.cursor.move(point.x, point.y);

      // Moved out of view
      if (point.x < 0 || point.y < 0 || point.x > this.options.size.x || point.y > this.options.size.y) {
        return this.blur();
      }

      // Add a confirm label for touch
      if (point.x < this.options.size.x/2) {
        // Right
        pos = {x: point.x+(this.options.size.ball/2)+20, y: point.y, 'text-anchor': 'start'};
      }
      else {
        // Left
        pos = {x: point.x-(this.options.size.ball/2)-20, y: point.y, 'text-anchor': 'end'};
      }

      this.removeConfirmBox();

      this.confirmBox = this.container.group();

      this.addLabel(pos, 'Tap here to confirm guess', this.confirmBox);

      // Bind all touch events for confirm box
      this.confirmBox.on('touchstart', function(event) {
        event.stopPropagation();
        event.preventDefault();
      });

      this.confirmBox.on('touchmove', function(event) {
        event.stopPropagation();
        event.preventDefault();
      });

      this.confirmBox.on('touchend', (function(event) {
        this.makeGuess(point.x, point.y);
        this.container.node.removeChild(this.confirmBox.node);
        this.confirmBox = null;
      }).bind(this));


      // Reset if guess not confirmed after 10s
      this.resetTimer = window.setTimeout((function() {
        this.removeConfirmBox();
        this.blur();
      }).bind(this), 10000);

      event.preventDefault();
    }).bind(this));


    this.container.on('click', (function(event) {
      if (this.complete) return;
      this.focus();

      point = this.scalePoint(eventCoordinates(event));

      this.makeGuess(point.x, point.y);
    }).bind(this));
  },

  removeConfirmBox: function() {
    if (this.confirmBox) {
      this.container.node.removeChild(this.confirmBox.node);
      this.confirmBox = null;
    }
  },

  scalePoint: function(point) {
    var svgPoint = this.container.node.createSVGPoint();
    svgPoint.x = point.x;
    svgPoint.y = point.y;

    svgPoint = svgPoint.matrixTransform(this.container.node.getScreenCTM().inverse());

    return {x: svgPoint.x, y: svgPoint.y};
  },

  focus: function() {
    if (this.complete) return;
    this.overlay.hide();
    this.cursor.show();
  },

  blur: function() {
    if (this.complete) return;
    this.overlay.show();
    this.cursor.hide();
  },

  heatSpot: function(spot) {
    this.heatMap.circle(this.options.size.ball).attr({cx: spot.x, cy: spot.y, fill: 'white', opacity: Math.min((spot.weight*2 || 1), 1)});
  },

  addHeatMap: function() {
    if (this.options.heatMap && this.options.heatMap.length) {
      this.options.heatMap.forEach(this.heatSpot, this);
    }
  },

  calculateDistance: function(x, y) {
    return Math.round(Math.sqrt(Math.pow(this.options.solution.x-x, 2)+Math.pow(this.options.solution.y-y, 2)));
  },

  makeGuess: function(x, y, previous) {
    if (this.complete) return;

    var guess = {x: x, y: y};

    // Check accuracy
    var distance = this.calculateDistance(x, y);

    var correct = distance < this.options.size.ball;

    // Show solution
    this.solutionImage.show();

    this.container.style({
      cursor: 'default'
    });

    this.complete = true;

    this.heatMap.style({opacity: 0.75});

    if (this.guesses && this.guesses.length) {
      this.guesses.forEach(function(guess) {
        guess.style({opacity: 1});
      });
    }

    // Display actual guess
    this.displayGuess(guess.x, guess.y, correct ? 'limegreen' : 'red', true);

    if (previous) {
      this.container.attr('class', 'complete');
      return;
    }

    // Store guess in localStorage
    if (this.options.id) {
      localStorage.setItem(localStorageKey(this.options.id), JSON.stringify({guess: guess, distance: distance}));
    }

    if (this.options.onGuess) this.options.onGuess.call(this, guess, distance);
  },

  displayGuess: function(x, y, color, cursor) {
    if (cursor) {
      this.cursor.attr({
        'class': 'guess',
        cx: x,
        cy: y
      }).style('stroke', color);
    }
    else {
      this.guesses.push(this.container.circle(this.options.size.ball-8).attr({
        'class': 'guess',
        fill: 'none',
        'stroke-width': '8',
        stroke: color,
        opacity: 0.75,
        cx: x,
        cy: y
      }).hide());
    }
  },

  addLabel: function(pos, text, container) {
    if (!container) {
      container = this.container;
    }

    var labelText  = container.text(text).attr({'font-size': this.fontSize, fill: '#FFF', 'dominant-baseline': 'central'}).attr(pos);

    var labelBox = labelText.node.getBBox();

    container.rect(labelBox.width+28, labelBox.height+20).attr({
      fill: 'black',
      opacity: 0.75,
      x: labelBox.x-14,
      y: labelBox.y-10,
      rx: 5,
      ry: 5
    });

    container.node.appendChild(labelText.node);
  }
};