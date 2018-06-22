const path = require('path')
const fs = require('fs');
const download = require('download');

class AutofonticonBocloudspWebpackPlugin {
  constructor(pluginOptions) {
    this.pluginOptions = pluginOptions;
  }

  apply(compiler) {
    let pluginOptions = this.pluginOptions
    compiler.plugin('compilation', function(compilation, options) {
      compilation.plugin('html-webpack-plugin-before-html-processing',
        function(htmlPluginData, callback) {

          if (process.env.NODE_ENV !== 'production') {
            // 开发环境
            htmlPluginData.assets.css.unshift(pluginOptions.onlineUrl);
            callback(null, htmlPluginData);

          } else {
            // 生产环境
            console.log('downloading icon fonts');
            let cssFileName = pluginOptions.onlineUrl.substr(
              pluginOptions.onlineUrl.lastIndexOf('/') + 1)
            let cssPath = path.join(compiler.options.output.path,
              'static', 'css')

            // 下载css文件
            download(pluginOptions.onlineUrl, cssPath).then(() => {
              console.log(`${cssFileName} downloaded!`);
              // 解析字体地址
              let cssFile = fs.readFileSync(path.join(cssPath, cssFileName), "utf-8");
              let fontFilesReg = /url\(\'\/\/\S+\)/g
              let fontFiles = cssFile.match(fontFilesReg).map((item) =>
                'http:' + item.substring(item.indexOf('//'), item.lastIndexOf('?')).toString()
              )
              fontFiles.shift()
              // console.log(fontFiles);
              // 并下载字体
              console.log('downloading fonts');
              Promise.all(fontFiles.map(x => download(x, cssPath)))
                .then(() => {
                console.log('fonts downloaded!');
                // 修改css文件中的url
                console.log('modifying css file');

                let modifyReg = new RegExp(fontFiles[0].substring(0 , fontFiles[0].lastIndexOf('/')+1).replace('http:',''), 'g');
                cssFile = cssFile.replace(modifyReg,'')
                fs.writeFileSync(path.join(cssPath, cssFileName), cssFile, 'utf8');
                console.log('icon font all done!');
                htmlPluginData.assets.css.unshift('/static/css/'+cssFileName);
                callback(null, htmlPluginData);
              });
            });
          }
        });
    });
  }

}

module.exports = AutofonticonBocloudspWebpackPlugin;
