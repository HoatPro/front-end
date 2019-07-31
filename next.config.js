// const withCss = require('@zeit/next-css');
const withSourceMaps = require('@zeit/next-source-maps');
const withPlugins = require('next-compose-plugins');
const dev = process.env.NODE_ENV !== 'production';
const rootPath = dev ? '' : '/netdashboard';
const sass = require('@zeit/next-sass');
const css = require('@zeit/next-css');
const fonts = require('next-fonts');
const images = require('next-images');
module.exports = withSourceMaps({
    // webpack: (config, { dev }) => ({
    //   config
    //   // ...config,
    //   // output: {
    //   //   ...config.output,
    //   //   publicPath: `${dev ? `${PATH_PREFIX}` : ''}${config.output.publicPath}`
    //   // }
    // }),
    webpack(config, options) {
        return config
    }
});


module.exports = withPlugins([
    [sass], [css], [fonts], [images]
], {
    publicRuntimeConfig: {
        rootPath
    },
    assetPrefix: rootPath
});