#!/usr/bin/env node
/* -----------------------------------------------------------------------------
 * Sass Director: generate Sass directory structures from Sass manifest files
 *
 * Bash script: Una Kravets, Jonathan Neal
 * Licensed MIT: https://github.com/una/sass-director
 * -------------------------------------------------------------------------- */

function init(argv) {
	var fullpath = path.resolve(argv[2]);

	cached = {
		directory: [],
		fullpath: []
	};

	created = {
		directory: [],
		fullpath: []
	};

	manifest = {
		basename: path.basename(fullpath),
		directory: path.dirname(fullpath),
		fullpath: fullpath,
		prefix: argv.includes('--no-underscore') ? '' : '_',
		suffix: argv.includes('--sass') ? '.sass' : '.scss',
		watch:  argv.includes('--watch')
	};

	matches = {
		commentMultiline: /\/\*[\W\w]+?\*\//g,
		commentSingleline: /\/\/[^\n]+/g,
		importAll: /(?:^\s*|;\s+|\n)@import[ \t]+(['"])(.+?)\1/g,
		importOne: /@import[ \t]+(['"])(.+?)\1/
	};

	message = {
		created: 'Created "$1"',
		deleted: 'Deleted "$1"',
		failed: ' FAILED',
		reading: 'Reading "$1"',
		watching: 'Watching "$1"'
	};

	// watch manifest directory if --watch argument exists
	if (manifest.watch) {
		var log = message.watching.replace('$1', manifest.basename);

		try {
			fs.watch(manifest.directory, function () {
				// run if manifest was modified
				if (manifest.fullpath === manifest.directory + '/' + arguments[1]) {
					main();
				}
			});

			console.log(log);
		} catch (error) {
			console.log(log + message.failed);
		}
	}
	// otherwise, run
	else {
		main();
	}
}

function main() {
	var
	data;

	// read manifest and strip comments
	try {
		data = fs.readFileSync(manifest.fullpath, 'utf8').replace(matches.commentMultiline, '').replace(matches.commentSingleline, '');

		if (!manifest.watch) {
			console.log(message.reading.replace('$1', manifest.basename));
		}
	}

	// exit on read error
	catch (error) {
		console.log(message.reading.replace('$1', manifest.basename) + failed);

		process.exit(1);
	}

	// match all import statements
	(data.match(matches.importAll) || []).forEach(function (importStatement) {
		// get relative path of import statement
		var relpath = importStatement.match(matches.importOne)[2],

		// set import path
		basename = relpath.slice(-5) === manifest.suffix ? relpath : relpath + manifest.suffix,
		directory = path.resolve(manifest.directory + '/' + path.dirname(basename)),
		fullpath = path.resolve(directory + '/' + manifest.prefix + path.basename(basename));

		// conditionally create every directory required
		directory.split('/').reduce(function (lastDirectory, directory) {
			directory = lastDirectory + '/' + directory;

			if (!fs.isDirectorySync(directory) && !created.directory.includes(directory)) {
				var log = message.created.replace('$1', path.basename(directory));

				try {
					fs.mkdirSync(directory);

					created.directory.push(directory);

					console.log(log);
				} catch (error) {
					console.log(log + message.failed);

					process.exit(1);
				}
			}

			return directory;
		});

		// conditionally create every file required
		if (!fs.isFileSync(fullpath) && !created.fullpath.includes(fullpath)) {
			var log = message.created.replace('$1', path.basename(fullpath));

			try {
				fs.writeFileSync(fullpath, '');

				created.fullpath.push(fullpath);

				console.log(log);
			} catch (error) {
				console.log(log + message.failed);

				process.exit(1);
			}
		}
	});

	// remove files in cache that are empty and not recently created
	cached.fullpath.forEach(function (fullpath) {
		var log = message.deleted.replace('$1', path.basename(fullpath));

		try {
			if (fs.isEmptySync(fullpath) && created.fullpath.indexOf(fullpath) === -1) {
				fs.unlinkSync(fullpath);

				console.log(log);
			}
		} catch (error) {
			console.log(log + message.failed);
		}
	});

	// remove directories in cache that are empty or not recently created
	cached.directory.forEach(function (directory) {
		var log = message.deleted.replace('$1', path.basename(directory));

		try {
			if (fs.isEmptySync(directory) || created.directory.indexOf(directory) === -1) {
				fs.rmdirSync(directory);

				console.log(log);
			}
		} catch (error) {
			console.log(log + message.failed);
		}
	});

	// reset cached
	cached.directory = created.directory.splice(0);
	cached.fullpath = created.fullpath.splice(0);
}

/* Setup
 * -------------------------------------------------------------------------- */

var
fs = require('fs'),
path = require('path'),
cached, created, manifest, matches, message;

if (!Array.prototype.includes) {
	Object.defineProperty(Array.prototype, 'includes', {
		value: function includes() {
			return Array.prototype.indexOf.apply(this, arguments) !== -1;
		}
	});
}

if (!fs.isDirectorySync) {
	fs.isDirectorySync = function isDirectorySync(path) {
		return fs.existsSync(path) && fs.statSync(path).isDirectory();
	};
}

if (!fs.isEmptySync) {
	fs.isEmptySync = function isEmptySync(path) {
		try {
			if (fs.statSync(path).isDirectory()) {
				return !(fs.readdirSync(path) || []).length;
			}

			return !(fs.readFileSync(path) || []).length;
		} catch (error) {
			return true;
		}
	};
}

if (!fs.isFileSync) {
	fs.isFileSync = function isFileSync(path) {
		return fs.existsSync(path) && fs.statSync(path).isFile();
	};
}

init(process.argv);
