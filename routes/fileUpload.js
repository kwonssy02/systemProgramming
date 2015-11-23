var fs = require('fs');
//var Busboy = require('busboy');
var path = require('path');
var jsonFormat = require('./jsonFormat');
 
require('./dbconnection')();

/**
 * 이미지 insert
 * input  : location, image file
 * output : 없음
 */
const postImageURL = ("/postImage/:sensorId");
const postImageQuery = ("INSERT INTO image (imageId, location, regiDate) values (?, (SELECT location FROM sensor WHERE sensorId = ?), now()) ;");

/**
 * 새로운 이미지 아이디 가져오기
 * input  : 없음
 * output : imageId
 */
const selectNewImageIdQuery = ("SELECT IFNULL(MAX(imageId),0)+1 as imageId from image ;");

module.exports = function(app) {

	app.post('/postImage/:sensorId', function(req, res) {
		//var busboy = new Busboy({ headers: req.headers });
		console.log('upload goes');
		
		const sensorId = req.params.sensorId;
		console.log('sensorId='+sensorId);
		req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			
			var newImageId;
            connection.query(selectNewImageIdQuery, function(err, rows, fields) {
				if(err) {
					throw err;
				}
				newImageId = rows[0].imageId;
				console.log('newImageId: ' + newImageId);
				//jsonFormat.successRes(res, 'postImage', req.body);
				insertNewImage(newImageId, sensorId, fieldname, file, filename, encoding, mimetype);
			});
		});	
				
		req.busboy.on('finish', function() {
			res.writeHead(200, { 'Response' : 'Saved' });
			res.end("That's all folks!");
		});
		
		return req.pipe(req.busboy);
		//res.writeHead(404);
		//res.end();
	});
	function insertNewImage(imageId, sensorId, fieldname, file, filename, encoding, mimetype) {
		//const sensorId = req.params.sensorId;
		const queryParams = [imageId, sensorId];
		connection.query(postImageQuery, queryParams, function(err, rows, fields) {
			if(err) {
				throw err;
			}
			//jsonFormat.successRes(res, 'postImage', req.body);
			uploadFile(imageId, fieldname, file, filename, encoding, mimetype);
		});
	}

 	function uploadFile(imageId,fieldname, file, filename, encoding, mimetype) {
		//console.log('newImageId: ' + imageId);
        console.log('file:'+filename);
        var dirname = ".";
        //var dirname = "..";
        var newPath = dirname + "/images/";
        //var saveTo = path.join(newPath, path.basename(fieldname));
        var saveTo = dirname + "/images/" + imageId + ".img";
                
        file.pipe(fs.createWriteStream(saveTo,{flags: 'w'}));
	}

	app.get('/images/:imageId', function (req, res){
    	imageId = req.params.imageId;
    	//var dirname = "/workspace/museek-server";
    	var dirname = ".";
		var imgFile = fs.readFileSync(dirname + "/images/" + imageId + ".img");
    	//res.writeHead(200, {'Content-Type': 'image/img', "Content-Length": imgFile.length});
		//res.end(imgFile, 'binary');
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<html><body><img src="data:image/img;base64,');
		res.write(new Buffer(imgFile).toString('base64'));
		res.end('"/></body></html>');
	});

	app.get('/images', function (req, res){
		
	});
	
	app.get('/image/:imageId', function (req, res) {
		var imageId = req.params.imageId;
		var filePath = './images/' + imageId + '.img';
		console.log(filePath);
		fs.readFile(filePath, function (error, data) {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(data);
		});
	});
};
