/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Test
*/
const async = require('async');
const assert = require('node:assert');
const {Database,Data} = require(".");
const {Log,Num,Str} = require("biz9-utility");
const {Data_Logic,Value_Type,Table,Field}=require("/home/think1/www/doqbox/biz9-framework/biz9-logic/source");
/*
 * availble tests
- connect
*/
/* --- TEST CONFIG START --- */
const APP_ID = 'test-stage-feb19';
/* --- TEST CONFIG END --- */

/* --- DATA CONFIG START --- */
const DATA_CONFIG ={
    APP_ID:APP_ID,
    MONGO_IP:'0.0.0.0',
    MONGO_USERNAME_PASSWORD:'',
    MONGO_PORT_ID:"27019",
    MONGO_SERVER_USER:'admin',
    MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
    MONGO_SSH_KEY:"",
    REDIS_URL:"0.0.0.0",
    REDIS_PORT_ID:"27019"
};
class Project_Table{
    static BLANK = 'blank_biz';
    static PRODUCT = 'product_biz';
    static GROUP = 'group_biz';
    static IMAGE = 'image_biz';
}
/* --- DATA CONFIG END --- */
//9_connect - 9_test_connect
describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
        let error=null;
        let cache=null;
        let database = {};
        let data = {};
        async.series([
            async function(call){
                const [biz_error,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                //-->
                let print_test = true;
                // -- TEST -- //
                // -- POST-START --//
                /*
                let option = {};
                // -- parent --
                //let parent = Data_Logic.get(Project_Table.PRODUCT,0,{data:{field_1:'value_'+Num.get_id(),field_2:'value_'+Num.get_id()}});
                let parent = Data_Logic.get(Project_Table.BLANK,'635');
                //const [error,biz_data] = await Data.post(database,parent.table,parent,option);
                // -- sub items --
                let sub_items = Data_Logic.get(Project_Table.IMAGE,0,{count:3,parent:parent,data:{field_1:'value_'+Num.get_id(),field_2:'value_'+Num.get_id()}});
                const [error,biz_data] = await Data.post_items(database,sub_items);

                */
                // -- POST-END --//
                //-- GET  START --//

                let foreign_2 = Data_Logic.get_foreign(Value_Type.ITEMS,Project_Table.IMAGE,Field.PARENT_ID,Field.ID,{title:'images'});

                let join_search_1 = Data_Logic.get_search(Project_Table.BLANK,{},{},1,0,{});
                let join_1 = Data_Logic.get_join(Value_Type.ITEMS,join_search_1,{foreigns:[foreign_2]});
                let foreign_1 = Data_Logic.get_foreign(Value_Type.ITEMS,Project_Table.BLANK,Field.PARENT_ID,Field.ID);

                //let group_1 = Data_Logic.get_group({foreigns:[foreign_2]});//Data_Logic.get_group();
                let option = {joins:[join_1]};//{groups:[group_1]};//{foreigns:[foreign_1]};
                let parent = Data_Logic.get(Project_Table.PRODUCT,'643');
                const [error,biz_data] = await Data.get(database,parent.table,parent.id,option);

                //-- GET  END --//
                //-->
                ///next Group 49604 3

                //---
                if(print_test){;
                    Log.w('99_biz_data',biz_data);
                }
             },
],
    function(error, result){
        console.log('CONNECT-DONE');
        done();
    });
    });
});
//9_blank - 9_test_blank
describe('blank', function(){ this.timeout(25000);
    it("_blank", function(done){
        let error=null;
        let database = {};
        let data = {};
        async.series([
            async function(call){
                const [biz_error,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                //-->
                let print_test = true;
                //-->
                //-- GET  START --//
                /*
                //let option = {id_field:Type.FIELD_TITLE_URL,stat:{print:false,type:Type.STAT_VIEW,user_id:12}};
                let parent = Data_Logic.get(Type.DATA_PRODUCT,'929');
                //Log.w('parent',parent);
                const [error,biz_data] = await Data.get(database,parent.table,parent.id,option);
                */
                //-- GET  END --//
                //---
                if(print_test){;
                    Log.w('99_biz_data',biz_data);
                }
             },
],
    function(error, result){
        console.log('CONNECT-DONE');
        done();
    });
    });
});

