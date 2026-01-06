const async = require('async');
const assert = require('node:assert');

const {Data,Database,Portal} = require(".");

const {Log,Num,Str} = require("biz9-utility");
const {Type,Data_Logic} = require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
/*
 * availble tests
- connect
*/
/* --- TEST CONFIG START --- */
const APP_ID = 'test-stage-jan6';
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
/* --- DATA CONFIG END --- */
//9_connect - 9_test_connect
describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
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
                let new_data_type = Type.DATA_PRODUCT;
                //-->
                //let parent = Data_Logic.get_new(new_data_type,0,{test:true,generate_title:true});
                let parent = Data_Logic.get_new(Type.DATA_PRODUCT,'957');

                //-->
                //let group = Data_Logic.get_new(Type.DATA_GROUP,0,{test:true,generate_title:true,parent:parent});
                //-->
                //let user = Data_Logic.get_new(Type.DATA_USER,0,{test:true,generate_title:true});
                //let user = Data_Logic.get_new(Type.DATA_USER,'54b31f02-afb4-4fa7-9835-f923da7a6749');
                //-->
                //let favorite = Favorite_Logic.get_new(parent.data_type,parent.id,user.id);
                //-->
                let option = {};
                //let join_search_1 = Data_Logic.get_search_join(Type.TITLE_COUNT,Data_Logic.get_search(Type.DATA_BLANK,{},{},1,0),{title:'cool'});
                //let option = {joins:[join_search_1]};
                //let foreign_search_1 = Data_Logic.get_search_foreign(Type.TITLE_ONE,Type.DATA_BLANK,Type.FIELD_PARENT_ID,Type.FIELD_ID);
                //let option = {foreigns:[foreign_search_1]};

                //let group_search_1 = Data_Logic.get_search_group();
                //let group_search_1 = Data_Logic.get_search_group({title:{group_43815:0,group_83574:1}});
                //let group_search_2 = Data_Logic.get_search_group({title:{group_78157:0},field:{title:1,title_url:1}});
                //let option = {groups:[group_search_1]};

                //let option = {groups:{}};
                //let option = {field:{id:1,title:1,title_url:1}};
                //let option = {stat:{user_id:user.id,type:Type.STAT_VIEW,unique:false}};
                //---
                //let search = Data_Logic.get_search(Type.DATA_PRODUCT,{},{date_create:-1},1,0);
                //---
                //Log.w('search',search);
                //const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
                //---
                //const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
                //---
                //const [error,biz_data] = await Portal.copy(database,parent.data_type,parent.id,option);
                //---
                const [error,biz_data] = await Portal.get(database,parent.data_type,parent.id,option);
                //const [error,biz_data] = await Portal.get(database,group.data_type,group.id,option);
                //const [error,biz_data] = await Portal.get(database,group.data_type,group.id);
                //---
                //const [error,biz_data] = await Portal.post(database,parent.data_type,parent);
                //const [error,biz_data] = await Portal.post(database,blank.data_type,blank);
                //const [error,biz_data] = await Portal.post(database,user.data_type,user);
                //const [error,biz_data] = await Portal.post(database,image.data_type,image);
                //const [error,biz_data] = await Portal.post(database,group.data_type,group);
                //---
                //const [error,biz_data] = await Portal.post_items(database,[parent,parent_item_1,parent_item_2]);
                //---
                //const [error,biz_data] = await Portal.delete(database,parent.data_type,parent.id,option);

                //---
                Log.w('99_biz_data',biz_data);
                //Log.w('99_option',option);
                //Log.w('99_biz_data_parents',biz_data.items[0]);
                //Log.w('99_biz_data_images',biz_data.items_bean[0].images.length);
                //Log.w('99_biz_data_len',biz_data.groups.length);
                //Log.w('99_biz_data_groups',biz_data.data_list[0].groups);
                //Log.w('99_biz_data_post',biz_data.data_list[0]);
                //Log.w('group',group);

                /*
                 *   {edit_mode?Project_Logic.get_item_field_value_edit(template.data_type,template.id,Type.FIELD_VALUE_LIST,2,{list_value_count:2}):""}
                    {Field_Logic.get_field_value_value(Type.FIELD_VALUE_LIST,template,2,{list_value_count:2}).map((item)
                */
             },
],
    function(error, result){
        console.log('CONNECT-DONE');
        done();
    });
    });
});

