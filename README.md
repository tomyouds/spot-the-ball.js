# spot-the-ball.js

A JavaScript implementation of the newspaper game [Spot the Ball](https://en.wikipedia.org/wiki/Spot_the_ball).

## Game
Spot the ball is a game where players guess the position of the ball after viewing an altered photograph of a sporting event with the ball removed. Spot the ball was originally a newspaper game common in the 1970s and 1980s in the UK. This project is inspired  by the [New York Times World Cup version](http://projects.nytimes.com/interactive/sports/worldcup/spot-the-ball/2014/06/17) of the game.

## Demo
A demo is available [here](http://tomyouds.github.io/spot-the-ball.js).

More examples with real guess data can be found on MLSsoccer.com:
- [November 4 2014](http://www.mlssoccer.com/news/article/2014/11/03/spot-ball-week-one)
- [November 11 2014](http://www.mlssoccer.com/news/article/2014/11/11/spot-ball-back-popular-demand-mls-cup-playoff-conference-semifinal-second-le)
- [November 25th 2014](http://www.mlssoccer.com/news/article/2014/11/24/spot-ball-time-take-another-stab-mlssoccercom-game-keeps-you-guessing)

## Download
[spot-the-ball.js 1.0.1](https://raw.github.com/tomyouds/spot-the-ball.js/master/spot-the-ball.js)

## Usage
``` js
new SpotTheBall(element,
  // options
  id: 'spot-the-ball-demo',
  size: {x: 750, y: 500, ball: 35},
  solution: {x: 634, y: 455},
  challengeImage: 'challenge.jpg',
  solutionImage: 'solution.jpg',
  onGuess: function(guess, distance) {
    ...
  }
);
```

## Browser compatibility
- Firefox 3.5+
- Chrome 4+
- Safari 5+
- Opera 10.5+
- Internet Explorer 9+