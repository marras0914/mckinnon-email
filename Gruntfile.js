module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        /**
         * Project Paths Configuration
         * ===============================
         */
        paths: {
            //images folder name
            images: 'img',
            //where to store built files
            dist: 'dist',
            //sources
            src: 'app',
            //main email file
            email: 'index.html',
            //enter here yout production domain
            distDomain: 'http://psiclientweb.com/mck/img',
            //this is the default development domain
            devDomain: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/'
        },

        /**
         * SCSS Compilation Tasks
         * ===============================
         */
        compass: {
            options: {
                sassDir: '<%= paths.src %>/scss',
                outputStyle: 'expanded',
                httpImagesPath: '/img/'
            },
            dev: {
                options: {
                    cssDir: '<%= paths.src %>/css',
                    imagesDir: '<%= paths.src %>/<%= paths.images %>',
                    noLineComments: false
                }
            },
            dist: {
                options: {
                    force: true,
                    cssDir: '<%= paths.dist %>/css',
                    imagesDir: '<%= paths.dist %>/<%= paths.images %>',
                    noLineComments: true,
                    assetCacheBuster: false
                }
            }
        },

        /**
         * Watch Task
         * ===============================
         */
        watch: {
            compass: {
                files: ['<%= paths.src %>/scss/**/*.scss'],
                tasks: ['compass:dev']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= paths.src %>/<%= paths.email %>',
                    '<%= paths.src %>/css/{,*/}*.css',
                    '<%= paths.src %>/<%= paths.images %>/{,*/}*.{png,jpg,jpeg,gif}'
                ]
            }
        },

        /**
         * Server Tasks
         * ===============================
         */
        connect: {
            options: {
                open: '<%= paths.devDomain %>/<%= paths.email %>',
                hostname: 'localhost',
                port: 8000,
                livereload: 35729
            },
            dev: {
                options: {
                    base: '<%= paths.src %>'
                }
            },
            dist: {
                options: {
                    keepalive: true,
                    livereload: false,
                    base: '<%= paths.dist %>'
                }
            }
        },

        /**
         * Cleanup Tasks
         * ===============================
         */
        clean: {
            dist: ['<%= paths.dist %>']
        },

        /**
         * Images Optimization Tasks
         * ===============================
         */
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.src %>/<%= paths.images %>',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= paths.dist %>/<%= paths.images %>'
                }]
            }
        },

        /**
         * Premailer Parser Tasks
         * ===============================
         */
        premailer: {
            options: {
                baseUrl: '<%= paths.distDomain %>'
            },
            dist: {
                src: '<%= paths.src %>/<%= paths.email %>',
                dest: '<%= paths.dist %>/<%= paths.email %>'
            }
        },

        /**
         * Test Mailer Tasks
         * ===============================
         */
        nodemailer: {
            options: {
                transport: {
                    type: 'SMTP',
                    options: {
                        service: 'Gmail',
                        auth: {
                            user: 'arras.marco@gmail.com',
                            pass: 'Monam3na'
                        }
                    }
                },
                recipients: [
                    {
                        name: 'marco.arras@hkstrategies.com',
                        email: 'marco.arras@hkstrategies.com'
                    }
                ]
            },
            dist: {
                src: ['<%= paths.dist %>/<%= paths.email %>']
            }
        }

    });

    [
        'grunt-contrib-connect',
        'grunt-contrib-watch',
        'grunt-contrib-compass',
        'grunt-contrib-imagemin',
        'grunt-contrib-clean',
        'grunt-premailer',
        'grunt-nodemailer',
    ].forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', 'dev');

    grunt.registerTask('dev', [
        'compass:dev',
        'connect:dev',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'imagemin',
        'compass:dist',
        'premailer:dist',
        'connect:dist'
    ]);

    grunt.registerTask('send', [
        'clean',
        'imagemin',
        'compass:dist',
        'premailer:dist',
        'nodemailer'
    ]);

};
