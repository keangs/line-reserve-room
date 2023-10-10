module.exports = {
  productionSourceMap: false,
  // publicPath: "/line-reserve-room/",
  publicPath: "/",
  transpileDependencies: ["vuetify"],
  devServer: {
    disableHostCheck: true,
    https: true,
  },
};
