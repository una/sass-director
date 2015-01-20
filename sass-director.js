#!/usr/bin/env node

var
fs = require('fs'),
args = process.argv.slice(2),
manifestFile = process.argv[2] || '',
baseDirectory = process.argv[3] || dirname(manifestFile);

function basename(path) {
	return path.replace(/^.*\//, '');
}

function dirname(path) {
	return path.replace(/\/[^/]+$/, '');
}

function mkdir(path) {
	if (!fs.existsSync(path) || !fs.statSync(path).isDirectory()) {
		fs.mkdirSync(path);
	}

	return true;
}

function exit(code, message) {
	console.log(message);

	process.exit(code || 0);
}

if (process.argv.length < 3) {
	exit(1, 'Usage: sass-director <manifest-file> <base-directory>');
}

if (!fs.existsSync(manifestFile)) {
	exit(1, 'Sorry, sass-director could not access ' + manifestFile + '.');
}

if (!mkdir(baseDirectory)) {
	exit(1, 'Sorry, sass-director could not access ' + baseDirectory + '.');
}

fs.readFile(manifestFile, 'utf8', function (error, data) {
	if (error) {
		exit(1, 'Sorry, sass-director could not access ' + manifestFile + '.');
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
			importDirectory = baseDirectory + '/' + dirname(importPath),
			importBasename = importDirectory + '/_' + basename(importPath);

			if (!fs.existsSync(importDirectory) && importDirectories.indexOf(importDirectory) === -1) {
				importDirectories.push(importDirectory);
			}

			if (!fs.existsSync(importBasename) && importDirectories.indexOf(importBasename) === -1) {
				importBasenames.push(importBasename);
			}
		});
	}

	importDirectories.forEach(function (importDirectory) {
		mkdir(importDirectory);
	});

	importBasenames.forEach(function (importBasename) {
		fs.closeSync(fs.openSync(importBasename, 'w'));
	});

	exit(0, 'Hurray, sass-director created ' + importDirectories.length + ' directories and ' + importBasenames.length + ' files!');
});
