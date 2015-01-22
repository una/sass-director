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

function log(message, code) {
	console.log(message);

	if (1 in arguments) {
		process.exit(code);
	}
}

function main() {
	fs.readFile(manifestFile, 'utf8', function (error, data) {
		if (error) {
			log('Unable to access "' + manifestFile + '"', 1);
		}

		var
		importStatements = data.replace(commentMatchMultiline, '').replace(commentMatchOneline, '').match(importMatchAll),
		directoryList = [],
		fullpathList = [];

		if (importStatements) {
			importStatements.forEach(function (importStatement) {
				var
				relpath = importStatement.match(importMatchOne)[2];

				relpath = relpath.slice(-5) === partialSuffix ? relpath : relpath + partialSuffix;

				var
				directory = path.resolve(manifestDirectory + '/' + path.dirname(relpath)),
				fullpath = path.resolve(directory + '/' + partialPrefix + path.basename(relpath));

				if (!fs.existsSync(directory) && directoryList.indexOf(directory) === -1) {
					directoryList.push(directory);
				}

				if (!fs.existsSync(fullpath) && fullpathList.indexOf(fullpath) === -1) {
					fullpathList.push(fullpath);
				}
			});
		}

		directoryList = directoryList.filter(function (directory) {
			var
			message = 'Created "' + directory.slice(manifestDirectory.length + 1) + '"',
			index = directoryListLast.indexOf(directory);

			if (!mkdir(directory)) {
				log(message + ' FAILED!', 1);

				return false;
			}

			if (index !== -1) {
				directoryListLast.splice(index, 1);
			}

			log(message);

			return true;
		});

		fullpathList = fullpathList.filter(function (fullpath) {
			var
			message = 'Created "' + fullpath.slice(manifestDirectory.length + 1) + '"',
			index = fullpathListLast.indexOf(fullpath);

			try {
				fs.closeSync(fs.openSync(fullpath, 'w'));
			} catch (error) {
				log(message + ' FAILED!', 1);

				return false;
			}

			if (index !== -1) {
				fullpathListLast.splice(index, 1);
			}

			log(message);

			return true;
		});

		fullpathListLast.forEach(function (fullpath) {
			var message = 'Deleted "' + fullpath.slice(manifestDirectory.length + 1) + '"';

			try {
				if (!fs.readFileSync(fullpath, 'utf8')) {
					fs.unlinkSync(fullpath);
				}
			} catch (error) {
				log(message + ' FAILED!', 1);

				return false;
			}

			log(message);
		});

		directoryListLast = directoryList;
		fullpathListLast = fullpathList;
	});
}

var
fs = require('fs'),
path = require('path'),
manifestFile = 2 in process.argv ? path.resolve(process.argv[2]) : '',
manifestDirectory = path.dirname(manifestFile),
partialPrefix = process.argv.indexOf('--no-underscore') !== -1 ? '' : '_',
partialSuffix = process.argv.indexOf('--sass') !== -1 ? '.sass' : '.scss',
isWatching = process.argv.indexOf('--watch') !== -1,
importMatchAll = /(?:^\s*|;\s+|\n)@import[ \t]+(['"])(.+?)\1/g,
importMatchOne = /@import[ \t]+(['"])(.+?)\1/,
commentMatchMultiline = /\/\*[\W\w]+?\*\//g,
commentMatchOneline = /\/\/[^\n]+/g,
directoryListLast = [],
fullpathListLast = [];

if (process.argv.length < 3) {
	log('Usage: sass-director <manifest-file> [--sass] [--no-underscore]', 1);
}

if (!fs.existsSync(manifestFile)) {
	log('Unable to access "' + manifestFile + '"', 1);
}

if (!mkdir(manifestDirectory)) {
	log('Unable to access "' + manifestDirectory + '"', 1);
}

if (isWatching) {
	log('Watching "' + manifestFile + '"');

	fs.watch(manifestDirectory, function (event, filename) {
		if (manifestDirectory + '/' + filename === manifestFile) {
			main();
		}
	});
} else {
	main();
}
