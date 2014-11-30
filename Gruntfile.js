module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      build: {
        src: [
          'src/utils.js',
          'src/svg-element.js',
          'src/spot-the-ball.js'
        ],
        dest: 'spot-the-ball.js'
      }
    },
    umd: {
      app: {
        src: 'spot-the-ball.js',
        objectToExport: 'SpotTheBall',
        indent: '  '
      }
    },
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '/*!\n * <%= pkg.title || pkg.name %> v<%= pkg.version %>\n * <%= pkg.homepage %>\n *\n * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n * Licensed under the <%= pkg.license %> license\n */\n',
          linebreak: true
        },
        src: 'spot-the-ball.js'
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          keepalive: true,
          base: 'demo'
        }
      }
    },
    watch: {
      options: {
        livereload: true,
        spawn: false
      },
      scripts: {
        files: ['src/**/*.js', 'demo.js'],
        tasks: ['build:demo']
      }
    },
    jshint: {
      options: {
        jshintrc: true,
      },
      browser: {
        files: {
          src: ['src/**/*.js']
        }
      },
      node: {
        files: {
          src: ['Gruntfile.js']
        }
      }
    },
    browserify: {
      app: {
        src: 'demo.js',
        dest: 'demo/demo.js',
        options: {
          debug: true
        }
      }
    },
    markdown: {
      all: {
        options: {
          template: 'demo/template.html',
          preCompile: function(src, context) {
            var demoContent = '<div id="spot-the-ball-demo"></div><em>(Photo by <a href="https://secure.flickr.com/photos/16638697@N00/4841859880" target="_blank">Ed Schipul</a>, licensed under the <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank">Creative Commons Attribution-Share Alike 2.0</a> license.)</em>';
            return src.replace('A demo is available [here](http://tomyouds.github.io/spot-the-ball.js).', demoContent);
          }
        },
        files: {
          'demo/index.html': 'README.md'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-markdown');
  grunt.loadNpmTasks('grunt-umd');

  grunt.registerTask('default', ['build:demo', 'watch']);
  grunt.registerTask('build', ['jshint', 'concat', 'umd', 'usebanner']);
  grunt.registerTask('build:demo', ['build', 'browserify', 'markdown']);
  grunt.registerTask('server', ['connect']);
};
