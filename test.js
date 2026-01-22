const async = require('async');
const assert = require('node:assert');

const {Data,Database,Portal,User_Data,Page_Data,Product_Data,Review_Data,Cart_Data,Order_Data} = require(".");

const {Log,Num,Str} = require("biz9-utility");
const {Type,Data_Logic,Cart_Logic,Order_Logic} = require("/home/think1/www/doqbox/biz9-framework/biz9-logic/code");
/*
 * availble tests
- connect
*/
/* --- TEST CONFIG START --- */
const APP_ID = 'test-stage-jan21';
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
                let print_test = true;
                //-->
                //-- GET  START --//
                /*
                //let option = {id_field:Type.FIELD_CART_NUMBER};
                //let parent = Data_Logic.get(new_data_type,0,{test:true});
                //Log.w('parent',parent);
                //let parent = Data_Logic.get(new_data_type,0,{test:true,title:'Apple 4'});
                let parent = Data_Logic.get(Type.DATA_CART,'CA-88475');
                //const [error,biz_data] = await Portal.get(database,parent.data_type,parent.id,option);
                //let parent_list = Data_Logic.get(new_data_type,0,{test:true,count:9});
                //const [error,biz_data] = await Portal.get(database,parent.data_type,parent.id,option);
                */
                //-- GET  END --//
                //-->
                //let group = Data_Logic.get(Type.DATA_GROUP,0,{test:true,generate_title:true,parent:parent});
                //let group = Data_Logic.get(Type.DATA_GROUP,'786');
                //-->
                //let blank = Data_Logic.get(Type.DATA_BLANK,0,{test:true,parent:parent});
                //let blank = Data_Logic.get(Type.DATA_BLANK,id);
                //let image = Data_Logic.get(Type.DATA_IMAGE,0,{test:true,parent:group});
                //-->
                //-- USER  START --//
                //let user = Data_Logic.get(Type.DATA_USER,0,{test:true,generate_title:true});
                //let user = Data_Logic.get(Type.DATA_USER,'498');
                //let user = Data_Logic.get(Type.DATA_USER,0,{data:{email:'ceo@bossappz.com',password:'123456789Ab!'}});
                //let user = Data_Logic.get(Type.DATA_USER,0,{test:true,data:{email:'ceo@bossappz.com',password:'123456789Ab!'}});
                //Log.w('user',user);
                //-- USER  END --//
                //-->
                //-- CART START --//
                // -- post-start --//
                /*
                let user = Data_Logic.get(Type.USER,Num.get_id(),{test:true});
                let cart_product_1 = Data_Logic.get(Type.DATA_PRODUCT,Num.get_id(),{test:true});
                let cart_sub_item_product_1 = Data_Logic.get(Type.DATA_PRODUCT,Num.get_id(),{test:true});
                let cart = Cart_Logic.get(user.id,{cart_code:'CA'});
                let cart_item_1 = Cart_Logic.get_cart_item(cart_product_1.data_type,cart_product_1.id,1,cart_product_1.cost,{cart_code:'CA'});
                let cart_item_2 = Cart_Logic.get_cart_item(cart_product_1.data_type,cart_product_1.id,1,cart_product_1.cost,{cart_code:'CA'});
                cart_item_1.id = Num.get_id();
                cart_item_2.id = Num.get_id();
                let cart_sub_item_1 = Cart_Logic.get_cart_sub_item(cart_item_1.id,Type.CART_SUB_TYPE_STANDARD,1,cart_sub_item_product_1.cost);
                let cart_sub_item_2 = Cart_Logic.get_cart_sub_item(cart_item_2.id,Type.CART_SUB_TYPE_STANDARD,1,cart_sub_item_product_1.cost);
                cart_item_1.cart_sub_items.push(cart_sub_item_1);
                cart_item_2.cart_sub_items.push(cart_sub_item_2);
                cart.cart_items.push(cart_item_1);
                cart.cart_items.push(cart_item_2);
                [cart_error,cart] = await Cart_Data.post(database,cart);
                */
                // -- get-start --//
                //let cart_product = Data_Logic.get(Type.DATA_CART,'CA-88475');
                //const [error,cart] = await Cart_Data.get(database,cart_product.id);
                //Log.w('33_cart',cart);
                // -- get-end --//
                //-- CART END --//
                //-->
                //-- ORDER START --//
                //
                // -- post-start --//
                //let order_product = Order_Logic.get(cart,{order_code:'OR'});
                //const [error_order,order] = await Order_Data.post(database,order_product);
                // -- post-end --//
                // -- get-start --//
                /*
                let order_product = Data_Logic.get(Type.DATA_ORDER,'OR-34952');
                const [error,biz_data] = await Order_Data.get(database,order_product.id);
                //Log.w('33_order',biz_data);
                */
                // -- get-end --//
                //-- ORDER END --//
                //-->
                //-- PROJECT-500 START --//
                // -- home-start -- //
                let id = Type.PAGE_HOME;
                let data_type = Type.DATA_PAGE;
                //id
                let id_field = Type.FIELD_TITLE_URL;
                //joins
                //products-popular
                let join_product_popular = Data_Logic.get_search_join(Type.SEARCH_ITEMS,Data_Logic.get_search(Type.DATA_PRODUCT,{},{view_count:-1},1,12),{title:'popular_products'});
                let join_product_latest = Data_Logic.get_search_join(Type.SEARCH_ITEMS,Data_Logic.get_search(Type.DATA_PRODUCT,{},{date_create:-1},1,12),{title:'latest_products'});
                let join_product_rating = Data_Logic.get_search_join(Type.SEARCH_ITEMS,Data_Logic.get_search(Type.DATA_PRODUCT,{},{rating_avg:-1},1,12),{title:'top_products'});
                let join_product_trending = Data_Logic.get_search_join(Type.SEARCH_ITEMS,Data_Logic.get_search(Type.DATA_PRODUCT,{},{view_count:-1},1,12),{title:'trending_products'});

                let join_foreign_category_product = Data_Logic.get_search_foreign(Type.SEARCH_COUNT,Type.DATA_PRODUCT,Type.FIELD_CATEGORY,Type.FIELD_TITLE,{title:'product_count'});
                let join_category = Data_Logic.get_search_join(Type.SEARCH_ITEMS,Data_Logic.get_search(Type.DATA_CATEGORY,{},{view_count:-1},1,12),{title:'categorys',distinct:{field:Type.FIELD_TITLE,sort_by:Type.SEARCH_SORT_BY_ASC},foreigns:[join_foreign_category_product]});
                let = option = {id_field,joins:[join_product_popular,join_product_latest,join_product_rating,join_product_trending,join_category]};
                //let = option = {id_field,joins:[join_category]};
                const [error,biz_data] = await Portal.get(database,data_type,id,option);
                // -- home-end -- //
                //-- PROJECT-500 END --//

                //let product_title_url = 'product_554';
                //
               //-->
                //let favorite = Favorite_Logic.get(parent.data_type,parent.id,user.id);
                //-->
                //let option = {};
                //let option = {clean:true,overwrite:true};
                //let option = {id_field:'title_url'};
                //let option = {distinct:{field:'title',sort_by:Type.TITLE_SORT_BY_DESC},field:{title:1,title_url:1}};

                //let option = {field:{id:1,title:1,title_url:1}};
                //let join_search_2 = Data_Logic.get_search_join(Type.SEARCH_ONE,Data_Logic.get_search(Type.DATA_BLANK,{},{},1,0),{title:'cool'});

                //let foreign_search_3 = Data_Logic.get_search_foreign(Type.SEARCH_COUNT,Type.DATA_PRODUCT,Type.FIELD_CATEGORY,Type.FIELD_TITLE,{field:{id:1},title:'product_count'});
                //let option = {foreigns:[foreign_search_3],distinct:{field:'title'},field:{title:1,title_url:1,product_count:1}};

                //--- JOIN -- START -- //
                /*
                let join_search_1 = Data_Logic.get_search_join(Type.SEARCH_COUNT,Data_Logic.get_search(Type.DATA_CATEGORY,{},{},1,0),{title:'my_count'});
                let option = {joins:[join_search_1]};
                let search = Data_Logic.get_search(Type.DATA_CATEGORY,{category:Type.DATA_PRODUCT},{title:1},1,0);
                //const [error,biz_data] = await Portal.get(database,Type.DATA_PRODUCT,'927',option);
                const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
                */
                //--- JOIN -- END -- //
                //

                //--- FOREIGN -- START -- //
                /*
                let foreign_search_1 = Data_Logic.get_search_foreign(Type.SEARCH_ONE,Type.DATA_PRODUCT,Type.FIELD_CATEGORY,Type.FIELD_TITLE,{title:'cool'});
                let option = {foreigns:[foreign_search_1],distinct:{field:'title'}};
                let search = Data_Logic.get_search(Type.DATA_CATEGORY,{},{date_create:-1},1,0);
                const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
                */
                //--- FOREIGN -- END -- //
                //
                //let group_search_1 = Data_Logic.get_search_group({image:{show:true}});
                //let group_search_2 = Data_Logic.get_search_group({title:{group_882:0,group_39:1},image:{show:true}});
                //let group_search_3 = Data_Logic.get_search_group({title:{group_924:0},field:{title:1,title_url:1}});
                //let option = {groups:[group_search_1]};
                //let option = {groups:[group_search_2]};

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

