const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    index: './public/src/index.js',
    homepage: './public/src/homepage.js',
    editprofile: './public/src/editprofile.js',
    profilepage: './public/src/profilepage.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },
  watch: true
}
