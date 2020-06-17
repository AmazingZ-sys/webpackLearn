# webpack学习实战

## 前言

随着前端的发展，只会傻傻使用脚手架，然后`npm run serve`、`npm run build`显然是不够的，在面试中也常常会有面试官问道会用webpack吗？会自定义进行配置管理吗？学会`webpack`往往能使你在面试中脱颖而出，废话不多说，我们开始走进`webpack`的世界。

> 本文仅供参考，如果错误烦请指正，蟹蟹

## 入门

### 1.初始化项目

新建一个空文件夹，初始化`npm`

```
// npm
npm init
// yarn
yarn init
```

`webpack`是运行在`node`环境中的，我们需要安装一下两个包

```
// npm
npm i -D webpack webpack-cli
// yarn
yarn add -D webpack wbpack-cli
```

新绛一个文件夹`src`,然后新建一个文件`main.js`，写一点代码进行测试

```
console.log("我在学习webpack");
```

配置`package.json`命令

```
// 运行 yarn run build 命令时将会找到 src 目录下的 main.js 当做入口文件进行打包操作
"scripts": {
    "build": "webpack src/main.js"
 }
```

执行

```
// npm
npm run build
// yarn 
yarn run build
```

此时如果生成了一个`dist`文件夹，并且内部含有`main.js`文件说明已经打包成功，这时候可能会出现如下警告（因为我们没有配置开发环境与生产环境，但是并不影响打包的执行）：

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gftwo96u0cj31ko088wfy.jpg)

### 2.开始我们的自定义配置

上面的一个简单示例只是`webpack`默认的配置，在开发中往往我们需要自定义一些配置，新建一个`build`文件夹，里面新建一个`webpack.config.js`文件

```
// webpack.config.js

const path = require('path');
module.exports = {
    mode:'development', // 开发模式
    entry: path.resolve(__dirname,'../src/main.js'),    // 入口文件
    output: {
        filename: 'zhizhi.js',      // 打包后的文件名称
        path: path.resolve(__dirname,'../dist')  // 打包后的目录
    }
}
```

更改我们的命令为

```
"scripts": {
    "build": "webpack --config build/webpack.config.js"
},
```

执行

```
// npm 
npm run build
// yarn
yarn run build
```

此时生成了如下文件

![image-20200616101807672](/Users/zhix/Library/Application Support/typora-user-images/image-20200616101807672.png)

### 3.配置`html`

js文件打包完成，但是我们不能每次都在相应的`html`模板中手动引入打包之后的js文件

> 有的老板对这里的可能会有疑问，我们打包好的js文件名不都是一样的吗？不是引入一次就行了吗？然而我们在开发中为了避免浏览器缓存导致页面更新不及时，往往会这样配置

```
// 这里的 [name] 为你的文件名称，如入口文件名为main.js [name] 就为main
// 而[hash:8] 表示在文件名之后加上8位的 hash 值，此时你每次打包之后的文件名都是不一样的
module.exports = {
    // 省略其他配置
    output: {
      filename: '[name].[hash:8].js',      // 打包后的文件名称
      path: path.resolve(__dirname,'../dist')  // 打包后的目录
    }
}
```

此时生成的文件为：

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gftx7n2fmlj30ua0fm75y.jpg)

因为每次生成的js文件名都不一样，而我们都需要将js文件引入到`html`中，这时候我们就需要一个插件来帮助我们`html-webpack-plugin`

安装`html-webpack-plugin`

```
// npm 
npm i -D html-webpack-plugin
// yarn 
yarn add -D html-webpack-plugin
```

新建一个与`build`同级的文件夹`public`，在里面新建一个`index.html`，然后修改配置文件`webpack.config.js`

```
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode:'development', // 开发模式
    entry: path.resolve(__dirname,'../src/main.js'),    // 入口文件
    output: {
      filename: '[name].[hash:8].js',      // 打包后的文件名称
      path: path.resolve(__dirname,'../dist')  // 打包后的目录
    },
    plugins:[
      new HtmlWebpackPlugin({
        template:path.resolve(__dirname,'../public/index.html')
      })
    ]
}
```

此时生成的目录和效果如下

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gftxegxfpgj31lw0i6dkc.jpg)

#### 3.1 多入口文件的开发

> 生成多个`html-webpack-plugin`实例来解决

```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode:'development', // 开发模式
    entry: {
      main:path.resolve(__dirname,'../src/main.js'),
      header:path.resolve(__dirname,'../src/header.js')
  }, 
    output: {
      filename: '[name].[hash:8].js',      // 打包后的文件名称
      path: path.resolve(__dirname,'../dist')  // 打包后的目录
    },
    plugins:[
      new HtmlWebpackPlugin({
        template:path.resolve(__dirname,'../public/index.html'),
        filename:'index.html',
        chunks:['main'] // 与入口文件对应的模块名
      }),
      new HtmlWebpackPlugin({
        template:path.resolve(__dirname,'../public/header.html'),
        filename:'header.html',
        chunks:['header'] // 与入口文件对应的模块名
      }),
    ]
}
```

执行`npm run build 或者 yarn run build`此时生成的目录和文件如下

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gftxk79l1lj31ls0tidnd.jpg)

#### 3.2 Clean-webpack-plugin

> 在我们每次执行打包之后会发现`dist`文件夹里面会残留上次打包的文件，我们会使用`clean-webpack-plugin`插件来帮助我们在打包输出前清空目标文件夹

先安装`clean-webpack-plugin`

```
// npm 
npm i -D clean-webpack-plugin
// yarn 
yarn add -D clean-webpack-plugin
```

修改配置文件`webpack.config.js`

```
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
    // ...省略其他配置
    plugins:[new CleanWebpackPlugin()]
}

```

### 4.引用CSS

我们的入口文件是js，所以我们在入口js文件中引入我们的`CSS`文件

`src`目录新建`assets`文件夹，里面新建`index.css 和 index.less`文件，然后在`main.js`文件中引入`css`文件

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gftz7oznu0j30gm06cdgh.jpg)

因为我们引入了`CSS`文件，所以需要一些`loader`来解析我们的`CSS`文件

```
// npm 
npm i -D style-loader css-loader less less-loader   // 如果我们使用了less来构建样式，则需要多安装两个，scss/sass同理
// yarn 
yarn add -D style-loader css-loader less less-loader
```

修改配置文件`webpack.config.js`

```
// webpack.config.js
module.exports = {
    // ...省略其他配置
    module:{
      rules:[
        {
          test:/\.css$/,
          use:['style-loader','css-loader'] // 从右向左解析原则
        },
        {
          test:/\.less$/,
          use:['style-loader','css-loader','less-loader'] // 从右向左解析原则
        }
      ]
    }
} 
```

此时浏览器打开`index.html`可以看到`CSS`以`style`标签的形式嵌入到页面中

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gftyhvv6cnj31lx0u0460.jpg)

#### 4.1 为`CSS`添加浏览器前缀兼容各内核浏览器

安装`postcss-loader 和 autoprefixer`

```
// npm 
npm i -D postcss-loader autoprefixer
// yarn 
yarn add -D postcss-loader autoprefixer
```

修改配置`webpack.config.js`

```
// webpack.config.js
module.exports = {
    module:{
        rules:[
            {
                test:/\.less$/,
                use:['style-loader','css-loader','postcss-loader','less-loader'] // 从右向左解析原则
           }
        ]
    }
} 

```

接下来我们还需要引入`autoprefixer`使其生效，这里有两种方式

1.在项目跟目录创建一个`postcss.config.js`，配置如下

```
module.exports = {
    plugins: [require('autoprefixer')]  // 引用该插件即可了
}
```

2.直接在`webpack.config.js`文件中配置

```
// webpack.config.js
module.exports = {
    //...省略其他配置
    module:{
        rules:[{
            test:/\.less$/,
            use:['style-loader','css-loader',{
                loader:'postcss-loader',
                options:{
                    plugins:[require('autoprefixer')]
                }
            },'less-loader'] // 从右向左解析原则
        }]
    }
}
```

这时候我们已经完成了`css`在`html`文件中的引入，但是如果样式文件很多，全部添加到`html`中会显得混乱。而我们可以通过插件`mini-css-extract-plugin`来拆分`css`

#### 4.2 拆分`css`

安装`mini-css-extract-plugin`

```
// npm
npm i -D mini-css-extract-plugin
// yarn 
yarn add -D mini-css-extract-plugin
```

> 在webpack 4.0以前，我们通过`extract-text-webpack-plugin`插件，把css样式从js文件中提取到单独的css文件中，webpack 4.0之后，官方推荐使用`mini-css-extract-plugin`插件来打包css文件

配置文件如下

```
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  //...省略其他配置
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
           MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ],
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: "[name].[hash].css",
        chunkFilename: "[id].css",
    })
  ]
}

```

运行`npm run build 或者  yarn run build`打包之后文件目录如下

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfu531wddzj31m80la443.jpg)

在这里遇到一个坑，在修改配置文件的时候没有删除`style-loader`，然后运行打包报错，后来想起来`style-loader`是将`css`文件通过`style`标签内嵌到页面中，而`mini-css-extract-plugin`是将`css`文件拆分成独立文件，两个插件冲突所以报错，将`style-loader`删除就好了

#### 4.3 拆分多个`css`

> 上面我们用到的`mini-css-extract-plugin`是将所有的`css`样式合并为一个`css`文件，如果我们要拆分多个`css`文件，需要用到`extract-text-webpack-plugin`，而目前`mini-css-extract-plugin`还不支持此功能，我们需要安装`@next`版本的`extract-text-webpack-plugin`

安装：

```
// npm 
npm i -D extract-text-webpack-plugin@next
// yarn
yarn add -D extract-text-webpack-plugin@next
```

修改`webpack.config.js`配置

```
// webpack.config.js

const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
let indexLess = new ExtractTextWebpackPlugin('index.less');
let indexCss = new ExtractTextWebpackPlugin('index.css');
module.exports = {
    module:{
      rules:[
        {
          test:/\.css$/,
          use: indexCss.extract({
            use: ['css-loader']
          })
        },
        {
          test:/\.less$/,
          use: indexLess.extract({
            use: ['css-loader','less-loader']
          })
        }
      ]
    },
    plugins:[
      indexLess,
      indexCss
    ]
}
```

打包之后的目录如图所示

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfu5jopf9wj31m40iuaew.jpg)

### 5.打包图片、字体、媒体等文件

`file-loader`就是将文件在进行一些处理之后（主要是处理文件名和路径、解析文件url），并将文件移动到输出的目录中

`url-loader`一般会与`file-loader`搭配使用，功能与`file-loader`类似，如果文件小于限制的大小，则会返回文件的base64编码，否则使用`file-loader`将文件移动到输出目录中

```
// webpack.config.js
module.exports = {
  // 省略其它配置 ...
  module: {
    rules: [
      // ...
      {
        test: /\.(jpe?g|png|gif)$/i, //图片文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
    ]
  }
}

```

### 6.用`babel`转义js文件

为了使我们的js代码兼容更多的浏览器环境，我们需要将ES6和更高版本的语法进行转义

安装

```
// npm 
npm i -D babel-loader @babel/preset-env @babel/core
// yarn 
yarn add -D babel-loader @babel/preset-env @babel/core
```

- 注意`babel-loader`与`babel-core`的版本对应关系
  - `babel-loader`8.x对应`babel-core`7.x
  - `babel-loader`7.x对应`babel-core`6.x

修改`webpack.config.js`配置

```
// webpack.config.js
module.exports = {
    // 省略其它配置 ...
    module:{
        rules:[
          {
            test:/\.js$/,
            use:{
              loader:'babel-loader',
              options:{
                presets:['@babel/preset-env']
              }
            },
            exclude:/node_modules/
          },
       ]
    }
}
```

举个栗子：

修改配置后我们在`main.js`中写入

![image-20200616154049444](/Users/zhix/Library/Application Support/typora-user-images/image-20200616154049444.png)

运行打包之后找到打包后的`main.xxxxxxxx.js`文件，打开之后找到我们的`console`

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfu6ayhu6pj312606adga.jpg)

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfu6bl3w2hj311g05mt95.jpg)

不难发现，上面的`babel-loader`只会将`ES6/7/8`语法转为`ES5`语法，但是对新的`api`并不会转换，例如：`Promise, Generator, Set, Maps, Proxy等`

此时我们需要借助`babel-polyfill`来进行转换

安装

```
// npm 
npm i -D @babel/polyfill
// yarn 
yarn add -D @babel/polyfill
```

修改`webpack.config.js`配置

```
// webpack.config.js
const path = require('path')
module.exports = {
    entry: ["@babel/polyfill",path.resolve(__dirname,'../src/index.js')],    // 入口文件
}
// 多个入口文件时配置如下
entry: {
        main:["@babel/polyfill",path.resolve(__dirname,'../src/main.js')],
        header:["@babel/polyfill",path.resolve(__dirname,'../src/header.js')],
    },
```

> 到现在为止我们对`webpack`有了个初步了解，但是想要熟练运用，我们需要一个系统的实战，开始摆脱脚手架尝试搭建自己的`Vue`项目吧

## 搭建`Vue`开发环境

上面的栗子🌰已经帮我们实现了打包css、图片、js、HTML等文件，但是我们还需要一下几种配置

### 1.解析`.vue文件`

安装

```
// npm 
npm i -D vue-loader vue-template-compiler vue-style-loader
npm i -S vue
// yarn 
yarn add -D vue-loader vue-template-compiler vue-style-loader
yarn add vue
```

`vue-loader`用于解析`.vue`文件

`vue-template-compiler`用于编辑`template`模板

修改`webpack.config.js`配置

```
const vueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
    module:{
        rules:[{
            test:/\.vue$/,
            use:['vue-loader']
        },]
     },
    resolve:{
        alias:{
          'vue$':'vue/dist/vue.runtime.esm.js',
          ' @':path.resolve(__dirname,'../src')
        },
        extensions:['*','.js','.json','.vue']
   },
   plugins:[
        new vueLoaderPlugin()
   ]
}

```

### 2.配置`webpack-dev-server`进行热更新

安装

```
//npm 
npm i -D webpack-dev-server
// yarn 
yarn add -D webpack-dev-server
```

修改`webpack.config.js`配置

```javascript
const Webpack = require('webpack')
module.exports = {
  // ...省略其他配置
  devServer:{
    port:3000,
    hot:true,
    contentBase:'../dist'
  },
  plugins:[
    new Webpack.HotModuleReplacementPlugin()
  ]
}
```

完整配置如下

```javascript
// vue环境

const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
let indexLess = new ExtractTextWebpackPlugin('index.less');
let indexCss = new ExtractTextWebpackPlugin('index.css');
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const Webpack = require('webpack')

module.exports = {
    mode: 'development', // 开发模式
    entry: {
        main: ["@babel/polyfill", path.resolve(__dirname, '../src/main.js')],
        header: ["@babel/polyfill", path.resolve(__dirname, '../src/header.js')],
    },
    output: {
        filename: '[name].[hash:8].js',      // 打包后的文件名称
        path: path.resolve(__dirname, '../dist')  // 打包后的目录
    },
    plugins: [
        new vueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new Webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: 'index.html',
            chunks: ['main'] // 与入口文件对应的模块名
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/header.html'),
            filename: 'header.html',
            chunks: ['header'] // 与入口文件对应的模块名
        }),
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.runtime.esm.js',
            ' @': path.resolve(__dirname, '../src')
        },
        extensions: ['*', '.js', '.json', '.vue']
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [require('autoprefixer')]
                    }
                }]
            },
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [require('autoprefixer')]
                    }
                }, 'less-loader']
            }
        ]
    },
    devServer:{
        port:3000,
        hot:true,
        contentBase:'../dist'
    },
}
```

### 3.配置打包命令

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfu7zey1gxj3100074t9i.jpg)

打包文件配置完毕，接下来我们测试一下，在`src`文件夹里新建`vueMain.js`

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfu859yeiaj30nw0c4jsp.jpg)

在`src`文件夹里新建一个`App.vue`文件

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfu8697xfej30ri0tiwhn.jpg)

在`public`文件夹下新建`index.html`

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfu8de8dhjj315i0kwtbo.jpg)

此时运行`npm run dev 或者  yarn run dev` 它会在本地跑一个`node`服务，端口为3000并自动打开浏览器访问：

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfu8cxt82hj31mk0d6juk.jpg)

### 4.区分开发环境和生产环境

在实际应用中，我们需要区分开发环境和生产环境，我们在原来`webpack.config.js`文件的基础上再新增两个文件

- `webpack.dev.js`开发环境的配置文件

  > 开发环境需要的主要是热更新，不需要压缩代码，拥有完整的`resourceMap`

- `webpack.prod.js`生产环境配置文件

  > 生产环境需要的是代码压缩、提取`CSS`文件、合理的`resourceMap`、分割代码

  需要安装一下依赖：

  - `webpack-merge` 合并配置
  - `copy-webpack-plugin` 拷贝静态资源
  - `optimize-css-assets-webpack-plugin` css压缩
  - `uglifyjs-webpack-plugin` js压缩

  > `webpack mode` 设置 `production` 的时候回自动压缩js代码。原则上不需要引入`uglifyjs-webpack-plugin`进行重复工作，但是`optimize-css-assets-webpack-plugin` 压缩`css` 的同时会破坏原有的js压缩，所以这里我们需要引入`uglifyjs`进行压缩

#### 4.1 webpack.config.js

```
const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const devMode = process.argv.indexOf('--mode=production') === -1;
module.exports = {
  entry:{
    main:path.resolve(__dirname,'../src/main.js')
  },
  output:{
    path:path.resolve(__dirname,'../dist'),
    filename:'js/[name].[hash:8].js',
    chunkFilename:'js/[name].[hash:8].js'
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        use:{
          loader:'babel-loader',
          options:{
            presets:['@babel/preset-env']
          }
        },
        exclude:/node_modules/
      },
      {
        test:/\.vue$/,
        use:[{
          loader:'vue-loader',
          options:{
            compilerOptions:{
              preserveWhitespace:false
            }
          }
        }]
      },
      {
        test:/\.css$/,
        use:[{
          loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          options:{
            publicPath:"../dist/css/",
            hmr:devMode
          }
        },'css-loader',{
          loader:'postcss-loader',
          options:{
            plugins:[require('autoprefixer')]
          }
        }]
      },
      {
        test:/\.less$/,
        use:[{
          loader:devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          options:{
            publicPath:"../dist/css/",
            hmr:devMode
          }
        },'css-loader','less-loader',{
          loader:'postcss-loader',
          options:{
            plugins:[require('autoprefixer')]
          }
        }]
      },
      {
        test:/\.(jep?g|png|gif)$/,
        use:{
          loader:'url-loader',
          options:{
            limit:10240,
            fallback:{
              loader:'file-loader',
              options:{
                name:'img/[name].[hash:8].[ext]'
              }
            }
          }
        }
      },
      {
        test:/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use:{
          loader:'url-loader',
          options:{
            limit:10240,
            fallback:{
              loader:'file-loader',
              options:{
                name:'media/[name].[hash:8].[ext]'
              }
            }
          }
        }
      },
      {
        test:/\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use:{
          loader:'url-loader',
          options:{
            limit:10240,
            fallback:{
              loader:'file-loader',
              options:{
                name:'media/[name].[hash:8].[ext]'
              }
            }
          }
        }
      }
    ]
  },
  resolve:{
    alias:{
      'vue$':'vue/dist/vue.runtime.esm.js',
      ' @':path.resolve(__dirname,'../src')
    },
    extensions:['*','.js','.json','.vue']
  },
  plugins:[
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template:path.resolve(__dirname,'../public/index.html')
    }),
    new vueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    })
  ]
}

```

#### 4.2 webpack.dev.js

```
const Webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')
module.exports = WebpackMerge(webpackConfig,{
  mode:'development',
  devtool:'cheap-module-eval-source-map',
  devServer:{
    port:3000,
    hot:true,
    contentBase:'../dist'
  },
  plugins:[
    new Webpack.HotModuleReplacementPlugin()
  ]
})

```

#### 4.3 webpack.prod.js

```
const path = require('path')
const webpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = WebpackMerge(webpackConfig,{
  mode:'production',
  devtool:'cheap-module-source-map',
  plugins:[
    new CopyWebpackPlugin([{
      from:path.resolve(__dirname,'../public'),
      to:path.resolve(__dirname,'../dist')
    }]),
  ],
  optimization:{
    minimizer:[
      new UglifyJsPlugin({//压缩js
        cache:true,
        parallel:true,
        sourceMap:true
    }),
    new OptimizeCssAssetsPlugin({})
    ],
    splitChunks:{
      chunks:'all',
      cacheGroups:{
        libs: {
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial" // 只打包初始时依赖的第三方
        }
      }
    }
  }
})

```

### 5.优化webpack配置

webpack的优化，关系到打包出来文件的大小，打包的速度等，我们从以下几个方面对`webpack`进行优化：

#### 5.1 优化打包速度

> 构建速度指的是我们每次修改代码之后热更新的速度和发布前打包文件的速度

##### 5.1.1 合理的配置`mode`参数与`devtool`参数

`mode` 可设置`development`（开发）和`production`（生产）两个参数

如果没有设置，`webpack4`会将`mode`的默认值设置为`production`

`production`模式下会进行`tree shaking`（去除无用代码）和`uglifyjs`（代码压缩混淆）

##### 5.1.2 缩小文件的搜索范围（配置`include exclude alias noParse extensions`）

- `alias`：当我们代码中出现`import vue`时，`webpack`会采用向上递归的方式去`node_modules`目录下去找。为了减少搜索范围我们可以直接告诉`webpack`去哪个路径下查找，也就是`alias`（别名）

- `include exclude`： 同样配置`include exclude` 也可以减少`webpack loader`的搜索转换时间

- `noParse` ：当我们代码中用到`import jq from 'jquery'`时，`webpack`回去解析`jq`这个库是否有依赖的包。但是我们对类似`jquery`这类依赖库，一般会认为不会引用其他的包（特殊的除外），增加`npParse`属性告诉`webpack`不必解析，一次增加打包速度

- `extensions`：`webpack`会根据`extensions`定义的后缀查找文件（频率高的文件类型优先写在前面）

  ```
  module.exports = {
   // 忽略其他配置
    module:{
    	noParse:/jquery/, // 不去解析jquery中的依赖库
      rules:[
        {
          test:/\.js$/,
          use:{
            loader:'babel-loader',
            options:{
              presets:['@babel/preset-env']
            }
          },
          exclude:/node_modules/
        },
        {
          test:/\.vue$/,
          use:[{
            loader:'vue-loader',
            options:{
              compilerOptions:{
                preserveWhitespace:false
              }
            }
          }]
        },
        {
          test:/\.css$/,
          use:[{
            loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            options:{
              publicPath:"../dist/css/",
              hmr:devMode
            }
          },'css-loader',{
            loader:'postcss-loader',
            options:{
              plugins:[require('autoprefixer')]
            }
          }]
        },
        {
          test:/\.less$/,
          use:[{
            loader:devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            options:{
              publicPath:"../dist/css/",
              hmr:devMode
            }
          },'css-loader','less-loader',{
            loader:'postcss-loader',
            options:{
              plugins:[require('autoprefixer')]
            }
          }]
        },
        {
          test:/\.(jep?g|png|gif)$/,
          use:{
            loader:'url-loader',
            options:{
              limit:10240,
              fallback:{
                loader:'file-loader',
                options:{
                  name:'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        },
        {
          test:/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          use:{
            loader:'url-loader',
            options:{
              limit:10240,
              fallback:{
                loader:'file-loader',
                options:{
                  name:'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        },
        {
          test:/\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          use:{
            loader:'url-loader',
            options:{
              limit:10240,
              fallback:{
                loader:'file-loader',
                options:{
                  name:'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        }
      ]
    },
    resolve:{
      alias:{
        'vue$':'vue/dist/vue.runtime.esm.js',
        ' @':path.resolve(__dirname,'../src')
      },
      extensions:['*','.js','.json','.vue']
    },
  }
  ```

##### 5.1.3 使用`HappyPack`开启多进程`Loder`转换

> 在`webpack`构建过程中，实际上耗费时间大多数用在`loader`解析转换以及代码的压缩中。日常开发中我们需要使用`loader`对js，图片，字体等文件做转换操作，并且转换的文件数据量也是非常大的。由于js单线程的特性使得这些转换操作不能并发处理，而是需要一个个文件进行处理。`HappyPack`的基本原理是将这部分任务分解到多个子进程中并行处理，子进程处理完成之后把结果发送到主进程中，从而减少构建时间

安装

```
// npm 
npm i -D happypack
// yarn 
yarn add -D happypack
```

修改`webpack.config.js`配置

```
const HappyPack = require("happypack")
const os = require("os")
const happyThreadPool = HappyPack.ThreadPool({size:os.cpus().length})
module.exports = {
	// 忽略其他配置
	module:{
		rules:[
			{
				test:/\.js$/.
				use:[{
					loader:"happypack/loader?id=happyBabel"
				}],
				exclude:/node_modules/
			},
		],
		plugins:[
			new HappyPack({
				id:"happyBabel",
				loaders:[
					{
						loader:"babel-loader",
						options:{
							presets:[
								["@babel/preset-env"]
							],
							cacheDirectory: true
						}
					}
				],
				threadPool:happyThreadPool // 共享进程池
			})
		]
	}
}
```

##### 5.1.4 使用`webpack-parallel-uglify-plugin`增强代码压缩

> 上面已经对`loader`转换进行了优化，还有一个难点就是优化代码的压缩时间

安装

```
// npm 
npm i -D webpack-parallel-uglify-plugin
// yarn 
yarn add -D webpack-parallel-uglify-plugin
```

修改`webpack.config.js`配置

```
const HappyPack = require("happypack")
const os = require("os")
const happyThreadPool = HappyPack.ThreadPool({size:os.cpus().length})
module.exports = {
	// 忽略其他配置
	optimization:{
		minimizer:[
			new ParallelUglifyPlugin({
				cacheDir:"./cache",
				uglifyJS:{
					output:{
						comments:false,
						beautify:false
					},
					compress:{
						drop_console:true,
						collapse_vars:true,
						reduce_vars:true
					}
				}
			})
		]
	}
}
```

##### 5.1.5 抽离第三方模块

> 对于开发项目中不经常会变更的静态依赖文件，类似我们的`elementUI、vue全家桶`等等，因为很少会去变更，所以我们不希望这些依赖要被集成到内一次的构建逻辑中去。 这样做的好处是每次更改我本地代码的文件的时候，`webpack`只需要打包我项目本身的文件代码，而不会再去编译第三方库。以后只要我们不升级第三方包的时候，那么`webpack`就不会对这些库去打包，这样可以快速的提高打包的速度。

这里我们使用`webpack`内置的`DllPlugin DllReferencePlugin`进行抽离
在与`webpack`配置文件同级目录下新建`webpack.dll.config.js` 代码如下：

```
// webpack.dll.config.js
const path = require("path");
const webpack = require("webpack");
module.exports = {
  // 你想要打包的模块的数组
  entry: {
    vendor: ['vue','element-ui'] 
  },
  output: {
    path: path.resolve(__dirname, 'static/js'), // 打包后文件输出的位置
    filename: '[name].dll.js',
    library: '[name]_library' 
     // 这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '[name]-manifest.json'),
      name: '[name]_library', 
      context: __dirname
    })
  ]
};

```

在`package.json`中配置如下命令

```
"dll": "webpack --config build/webpack.dll.config.js"
```

接下来我们在`webpack.config.js`中增加配置

```
module.exports = {
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor-manifest.json')
    }),
    new CopyWebpackPlugin([ // 拷贝生成的文件到dist目录 这样每次不必手动去cv
      {from: 'static', to:'static'}
    ]),
  ]
};

```

执行`npm run dll 或者 yarn run dll`

之后会发现生成了我们需要的集合第三方代码的`vendor.dll.js` 我们需要在`html`文件中手动引入这个js文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>老yuan</title>
  <script src="static/js/vendor.dll.js"></script>
</head>
<body>
  <div id="app"></div>
</body>
</html>

```

这样如果我们没有更新第三方依赖包，就不必执行`npm run dll 或者 yarn run dll`，直接执行`run dev 和 run build`的时候就会发现我们的打包速度明显提升，因为我们已经通过`dllPlugin`将第三方依赖包进行了抽离

##### 5.1.6 配置缓存

> 我们每次执行构建都会把所有文件都重复编译一遍，这样的重复工作是否可以被缓存下来呢？答案是可以的，目前大部分 `loader` 都提供了`cache` 配置项。比如在 `babel-loader` 中，可以通过设置`cacheDirectory` 来开启缓存，`babel-loader?cacheDirectory=true` 就会将每次的编译结果写进硬盘文件（默认是在项目根目录下的`node_modules/.cache/babel-loader`目录内，当然你也可以自定义）

