const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    index: './public/src/index.js',
    homepage: './public/src/homepage.js',
    trouble: './public/src/trouble.js',
    editprofile: './public/src/editprofile.js',
    profilepage: './public/src/profilepage.js',
    eventsummary: './public/src/eventsummary.js',
    usersummary: './public/src/usersummary.js',
    addevent: './public/src/addevent.js',
    editevent: './public/src/editevent.js',
    viewuser: './public/src/viewuser.js',
    edituser: './public/src/viewuser.js'
  },
  output: {
    path: path.resolve(__dirname, 'public/bundles'),
    filename: '[name].js'
  },
  watch: true
}
