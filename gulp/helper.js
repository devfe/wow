var path = require('path');
var _ = require('lodash');
var Util = require('./utils');

module.exports = {
    /**
     * 添加内置过滤器
     */
    addFilters: function(env, config) {
        /**
         * exclude 过滤器
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
    },

    /**
     * 转换手动引用的资源路径
     * {{ Tag('tagname', relative_path) }}
     * return
     *  <script src"production_path"></script>
     *  <link rel="stylesheet" type="text/css" href="production_path" />
     */
    addGlobals: function(env, config) {
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
    },

    /**
     * 添加自定义标签
     */
    addExtensions: function(env, config) {
        var _this = this;
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
                var cPath = config.componentFile
                    .replace(/{name}/g, name);

                var mergedData = _.assign(_this.getComponentData(cPath, config), data, {
                    name: config.name,
                    version: config.version
                });
                return env.render(cPath, mergedData);
            };
        };

        env.addExtension('component', new ComponentTag());
    },

    /**
     * 获取组件数据
     */
    getComponentData: function (cName, config) {
        var cfgPath = path.join(process.cwd(), config.source, path.dirname(cName), 'config.js');
        var data = {};

        if (Util.hasContents(cfgPath)) {
            data = require(cfgPath).data;
        }
        // clear node module cache.
        delete require.cache[cfgPath];
        return data;
    }
};
