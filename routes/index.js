var express = require('express');
var router = express.Router();
require('./dbconnection')();

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: '코메라: 냄새맡는 카메라' });
});
*/

const homeURL = ("/");
const selectPostsQuery = ("SELECT imageId, location, DATE_FORMAT(regiDate, '%Y/%m/%d %H:%i:%s') as regiDate, TIMESTAMPDIFF(SECOND, regiDate, now()) secDiff FROM image ORDER BY regiDate DESC LIMIT 10");
const selectCommentsQuery = ("SELECT imageId, author, content, DATE_FORMAT(regiDate, '%Y/%m/%d %H:%i:%s') as regiDate FROM comment ORDER BY regiDate ASC");

const addCommentURL = ("/addComment");
const addCommentQUERY = ("INSERT INTO comment (imageId, author, content, regiDate) values(?, ?, ?, NOW())");
const selectCommentsByImageIdQuery = ("SELECT imageId, author, content, DATE_FORMAT(regiDate, '%Y/%m/%d %H:%i:%s') as regiDate FROM comment WHERE imageId = ? ORDER BY regiDate ASC");

router.get(homeURL, home);
function home(req, res, next) {
	var data = {};
	data['title'] = '코메라: 냄새맡는 카메라';
        connection.query(selectPostsQuery, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
		data['posts'] = rows;
		
		connection.query(selectCommentsQuery, function(err, rows, fields) {
                	if(err) {
                        	throw err;
                	}
                	//res.send(rows);
                	data['comments'] = rows;
                	res.render('index', data);
        	});
        });

}

router.post(addCommentURL, addComment);
function addComment(req, res, next) {
        const imageId = req.body.imageId;
        const author = req.body.author;
	const content = req.body.content;
	
        const queryParams = [imageId, author, content];
        connection.query(addCommentQUERY, queryParams, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
		const queryParams2 = [imageId];
		connection.query(selectCommentsByImageIdQuery, queryParams2, function(err, rows, fields) {
                        if(err) {
                                throw err;
                        }
                        res.json(rows);
                });
        });
}

module.exports = router;
