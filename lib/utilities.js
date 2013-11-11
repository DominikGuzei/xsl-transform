var fileSystem = require('fs'),
		pathUtil = require('path'),
		xslt = require('node_xslt'),
		mkdirp = require('mkdirp');

var utilities = {
		
	printUsageInformation: function() {
		console.log('Usage: xsltransform path/to/stylesheet.xsl path/to/inputfolder path/to/outputfolder');
	},

	throwError: function(message) {

		// log a message to the console
		console.log(message);

		// exit the command line process
		process.exit();
	},

	checkExistance: function(path) {

		// check that given file or directory exists
		if(!fileSystem.existsSync(path)) {
			utilities.throwError('Error: "' + path + '" does not exist.');
		}
	},

	checkFileExistance: function(path) {

		// check that the file exists
		utilities.checkExistance(path);

		// get the status of given path
		var fileStatus = fileSystem.statSync(path);

		// check that the given path points to a file
		if(!fileStatus.isFile()) {
			utilities.throwError('Error: "' + path + '" is not a file!');
		}
	},

	ensureDirectoryExistence: function(path) {
		
		if(fileSystem.existsSync(path) && fileSystem.statSync(path).isFile()) {
			utilities.throwError('Error: "' + path + '" is an existing file but must be a directory!');
		}

		mkdirp(path, function(error, madeNew) {
			if(error) {
				console.log(error);
			} 
			else {
				if(madeNew) {
					console.log('Created new directory at ' + path);
				}
			}
		});

	},

	checkFileExtension: function(path, extension) {

		// check that is has valid file extension
		if(pathUtil.extname(path) !== extension) {
			utilities.throwError('Error: "' + xslPath + '" is not a ' + extension + ' file!');
		}
	},

	loadXslFile: function(xslPath) {

		utilities.checkFileExistance(xslPath);
		utilities.checkFileExtension(xslPath, '.xsl');

		return xslt.readXsltFile(xslPath);
	},

	getXmlFilePaths: function(xmlPath) {

		var xmlFiles = [];

		utilities.checkExistance(xmlPath);

		// get the file status of given xsl path
		var fileStatus = fileSystem.statSync(xmlPath);

		if(fileStatus.isFile()) {
			
			utilities.checkFileExtension(xmlPath, '.xml');

			xmlFiles.push( xmlPath );
		}
		else if(fileStatus.isDirectory()) {

			var files = fileSystem.readdirSync(xmlPath);

			for(var i=0; i < files.length; i++) {
				var filePath = xmlPath + "/" +  files[i];

				if(fileSystem.statSync(filePath).isFile()) {
					xmlFiles.push(filePath);
				}
			}
		}

		return xmlFiles;
	}
};

module.exports = utilities;