# Wow

Wow - Ultimate component based gulp workflow

## Requirements

* node > [v0.10.35](http://npm.taobao.org/mirrors/node/v0.10.35/)
* ruby 2.0.0 + sass 3.4.13
* gulp 3.9.0

## Start

Install npm packages & Just run gulp command:

    $ npm install && npm install -g gulp
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

## CLI(command)

### $ gulp start

Start a local server with livereload

### $ gulp build

Build source to destination

### $ gulp deploy

Upload **build** file to remote ftp server

### $ gulp release [-t] [-f path/to/file]

Release project to git repo

## CLI(option)

### -f

Specify a single file to processed

    $ gulp build -f app/components/main/main.js

### -d

Debug mode will not compress source file

### -t

Processing contain template html files

### -v

Specify a version to processed

    $ gulp build -v 1.1.1
    
    // Directory result
    -build
    └─main
        └─[1.1.1]
            └─components
                ├─footer
                ├─main
                │  ├─i
                │  └─mixin
                ├─module
                └─sidebar
                
### -c

Start with component template, this is useful for separated component development

### Todos

- [x] deploy single file
- [x] deploy specified version of source code
- [ ] add git workflow to release command


> Read the gulpfile is best way to know how it works.
