#! /usr/bin/env node

/*
 * xsl-transform
 * https://github.com/DominikGuzei/xsl-transform
 *
 * Copyright (c) 2013 Dominik Guzei
 * Licensed under the MIT license.
 */

// require other modules
var utilities = require('./utilities'),
	 	xslt = require('node_xslt'),
		fileSystem = require('fs');
		pathUtil = require('path');

// extract the command line parameters from the process args
var userArgs = process.argv.slice(2);

// exit and print command line usage if number of params isnt correct
if(userArgs.length != 3) {
	utilities.printUsageInformation();
	process.exit();
}

// first param is the path to the xsl stylesheet document
var xslPath = pathUtil.normalize(userArgs[0]);

// second argument is the input folder/file
var inputPath = userArgs[1];

// third argument is the output folder
var outputPath = userArgs[2];

// fourth argument is the file extensions of the transformed documents (defaults to .html)
var outputExtension = userArgs[3];

if(!outputExtension) {
	outputExtension = '.html';
}

// ensure that output path is not a file and create the directory if necessary
utilities.ensureDirectoryExistence(outputPath);

// load the xsl file log any errors to the console
var xsl = utilities.loadXslFile(xslPath);

// gets an array of xml files from the input path
var xmlFilePaths = utilities.getXmlFilePaths(inputPath);

// log a warning if no input files are found
if(xmlFilePaths.length === 0) {
	utilities.throwError('No xml files found at "' + inputPath + '"');
}

// loop over all xml files and transform them to the output format
for(var i=0; i < xmlFilePaths.length; i++) {

	var currentXmlFilePath = xmlFilePaths[i],
			xmlFileBasename = pathUtil.basename(currentXmlFilePath, '.xml'),
			currentOutputPath = outputPath + "/" + xmlFileBasename + outputExtension;

	// force UTF-8 encoding on xml files!
	var xmlFileBuffer = fileSystem.readFileSync(currentXmlFilePath, { encoding: 'utf8' });
	var xmlDocument = xslt.readXmlString(xmlFileBuffer);
	var outputString = xslt.transform(xsl, xmlDocument, []);

	fileSystem.writeFile(currentOutputPath, outputString, function(err) {

    if(err) {
        console.log(err);
    } else {
        console.log("Successfully transformed " + currentXmlFilePath + " into " + currentOutputPath);
    }

	}); 

}