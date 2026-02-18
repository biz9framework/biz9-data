/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Test
*/
const async = require('async');
const assert = require('node:assert');
const {Data_Logic} = require(".");
const {Log,Num,Str} = require("biz9-utility");
/*
 * availble tests
- connect
*/
/* --- TEST CONFIG START --- */
const APP_ID = 'test-stage-feb17';
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
        let cache=null;
        let database = {};
        let data = {};
        async.series([
            async function(call){
                //const [biz_error,biz_data] = await Database.get(DATA_CONFIG);
                //database = biz_data;
            },
            /*
		    async function(call) {
                	const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
			},
            */
            async function(call){
                class Project_Table{
                    static PRODUCT='product_biz';
                }
                //-->
                let print_test = true;
                // -- TEST -- //
                //let search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
                //let group = Data_Logic.get_group({value_type::});
                //Log.w('my_search',search);

                // -- POST-START --//
                //let parent = Data_Logic.get(Project_Table.PRODUCT,0,{count:3,parent:my_parent,user:my_user,data:{cool:'apple1',sauce:'butter'}});
                //Log.w('11_parent',parent);
                //let parent = Data_Logic.get(Type.DATA_PRODUCT,'405');
                //const [biz_error,biz_data] = await Data.post(database,Type.DATA_PRODUCT,parent);
                //let groupj= Data_Logic.get(Type.DATA_GROUP,0,{test:true,parent:parent});
                //let group = Data_Logic.get(Type.DATA_GROUP,'289',{test:true,parent:parent});
                //const [biz_error,biz_data] = await Data.post(database,Type.DATA_GROUP,group);
                //let blank = Data_Logic.get(Type.DATA_BLANK,0,{test:true,parent:parent});
                //let blank = Data_Logic.get(Type.DATA_BLANK,'908',{test:true,parent:parent});
                //const [biz_error,biz_data] = await Data.post(database,Type.DATA_BLANK,blank);
                //let image = Data_Logic.get(Type.DATA_IMAGE,0,{test:true,parent:blank});
                //const [biz_error,biz_data] = await Data.post(database,Type.DATA_IMAGE,image);
                //let item_list = Data_Logic.get(Type.DATA_PRODUCT,0,{test:true,count:3});
                //const [biz_error,biz_data] = await Data.post_items(database,item_list);
                // -- POST-END --//
                //-- GET  START --//
                /*
                //let option = {field:{title:1,id:1}};
                let foreign_sub_1 = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_IMAGE,Type.FIELD_PARENT_ID,Type.FIELD_ID,{title:'foreign_sub_image_1'});
                //let foreign_sub_2 = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_SERVICE,Type.FIELD_PARENT_ID,Type.FIELD_ID,{title:'foreign_service_1'});
                //let foreign_sub = Data_Logic.get_search_foreign(Type.SEARCH_ONE,Type.DATA_BLANK,Type.FIELD_PARENT_ID,Type.FIELD_ID,{title:'foreign_blanks'});
                //let foreign_search_1 = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_GROUP,Type.FIELD_PARENT_ID,Type.FIELD_ID,{title:'foreign_cool',page_size:3,sort_by:{title:1}});
                //let foreign_search_1 = Data_Logic.get_search_foreign(Type.SEARkH_ITEMS,Type.DATA_BLANK,Type.FIELD_PARENT_ID,Type.FIELD_ID,{title:'foreign_blanks',page_size:3,sort_by:{title:1},foreigns:[]});
                //foreign_sub_blank_search_1,foreign_sub_blank_search_2
                //let foreign_1 = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_BLANK,Type.FIELD_PARENT_ID,Type.FIELD_ID,{title:'foreign_blank_1'});
                let foreign_1 = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_BLANK,Type.FIELD_PARENT_ID,Type.FIELD_ID,{title:'foreign_blank_1',foreigns:[foreign_sub_1]});
                //let foreign_1 = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_BLANK,Type.FIELD_PARENT_ID,Type.FIELD_ID,{title:'foreign_blank_1',foreigns:[foreign_sub_1,foreign_sub_2]});
                let join_1 = Data_Logic.get_search_join(Type.SEARCH_ITEMS,Data_Logic.get_search(Type.DATA_BLANK,{},{},1,0),{title:'join_blank_1'});
                //let join_2 = Data_Logic.get_search_join(Type.SEARCH_ITEMS,Data_Logic.get_search(Type.DATA_IMAGE,{},{},1,0),{title:'my_joins_2'});
                //let option = {};
                //let option = {foreigns:[foreign_1]};
                let option = {joins:[join_1],foreigns:[foreign_1]};
                //let option = {groups:[Data_Logic.get_search_group({image:true})],foreigns:[foreign_search_1]};
                //let option = {groups:[Data_Logic.get_search_group({image:false})]};
                let parent = Data_Logic.get(Type.DATA_PRODUCT,'405');
                const [error,biz_data] = await Data.get(database,parent.data_type,parent.id,option);
                //Log.w('88_biz_data',biz_data);
                //Log.w('88_biz_data_items',biz_data.items);
                //Log.w('88_biz_data',biz_data[0].groups_cool);
                //Log.w('88_biz_data',biz_data[1].groups_cool);
                //Log.w('88_biz_data',biz_data[0].groups_cool[0]);
                */
                //-- GET  END --//
                //-->
                //-- SEARCH START --//
                /*
                //let foreign_sub_blank_search_2 = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_IMAGE,Type.FIELD_PARENT_ID,Type.FIELD_ID,{title:'group_images'});
                //let foreign_sub_blank_search_1 = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_BLANK,Type.FIELD_PARENT_ID,Type.FIELD_ID,{title:'group_blanks'});
                //let foreign_search_1 = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_GROUP,Type.FIELD_PARENT_ID,Type.FIELD_ID,{title:'groups_cool',page_size:3,sort_by:{title:1},foreigns:[foreign_sub_blank_search_1,foreign_sub_blank_search_2]});
                //foreign_sub_blank_search_1,foreign_sub_blank_search_2
                //let foreign_search_2 = Data_Logic.get_search_foreign(Type.SEARCH_COUNT,Type.DATA_IMAGE,Type.FIELD_PARENT_ID,Type.FIELD_ID,{title:'images_cool'});
                //let option = {foreigns:[foreign_search_1]};
                let option = {groups:[Data_Logic.get_search_group({image:true})]};
                //let option = {groups:[Data_Logic.get_search_group({image:true,title:{group_36:1,group_37:1}})]};
                //let option = {};

                //let foreign_1 = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_IMAGE,Type.FIELD_PARENT_ID,Type.FIELD_ID,{title:'foreign_image_1'});
                //let join_1 = Data_Logic.get_search_join(Type.SEARCH_ITEMS,Data_Logic.get_search(Type.DATA_BLANK,{},{},1,0),{title:'my_joins_1',foreigns:[foreign_1]});
                //let join_2 = Data_Logic.get_search_join(Type.SEARCH_ITEMS,Data_Logic.get_search(Type.DATA_IMAGE,{},{},1,0),{title:'my_joins_2'});
                //let option = {};
                //let option = {foreigns:[foreign_search_1]};
                //let option = {joins:[join_1,join_2]};

                let search = Data_Logic.get_search(Type.DATA_PRODUCT,{},{},1,0,option);
                const [biz_error,biz_data] = await Data.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,search.option);
                Log.w('33_biz_data',biz_data);
                //Log.w('33_biz_data',biz_data.items[0]);
                */
                //-- SEARCH  END --//
                               //-- POST_ITEMS START --//
                //let option = {};
                //let image = Data_Logic.get(Type.DATA_PRODUCT,0,{test:true,count:3});
                //Log.w('33_image',image);
                //Log.w('parent',parent);
                //const [error,biz_data] = await Data.post_items(database,image);
                //let parent_list = Data_Logic.get(new_data_type,0,{test:true,count:9});
                //const [error,biz_data] = await Data.get(database,parent.data_type,parent.id,option);
                //-- POST_ITEMS  END --//


                //-- DELETE  START --//
                /*
                let option = {};
                let parent = Data_Logic.get(Type.DATA_PRODUCT,'353');
                const [error,biz_data] = await Data.delete(database,parent.data_type,parent.id,option);
                //let search = Data_Logic.get_search(Type.DATA_PRODUCT,{},{},1,0);
                //const [error,biz_data] = await Data.delete_search(database,search.data_type,search.filter);
                Log.w('88_biz_data',biz_data);
                */
                //-- DELETE  END --//
                //-- COPY  START --//
                //let parent = Data_Logic.get(Type.DATA_PRODUCT,'929');
                //const [error,biz_data] = await Data.copy(database,parent.data_type,parent.id);
                //let parent_list = Data_Logic.get(new_data_type,0,{test:true,count:9});
                //const [error,biz_data] = await Data.get(database,parent.data_type,parent.id,option);
                //-- COPY  END --//
                //--- SUB_VALUE -- START -- //
                /*
                let parent = Data_Logic.get(Type.DATA_PAGE,'549');
                let option = {sub_value:true};
                const [biz_error,biz_data] = await Data.get(database,parent.data_type,parent.id,option);
                */
                //--- SUB_VALUE -- END -- //
                //-- USER  START --//
                //let user = Data_Logic.get(Type.DATA_USER,0,{test:true,generate_title:true});
                //let user = Data_Logic.get(Type.DATA_USER,'498');
                //let user = Data_Logic.get(Type.DATA_USER,0,{data:{email:'ceo@bossappz.com',password:'123456789Ab!'}});
                //let user = Data_Logic.get(Type.DATA_USER,0,{test:true,data:{email:'ceo@bossappz.com',password:'123456789Ab!'}});
                //Log.w('user',user);
                //-- USER  END --//
                //-- ORDER START --//
                /*
                //
                // -- post-start --//
                let order_product = Order_Logic.get
                [cart_error,cart] = await Order_Data.post(database,order);
                Log.w('99_cart',cart);
                // -- get-start --//
               // -- get-start --//
                let order_product = Data_Logic.get(Type.DATA_ORDER,'OR-34952');
                const [error,biz_data] = await Order_Data.get(database,order_product.id);
                //Log.w('33_order',biz_data);
                // -- get-end --//
                */
                //-- ORDER END --//
                //-->

                //-- PROJECT-500 START --//
                /*
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

                let join_foreign_category_product_count = Data_Logic.get_search_foreign(Type.SEARCH_COUNT,Type.DATA_PRODUCT,Type.FIELD_CATEGORY,Type.FIELD_TITLE,{title:'product_count'});
                let join_foreign_category_product_items = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_PRODUCT,Type.FIELD_CATEGORY,Type.FIELD_TITLE,{title:'product_items',page_current:1,page_size:12});

                let join_category = Data_Logic.get_search_join(Type.SEARCH_ITEMS,Data_Logic.get_search(Type.DATA_CATEGORY,{},{view_count:-1},1,12),{title:'categorys',distinct:{field:Type.FIELD_TITLE,sort_by:Type.SEARCH_SORT_BY_ASC},foreigns:[join_foreign_category_product_count, join_foreign_category_product_items]});

                let join_blog_post = Data_Logic.get_search_join(Type.SEARCH_ITEMS,Data_Logic.get_search(Type.DATA_BLOG_POST,{},{view_count:-1},1,12),{title:'blog_items'});

                //let = option = {id_field,{title:'my_cool'},joins:[join_product_popular,join_product_latest,join_product_rating,join_product_trending,join_category,join_blog_post]};
                let = option = {id_field,title:'my_cool'};
                const [error,biz_data] = await Data.get(database,data_type,id,option);
                // -- home-end -- //
                */
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
                let join_search_1 = Data_Logic.get_search_join(Type.SEARCH_ITEMS,Data_Logic.get_search(Type.DATA_BLANK,{},{},1,0),{title:'my_blanks'});
                let option = {joins:[join_search_1]};
                let search = Data_Logic.get_search(Type.DATA_CATEGORY,{category:Type.DATA_PRODUCT},{title:1},1,0);
                //const [error,biz_data] = await Data.get(database,Type.DATA_PRODUCT,'927',option);
                const [biz_error,biz_data] = await Data.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
                */
                //--- JOIN -- END -- //
                //

                //--- FOREIGN -- START -- //
                /*
                let foreign_search_1 = Data_Logic.get_search_foreign(Type.SEARCH_ONE,Type.DATA_PRODUCT,Type.FIELD_CATEGORY,Type.FIELD_TITLE,{title:'cool'});
                let option = {foreigns:[foreign_search_1],distinct:{field:'title'}};
                let search = Data_Logic.get_search(Type.DATA_CATEGORY,{},{date_create:-1},1,0);
                const [biz_error,biz_data] = await Data.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
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
//9_post_app - 9_test_post_app
describe('post_app', function(){ this.timeout(25000);
    it("_post_app", function(done){
        let error=null;
        let database = {};
        let data = {};
        let print_test = true;
        let parent = null;
        let group = null;
        let image = null
        let user = Data_Logic.get(Type.DATA_USER,0,{test:true});
        async.series([
            async function(call){
                const [biz_error,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                //-- USER START --//
                let option = {};
                const [error,biz_data] = await Data.post(database,user.data_type,user,option);
                user = biz_data;
                //-- USER END --//
            },
            async function(call){
                //-- PARENT START --//
                parent = Data_Logic.get(Type.DATA_PRODUCT,0,{test:true,user:user});
                let option = {};
                const [error,biz_data] = await Data.post(database,parent.data_type,parent,option);
                parent = biz_data;
                //-- PARENT END --//
            },

            async function(call){
                //-- GROUP START --//
                group = Data_Logic.get(Type.DATA_GROUP,0,{test:true,parent:parent});
                let option = {};
                const [error,biz_data] = await Data.post(database,group.data_type,group,option);
                group = biz_data;
                //-- GROUP END --//
            },
            async function(call){
                //-- GROUP-IMAGE START --//
                image = Data_Logic.get(Type.DATA_IMAGE,0,{test:true,parent:group,count:3});
                let option = {};
                const [error,biz_data] = await Data.post_items(database,image);
                image = biz_data;
                //-- GROUP-IMAGE END --//
            },
        ],
    function(error, result){
        console.log('CONNECT-DONE');
        if(print_test){;
            Log.w('USER ID',user.id);
            Log.w('PARENT ID',parent.id);
            Log.w('GROUP ID',group.id);
            Log.w('GROUP IMAGE Count',image.length);
        }
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
                const [error,biz_data] = await Data.get(database,parent.data_type,parent.id,option);
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

