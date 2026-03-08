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
const {Store_Field,Store_Type,Store_Table,Store_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-store/source");
const {Cart_Data}=require("/home/think1/www/doqbox/biz9-framework/biz9-store-data/source");
const {User_Field,User_Type,User_Table,User_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-user/source");
const {Data_Logic,Data_Value_Type,Data_Table,Data_Field}=require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
/*
 * availble tests
- connect
*/
/* --- TEST CONFIG START --- */
const APP_ID = 'test-stage-march7';
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
                /*
                //let foreign_2 = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Project_Table.IMAGE,Data_Field.PARENT_ID,Field.ID,{title:'images'});
                //let join_search_1 = Data_Logic.get_search(Project_Table.BLANK,{},{},1,0,{});
                //let join_1 = Data_Logic.get_join(Data_Value_Type.ITEMS,join_search_1,{foreigns:[foreign_2]});
                //let foreign_1 = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Project_Table.BLANK,Data_Field.PARENT_ID,Field.ID);
                let group_1 = Data_Logic.get_group();//Data_Logic.get_group();
                //let option = {};
                let option = {groups:[group_1]};//{{joins:[join_1]};foreigns:[foreign_1]};
                let parent = Data_Logic.get(Project_Table.BLOG_POST,'899');
                const [error,biz_data] = await Data.get(database,parent.table,parent.id,option);
                */
                //-- GET END --//
                //-- COPY START --//
                let option = {};
                let parent = Data_Logic.get(Project_Table.BLOG_POST,'844');
                const [error,biz_data] = await Data.copy(database,parent.table,parent.id,option);
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

