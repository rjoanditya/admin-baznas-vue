module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,

  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
    
  devServer: {
    disableHostCheck: true
  }
}