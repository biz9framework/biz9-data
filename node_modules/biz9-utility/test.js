/*
Copyright 2019 BiZ9 Framework
Author: biz9framework@gmail.com (BiZ9 Framework LLC)
License GNU General Public License v3.0
Description: BiZ9 Framework: Test
*/

const series = require('async-series');
const moment = require('moment');
//const { w,w_error,get_test_item,error_append,get_id,get_guid,get_title_url,get_date_time_str,get_date_str, get_date_time_pretty} = require('.');
const {DateTime,Log,Test }= require('.');

/* --- TEST CONFIG START --- */
/* --- TEST DATA CONFIG END --- */

describe("connect", () => {
    it("_connect", () => {
        series([
            function(call) {
                console.log('CONNECT-START');
                call()
            },
            function(call) {
                console.log('DateTime-GET-STR-START');
                let date = new moment().toISOString();
                Log.w('get_str',DateTime.get_str(date));
                console.log('DateTime-GET-STR-SUCCESS');
                call()
            },

            function(call) {
                console.log('DateTime-GET-Date-STR-START');
                let date = new moment().toISOString();
                Log.w('get_date_str',DateTime.get_date_str(date));
                console.log('DateTime-GET-Date-STR-SUCCESS');
                call()
            },

            function(call) {
                console.log('DateTime-GET-Pretty-START');
                let date = new moment().toISOString();
                Log.w('get_date_str',DateTime.get_pretty(date));
                console.log('DateTime-GET-Pretty-SUCCESS');
                call()
            },

            function(call) {
                console.log('DateTime-GET-Obj-START');
                let date = new moment().toISOString();
                Log.w('get_date_str',DateTime.get_obj(date));
                console.log('DateTime-GET-Obj-SUCCESS');
                call()
            },

            function(call) {
                console.log('Log-W-START');
                let str = 'str_one';
                Log.w('get_str','help');
                console.log('Log-W-END');
                call()
            },

            function(call) {
                console.log('Log-Error-START');
                let str = 'str_one';
                Log.error('get_error','help');
                console.log('Log-Error-END');
                call()
            },
            function(call) {
                console.log('W-GET-TEST-ITEM-START');
                let id= 0;
                let data_type = 'dt_blank';
                let test_item = Test.get_item(id,data_type);
                console.log(test_item);
                console.log('W-GET-TEST-ITEM-SUCCERSS');
                call()
            },
            function(call) {
                console.log('ERROR-APPEND-START');
                let error = 'error1';
                let error2 = 'error2';
                let _error_append = null;
                _error_append = Log.append(_error_append,error);
                _error_append = Log.append(_error_append,error2);
                console.log(_error_append);
                console.log('ERROR-APPEND-SUCCERSS');
                call()
            },



            function(call) {
                // never happens, because "second thing"
                // passed an error to the done() callback
            }
        ], function(err) {
            console.log(err.message) // "another thing"
        })

     });
});


