var path = require('path');

var gulp = require('gulp');
var data = require('gulp-data');
var gulpif = require('gulp-if');
var livereload = require('gulp-livereload');
var Util = require('./utils');
var _ = require('lodash');

var nunjucksRender = require('gulp-nunjucks-render');

var ComponentPath = '{cDir}/{name}/{name}.html';

/*
function getTplVal(data) {
    var res = '';
    for( var key in data ) {
        if ( data.hasOwnProperty(key) ) {
            res += '{% set '+ key +'="'+ data[key] +'" %}\n';
        }
    }
    return res;
}

function parseComponentTag (config) {
    var RE_COMPONENT = /\{\%\scomponent\s([^%]+)\%\}/g;
    var RE_NAME = /\bname=["'](\w+)["']/;
    var RE_DATA = /\bdata=["'](.+)["']/;

    var _component = {};

    return replace(RE_COMPONENT, function(source) {
        var mName = source.match(RE_NAME);
        var mData = source.match(RE_DATA);

        var name, data, result = source;

        if ( mName ) {
            name = mName[1];
        } else {
            console.error('Component name not given.');
            return result;
        }
        if ( mData ) {
            data = mData[1];
        }

        try {
            //console.log('Name: %s | Data: %s', name, data);
            data = (new Function('return ' + data))();
        } catch (e) {
            console.error('Component tag parse error. \n');
            console.log(e);
            return result;
        }

        var cPath = path.join(config.component, name, name);
        var cData = data ? getTplVal(data) : '';

        // 标记加载过的组件
        if ( !_component[cPath] ) {
            _component[cPath] = {
                name: name,
                path: cPath
            };
        }

        // include 组件模板后绑定参数data字段到当前组件作用域
        result = '\
        {% for i in range(0, 1) %}\n\
            '+ cData +'\
            {% include "'+ Util.dirToPath(cPath) +'.html" %}\n\
        {% endfor %}\n';

        return result;
    }).on('data', function(file) {
        config._components[file.path] = _component;
    });
}
*/

// 解析组件引用拼成对象数据
function parseReference(config, file) {
    var content = String(file.contents);
    var RE_COMPONENT = /\{\%\scomponent\s([^%]+)\%\}/g;

    var results = content.match(RE_COMPONENT) || [];

    function getName(str) {
        return str.replace(/\{\%\scomponent\s/g, '')
            .replace(/\%\}/g, '')
            .replace(/\s/g, '')
            .replace(/'/g, '')
            .replace(/"/g, '').trim();
    }
    /*
    _components:
     {
        "path/to/template/file": {
            "path/to/component0": { name: 'c2', path: ""},
            "path/to/component1": { name: 'c1', path: ""}
        }
     }
    */
    config._components[file.path] = {};

    results.forEach(function (r) {
        var name = getName(r.split(',')[0]);
        var cPath = ComponentPath
            .replace('{cDir}', config.component)
            .replace(/{name}/g, name)
            .replace(/\.html/g, '');

        if (!config._components[file.path][cPath]) {
            config._components[file.path][cPath] = {
                name: name,
                path: cPath
            };
        }
    });

}

/**
 * 添加内置过滤器
 */
function addFilters(env, config) {
    /**
     * 过滤 components
     *  {{ _components | exclude('main', 'footer') | source('style') }}
     */
    env.addFilter('exclude', function() {
        var args = Array.prototype.slice.call(arguments);
        var components = args.shift();
        var result = {};

        for ( var c in components ) {
            //console.log('--%s-%s--', args, components[c]['name']);
            if ( args.indexOf( components[c]['name'] ) < 0 ) {
                result[c] = components[c];
            }
        }

        return result;
    });

    //
    /**
     * 获取拼合 component 资源文件
     *  {{ _components source('link') }}
     *  {{ _components source('script') }}
     */
    env.addFilter('source', function(components, type) {
        var paths = [];
        var EXT = type === 'link' ? '.scss' : '.js';
        var prefix = path.relative(config.source, process.cwd());

        var tag = Util.getTag(type);

        for ( var c in components ) {
            var filename = path.join(config.source, c + EXT);

            // 组件资源文件存在并且有内容才会产生引用
            if ( Util.hasContents(filename) ) {
                // html 里面引用相对路径不需要app
                paths.push(Util.dirToPath(path.join(prefix, c + EXT.replace('.scss', '.css'))));
            }
        }
        var result = paths.map(function(r) {
            return tag.replace('{{source}}', r);
        });
        var resultCombo = paths.map(function(r) {
            return path.join(config.view, r);
        });

        var comboPath = path.join(
            config.cdn,
            config.production,
            '??',
            resultCombo.join(',')
        );

        return config._isRelease
            ? tag.replace('{{source}}', Util.dirToPath(comboPath))
            : result.join('\n');
    });
}

/**
 * 转换手动引用的资源路径
 * {{ Tag('tagname', relative_path) }}
 * return
 *  <script src"production_path"></script>
 *  <link rel="stylesheet" type="text/css" href="production_path" />
 */
function addGlobals(env, config) {
    function getProductionPath(source) {
        var result = source;

        if (config._isRelease) {
            var realPath       = Util.relativeDir(path.resolve(config.view, source));
            var productionPath = path.join(
                config.cdn,
                config.production,
                realPath
            );

            result = Util.dirToPath(productionPath);
        }
        return result;
    }
    env.addGlobal('Tag', function (tagname, source) {
        return Util.getTag(tagname).replace('{{source}}', getProductionPath(source));
    });
}

/**
 * 添加自定义标签
 */
function addExtensions(env, config) {
    /**
     * {% component 'name' {title: 'Example', subtitle: 'An example component'} %}
     */
    var ComponentTag = function() {
        this.tags = ['component'];

        this.parse = function(parser, nodes, lexer) {
            var token = parser.nextToken();

            var args = parser.parseSignature(null, true);
            parser.advanceAfterBlockEnd(token.value);

            return new nodes.CallExtension(this, 'run', args);
        };

        this.run = function(context, name, data) {
            var cPath = ComponentPath
                .replace('{cDir}', config.component)
                .replace(/{name}/g, name);

            return env.render(cPath, _.assign(data, {
                name: config.name,
                version: config.version
            }));
        };
    };

    env.addExtension('component', new ComponentTag());
}

module.exports = function(config, file) {
    var src = file || config.views[0];
    var env = nunjucksRender.nunjucks.configure(config.source, {watch: false});

    addExtensions(env, config);
    addFilters(env, config);
    addGlobals(env, config);

    return function(cb) {
        cb = cb || function() {};

        gulp.src(src, { base: config.source })
            //.pipe(parseComponentTag(config))
            .pipe(data(function (file) {
                return parseReference(config, file);
            }))
            .pipe(data(function (file) {
                return {
                    name: config.name,
                    version: config.version,
                    _components: config._components[file.path]
                };
            }))
            .pipe(nunjucksRender())
            .pipe(gulp.dest(config.dest))
            .on('end', cb)
            .pipe(gulpif(config._isWatch, livereload()));
    }
};

