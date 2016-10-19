/* global module */

module.exports = function(grunt) {
    grunt.initConfig({        
        concat: {
            compile_app: {
                src: 'src/module/*.js',
                dest: 'src/app.js'
            }
        }
        /*
        watch: {
            files: './src/module/*.js',
            tasks: ['concat']
        }
        */
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    //grunt.loadNpmTasks('grunt-contrib-watch');
};
