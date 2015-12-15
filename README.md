# Wow

Wow - Ultimate component based gulp workflow

## Requirements

* node > [v1.0.35](http://npm.taobao.org/mirrors/node/v0.10.35/)
* ruby 2.0.0 + sass 3.4.13
* gulp 3.9.0

## Start

Install npm packages & Just run gulp command:

    $ npm install
    $ gulp start

then go browser open `http://localhost:1024` to enjoy.

## Features

1. Component based - just try demo
2. Buid with gulp and these plugins(thanks):
    1. uglify
    2. sass
    3. nunjucks
    4. eslint
    5. livereload
3. Built-in boilerplate
4. Easy to configuration

## CLI

### $ gulp start

Start a local server with livereload

### $ gulp uglify

Compress source script file to dest

### $ gulp copy

Copy source image file to dest

### $ gulp nunjucks

Compile nunjucks template to html

### $ gulp sass

Compile sass to css file

### $ gulp deploy [-t] [-f path/to/file] [-v=0.0.0]

Upload dest file to remote ftp server

### $ gulp release [-t] [-f path/to/file]

Release project to dest, if `-t` both with template file

    Read the gulpfile is best way to know how it works.
