/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data-Mongo
*/
const path = require('path')
const async = require("async");
//var cool  = require('../../../dataz/index.js');
console.log('ppppppppppppp')
const {check_client_db}  = require('./../index.js');
console.log('rrrrrrrrrrrrrr')
//console.log(get_db_connect);
//console.log('BBBBBBBBBBBB');

//const {check_client_db} = require(path.join(__dirname, '../../index.js'));
//const {check_client_db} = require('/home/think2/www/doqbox/biz9-framework/biz9-data/src/code');

//const update=(db_connect,data_type,data_item)=>{
const update=(db_connect,data_type,item)=>{
    console.log('444444444444444');
	return new Promise((callback) =>{
        let error=null;
        let collection = {};
        async.series([
			function(callback) {

                if(String(item.tbl_id)=='0') {//insert


                }




			},
			function(callback) {
				setTimeout(function() {
					callback(null, 'two');
				}, 100);
			}
		]).then(results => {
			console.log(results);
			// results is equal to ['one','two']
		}).catch(err => {
			console.log(err);
		});
	});
}


module.exports = {
	update
};

