/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Test
*/
const async = require('async');
const assert = require('node:assert');
const {Config}=require('./project');
BIZ9_CONFIG=Config.get_biz9_config();
const {Database,Data} = require(".");
const {Log,Str,Obj,Response_Logic,Response_Field,Status_Type,Num}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Store_Field,Store_Type,Store_Table,Store_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-store/source");
const {Website_Title,Form_Field,Website_Table,Website_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-website/source");
const {Cart_Data}=require("/home/think1/www/doqbox/biz9-framework/biz9-store-data/source");
const {User_Field,User_Type,User_Table,User_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-user/source");
const {Data_Logic,Data_Value_Type,Data_Table,Data_Field,Data_Response_Field}=require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
/*
 * 9_define
-- data_count
-- data_copy
-- data_delete
-- data_delete_search
-- data_get
-- data_post
-- data_post_items
-- data_search
*/
/* --- TEST CONFIG START --- */
const APP_ID = 'test-stage-april';
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
    static BLOG_POST = 'blog_post_biz';
    static PRODUCT = 'product_biz';
    static CATEGORY = 'category_biz';
    static PAGE = 'page_biz';
    static ORDER = 'order_biz';
    static USER = 'user_biz';
    static GROUP = 'group_biz';
    static IMAGE = 'image_biz';
    static IMAGE_GALLERY = 'image_gallery_biz';
}
/* --- DATA CONFIG END --- */
//9_connect - 9_test_connect
describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
        let response={};
        let cache=null;
        let database = {};
        let data = {};
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                //-->
                let print_test = false;
                // -- POST-START --//
            },
        ],
            function(error, result){
                console.log('CONNECT-DONE');
                done();
            });
    });
});
//9_count - 9_test_count
describe('data_count', function(){ this.timeout(25000);
    it("_data_count", function(done){
        console.log('COUNT-START');
        let response=Response_Logic.get();
        let database = {};
        let data = {};
        let option = {};
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                // -- SEARCH-COUNT-START
                let post_search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
                const [biz_response,biz_data] = await Data.count(database,post_search.table,post_search.filter,option);
                // -- SEARCH-COUNT-END
                Log.w('biz_response',biz_response);
                Log.w('biz_data',biz_data);
            },
            async function(call){
                console.log('COUNT-SUCCESS');
            },
        ],
            function(error, result){
                console.log('COUNT-DONE');
                done();
            });
    });
});
//9_copy - 9_test_copy
describe('data_copy', function(){ this.timeout(25000);
    it("_data_copy", function(done){
        console.log('COPY-START');
        let response=Response_Logic.get();
        let database = {};
        let data = {};
        let option = {};
        let post_data = Data_Logic.get(Project_Table.PRODUCT,'69f18aaf4f3f5c9a67c9d13d');
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Data.copy(database,post_data.table,post_data.id,option);
                Log.w('biz_response',biz_response);
                Log.w('biz_data',biz_data);
            },
            async function(call){
                console.log('COPY-SUCCESS');
            },
        ],
            function(error, result){
                console.log('COPY-DONE');
                done();
            });
    });
});
//9_delete - 9_test_delete
describe('data_delete', function(){ this.timeout(25000);
    it("_data_delete", function(done){
        console.log('DELETE-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let post_data = Data_Logic.get(Project_Table.PRODUCT,'69f18aaf4f3f5c9a67c9d13d');
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Data.delete(database,post_data.table,post_data.id,option);
                Log.w('99_biz_response',biz_response);
                Log.w('99_biz_data',biz_data);
            },
            async function(call){
                console.log('DELETE-SUCCESS');
            },
        ],
            function(error, result){
                console.log('DELETE-DONE');
                done();
            });
    });
});
//9_delete_search - 9_delete_search //data_delete_search
describe('data_many_delete_search', function(){ this.timeout(25000);
    it("_data_many_delete_search", function(done){
        console.log('DELETE-SEARCH-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let post_search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                //-- DELETE-SEARCH-START
                const [biz_response,biz_data] = await Data.delete_search(database,post_search.table,post_search.filter,option);
                Log.w('biz_response',biz_response);
                Log.w('biz_data',biz_data);
                //-- DELETE-SEARCH-END
            },
            async function(call){
                console.log('DELETE-SEARCH-SUCCESS');
            },
        ],
            function(response, result){
                console.log('DELETE-SEARCH-DONE');
                done();
            });
    });
});
//9_get - 9_test_get
describe('data_get', function(){ this.timeout(25000);
    it("_data_get", function(done){
        console.log('GET-START');
        let response={};
        let database = {};
       let option = {};
       let data = {};
       let parent = {};
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                // -- GET-START --
                parent = Data_Logic.get(Project_Table.PRODUCT,'69f18aaf4f3f5c9a67c9d13d');
                const [biz_response,biz_data] = await Data.get(database,parent.table,parent.id,option);
                Log.w('99_biz_response',biz_response);
                Log.w('99_biz_data',biz_data);
                // -- GET-END --


                // --- GET-STORE-CART-START ---
                /*
                let foreign_user = Data_Logic.get_foreign(Data_Value_Type.ONE,User_Table.USER,Data_Field.ID,User_Field.USER_ID,{title:'user'});
                let foreign_cart_item_parent = Data_Logic.get_foreign(Data_Value_Type.ONE,Store_Table.PRODUCT,Data_Field.ID,Data_Field.PARENT_ID,{title:'parent'});
                let foreign_cart_sub_item_parent = Data_Logic.get_foreign(Data_Value_Type.ONE,Store_Table.PRODUCT,Data_Field.ID,[Data_Field.PARENT_ID],{title:'parent'});
                let foreign_cart_sub_item = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Store_Table.CART_SUB_ITEM,Store_Field.CART_NUMBER,Store_Field.CART_NUMBER,{title:'cart_sub_items',foreigns:[foreign_cart_sub_item_parent]});
                let foreign_cart_item = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Store_Table.CART_ITEM,Store_Field.CART_NUMBER,Store_Field.CART_NUMBER,{title:'cart_items',foreigns:[foreign_cart_sub_item,foreign_cart_item_parent]});

                let option = { foreigns:[foreign_user,foreign_cart_item] };
                */
                // --- GET-STORE-CART-END ---


                /*
                let foreign_cart_sub_item_parent = Data_Logic.get_foreign(Data_Value_Type.COUNT,Store_Table.PRODUCT,Data_Field.ID,Data_Field.PARENT_ID,{title:'parent'});
                let foreign_cart_sub_item = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Store_Table.CART_SUB_ITEM,Store_Field.CART_NUMBER,Store_Field.CART_NUMBER,{title:'cart_sub_items',foreigns:[foreign_cart_sub_item_parent]});
                let foreign_cart_item = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Store_Table.CART_ITEM,Store_Field.CART_NUMBER,Store_Field.CART_NUMBER,{title:'cart_items',foreigns:[foreign_cart_sub_item]});
                let option = { foreigns:[foreign_cart_item] };
                */

                // -- FOREIGN-START --
                /*
                let foreign_search_3 = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Project_Table.CATEGORY,Form_Field.TITLE,Form_Field.CATEGORY,{title:'foreign_search_3'});
                let foreign_search_2 = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Project_Table.PRODUCT,Form_Field.CATEGORY,Form_Field.CATEGORY,{title:'foreign_search_2',foreigns:[foreign_search_3]});
                let foreign_search_1 = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Project_Table.CATEGORY,Form_Field.TITLE,Form_Field.CATEGORY,{title:'foreign_search_1'});
                option = {foreigns:[foreign_search_1,foreign_search_2]};
                */
                // -- FOREIGN-END --

                // -- FOREIGN-2-START --
                //let foreign_search_1 = Data_Logic.get_foreign(Data_Value_Type.COUNT,Project_Table.CATEGORY,Form_Field.TITLE,Form_Field.CATEGORY,{title:'foreign_search_1'});
                //option = {foreigns:[foreign_search_1],/*,distinct:{field:'title'},*/field:{title:1,product_count:1}};
                //option = {foreigns:[foreign_search_1]};
                //search = Data_Logic.get_search(Project_Table.CATEGORY,{category:'Product'},{},1,0);
                //option = {field:{title:1}};
                //let option = {foreigns:[foreign_cart_item]};
                //parent = Data_Logic.get(Project_Table.PRODUCT,'291');
                //const [biz_response,biz_data] = await Data.get(database,parent.table,parent.id,option);
                //Log.w('biz_data',biz_data);
                //Log.w('biz_response',biz_response);
                //Log.w('biz_option',option);
                //Log.w('biz_data_cart_items',biz_data.cart_items[0]);
                // -- FOREIGN-2-START --

                // -- JOIN-START --
                /*
                let join_1 = Data_Logic.get_join(Data_Value_Type.ITEMS,Data_Logic.get_search(Project_Table.PRODUCT,{},{view_count:-1},1,12),{title:'popular_products'});
                option = {joins:[join_1]};
                parent = Data_Logic.get(Project_Table.PRODUCT,'636');
                const [biz_response,biz_data] = await Data.get(database,parent.table,parent.id,option);
                Log.w('biz_data',biz_data);
                */
                // -- JOIN-END --
                //
                          },
            async function(call){
                console.log('GET-SUCCESS');
            },
        ],
            function(error, result){
                console.log('GET-DONE');
                done();
            });
    });
});
//9_post - 9_test_post
describe('data_post', function(){ this.timeout(25000);
    it("_data_post", function(done){
        console.log('POST-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                // -- POST-START --
                // --- update ---
                //let post_data = Data_Logic.get(Project_Table.PRODUCT,'69ebead4510257017a5a6a86');
                // --- new ---
                post_data = Store_Logic.get_test_product({title:'Product '+Str.get_id()});
                const [biz_response,biz_data] = await Data.post(database,post_data.table,post_data,option);
                Log.w('biz_response',biz_response);
                Log.w('biz_data',biz_data);
                // -- POST-END --

            },
            async function(call){
                console.log('POST-SUCCESS');
            },
        ],
            function(error, result){
                console.log('POST-DONE');
                done();
            });
    });
});
//9_post_items - 9_test_post_items //data_post_items
describe('data_many_post_items', function(){ this.timeout(25000);
    it("_data_many_post_items", function(done){
        console.log('POST-ITEMS-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let post_data = Store_Logic.get_test_products();
        post_data = Obj.merge_items(Store_Logic.get_test_products(),post_data);
        post_data = Obj.merge_items(Store_Logic.get_test_products(),post_data);
        post_data = Obj.merge_items(Store_Logic.get_test_products(),post_data);
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Data.post_items(database,post_data,option);
                Log.w('99_biz_response',biz_response);
                Log.w('99_biz_data',biz_data);
                Log.w('99_biz_data',biz_data.length);
            },
            async function(call){
                console.log('POST-ITEMS-SUCCESS');
            },
        ],
            function(error, result){
                console.log('POST-ITEMS-DONE');
                done();
            });
    });
});
//9_search - 9_test_search
describe('data_search', function(){ this.timeout(25000);
    it("_data_search", function(done){
        console.log('DATA-SEARCH-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
       async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                // -- SEARCH-START --
                let search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
                const [biz_response,biz_data] = await Data.search(database,search.table,search.filter,search.sort_by,search.page_current,search.page_size,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_response',biz_response);
                //Log.w('biz_data_items',biz_data.items);
                //Log.w('biz_data_length',biz_data.items.length);
                // -- SEARCH-END --

                // -- SEARCH-FIELD-START --
                /*
                option = {field:{id:1,username:1,name:1,email:1,role:1,gender:1,image_filename:1}};
                let search = Data_Logic.get_search(Project_Table.USER,{},{},1,5,{});
                */
                // -- SEARCH-FIELD-END --

                // -- FOREIGN-1-START --
                /*
                //let foreign_search_3 = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Project_Table.CATEGORY,Form_Field.TITLE,Form_Field.CATEGORY,{title:'foreign_search_3'});
                let foreign_search_2 = Data_Logic.get_foreign(Data_Value_Type.COUNT,Project_Table.PRODUCT,Form_Field.CATEGORY,Form_Field.CATEGORY,{title:'foreign_search_2',foreigns:[]});
                let foreign_search_1 = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Project_Table.CATEGORY,Form_Field.TITLE,Form_Field.CATEGORY,{title:'foreign_search_1'});
                option = {foreigns:[foreign_search_2]};
                let search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,3,{});
                */
                // -- FOREIGN-1-END --

                // -- FOREIGN-2-START --
                /*
                let foreign_search_1 = Data_Logic.get_foreign(Data_Value_Type.COUNT,Project_Table.PRODUCT,Form_Field.CATEGORY,Form_Field.TITLE,{title:'product_count'});
                option = {foreigns:[foreign_search_1],distinct:{field:'title'},field:{title:1,product_count:1,category:1}};
                //option = {foreigns:[foreign_search_1]};
                //option = {foreigns:[foreign_search_1],distinct:{field:1}};
                //option = {field:{title:1}};
                search = Data_Logic.get_search(Project_Table.CATEGORY,{category:'Product'},{},1,0);
                */
                // -- FOREIGN-2-START --

                // -- FOREIGN-3-START --
                /*
                let foreign_user = User_Logic.get_foreign_user();
                option = {foreigns:[foreign_user]};
                let search = Data_Logic.get_search(Project_Table.ORDER,{},{},1,0,{});
                const [biz_response,biz_data] = await Data.search(database,search.table,search.filter,search.sort_by,search.page_current,search.page_size,option);
                Log.w('99_biz_data',biz_data);
                for(const item of biz_data.items){
                    console.log(item.user);
                }
                */
                // -- FOREIGN-3-END --

                         },
            async function(call){
                console.log('DATA-SEARCH-SUCCESS');
            },
        ],
            function(error, result){
                console.log('DATA-SEARCH-DONE');
                done();
            });
    });
});
//9_blank - 9_test_blank
describe('data_blank', function(){ this.timeout(25000);
    it("_data_blank", function(done){
        console.log('BLANK-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let post_data = Data_Logic.get(Project_Table.PRODUCT,'929');
        let post_search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Data.count(database,post_search.table,post_search.filter,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_response',biz_response);
            },
            async function(call){
                console.log('BLANK-SUCCESS');
            },
        ],
            function(error, result){
                Log.error('BLANK-DONE',error);
                done();
            });
    });
});


