module.exports = function(grunt) {
	'use strict';

	require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dist: {
        options: {
          transform: [
	         ['babelify', {
	           presets: ['es2015']
	         }],
           ['reactify'],
	         ['uglifyify']
          ]
        },
        files: {
          'static/js/app.js' : 'client/src/**/*.es6'
        }
      },
      dev: {
        options: {
          transform: [
            ['babelify', {
              presets: ['es2015']
            }],
            ['reactify']
          ],
          browserifyOptions: {
            debug: true
          }
        },
        files: {
          'static/js/app.js' : 'client/src/**/*.es6'
        }
      }
    },

    copy: {
      all: {
        files: [{
          expand: true,
          cwd: 'client/src/',
          src: ['partials/**', 'index.html'],
          dest: 'static/'
        }]
      }
    },

    wiredep: {
      task: {
        src: [ 'static/index.html'],
      }
    },

    inject: {
      dist: {
        files: {
          'static/index.html': 'static/index.html'
        },
        scriptsrc: 'static/js/app.min.js'
      },
      dev: {
        files: {
          'static/index.html': 'static/index.html'
        },
        scriptsrc: 'static/js/app.js'
      }
    },

    inject_css: {
      dist: {
        files: {
          'static/index.html': 'static/css/style.min.css'
        }
      },
      dev: {
        files: {
          'static/index.html': 'static/css/style.css'
        }
      }
    },

    less: {
      options: {
        paths: ['static/bower_components/bootstrap/less'],
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'static/css/style.css': 'client/src/less/style.less'
        }
      },
      dev: {
        options: {
          sourceMap: true
        },
        files: {
          'static/css/style.css': 'client/src/less/style.less'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9']
      },
      dist:{
        files:{
          'static/css/style.css': 'static/css/style.css'
        }
      },
      dev: {
        options: {
          map: true
        },
        files: {
          'static/css/style.css': 'static/css/style.css'
        }
      }
    },

    useminPrepare: {
      options: {
        dest: 'static/css'
      },
      html: 'static/index.html'
    },

    usemin: {
      options: {
        dirs: ['dist']
      },
      html: ['static/index.html'],
      css: ['static/css/**/*.css']
    },

    karma: {
      unit: {
        configFile: './karma.conf.js',
        autoWatch: true,
        singleRun: false
      },
    },

    eshint: {
    	all: ['Gruntfile.js', 'karma.config.js', 'client/**/*.es6']
  	},

    watch: {
      grunt: {
        options: {
          reload: true
        },
        files: 'Gruntfile.js'
      },

      less: {
        files: 'client/src/less/**/*.less',
        tasks: ['css:dev']
      },

      js: {
        files: 'client/src/js/**/*.es6',
        tasks: ['js:dev']
      },

      css: {
        options: {
          livereload: true //port 35729
        },
        files: 'static/**/*.css'
      },

      html: {
        files: ['client/src/**/*.html'],
        tasks: ['inject_all:dev']
      }
    },

    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch:js', 'watch:css'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    nodemon: {
      dev: {
        script: './index.js'
      }
    },

    clean: {
      all: ['static/**/*.*', '!static/bower_components']
    }
  });

  grunt.registerTask('default', ['dev']);
  grunt.registerTask('dev', ['css:dev', 'js:dev', 'inject_all:dev', 'concurrent']);
  grunt.registerTask('dist', ['clean', 'css:dist', 'js:dist', 'inject_all:dist']);
  grunt.registerTask('js:dev', ['browserify:dev']);
  grunt.registerTask('js:dist', ['browserify:dist']);
  grunt.registerTask('inject_all:dev', ['copy', 'wiredep', 'inject:dev', 'inject_css:dev']);
  grunt.registerTask('inject_all:dist', ['copy', 'wiredep', 'inject:dist', 'inject_css:dist']);
  grunt.registerTask('css:dev', ['less:dev', 'autoprefixer:dev']);
  grunt.registerTask('css:dist', ['less:dist', 'autoprefixer:dist']);

  // testing
  grunt.registerTask('test', ['lint', 'karma:unit']);
  grunt.registerTask('lint', ['eslint']);
};
