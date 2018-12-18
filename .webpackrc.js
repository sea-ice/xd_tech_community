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
    },
    "/sms": {
      "target": "https://leancloud.cn",
      "changeOrigin": true,
      "pathRewrite": { "^/sms": "" }
    }
  },
  "html": {
    "template": "./src/index.ejs"
  },
  "hash": true,
  "publicPath": process.env.NODE_ENV === 'development' ? '/' : '/tech_community/'
  // publicPath仅替换html文档里面引用的资源的路径
}
