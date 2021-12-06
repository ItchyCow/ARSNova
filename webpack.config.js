const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    index: './public/src/index.js',
    homepage: './public/src/homepage.js',
    trouble: './public/src/trouble.js',
    editprofile: './public/src/editprofile.js',
    profilepage: './public/src/profilepage.js',
    addevent: './public/src/addevent.js'
  },
  output: {
    path: path.resolve(__dirname, 'public/bundles'),
    filename: '[name].js'
  },
  watch: true
}
