var express = require('express');
var router = express.Router();
var jsonFormat = require('./jsonFormat');
var fs = require('fs');
var path = require('path');

require('./dbconnection')();

/**
 * 전체 이미지 select
 * input  : 없음
 * output : id, password, name, groupkey
 */
const selectImagesURL = ("/images");
const selectImagesQuery = ("SELECT * FROM image;");

/**
 * 이미지 insert
 * input  : location, image file
 * output : 없음
 */
const postImageURL = ("/postImage/:loc");
const postImageQuery = ("INSERT INTO image (imageId, location, regDate) values (?, ?, now()) ;");

/**
 * 새로운 이미지 아이디 가져오기
 * input  : 없음
 * output : imageId
 */
const selectNewImageIdQuery = ("SELECT MAX(imageId)+1 as imageId from image ;");

/**
router.get(postImageURL, postImage);
function postImage(req, res, next) {
	var newImageId;
	console.log('postImage connected');
	connection.query(selectNewImageIdQuery, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
		newImageId = rows[0].imageId;
		console.log('newImageId: ' + newImageId);
                //jsonFormat.successRes(res, 'postImage', req.body);
        });

	const loc = req.params.loc;
	const queryParams = [newImageId, loc];
	connection.query(postImageQuery, queryParams, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                //jsonFormat.successRes(res, 'postImage', req.body);
        });
	req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                console.log('file:'+filename);
                var dirname = ".";
                //var dirname = "..";
		var newPath = dirname + "/images/";
		//var saveTo = path.join(newPath, path.basename(fieldname));
		var saveTo = dirname + "/images/" + filename;
	
		 file.pipe(fs.createWriteStream(saveTo,{flags: 'w'}));
	});

	req.busboy.on('finish', function() {
		res.writeHead(200, { 'Response' : 'Saved' });
		res.end("That's all folks!");
	});

	return req.pipe(req.busboy);
}
*/

/**
router.post(insertTokenURL, insertToken);
function insertToken(req, res, next) {
        const id = req.params.id;
        const token = req.params.token;
        const queryParams = [id, token];
        connection.query(selectTokenQuery, queryParams, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                console.log("tokencount="+rows[0].count);
                if(rows[0].count < 1)
                        insertToken2(req, res, next);
                else
                        jsonFormat.successRes(res, 'insertToken', req.body);
        });
}
*/


router.post('/', function(req, res) {
	res.send();
});

module.exports = router;
