/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Test
*/
const async = require('async');
const assert = require('node:assert');
const {Database,Data} = require(".");
const {Log,Num,Str,Obj} = require("biz9-utility");
const {Store_Field,Store_Type,Store_Table,Store_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-store/source");
const {Website_Title,Form_Field,Website_Table}=require("/home/think1/www/doqbox/biz9-framework/biz9-website/source");
const {Cart_Data}=require("/home/think1/www/doqbox/biz9-framework/biz9-store-data/source");
const {User_Field,User_Type,User_Table,User_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-user/source");
const {Data_Logic,Data_Value_Type,Data_Table,Data_Field}=require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
/*
 * availble tests
- connect
-- data_count
-- data_copy
-- data_delete
-- data_delete_search
-- data_get
-- data_post
-- data_post_items
-- data_search
---group_add
*/
/* --- TEST CONFIG START --- */
const APP_ID = 'test-stage-march23';
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
    static PAGE = 'page_biz';
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
                let print_test = false;
                // -- POST-START --//
                /*
                let option = {};
                // -- parent --
                //Log.w('33_parent',parent);
                let parent = Data_Logic.get(Project_Table.PRODUCT,0);
                const [error,biz_data] = await Data.post(database,parent.table,parent,option);
                // -- sub items --
                //let sub_items = Data_Logic.get(Project_Table.BLANK,0,{count:10,parent:parent,data:{field_1:'value_'+Num.get_id(),field_2:'value_'+Num.get_id()}});
                //let sub_items = Data_Logic.get(Project_Table.PRODUCT,0,{count:10,data:Store_Logic.get_test_product()});
                //let sub_items = Data_Logic.get(Project_Table.PRODUCT,0,{count:1,data:User_Logic.get_test_user()});
                //const [error,biz_data] = await Data.post_items(database,sub_items);
                */
                // -- POST-END --//
                //-- GET START --//
                //let foreign_2 = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Project_Table.IMAGE,Data_Field.PARENT_ID,Field.ID,{title:'images'});
                //let join_search_1 = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,2,{});
                //let join_1 = Data_Logic.get_join(Data_Value_Type.ITEMS,join_search_1,{title:'apple'});
                //let option = {title:'cool',joins:[join_1]};//{{joins:[join_1]};foreigns:[foreign_1]};
                //option = Obj.merge(option,{title:'cool',id_field:Form_Field.TITLE_URL});
                //let foreign_sub_value = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Website_Table.SUB_VALUE,Form_Field.PARENT_ID,Form_Field.ID,{title:'sub_values'});
                let foreign_1 = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Project_Table.IMAGE,Form_Field.PARENT_ID,Form_Field.ID,{title:'images'});
                let option = {groups:[Data_Logic.get_group({foreigns:[foreign_1]})]};
                let parent = Data_Logic.get(Store_Table.PRODUCT,'117');
                const [error,biz_data] = await Data.get(database,parent.table,parent.id,option);
                Log.w('33_result',biz_data);
                //Log.w('44_result',biz_data.main_images);
                //Log.w('44_result',biz_data.groups[0]);
                //Log.w('44_result',biz_data.groups[0].images);
                //-- GET END --//
                //-- COPY START --//
                /*
                let option = {};
                let parent = Data_Logic.get(Project_Table.BLOG_POST,'844');
                const [error,biz_data] = await Data.copy(database,parent.table,parent.id,option);
                */
                //-- COPY END --//
                //-->
                //-- SEARCH START --//
                /*
                let join_search_1 = Data_Logic.get_search(Project_Table.BLANK,{},{},1,0,{});
                let join_1 = Data_Logic.get_join(Data_Value_Type.ITEMS,join_search_1);
                let foreign_1 = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Project_Table.BLANK,Data_Field.PARENT_ID,Field.ID);
                let group_1 = Data_Logic.get_group();
                let option = {groups:[group_1]};//{joins:[join_1],foreigns:[foreign_1]};
                */
                //let search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
                //const [error,biz_data] = await Data.search(database,search.table,search.filter,search.sort_by,search.page_current,search.page_size,option);
                //const [error,biz_data] = await Data.count(database,search.table,search.filter);
                //-- SEARCH START --//
                // -- DELETE-START --//
                /*
                let option = {};
                // -- parent --
                //let parent = Data_Logic.get(Project_Table.PRODUCT,'255');
                //const [error,biz_data] = await Data.delete(database,parent.table,parent.id,option);
                let search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
                const [error,biz_data] = await Data.delete_search(database,search.table,search.filter,search.sort_by,search.page_current,search.page_size,option);
                */
                // -- DELETE-END --//

                // -- CART-POST-TEST-- START
                /*
        let user = Data_Logic.get(User_Table.USER,'228');
        let cart = Store_Logic.get_cart(user.id,{cart_code:'CA'});
        let product_1 = Data_Logic.get(Project_Table.PRODUCT,'518');
        let product_2 = Data_Logic.get(Project_Table.PRODUCT,'860');
        let product_sub_1 = Data_Logic.get(Project_Table.PRODUCT,'129');
        let product_sub_2 = Data_Logic.get(Project_Table.PRODUCT,'92');
        let cart_item_1 = Store_Logic.get_cart_item(product_1.table,product_1.id,1,Store_Logic.get_test_cost());
        let cart_sub_item_1 = Store_Logic.get_cart_sub_item(cart_item_1.id,Store_Type.CART_SUB_TYPE_STANDARD,product_sub_1.table,product_sub_1.id,1,Store_Logic.get_test_cost());
        cart_item_1.cart_sub_items.push(cart_sub_item_1);
        let cart_item_2 = Store_Logic.get_cart_item(product_2.table,product_2.id,1,Store_Logic.get_test_cost());
        let cart_sub_item_2 = Store_Logic.get_cart_sub_item(cart_item_2.id,Store_Type.CART_SUB_TYPE_STANDARD,product_sub_2.table,product_sub_2.id,1,Store_Logic.get_test_cost());
        cart_item_2.cart_sub_items.push(cart_sub_item_2);
        cart.cart_items.push(cart_item_1);
        cart.cart_items.push(cart_item_2);
        const [biz_error,biz_data] = await Cart_Data.post(database,cart);
        Log.w('11_cart_post',biz_data);
        */
                // -- CART-POST-TEST-2 -- END


                // -- CART-GET-FOREIGN-START -- //
                /*
                let foreign_user = Data_Logic.get_foreign(Data_Value_Type.ONE,User_Table.USER,Data_Field.ID,User_Field.USER_ID,{title:'user'});
                let foreign_cart_item_parent = Data_Logic.get_foreign(Data_Value_Type.ONE,Store_Table.PRODUCT,'Data_Field.ID',Data_Field.PARENT_ID,{title:'parent'});
                let foreign_cart_item = Data_Logic.get_foreign(Data_Value_Type.ONE,Store_Table.CART_ITEM,Store_Field.CART_ID,Data_Field.ID,{title:'cart_items',foreigns:[foreign_cart_item_parent]});
//let foreign_cart_item = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Store_Table.CART_ITEM,Store_Field.CART_ID,Data_Field.ID,{title:'cart_items'});
//Log.w('www',foreign_cart_item);
                let cart_option = { id_field:Store_Field.CART_NUMBER,foreigns:[foreign_user,foreign_cart_item] };
                let cart_number = 'CA-16399';
                const [biz_error,biz_data] = await Data.get(database,Store_Table.CART,cart_number,cart_option);
                Log.w('33_data',biz_data);
                Log.w('33_data',biz_data.cart_items);
                */
// -- CART-GET-FOREIGN-END -- //


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
//9_count - 9_test_count
describe('data_count', function(){ this.timeout(25000);
    it("_data_count", function(done){
        console.log('COUNT-START');
        let error=null;
        let database = {};
        let data = {};
        let option = {};
        let post_data = Data_Logic.get(Project_Table.PRODUCT,'929');
        let post_search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
        async.series([
            async function(call){
                const [biz_error,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_error,biz_data] = await Data.count(database,post_search.table,post_search.filter,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_error',biz_error);
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
        let error=null;
        let database = {};
        let data = {};
        let option = {};
        let post_data = Data_Logic.get(Project_Table.PRODUCT,'618');
        async.series([
            async function(call){
                const [biz_error,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_error,biz_data] = await Data.copy(database,post_data.table,post_data.id,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_error',biz_error);
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
        let error=null;
        let database = {};
        let data = {};
        let option = {};
        let post_data = Data_Logic.get(Project_Table.PRODUCT,'618');
        async.series([
            async function(call){
                const [biz_error,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_error,biz_data] = await Data.delete(database,post_data.table,post_data.id,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_error',biz_error);
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


//9_get - 9_test_get
describe('data_get', function(){ this.timeout(25000);
    it("_data_get", function(done){
        console.log('GET-START');
        let error=null;
        let database = {};
        let data = {};
        let option = {};
        let post_data = Data_Logic.get(Project_Table.PRODUCT,'618');
        let post_search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
        async.series([
            async function(call){
                const [biz_error,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_error,biz_data] = await Data.get(database,post_data.table,post_data.id,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_error',biz_error);
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


//9_blank - 9_test_blank
describe('data_blank', function(){ this.timeout(25000);
    it("_data_blank", function(done){
        console.log('BLANK-START');
        let error=null;
        let database = {};
        let data = {};
        let option = {};
        let post_data = Data_Logic.get(Project_Table.PRODUCT,'929');
        let post_search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
        async.series([
            async function(call){
                const [biz_error,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_error,biz_data] = await Data.count(database,post_search.table,post_search.filter,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_error',biz_error);
            },
            async function(call){
                console.log('BLANK-SUCCESS');
            },
        ],
            function(error, result){
                console.log('BLANK-DONE');
                done();
            });
    });
});


