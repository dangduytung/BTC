var bytenode = require('bytenode');
var fs = require('fs');
var path = require("path");

var IGNORE_FOLDERS = ['node_modules', 'data', 'logs', 'script', 'test'];
var IGNORE_FILES = ['README.md', 'package-lock.json'];

fs.exists('./dist', exist => {
    if (exist) {
        delDir('./dist');
    }
    fs.mkdirSync('./dist');
})

// Copy the directory to dist
fs.readdir('./', (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    for (var i = 0; i < files.length; i++) {
        var stat = fs.statSync('./' + files[i]);

        if (stat.isDirectory() && IGNORE_FOLDERS.indexOf(files[i]) > -1) {
            continue;
        }

        if (stat.isFile() && IGNORE_FILES.indexOf(files[i]) > -1) {
            continue;
        }

        if (stat.isFile()) {
            if (files[i].indexOf('compile.js') == -1) {
                fs.writeFileSync('./dist/' + files[i], fs.readFileSync('./' + files[i]));
            }
        } else if (stat.isDirectory() && files[i].indexOf('dist') == -1) {
            createDocs('./' + files[i], './dist/' + files[i], function () {

            })
        } else {

        }
    }

    compileFile();

    // Create file launcher.js
    fs.writeFileSync('./dist/launcher.js', `require('bytenode');\nrequire('./app/main.jsc');`);
    fs.renameSync('./dist/.env_prod', './dist/.env');
})

function compileFile() {
    // Compile app.js to bytecode
    bytenode.compileFile({
        filename: './dist/app/main.js'
    });
    fs.unlinkSync('./dist/app/main.js');

    // Compile the js file in the filters / routes / services directory into bytecode
    compileDir('./dist/app/config');
    compileDir('./dist/app/services');
}

function compileDir(dir) {
    var stat = fs.statSync(dir);
    if (stat.isFile() && dir.indexOf('.js') != -1) {
        // File, direct conversion
        bytenode.compileFile({
            filename: dir
        });
        fs.unlinkSync(dir);
    } else if (stat.isDirectory()) {
        // Directory, list file list, circular processing
        var files = fs.readdirSync(dir);
        for (var i = 0; i < files.length; i++) {
            var file = dir + '/' + files[i];
            compileDir(file);
        }
    } else {

    }
}

// Create directory recursively Synchronization method  
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            console.log("mkdirsSync = " + dirname);
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

function _copy(src, dist) {
    var paths = fs.readdirSync(src)
    paths.forEach(function (p) {
        var _src = src + '/' + p;
        var _dist = dist + '/' + p;
        var stat = fs.statSync(_src)
        if (stat.isFile()) { // judge whether it is a file or a directory
            fs.writeFileSync(_dist, fs.readFileSync(_src));
        } else if (stat.isDirectory()) {
            copyDir(_src, _dist) // When the directory is, recursive copy
        }
    })
}

/*
 * Copy directories, subdirectories, and files in them
 * @param src {String} The directory to be copied
 * @param dist {String} copy to target directory
 */
function copyDir(src, dist) {
    var b = fs.existsSync(dist)
    console.log("dist = " + dist)
    if (!b) {
        console.log("mk dist = ", dist)
        mkdirsSync(dist); // Create a directory
    }
    console.log("_copy start")
    _copy(src, dist);
}

function createDocs(src, dist, callback) {
    console.log("createDocs...")
    copyDir(src, dist);
    console.log("copyDir finish exec callback")
    if (callback) {
        callback();
    }
}

function delDir(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); // Delete folder recursively
            } else {
                fs.unlinkSync(curPath); // Delete file
            }
        });
        fs.rmdirSync(path);
    }
}