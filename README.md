# autofonticon-bocloudsp-webpack-plugin
Webpack plugin that switches fonticon source automatically

## Introduction
Setup url to your ali font icon url with copy-paste only. Online version will be used in development. Files will be downloaded and set automatically while building.

## Insatllation
```javascript
$ npm install autofonticon-bocloudsp-webpack-plugin --save-dev
```

## Usage
```javascript
// webpack.base.conf.js

const AutofonticonWebpackPlugin = require('autofonticon-bocloudsp-webpack-plugin');

// ...
// ...
// ...

plugins: [
    new AutofonticonWebpackPlugin({onlineUrl: 'http://at.alicdn.com/t/something.css'}),
  ]
```

#### Notice
This plugin is peer dependent on HtmlWebpackPlugin