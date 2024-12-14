/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data-Mongo
*/
const path = require('path')
//const {check_client_db} = require(path.join(__dirname, '../../index.js'));
//const {check_client_db} = require('/home/think2/www/doqbox/biz9-framework/biz9-data/src/code');

//const {  } = require(process.env.BIZ9_HOME + "/biz9-data/src/code/dataz");
//console.log(path.join(__dirname, '../../index.js'));
console.log('dddddddddd');
console.log('coooooooooooooooooolllllllllll');
console.log('dddddddddd');
console.log('dddddddddd');
const { get_guid } = require(process.env.BIZ9_HOME + "/biz9-utility/src/code");
const moment = require("moment");
/*
    module.update =async function(db,data_type,item,callback){
        get_guid=function(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        var error=null;
        var collection = {};
        if (String(item.tbl_id)=='0') {//insert
            item.tbl_id = get_guid();
            item.date_create = new moment().toISOString();
            item.date_save = new moment().toISOString();
            async function run() {
                if(dataz.db_client_connected(db)){
                    collection = db.collection(data_type);
                    await collection.insertOne(item);
                    callback(error,item);
                }else{
                    callback('error_mongo_db_update',item);
                }
            }
            run();
        }else{
            item.date_save = new moment().toISOString();
            async function run() {
                if(dataz.db_client_connected(db)){
                    collection = db.collection(data_type);
                    await collection.updateOne({tbl_id:item.tbl_id},{$set: item});
                    callback(null,item);
                }else{
                    callback('error_mongo_db_update_2',item);
                }
            }
            run();
        }
    }
    */

const update=(db_connect,data_type,item)=>{
    var error=null;
    var collection = {};
    return new Promise((callback) =>{
        if(String(item.tbl_id)=='0') {//insert
            item.tbl_id = get_guid();
            item.date_create = new moment().toISOString();
            item.date_save = new moment().toISOString();
            console.log('apple');
          if(check_client_db(db_connect)){
              console.log('aaaaaaaaaaa');
            }else{
                console.log('rrrrrrrrrrrrr');
            }

            async function run() {
                //console.log('fff');
                //console.log(check_db_connect);
                /*
                if(check_db_connect(db)){
                    collection = db.collection(data_type);
                    collection.insertOne(item).then((data)=> {
                        callback(data);
                    }).catch(err => handleError)
                    function handleError(error) {
                        error = error;
                        console.error("--Mongo-DB-Error--"+error.message+"--Error--", error);
                    }
                }else{
                    callback(null);
                }
                */
            }
            run();
        }else{
            /*
            item.date_save = new moment().toISOString();
            async function run() {
                collection = db.collection(data_type);
                    collection.updateOne({tbl_id:item.tbl_id},{$set: item}).then((data)=> {
                        callback(data);
                    }).catch(err => handleError)
                    function handleError(error) {
                        error = error;
                        console.error("--Mongo-DB-Error--"+error.message+"--Error--", error);
                    }
            }
            run();
            */

        }
    });


    /*
    return new Promise((resolve) =>{
        console.log('2222222222');
        let error=null;
        data_mon.update(data_type,data_item).then((data)=> {
            console.log('run_data_mon');
            console.log('here');
//resolve([null,data]);
        }).catch(err => handleError)
        function handleError(error) {
            error = error;
            console.error("--Error--"+error.message+"--Error--", error);
        }
    });

*/
}

module.exports = {
    update
};

