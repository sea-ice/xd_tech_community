const path = require('path')
const isDevelopment = process.env.NODE_ENV === 'development'

export default {
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }],
    ["module-resolver", {
      "alias": {
        "components": "./src/components",
        "config": "./src/config",
        "AuthorDetail": "./src/routes/User/AuthorDetail",
        "utils": "./src/utils",
        "services": "./src/services",
        "src": "./src"
      }
    }]
  ],
  "proxy": {
    "/api": {
      "target": "http://13.76.169.167:8080/campus_test1",
      "changeOrigin": true,
      "pathRewrite": { "^/api": "" }
    }
  },
  "html": {
    "template": "./src/index.ejs"
  },
  "hash": true,
  "publicPath": process.env.NODE_ENV === 'development' ? '/' : '/tech_community/',
  // publicPath仅替换html文档里面引用的资源的路径
  "extraBabelIncludes": [
    'node_modules/hex-rgb/index.js',
    'node_modules/object-values/index.js'
  ],
  ignoreMomentLocale: true,
  "commons": [
    {
      async: '__common',
      children: true, // 将来源chunks设置为通过code split得到的chunks
      minChunks(module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(__dirname, './node_modules')) === 0 &&
          count >= 5
        )
      }
    }, {
      name: 'runtime',
      filename: `[name]${isDevelopment ? '' : '.[chunkhash:8]'}.js`
    }
  ]
}

// roadhog build --analyze 分析打包结果