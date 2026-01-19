const async = require('async');
const assert = require('node:assert');

const {Data,Database,Portal,User_Data,Page_Data,Product_Data,Review_Data} = require(".");

const {Log,Num,Str} = require("biz9-utility");
const {Type,Data_Logic} = require("/home/think1/www/doqbox/biz9-framework/biz9-logic/code");
/*
 * availble tests
- connect
*/
/* --- TEST CONFIG START --- */
const APP_ID = 'test-stage-jan18';
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
                let id = '484';
                //let id = 'home22';
                let print_test = true;

                //-->
                //let parent = Data_Logic.get(new_data_type,0,{test:true});
                //Log.w('parent',parent);
                //let parent = Data_Logic.get(new_data_type,0,{test:true,title:'Apple 4'});
                //let parent = Data_Logic.get(new_data_type,id);
                let parent_list = Data_Logic.get(new_data_type,0,{test:true,count:9});
                //-->
                //let group = Data_Logic.get(Type.DATA_GROUP,0,{test:true,generate_title:true,parent:parent});
                let group = Data_Logic.get(Type.DATA_GROUP,'786');
                //-->
                //let blank = Data_Logic.get(Type.DATA_BLANK,0,{test:true,parent:parent});
                //let blank = Data_Logic.get(Type.DATA_BLANK,id);
                //-->
                let image = Data_Logic.get(Type.DATA_IMAGE,0,{test:true,parent:group});
                //-->
                //-->
                //
                //let user = Data_Logic.get(Type.DATA_USER,0,{test:true,generate_title:true});
                //let user = Data_Logic.get(Type.DATA_USER,'54b31f02-afb4-4fa7-9835-f923da7a6749');
                //let user = Data_Logic.get(Type.DATA_USER,0,{data:{email:'ceo@bossappz.com',password:'123456789Ab!'}});
                let user = Data_Logic.get(Type.DATA_USER,0,{test:true,data:{email:'ceo@bossappz.com',password:'123456789Ab!'}});
                //Log.w('user',user);
                //-->
                //let favorite = Favorite_Logic.get(parent.data_type,parent.id,user.id);
                //-->
                //let option = {};
                //let option = {clean:true,overwrite:true};
                //let option = {id_field:'title_url'};
                //let option = {distinct:{field:'title',sort_by:Type.TITLE_SORT_BY_DESC},field:{title:1,title_url:1}};

                //let option = {field:{id:1,title:1,title_url:1}};
                //let join_search_1 = Data_Logic.get_search_join(Type.TITLE_ONE,Data_Logic.get_search(Type.DATA_BLANK,{},{},1,0),{title:'apple'});
                //let join_search_2 = Data_Logic.get_search_join(Type.TITLE_ONE,Data_Logic.get_search(Type.DATA_BLANK,{},{},1,0),{title:'cool'});
                //let option = {joins:[join_search_1]};

                let foreign_search_3 = Data_Logic.get_search_foreign(Type.TITLE_COUNT,Type.DATA_PRODUCT,Type.FIELD_CATEGORY,Type.FIELD_TITLE,{field:{id:1},title:'product_count'});
                let option = {foreigns:[foreign_search_3],distinct:{field:'title'},field:{title:1,title_url:1,product_count:1}};

                //let foreign_search_1 = Data_Logic.get_search_foreign(Type.TITLE_ITEMS,Type.DATA_IMAGE,Type.FIELD_PARENT_ID,Type.FIELD_ID,{title:'cool'});
                //let option = {foreigns:[foreign_search_1],distinct:{field:'title'},field:{title:1,title_url:1,product_count:1}};

                //let group_search_1 = Data_Logic.get_search_group({image:{show:true}});
                //let group_search_2 = Data_Logic.get_search_group({title:{group_882:0,group_39:1},image:{show:true}});
                //let group_search_3 = Data_Logic.get_search_group({title:{group_924:0},field:{title:1,title_url:1}});
                //let option = {groups:[group_search_1]};
                //let option = {groups:[group_search_2]};

                //let option = {stat:{user_id:user.id,type:Type.STAT_VIEW,unique:false}};
                //---
                //let search = Data_Logic.get_search(Type.DATA_GROUP,{},{date_create:-1},1,0);
                //
                let search = Data_Logic.get_search(Type.DATA_CATEGORY,{category:Type.DATA_PRODUCT},{title:1},1,0);
                //---
                const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
                //const [biz_error,biz_data] = await Portal.search_simple(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
                //const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
                //---
                //const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
                //---
                //const [error,biz_data] = await Portal.copy(database,parent.data_type,parent.id,option);
                //---
                //const [error,biz_data] = await Portal.get(database,parent.data_type,parent.id,option);
                //const [error,biz_data] = await Portal.get(database,group.data_type,group.id,option);
                //const [error,biz_data] = await Portal.get(database,group.data_type,group.id);
                //const [error,biz_data] = await Page_Data.get(database,id,option);
                //---
                //const [error,biz_data] = await Portal.post(database,parent.data_type,parent,option);
                //const [error,biz_data] = await Portal.post(database,group.data_type,group);
                //const [error,biz_data] = await Portal.post(database,blank.data_type,blank);
                //const [error,biz_data] = await Portal.post(database,user.data_type,user);
                //const [error,biz_data] = await Portal.post(database,image.data_type,image);
                //---
                //const [error,biz_data] = await Portal.post_items(database,parent_list);
                //---
                //const [error,biz_data] = await Portal.delete(database,parent.data_type,parent.id,option);
                //const [biz_error,biz_data] = await Portal.delete_search(database,search.data_type,search.filter,option);
                //---
                //iconst [error,biz_data] = await User_Data.login(database,user,option);
                //const [error,biz_data] = await User_Data.register(database,user,option);
                //---
                //const [biz_error,biz_data] = await Review_Data.get(database,Type.DATA_PRODUCT,'1',{date_create:-1},1,12);

                //---
                if(print_test){;
                    Log.w('99_biz_data',biz_data);
                    //Log.w('99_biz_data_parents',biz_data.items[0].groups[0]);

                }
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

