const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    index: './public/src/index.js',
    homepage: './public/src/homepage.js',
<<<<<<< HEAD
    trouble: './public/src/trouble.js'
=======
    editprofile: './public/src/editprofile.js',
    profilepage: './public/src/profilepage.js'
>>>>>>> 15cfa8abfeb793f6f37220d38565d7eef5f48d96
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },
  watch: true
}
