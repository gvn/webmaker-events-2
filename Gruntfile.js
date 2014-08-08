/* global require */
module.exports = function (grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
      development: {
        files: {
          'app/compiled/app.ltr.css': 'app/less/app.less'
        },
        options: {
          sourceMap: true,
          sourceMapBasepath: 'app',
          sourceMapRootpath: '/'
        }
      },
      production: {
        files: {
          'app/compiled/app.ltr.css': 'app/less/app.less'
        }
      }
    },
    watch: {
      less: {
        files: ['app/less/**/*.less', 'bower.json'],
        tasks: ['less:development']
      },
      server: {
        files: ['server/**/*', 'package.json'],
        tasks: ['shell:runServer']
      }
    },
    cssjanus: {
      'app/compiled/app.rtl.uncss.css': 'app/compiled/app.ltr.uncss.css',
      options: {
        swapLtrRtlInUrl: true,
        swapLeftRightInUrl: false,
        generateExactDuplicates: false
      }
    },
    shell: {
      runServer: {
        options: {
          async: true
        },
        command: 'node server/server.js'
      }
    },
    jsonlint: {
      json: {
        src: [
          'bower.json',
          'package.json',
          'locale/**/*.json'
        ]
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'app/js/**/*.js'],
      options: {
        ignores: ['app/js/lib/**/*.js'],
        jshintrc: '.jshintrc'
      }
    },
    jsbeautifier: {
      modify: {
        src: ['Gruntfile.js', 'app/js/**/*.js', '!app/js/lib/**/*.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      validate: {
        src: ['Gruntfile.js', 'app/js/**/*.js', '!app/js/lib/**/*.js'],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    },
    angular_i18n_finder: {
      files: ['app/index.html', 'app/views/*.html', 'app/views/**/*.html'],
      options: {
        pathToJSON: ['locale/en_US/*.json'],
        ignoreKeys: []
      }
    },
    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      ltr: {
        src: 'app/compiled/app.ltr.uncss.css',
        dest: 'app/compiled/app.ltr.uncss.min.css'
      },
      rtl: {
        src: 'app/compiled/app.rtl.uncss.css',
        dest: 'app/compiled/app.rtl.uncss.min.css'
      }
    },
    uncss: {
      production: {
        options: {
          ignore: ['.pagination > .active > a', /\.multicolor-header\.color-[0-9]/, /we-rsvp.*/, /\.dropdown-menu/, /\.navbar/],
          stylesheets: ['compiled/app.ltr.css'],
          urls: ['http://localhost:1981/', 'http://localhost:1981/#/events'] // Deprecated
        },
        files: {
          'app/compiled/app.ltr.uncss.css': ['app/index.html', 'app/views/**/*.html']
        }
      }
    },
    'string-replace': {
      production: {
        files: {
          'app/index.html': 'app/index.template'
        },
        options: {
          replacements: [{
            pattern: '%_EXTENSIONS_%',
            replacement: '.uncss.min'
          }]
        }
      },
      development: {
        files: {
          'app/index.html': 'app/index.template'
        },
        options: {
          replacements: [{
            pattern: '%_EXTENSIONS_%',
            replacement: ''
          }]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell-spawn');

  grunt.registerTask('default', ['string-replace:development', 'shell:runServer', 'less:development', 'watch']);
  grunt.registerTask('build', ['string-replace:production', 'shell:runServer', 'less:production', 'uncss', 'cssjanus', 'cssmin']);

  // Clean code before a commit
  grunt.registerTask('clean', ['jsbeautifier:modify', 'jsonlint', 'jshint', 'angular_i18n_finder']);

  // Validate code (read only)
  grunt.registerTask('validate', ['jsbeautifier:validate', 'jsonlint', 'jshint']);
};
