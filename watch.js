// const fs = require('fs');
// var Vinyl = require('vinyl');
// // fs.watch('./docs', (event, name) => {
// //     console.log(event, name);
// // });

// var jsFile = new Vinyl({
//     cwd: '/',
//     base: '/test/',
//     path: '/test/file.js',
//     contents: Buffer.alloc(100,'var x = 123')
//   });

//   jsFile.extname = ".md";

//   console.log(`extname: ${jsFile.extname}`);
//   console.log(`dirname: ${jsFile.dirname}`);
//   console.log(`relative: ${jsFile.relative}`);
//   console.log(`path: ${jsFile.path}`);
//   console.log(`history: ${jsFile.history}`);

const chokidar = require('chokidar');
// One-liner for current directory
chokidar.watch('./docs', { ignoreInitial: true }).on('all', (event, path) => {
    console.log(event, path);
});
