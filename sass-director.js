#!/usr/bin/env node

function mkdir(path) {
	function create(path) {
		if (path) {
			if (!fs.existsSync(path) || !fs.statSync(path).isDirectory()) {
				try {
					fs.mkdirSync(path);
				} catch (error) {
					return false;
				}
			}
		}

		return true;
	}

	path.replace(/^\/+/, '').split(/\/+/).reduce(function (previousValue, currentValue) {
		create('/' + previousValue);

		return previousValue + '/' + currentValue;
	});

	return create(path);
}

function exit(code, message) {
	console.log(message);

	process.exit(code || 0);
}

var
fs = require('fs'),
path = require('path'),
manifestFile = 2 in process.argv ? path.resolve(process.argv[2]) : '',
baseDirectory = 3 in process.argv ? path.resolve(process.argv[3]).replace(/\/+$/, '') : path.dirname(manifestFile),
ascii = '                                       \r\n                  -:..``                         \r\n                +hhoohMMd+\/oo                    \r\n              +``+mmooydssdMM+--:-`              \r\n              No  mMh  yMN``+mmoosdyoyhy\/--:.    \r\n             .yy-.+NM: .MMo  mMd  yMN``\/Nmoos:   \r\n             -++++++++\/\/syy-.+NN: .NMs  dMd  s+  \r\n             \/+++++++++++++++++++\/\/oyy-.\/mN\/ `.  \r\n            `++++++++++++++++++++++++++++++++:   \r\n            .++++++++++++++++++++++++++++++++.   \r\n            :+++++++++++++++++++++++++++++++\/    \r\n            ++++++++++++++++++++++++++++++++-    \r\n           `++++++++++++++++++++++++++++++++     \r\n            `.--::\/\/+++++++++++++++++++++++:     \r\n                      ``..--:\/\/++++++++++++`     \r\n                                 ``..--::\/-      \r\n\r\n                                      \r\n _____                ______ _               _             \r\n\/  ___|               |  _  (_)             | |            \r\n\\ `--.  __ _ ___ ___  | | | |_ _ __ ___  ___| |_ ___  _ __ \r\n `--. \\\/ _` \/ __\/ __| | | | | | \'__\/ _ \\\/ __| __\/ _ \\| \'__|\r\n\/\\__\/ \/ (_| \\__ \\__ \\ | |\/ \/| | | |  __\/ (__| || (_) | |   \r\n\\____\/ \\__,_|___\/___\/ |___\/ |_|_|  \\___|\\___|\\__\\___\/|_|   \r\n\n';

if (process.argv.length < 3) {
	exit(1, ascii + 'Usage: sass-director <manifest-file>');
}

if (!fs.existsSync(manifestFile)) {
	exit(1, 'Sorry, Sass Director could not access ' + manifestFile + '.');
}

if (!mkdir(baseDirectory)) {
	exit(1, 'Sorry, Sass Director could not access ' + baseDirectory + '.');
}

fs.readFile(manifestFile, 'utf8', function (error, data) {
	if (error) {
		exit(1, 'Sorry, Sass Director could not access ' + manifestFile + '.');
	}

	var
	importStatements = data.match(/^[ \t]*@import[ \t]+(['"])(.+?)\1/mg),
	importDirectories = [],
	importBasenames = [];

	if (importStatements) {
		importStatements.forEach(function (importStatement) {
			var
			importPath = importStatement.match(/^[ \t]*@import[ \t]+(['"])(.+?)\1/)[2];

			importPath = importPath.match(/\.scss$/) ? importPath : importPath + '.scss';

			var
			importDirectory = baseDirectory + '/' + path.dirname(importPath),
			importBasename = importDirectory + '/_' + path.basename(importPath);

			if (!fs.existsSync(importDirectory) && importDirectories.indexOf(importDirectory) === -1) {
				importDirectories.push(importDirectory);
			}

			if (!fs.existsSync(importBasename) && importDirectories.indexOf(importBasename) === -1) {
				importBasenames.push(importBasename);
			}
		});
	}

	importDirectories.forEach(function (importDirectory) {
		if (!mkdir(importDirectory)) {
			exit(1, 'Sorry, Sass Director could not create the ' + importDirectory + ' directory.');
		}
	});

	importBasenames.forEach(function (importBasename) {
		try {
			fs.closeSync(fs.openSync(importBasename, 'w'));
		} catch (error) {
			exit(1, 'Sorry, Sass Director could not create the ' + importBasename + ' file.');
		}
	});

	exit(0, ascii + 'Hurray, Sass Director created ' + importDirectories.length + ' directories and ' + importBasenames.length + ' files!');
});
