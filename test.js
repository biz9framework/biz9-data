const async = require('async');
const assert = require('node:assert');
const {Data,Database,Portal,Category_Data,Product_Data,Page_Data,Blog_Post_Data,Content_Data,Stat_Data,List_Data,Review_Data,Favorite_Data,Search_Data,Admin_Data,Business_Data} = require(".");
const {Log,Number} = require("biz9-utility");
const {DataType,DataItem,Item_Logic,Page_Logic,Template_Logic,Blog_Post_Logic,Content_Logic,Product_Logic,Field_Logic,Admin_Logic,Business_Logic} = require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
/*
 * availble tests
- connect
- item_update
- get_data
- item_delete
- item_list_update
- item_list_get
- item_list_delete
*/
/* --- TEST CONFIG START --- */
//const KEY = '0'; // 0 = intialize a new data item.
//const KEY = 'd220d962-4491-4022-b5be-374d8168d79b';
//http://localhost:1904/main/crud/get_item_parent_top/blog_post_biz/27394892-8b61-4ddd-93d7-9251a45a652c?app_id=test-june11
const KEY = 'title_5153';
//const ID = '27394892-8b61-4ddd-93d7-9251a45a652c';
const ID = 0;
const DATA_TYPE = DataType.BLOG_POST;
const OPTION = {};
//const FILTER = {test_group_id:59367};
const FILTER = {data_type:DATA_TYPE};
const APP_ID = 'test-july12';
const SQL = {};
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

/* --- BiZ9_CORE_CONFIG-END --- */
describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
        let cloud_error=null;
        let database = {};
        async.series([
            // GET - START
            async function(call){
                console.log('DATABASE-START');
                //const [error,data] = await Team.get_member(db_connect,title_url);
                const [error,data] = await Database.get(DATA_CONFIG);
                database = data;
                console.log('DATABASE-END');
            },
            async function(call){
                /*
            console.log('STAT-START');
            let data_type = DataType.PRODUCT;
            let id = 'a56d0911-71b4-4afe-a768-ad967588f86f';
            let customer_id = Number.get_id();
            const [error,data] = await Stat_Data.update_item_view_count(database,data_type,id,customer_id);
            Log.w('data',data);
            console.log('STAT-END');
            */

                /*
            console.log('LIST-START');
        //let query = {};
        //query.application_development_template_type = "Website Application Template";
        /*
            let search = Item_Logic.get_search(DataType.CATEGORY,{},{},1,90);
            Log.w('search',search);

            let option = {get_group:true,group_search:Item_Logic.get_search(DataType.PRODUCT,{},{},1,90),group_parent_field:'title',group_child_field:'category'};
            const [error,data] = await List_Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            Log.w('data',data);
            console.log('LIST-END');
            */


                /*
        console.log('SEARCH-START');
        let query = {};
        //query.application_development_template_type = "Mobile Application Template";
        //query.application_development_template_type = "Website Application Template";
        //query.product_type = "Application Development Template";
        //query.featured = "true";
            //let user_id = 'ccdaa4d8-9aa0-499f-9249-dd70a6d675f9';
            let search = Item_Logic.get_search(DataType.PRODUCT,{title:'ffffffff'},{},1,0);
            Log.w('search',search);
            //const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
            const [error,data] = await Search_Data.get(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
        //Log.w('data',data);
            Log.w('data',data);
            //Log.w('data',data.item_list.length);
            console.log('SEARCH-END');
            */
                /*
        console.log('REVIEW-START');
        let parent_data_type = DataType.PRODUCT;
        let parent_id= "de773692-104f-4d76-93c6-a79a03283261";
        let user_id = "e58b52da-cba3-4ce6-a9d7-89cdcc826d85";
        let rating = Number.get_id(6);
        let comment = Field_Logic.get_test().note;
        let review = DataItem.get_new(DataType.REVIEW,0,{parent_data_type:parent_data_type,parent_id:parent_id,user_id:user_id,rating:rating,rating,comment:comment});
        //Log.w('review',review);
        //const [error,data] = await Review_Data.update(database,review.parent_data_type,review.parent_id,review.user_id,review);
        //
        let query = {parent_id:parent_id};
        let review_search = Item_Logic.get_search(DataType.REVIEW,query,{},1,0);
        const [error,data] = await Review_Data.search(database,review_search.data_type,review_search.filter,review_search.sort_by,review_search.page_current,review_search.page_size);
        Log.w('data',data);
        Log.w('dat_len',data.item_list.length);
        console.log('REVIEW-END');
        */

                /*
        console.log('FAVORITE-START');
        let parent_data_type = DataType.PRODUCT;
        let parent_id= "de773692-104f-4d76-93c6-a79a03283261";
        let user_id = "e58b52da-cba3-4ce6-a9d7-89cdcc826d85";
        //const [error,data] = await Favorite_Data.update(database,parent_data_type,parent_id,user_id);
        //
        const [error,data] = await Favorite_Data.get_list(database,parent_data_type,user_id);
        Log.w('data',data);
        console.log('FAVORITE-END');
        */

                /*
        console.log('PRODUCT-START');
        let key = "copy_test_91963";
        let search = Item_Logic.get_search(DataType.PRODUCT,{title:'Test 91963'},{},1,0);
        const [error,data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
        //const [error,data] = await Product_Data.get(database,key);
        Log.w('error',error);
        Log.w('data',data);
        console.log('PRODUCT-END');
        */

        //console.log('CONTENT-START');
        //let content = Content_Logic.get_test("Content " + String(Number.get_id()),{get_value:true,get_item:true});
        //const [error,data] = await Content_Data.get(database,'partners',{get_item:true});
        //Log.w('data',data);
        //console.log('CONTENT-END');


        //console.log('PAGE-START');
        //let page = Page_Logic.get_test("Page " + String(Number.get_id()),{get_value:true,get_item:true});
        //Log.w('page',page);
        //const [error,data] = await Page_Data.get(database,'home',{get_business:true,get_section:true});
        //Log.w('data',data);
        //Log.w('data_section_1',data.page.section_1);
        //console.log('PAGE-END');

        /*
                console.log('TEMPLATE-START');
        //let data_type=DataType.ITEM;
                let data_type=DataType.TEMPLATE;
                let key="primary";
                //let key="header";
                const [error,data] = await Portal.get(database,data_type,key,{get_item:true});
                //let template = Template_Logic.get_test("Primary",{get_value:true,get_item:true});
                //Log.w('template',template);
                //const [error,data] = await Category.get_category_product_group_list(database,filter,{get_item:true});
                Log.w('error',error);
                Log.w('data',data.header.items.length);
//Log.w('data_items_len',data.items.length);
//Log.w('data_items_len',data.items.length);
//Log.w('data_header',data.header);
//Log.w('data_header_item_1',data.header.item_1);
//Log.w('data_items',data.items.length);
                console.log('TEMPLATE-END');
                */



                /*
                console.log('PORTAL-SEARCH-START');
                let id = 0;
                let data_type = DataType.PRODUCT;
                let search = Item_Logic.get_search(DataType.PRODUCT,{},{},1,0);
                const [error,data] = await Search_Data.get(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                Log.w('data',data);
                console.log('PORTAL-SEARCH-END');
                */

                /*
                console.log('ADMIN-START');
                let key = 'test_53555';
                //let search = Item_Logic.get_search(DataType.ADMIN,{},{},1,0);
                //const [error,data] = await Admin_Data.get(database,key);
                const [error,data] = await Admin_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
                Log.w('data',data);
                console.log('ADMIN-END');
                */

                console.log('BLOG-DATA-START');
                let key = 'test_39058';
                //let search = Item_Logic.get_search(DataType.BLOG_POST,{},{},1,0);
                const [error,data] = await Blog_Post_Data.get(database,key);
                //const [error,data] = await Business_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
                Log.w('data',data);
                console.log('BLOG-DATA-END');


                /*
                console.log('BUSINESS-START');
                let key = 'test_34003';
                let search = Item_Logic.get_search(DataType.BUSINESS,{},{},1,0);
                //const [error,data] = await Business_Data.get(database,key);
                const [error,data] = await Business_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
                Log.w('data',data);
                console.log('BUSINESS-END');
                */


                /*
                console.log('PORTAL-UPDATE-START');
                let data_type = DataType.BLOG_POST;
                let item_update = Blog_Post_Logic.get_test();
                //Log.w('item_update',item_update);
                const [error,data] = await Portal.update(database,data_type,item_update);
                Log.w('data',data);
                console.log('PORTAL-UPDATE-END');
                */

                /*
                console.log('PORTAL-DELETE-START');
                let id =  'c598a94e-a6ca-4379-81f0-b58130802152';
                let data_type = DataType.PRODUCT;
                const [error,data] = await Portal.delete(database,data_type,id);
                Log.w('data',data);
                console.log('PORTAL-DELETE-END');
                */

                /*
                console.log('PORTAL-DELETE-CACHE-START');
                let id =  'db4ce653-ed62-454a-b556-29dffd3940e6';
                let data_type = DataType.PRODUCT;
                const [error,data] = await Portal.delete_cache(database,data_type,id);
                Log.w('data',data);
                console.log('PORTAL-DELETE-CACHE-END');
                */

                /*
                console.log('PORTAL-GET-START');
                let data_type = DataType.PRODUCT;
                let id =  'db4ce653-ed62-454a-b556-29dffd3940e6';
                let key = 'test_10852';
                const [error,data] = await Portal.get(database,data_type,id);
                Log.w('data',data);
                console.log('PORTAL-GET-END');
                */

                /*
                console.log('PORTAL-COPY-START');
                let data_type = DataType.PRODUCT;
                let id = 'ef923dd8-7f40-4833-af16-0b4e7fb22869';
                const [error,data] = await Portal.copy(database,data_type,id);
                Log.w('data',data);
                console.log('PORTAL-COPY-END');
                */


                /*
            console.log('PORTAL-COUNT-LIST-START');
                let data_type = DataType.PRODUCT;
                let filter = {};
                const [error,data] = await Portal.count(database,data_type,filter);
                Log.w('data',data);
                console.log('PORTAL-COUNT-LIST-END');
                */

                /*
                console.log('PORTAL-DELETE-SEARCH-START');
                let id = 0;
                let data_type = DataType.PRODUCT;
                let filter = {};
                const [error,data] = await Portal.delete_search(database,data_type,filter);
                Log.w('data',data);
                console.log('PORTAL-DELETE-SEARCH-END');
                */

                /*
                console.log('PORTAL-UPDATE-LIST-START');
                let id = 0;
                let data_type = DataType.PRODUCT;
                let item_list = Product_Logic.get_test_list();
                Log.w('data',item_list);
                const [error,data] = await Portal.update_list(database,item_list);
                Log.w('data',data);
                console.log('PORTAL-UPDATE-LIST-END');
                */

        /*
                console.log('PORTAL-DELETE-START');
                let data_type = DataType.BLANK;
                let key = "1d5e10eb-8927-442d-83ae-52f2e156daad";
                //let key = 'product_1';
                //const [error,data] = await Portal.get();
                const [error,data] = await Portal.delete(database,data_type,key,{get_item:true,get_photo:true});
                console.log(data);
                console.log('PORTAL-DELETE-SUCCESS');
//database = data;
//Log.w('database',database);
                console.log('PORTAL-DELETE-END');
                */



},

    /*
        async function(call){
                const [error,data] = await Database.close(database);
                Log.w('data_close',data);
               console.log('DATABASE-CLOSE');
    //call();
        },
        */
        // GET - END


        // CONNECT - START
        /*
        async function(call){
                console.log('DATABASE-START');
                let title_url = 'sales_team';
        //const [error,data] = await Team.get_member(db_connect,title_url);
                const [error,data] = await Database.get({app_id:"test-may26",biz9_config_file:"/home/think2/www/doqbox/biz9-framework/biz9-service/code/biz9_config"});
            console.log('connect-good');
                database = data;
                Log.w('database',database);
//call();
        },
        async function(call){
                const [error,data] = await Database.close(database);
                Log.w('data_close',data);
               console.log('DATABASE-CLOSE');
//call();
        },
        */
    // CONNECT - END

    /*
            function(call){
                console.log('11111111111');
                Data.open_db(data_config).then(([error,data])=> {
                    console.log('222222222');
                    cloud_error=Log.append(cloud_error,error);
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    Log.w('data',data);
                    console.log('CONNECT-OPEN-SUCCESS');
//call();
                }).catch(error => {
                    Log.error('CONNECT-OPEN-ERROR',error);
                    console.log(error);
                    cloud_error=Log.append(cloud_error,error);
                });
            },
            function(call){
                Data.check_db(db_connect).then((data)=> {
                    cloud_error=Log.append(cloud_error,error);
                    Log.w('data',data);
                    Log.w('error',error);
                    assert.notEqual(data,null);
                    console.log(data);
                    console.log('CONNECT-CHECK-SUCCESS');
                    call();
                }).catch(error => {
                    Log.error('CONNECT-CHECK-ERROR',error);
                    cloud_error=Log.append(cloud_error,error);
                });
            },
            function(call){
                Data.close_db(db_connect).then(([error,data])=> {
                    cloud_error=Log.append(cloud_error,error);
                    db_connect = data;
                    assert.equal(db_connect,null);
                    console.log(data);
                    console.log('CONNECT-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    Log.error('CONNECT-CLOSE-ERROR',error);
                    cloud_error=Log.append(cloud_error,error);
                });
            },
            */
],
    function(error, result){
        //console.log('CONNECT-DONE');
        done();
    });
});
});
describe('item_get', function(){ this.timeout(25000);
    it("_item_get", function(done){
        let cloud_error=null;
        let database = {};
        var item = DataItem.get_new(DATA_TYPE,0);
        //var item = DataItem.get_new(DATA_TYPE,KEY);
        async.series([
            async function(call){
                console.log('DATABASE-START');
                const [error,data] = await Database.get(DATA_CONFIG);
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    database = data;
                    console.log('DATABASE-SUCCESS');
                }
                console.log('DATABASE-END');
            },
            async function(call){
                console.log('GET-START');
                //const [error,data] = await Portal.get(database,item.data_type,ID,{});
                const [error,data] = await Portal.get(database,item.data_type,KEY,{});
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    item = data;
                    console.log(item);
                    console.log('GET-SUCCESS');
                }
                console.log('GET-END');
            },
            async function(call){
                console.log('CLOSE-START');
                const [error,data] = await Database.close(database,{});
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    database = data;
                    assert.Equal(data,null);
                    console.log('CLOSE-SUCCESS');
                }
                console.log('CLOSE-END');
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("GET-ERROR-DONE",cloud_error);
                }else{
                    console.log('GET-DONE');
                }
                done();
            });
    });
});
describe('item_update', function(){ this.timeout(25000);
    it("_item_update", function(done){
        let cloud_error=null;
        let database = {};
        var item_test = Item_Logic.get_test('Item '+Number.get_id(),DATA_TYPE,0);
        //let item_test = Item_Logic.get_test("Item_" +Number.get_id(),DataType.BLOG_POST,0);
        Log.w('item_test_44',item_test);
        async.series([
            async function(call){
                console.log('DATABASE-START');
                const [error,data] = await Database.get(DATA_CONFIG);
                console.log(data);
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    database = data;
                    console.log(database);
                    console.log('DATABASE-SUCCESS');
                }
                console.log('DATABASE-END');
            },
            async function(call){
                console.log('UPDATE-START');
                const [error,data] = await Portal.update(database,DATA_TYPE,item_test,{});
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    item_test = data;
                    assert.notEqual(item_test,null);
                    console.log(item_test);
                    console.log('UPDATE-SUCCESS');
                }
                console.log('UPDATE-END');
            },
            async function(call){
                console.log('CLOSE-CLOSE');
                const [error,data] = await Database.close(database,{});
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    database = data;
                    assert.Equal(data,null);
                    console.log('CLOSE-SUCCESS');
                }
                console.log('CLOSE-END');
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("UPDATE-ERROR-DONE",cloud_error);
                }else{
                    console.log('UPDATE-DONE');
                }
                done();
            });
    });
});
describe('item_delete', function(){ this.timeout(25000);
    it("_item_delete", function(done){
        let cloud_error=null;
        let database = {};
        var item = Item_Logic.get_test(DATA_TYPE,ID);
        async.series([
            async function(call){
                console.log('DATABASE-START');
                const [error,data] = await Database.get(DATA_CONFIG);
                console.log(data);
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    database = data;
                    console.log(database);
                    console.log('DATABASE-SUCCESS');
                }
                console.log('DATABASE-END');
            },
            async function(call){
                console.log('DELETE-START');
                const [error,data] = await Portal.delete(database,item.data_type,item.id,{});
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    item = data;
                    console.log(item);
                    console.log('DELETE-SUCCESS');
                }
                console.log('DELETE-END');
            },
            async function(call){
                console.log('CLOSE-CLOSE');
                const [error,data] = await Database.close(database,{});
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    database = data;
                    assert.Equal(data,null);
                    console.log('CLOSE-SUCCESS');
                }
                console.log('CLOSE-END');
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("UPDATE-ERROR-DONE",cloud_error);
                }else{
                    console.log('UPDATE-DONE');
                }
                done();
            });
    });
});




describe('get_data', function(){ this.timeout(25000);
    it("_get_data", function(done){
        let cloud_error = null;
        let database = {};
        let item = get_new_item(DATA_TYPE,KEY);
        async.series([
            async function(call){
                console.log('TEST-CONNECT-START');
                //const [error,data] = await Database.get(DATA_CONFIG,{biz9_config_file:"/home/think2/www/doqbox/biz9-framework/biz9-service/code/biz9_config"});
                //const [error,data] = await Database.get(DATA_CONFIG,{biz9_config_file:"/home/think2/www/doqbox/biz9-framework/biz9-service/code/biz9_config",app_id:"cool_apple"});
                //const [error,data] = await Database.get(DATA_CONFIG,{biz9_config_file:"/home/think2/www/doqbox/biz9-framework/biz9-service/code/biz9_config"});
                //const [error,data] = await Database.get(DATA_CONFIG,{app_id:'cool_work'});
                //const [error,data] = await Database.get(DATA_CONFIG,{app_id:'cool_work',biz9_config_file:"/home/think2/www/doqbox/biz9-framework/biz9-service/code/biz9_config"});
                //const [error,data] = await Database.get({},{app_id:"cool_work",biz9_config_file:"/home/think2/www/doqbox/biz9-framework/biz9-service/code/biz9_config"});
                const [error,data] = await Database.get(DATA_CONFIG);
                database = data;
                Log.w('database',database);
                console.log('TEST-CONNECT-SUCCESS');
                console.log('TEST-CONNECT-END');
            },
            async function(call){
                console.log('TEST-GET-START');
                Log.w('item',item);
                const [error,data] = await Portal.get(database,item.data_type,item.id,OPTION);
                Log.w('database',data);
                console.log('TEST-GET-SUCCESS');
                console.log('TEST-GET-END');
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("TEST-GET-DONE",cloud_error);
                }else{
                    console.log('TEST-GET-DATA-CONNECT-DONE');
                }
                done();
            });
    });
});
describe('item_list_update', function(){ this.timeout(25000);
    it("_item_list_update", function(done){
        let cloud_error=null;
        let db_connect = {};
        let item_test_list = [];
        async.series([
            function(call){
                console.log('TEST-LIST-ITEM-UPDATE-CONNECT-START');
                Data.open_db(data_config).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                        Log.error('error',error);
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('TEST-LIST-ITEM-UPDATE-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-UPDATE-UPDATE-START');
                let test_group_id=Number.get_id();
                for(a=0;a<10;a++){
                    item_test=Test.get_item('dt_blank',0);
                    item_test.test_group_id=test_group_id;
                    item_test_list.push(item_test);
                }
                Data.update_list(db_connect,item_test_list).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }
                    console.log(data);
                    assert.notEqual(0,data.length);
                    assert.strictEqual(10,data.length);
                    assert.notEqual(0,data[0].id);
                    console.log('TEST-LIST-ITEM-UPDATE-UPDATE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-UPDATE-CLOSE-START');
                Data.close_db(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('TEST-LIST-ITEM-UPDATE-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-UPDATE-ASSERT-START');
                assert.notEqual(item_test.first_name,0);
                assert.notEqual(item_test.first_name,null);
                assert.notEqual(item_test.id,0);
                assert.notEqual(item_test.id,null);
                assert.equal(null,db_connect);
                console.log('TEST-LIST-ITEM-UPDATE-ASSERT-SUCCESS');
                call();
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("TEST-LIST-ITEM-UPDATE-ERROR-DONE",cloud_error);
                }else{
                    console.log('TEST-LIST-ITEM-UPDATE-CONNECT-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-UPDATE-UPDATE-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-UPDATE-CLOSE-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-UPDATE-ASSERT-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-UPDATE-DONE');
                }
                done();
            });
    });
});
describe('item_list_get', function(){ this.timeout(25000);
    it("_item_list_get", function(done){
        let cloud_error = null;
        let db_connect = {};
        let data_list = [];
        let data_type =DATA_TYPE;
        let filter =FILTER;
        let sort_by ={title:-1};
        let page_current =1;
        let page_size =10;
        async.series([
            function(call){
                console.log('LIST-ITEM-GET-CONNECT-START');
                Data.open_db(data_config).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                        Log.error('error',error);
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('LIST-ITEM-GET-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('LIST-ITEM-GET-GET-ITEM-LIST-START');
                Log.w('data_type',data_type);
                Log.w('filter',filter);
                Log.w('sort_by',sort_by);
                Log.w('page_current',page_current);
                Log.w('page_size',page_size);
                Data.get_list(db_connect,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=> {
                    data_list = data;
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        Log.w('data',data);
                        Log.w('item_count',item_count);
                        Log.w('page_count',page_count);
                        console.log('LIST-ITEM-GET-GET-ITEM-LIST-SUCCESS');
                    }
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('LIST-ITEM-GET-CLOSE-START');
                Data.close_db(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('LIST-ITEM-GET-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('LIST-ITEM-GET-ASSERT-START');
                assert.equal(data_list.length,page_size);
                console.log('LIST-ITEM-GET-ASSERT-SUCCESS');
                call();
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("LIST-ITEM-GET-ERROR-DONE",cloud_error);
                }else{
                    console.log('LIST-ITEM-GET-CONNECT-SUCCESS-DONE');
                    console.log('LIST-ITEM-GET-GET-SUCCESS-DONE');
                    console.log('LIST-ITEM-GET-ASSERT-SUCCESS-DONE');
                    console.log('LIST-ITEM-GET-CLOSE-SUCCESS-DONE');
                    console.log('LIST-ITEM-GET-DONE');
                }
                done();
            });
    });
});
describe('item_list_delete', function(){ this.timeout(25000);
    it("_item_list_delete", function(done){
        let cloud_error = null;
        let db_connect = {};
        let data_list = [];
        let data_type =DATA_TYPE;
        let filter =FILTER;
        async.series([
            function(call){
                console.log('TEST-LIST-ITEM-DELETE-CONNECT-START');
                Data.open_db(data_config).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                        w('error',error);
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('TEST-LIST-ITEM-DELETE-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-GET-DELETE-ITEM-LIST-START');
                Log.error('data_type',data_type);
                Log.error('filter',filter);
                Data.delete_list(db_connect,data_type,filter).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        data_list = data;
                        Log.error('data',data_list);
                        console.log('TEST-LIST-ITEM-GET-GET-ITEM-LIST-SUCCESS');
                    }
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-DELETE-CLOSE-START');
                Data.close_db(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('TEST-LIST-ITEM-DELETE-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-DELETE-ASSERT-START');
                //assert.equal(data_list.length,page_size);
                console.log('TEST-LIST-ITEM-DELETE-ASSERT-SUCCESS');
                call();
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("TEST-LIST-ITEM-DELETE-ERROR-DONE",cloud_error);
                }else{
                    console.log('TEST-LIST-ITEM-DELETE-CONNECT-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-DELETE-GET-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-DELETE-ASSERT-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-DELETE-CLOSE-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-DELETE-DONE');
                }
                done();
            });
    });
});

const get_new_item = (data_type,id) =>{
    return {data_type:data_type,id:id};
}

