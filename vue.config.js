module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    name: 'Ownline',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent'

    /*    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'dev/sw.js',
      // ...other Workbox options...
    } */
  },
  devServer: {
    compress: true,
    port: 9000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        // ws: true,
        // changeOrigin: true,
        logLevel: 'debug'
        // 'onProxyReq': function (proxyReq, req, res) {
        //   // proxyReq.setHeader('Cookie', 'access_token_cookie=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE1MzQzMjk4MTAsIm5iZiI6MTUzNDMyOTgxMCwianRpIjoiNjBkZGI0MDgtOTQzYy00YjdkLWI3OWYtMzdhMDRhNDMyZmY5IiwiZXhwIjoxNTM0MzM3MDEwLCJpZGVudGl0eSI6IjhmNjUxMTE5LWVhYzgtNDBkNC05NjhmLTQ4NzY0NjMzOGJhNyIsImZyZXNoIjp0cnVlLCJ0eXBlIjoiYWNjZXNzIn0.vj4sLE1wsFk1dEO8LMIx_N0ySEbXjqqxRGnJDeoEJKsJqwq3srU-ItCGoH1EiVLTWzLg06DExw8zgTi6SCynqg');
        //   console.log('onProxyRes:', proxyReq)
        // }
      }
    }
  }
}
