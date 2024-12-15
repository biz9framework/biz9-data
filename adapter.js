/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Mongo - Base
*/
const {get_db_base,check_db_base,close_db_base}  = require('./mongo/index.js');
const get_db_adapter =() => {
	return new Promise((callback) => {
		let error=null;
		get_db_base().then((data)=> {
			callback([null,data]);
        }).catch(err => {
            console.error("--Error-Get-DB-Connect--"+err+"--Error--", err);
		});
	});
}
const close_db_adapter =(db_connect) => {
	return new Promise((callback) => {
		let error=null;
		close_db_base(db_connect).then((data)=> {
			callback([null,data]);
        }).catch(err => {
            console.error("--Error-Close-DB-Connect--"+err+"--Error--", err);
		});
	});
}

const check_db_adapter = (db_connect) => {
    return check_db_base(db_connect);
}
module.exports = {
	get_db_adapter,
	check_db_adapter,
	close_db_adapter
	//update_item_base
};

