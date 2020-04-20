
const path = require('path');
const entryFiles = [path.join(__dirname, './public/app.js')];

const options = {
  outDir: path.join(__dirname, './public/dist'), 
  outFile: 'app.bundle.js', 
  outDir: path.join(__dirname, './public/dist'),
  watch: true
};

module.exports = {entryFiles, options};