'use strict';
module.exports = function( grunt ){
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.config('watch',{
    options:{
      livereload:true
    },
    styles:{
      files:"css/**/*.css"
    }
  })
};
