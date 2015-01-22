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
		partialDirectories = [],
		partialBasenames = [];

		if (importStatements) {
			importStatements.forEach(function (importStatement) {
				var
				partialPath = importStatement.match(importMatchOne)[2];

				partialPath = partialPath.slice(-5) === partialSuffix ? partialPath : partialPath + partialSuffix;

				var
				partialDirectory = manifestDirectory + '/' + path.dirname(partialPath),
				partialBasename = path.resolve(partialDirectory + '/' + partialPrefix + path.basename(partialPath));

				if (!fs.existsSync(partialDirectory) && partialDirectories.indexOf(partialDirectory) === -1) {
					partialDirectories.push(partialDirectory);
				}

				if (!fs.existsSync(partialBasename) && partialDirectories.indexOf(partialBasename) === -1) {
					partialBasenames.push(partialBasename);
				}
			});
		}

		partialDirectories.forEach(function (partialDirectory) {
			var message = 'Created "' + partialDirectory.slice(manifestDirectory.length + 1) + '"';

			if (!mkdir(partialDirectory)) {
				log(message + ' FAILED!', 1);
			}

			log(message);
		});

		partialBasenames.forEach(function (partialBasename) {
			var message = 'Created "' + partialBasename.slice(manifestDirectory.length + 1) + '"';

			try {
				fs.closeSync(fs.openSync(partialBasename, 'w'));
			} catch (error) {
				log(message + ' FAILED!', 1);
			}

			log(message);
		});
	});
}

var
fs = require('fs'),
path = require('path'),
manifestFile = 2 in process.argv ? path.resolve(process.argv[2]) : '',
manifestDirectory = path.dirname(manifestFile),
partialPrefix = process.argv.indexOf('--no-underscore') !== -1 ? '' : '_',
partialSuffix = process.argv.indexOf('--sass') !== -1 ? '.sass' : '.scss',
importMatchAll = /(?:^\s*|;\s+|\n)@import[ \t]+(['"])(.+?)\1/g,
importMatchOne = /@import[ \t]+(['"])(.+?)\1/,
commentMatchMultiline = /\/\*[\W\w]+?\*\//g,
commentMatchOneline = /\/\/[^\n]+/g;

if (process.argv.length < 3) {
	log('Usage: sass-director <manifest-file> [--sass] [--no-underscore]', 1);
}

if (!fs.existsSync(manifestFile)) {
	log('Unable to access "' + manifestFile + '"', 1);
}

if (!mkdir(manifestDirectory)) {
	log('Unable to access "' + manifestDirectory + '"', 1);
}

main();
