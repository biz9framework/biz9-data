const async = require('async');
const assert = require('node:assert');

const {Data,Database,Category_Data,Product_Data,Page_Data,Blog_Post_Data,Content_Data,Stat_Data,List_Data,Review_Data,Favorite_Data,Search_Data,Admin_Data,Business_Data,Order_Data,User_Data,Faq_Data,Portal,Cart_Data} = require(".");

const {Log,Num,Str} = require("biz9-utility");
const {DataType,DataItem,Item_Logic,Page_Logic,Template_Logic,Blog_Post_Logic,Content_Logic,Product_Logic,Field_Logic,Admin_Logic,Business_Logic,Category_Logic,User_Logic,Order_Logic,FieldType,Cart_Logic,Stat_Logic,Review_Logic,PageType} = require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
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
const APP_ID = 'test-stage';
//const APP_ID = 'app_id_98230';
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
                //APP-START
                //APP-END

                /*
                var https = require('https');
                var key = '4A2F0395D906CA7E334C0A332E06F473';
                var ip = '168.244.193.23';
                let url = 'https://api.ip2location.io/?key=' + key + '&ip=' + ip + '&format=json';
                let response = '';
                let req = https.get(url, function (res) {
                    res.on('data', (chunk) => (response = response + chunk));
                    res.on('error', (e) => console.log('ERROR: ' + e));
                    res.on("end", function () {
                        try {
                            console.log('aaaaaaa');
                            myobj = JSON.parse(response);
                            console.log(myobj);
                            Log.w('country_name',myobj.country_name);
                            Log.w('region_name',myobj.region_name);
                            Log.w('district',myobj.district);
                            Log.w('city_name',myobj.city_name);
                            Log.w('latitude',myobj.latitude);
                            Log.w('longitude',myobj.longitude);
                            Log.w('zip_code',myobj.zip_code);
                            Log.w('isp',myobj.isp);
                            console.log('bbbbbb');
                            if (myobj['error']) {
                                console.log('ERROR: ' + myobj['error']['error_message']);
                            }
                            else if (myobj['proxy']) {
                                if (myobj['proxy']['is_vpn']) {
                                    console.log('The IP ' + ip + ' is a VPN.');
                                }
                                else {
                                    console.log('The IP ' + ip + ' is NOT a VPN.');
                                }
                            }
                            else {
                                console.log('ERROR: The is_vpn field requires a paid subscription to the Security plan.');
                            }
                        }
                        catch (e) {
                            console.log('ERROR: Invalid JSON in response.')
                        }
                    });
                });
                */

                /*
                    //FAQ-START
                console.log('FAQ-START');
                let key = 'primary';
                const [error,data] = await Faq_Data.get(database,key,{question_count:4});
                Log.w('data',data.item.questions);
                console.log('FAQ-END');
//FAQ-END
*/

//STAT-START
/*
                console.log('STAT-START');
            let user_id = Num.get_id();
            let parent_data_type = 'product_biz';
            let stat_type_id = FieldType.STAT_VIEW_ADD_ID;
            let stat_list = [DataItem.get_new(DataType.STAT,0,{parent_data_type:parent_data_type,parent_id:'6952c3b8-b10b-48cb-8e42-ae3f3ef356c2'})];

            let stat = Stat_Logic.get_new(parent_data_type,user_id,stat_type_id,stat_list);
            Log.w('stat',stat);
            const [error,data] = await Stat_Data.update(database,stat.parent_data_type,stat.user_id,stat.stat_type_id,stat.item_list,{});
            Log.w('data',data);
            console.log('STAT-END');
            */

//STAT-END

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
        console.log('REVIEW-INFO-START');
        let parent_data_type = DataType.PRODUCT;
        let parent_id = '56899ff7-bc11-4004-8e3b-f1688b9e0ba1';
        let user_id =  '3b11900c-49b3-4934-80ab-dccd884ba53b';
        console.log('REVIEW-INFO-END');
        let product_review = Review_Logic.get_test(parent_data_type,parent_id,user_id);
        let review = Review_Logic.get_new(parent_data_type,parent_id,user_id,product_review.title,product_review.comment,product_review.rating);
        review.rating = 4;
        */
//Log.w('product_review',product_review);
//Log.w('review',review);
//Log.w('review_rating',rating);
//const [error,data] = await Review_Data.update(database,review.parent_data_type,review.parent_id,review.user_id,review);
//const [error,data] = await Review_Data.get(database,parent_data_type,parent_id,{},1,0);
//Log.w('data',data);
//Log.w('data_parent',data.item_list[0]);
//Log.w('data_parent',data.item_list[1]);
//console.log('REVIEW-END');

        //console.log('FAVORITE-START');
        //let parent_data_type = DataType.PRODUCT;
        //let parent_id= '27cce0b4-7e2d-4884-b1db-5144e4081dc6';
        //let user_id = '12ea029a-b893-4b17-be24-2d6ef2feae25';
        //const [error,data] = await Favorite_Data.get(database,parent_data_type,user_id,{},1,0);
        //Log.w('data',data);
        //console.log('FAVORITE-END');

                /*
        console.log('CATEGORY-START');
        let data_type = DataType.CATEGORY;
        //let id =  'db4ce653-ed62-454a-b556-29dffd3940e6';
        let key = 'cool';
        let search = Item_Logic.get_search(data_type,{},{},1,0);
        let option = {
            //count--start
            get_item_count:true,
            item_count_data_type:DataType.PRODUCT,
            item_count_field:'category',
            item_count_value:'title',
            //count--end
            //get_item_search:true,
            //item_search_data_type:DataType.PRODUCT,
            //item_search_filter:{category:'Cool'},
        };
                //Log.w('option',option);
        const [error,data] = await Category_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
        Log.w('data',data);
    //Log.w('data_1',data.item_list[0]);
    //Log.w('data_2',data.item_list[0].item_search_list);
        console.log('CATEGORY-END');
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
    /*
        console.log('CONTENT-START');
        //let content = Content_Logic.get_test("Content " + String(Num.get_id()),{get_value:true,get_item:true});
        let key = "product_hosting_type";
        const [error,data] = await Content_Data.get(database,key,{get_item:true,get_order_item:true,order_item_count:3});
        Log.w('data',data);
        Log.w('data_1',data.item.items[0].title);
        Log.w('data_2',data.item.items[1].title);
        Log.w('data_3',data.item.items[2].title);
        console.log('CONTENT-END');
        */

        console.log('PAGE-START');
        //let page = Page_Logic.get_test("Page " + String(Num.get_id()),{get_value:true,get_item:true});
        let key = PageType.BLOG_POST;
        //let key = 'Gallery';
        const [error,data] = await Page_Data.get(database,key);
        Log.w('data',data);
        console.log('PAGE-END');

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

        /*
                console.log('BLOG-DATA-START');
                let key = 'test_39058';
        //let search = Item_Logic.get_search(DataType.BLOG_POST,{},{},1,0);
                const [error,data] = await Blog_Post_Data.get(database,key);
                //const [error,data] = await Business_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
                Log.w('data',data);
                console.log('BLOG-DATA-END');
                */


                /*
                console.log('BUSINESS-START');
                let key = 'test_34003';
                const [error,data] = await Business_Data.get(database);
                Log.w('data',data);
                console.log('BUSINESS-END');
                */


                //USER-START
                /*
                console.log('USER-START');
                let user = User_Logic.get_test('UserCool'+Num.get_id());
                //user.title = Str.get_title_url(user.title);
                ip_address = "168.244.193.23";
                geo_key = "4A2F0395D906CA7E334C0A332E06F473";
                //user.title = "test_32926";
                //user.email = "user5"+Num.get_id()+"@bossappz.com";
                Log.w('user',user);
                const [error,data] = await User_Data.register(database,user,ip_address,geo_key);
                //const [error,data] = await User_Data.login(database,user.email,user.password);
                Log.w('data',data);
                console.log('USER-END');
                //USER-END
                */
                /*
                console.log('PORTAL-DELETE-START');
                let id = 'c3b33a03-9af8-43ec-9878-31cba4ba2588';
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
                let data_type = DataType.BLOG_POST;
        //let key =  '56708c79-6750-4d51-b85d-bc25bf5d3fc9';
                let key = 'apple';
                const [error,data] = await Portal.get(database,data_type,key,{get_item:true,get_photo:true});
                Log.w('data',data);
                console.log('PORTAL-GET-END');
                */

        /*
                console.log('PORTAL-COPY-START');
                let data_type = DataType.BLOG_POST;
                let id = '2e196e65-c862-4a15-ab49-719857b18410';
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
//9_item_post_data
describe('item_post_data', function(){ this.timeout(25000);
    it("_item_post_data", function(done){
        let cloud_data = {cart:DataItem.get_new(DataType.CART,0)};
        let cloud_error=null;
        let database = {};
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
                console.log('CART-POST-START');
                let parent_data_type = DataType.PRODUCT;
                let parent_id = "7620c413-e542-4b89-82e6-60c5b1e06a55";
                let user_id = "ea790ecf-2a91-4fe4-951d-5cae0d9551a4";
                let parent_sub_item_1_data_type = DataType.ITEM;
                let parent_sub_item_1_id = "0eb7b268-7c19-4705-a94e-e939568b85d8";

                let parent_sub_item_2_data_type = DataType.ITEM;
                let parent_sub_item_2_id = "1e95bd1b-f902-4fc0-8424-da0c93b81b48";

                let cart = Cart_Logic.get_cart(parent_data_type,user_id);
                let cart_item = Cart_Logic.get_cart_item(parent_data_type,parent_id,cart.cart_number,user_id,1);
                cart.cart_item_list.push(cart_item);

                let cart_sub_item_1 = Cart_Logic.get_cart_sub_item(parent_sub_item_1_data_type,parent_sub_item_1_id,cart.cart_number,user_id,1);
                cart_item.cart_sub_item_list.push(cart_sub_item_1);

                let cart_sub_item_2 = Cart_Logic.get_cart_sub_item(parent_sub_item_2_data_type,parent_sub_item_2_id,cart.cart_number,user_id,1);
                cart_item.cart_sub_item_list.push(cart_sub_item_2);

                const [error,data] = await Cart_Data.post(database,user_id,cart);
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    cloud_data.cart = data.cart;
                    Log.w('cart_post_cart_data',cloud_data.cart);
                    console.log('CART-POST-SUCCESS');
                }
                console.log('CART-POST-END');
            },
            async function(call){
                console.log('CART-GET-START');
                const [error,data] = await Cart_Data.get(database,cloud_data.cart.cart_number);
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    cloud_data.cart = data.cart;
                    Log.w('cart_get_cart_data',cloud_data.cart);
                    console.log('CART-GET-DONE');
                }
                console.log('CART-GET-END');
            },
            async function(call){
                console.log('ORDER-POST-START');
                let order = Order_Logic.get_order(cloud_data.cart);
                Log.w('new_order',order);
                const [error,data] = await Order_Data.post(database,order);
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    cloud_data.order = data.order;
                    Log.w('order_post_order_data_22',data);
                    console.log('ORDER-GET-DONE');
                }
                console.log('ORDRE-GET-END');
            },
            async function(call){
                console.log('ORDER-GET-START');
                const [error,data] = await Order_Data.get(database,cloud_data.order.order_number);
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    cloud_data.order = data.order;
                    Log.w('cart_get_order_data',cloud_data.order);
                    console.log('ORDER-GET-DONE');
                }
                console.log('ORDER-GET-END');
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("GET-ERROR-DONE",cloud_error);
                }else{
                    console.log('CART-POST-DONE');
                }
                done();
            });
    });
});
//9_item_delete_data
describe('item_delete_data', function(){ this.timeout(25000);
    it("_item_delete_data", function(done){
        let cloud_data = {cart:DataItem.get_new(DataType.CART,0)};
        let cloud_error=null;
        let database = {};
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
                console.log('CART-DELETE-START');
                let id = "49d591f1-5c19-4520-8b46-1528bde5115d";

                const [error,data] = await Cart_Data.delete(database,id);
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    Log.w('cart_delete_cart_data',data);
                    console.log('CART-DELETE-SUCCESS');
                }
                console.log('CART-DELETE-END');
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("GET-ERROR-DONE",cloud_error);
                }else{
                    console.log('CART-DELETE-DONE');
                }
                done();
            });
    });
});
/*
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
*/
//cart_update
describe('item_update', function(){ this.timeout(25000);
    it("_item_update", function(done){
        let cloud_error=null;
        let database = {};
        let cart = {};
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
                console.log('CART-UPDATE-START');
                let user_id = "f7765250-75bf-4d43-b17e-5f01154acad0";
                let parent_data_type = DataType.PRODUCT;
                let parent_id = "a9956e2f-a9ca-4c32-a432-993ecccff0ad";
                let sub_item_1_data_type = DataType.ITEM;
                let sub_item_1_id = "cd2cd782-cdc8-4eef-8284-779d0b065969";
                let sub_item_2_data_type =  DataType.ITEM;
                let sub_item_2_id = "01b4fd96-27ec-43f8-874d-78b7ba01ef22";

                let cart = Cart_Logic.get_cart(user_id);
                //cart item
                let cart_item_product = Cart_Logic.get_cart_item(parent_data_type,parent_id,cart.cart_number,user_id,1);
                // cart sub item 1
                let cart_sub_item_cms_type = Cart_Logic.get_cart_item(sub_item_1_data_type,sub_item_1_id,cart.cart_number,user_id,1);
                // cart sub item 2
                let cart_sub_item_hosting_type = Cart_Logic.get_cart_item(sub_item_2_data_type,sub_item_2_id,cart.cart_number,user_id,1);
                cart_item_product.cart_sub_item_list.push(cart_sub_item_cms_type);
                cart_item_product.cart_sub_item_list.push(cart_sub_item_hosting_type);
                cart.cart_item_list.push(cart_item_product);
                //Log.w('cart',cart.cart_item_list);

                const [error,data] = await Cart_Data.update(database,parent_data_type,user_id,cart);
                //Log.w('data',cart);

                //Log.w('data',data);
                //Log.w('data_item_list',data.cart.cart_item_list);
                console.log('CART-UPDATE-END');

            },

            async function(call){
                // console.log('CART-GET-CART-START');
                // let parent_data_type =DataType.PRODUCT;
                //let user_id = 'f7765250-75bf-4d43-b17e-5f01154acad0';
                //let cart_number = 'CA-86876';
                //get cart
                //const [error,data] = await Cart_Data.get(database,cart_number);
                //cart = data.cart;
                //Log.w('data',data);
                //Log.w('data_cart_item_list',data.cart.cart_item_list);
                //console.log('CART-GET-CART-END');
            },
            async function(call){
                console.log('CLOSE-CLOSE');
                const [error,data] = await Database.close(database);
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    database = data;
                    console.log('CLOSE-SUCCESS');
                }
                console.log('CLOSE-END');
            },
        ],
            function(error, result){
                if(cloud_error){
                    //Log.error("UPDATE-ERROR-DONE",cloud_error);
                }else{
                    console.log('UPDATE-DONE');
                }
                done();
            });
    });
});

/*
    //order_update
describe('item_update', function(){ this.timeout(25000);
    it("_item_update", function(done){
        let cloud_error=null;
        let database = {};
        let cart = {};
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
                console.log('ORDER-GET-CART-START');
                let parent_data_type =DataType.PRODUCT;
                let user_id = 'f7765250-75bf-4d43-b17e-5f01154acad0';
                let cart_number = 'CA-86876';
                //get cart
                const [error,data] = await Cart_Data.get(database,cart_number);
                cart = data.cart;
                //Log.w('data',data);
                //Log.w('data_cart_item_list',data.cart.cart_item_list);
                console.log('ORDER-GET-CART-END');
            },
            async function(call){
                console.log('ORDER-UPDATE-START');
                const [error,data] = await Order_Data.update(database,cart);
//Log.w('data',data);
//Log.w('data_item_list',data.order.order_item_list);
                console.log('ORDER-UPDATE-END');

            },
            async function(call){
                console.log('CLOSE-CLOSE');
                const [error,data] = await Database.close(database);
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    database = data;
                    console.log('CLOSE-SUCCESS');
                }
                console.log('CLOSE-END');
            },
        ],
            function(error, result){
                if(cloud_error){
                    //Log.error("UPDATE-ERROR-DONE",cloud_error);
                }else{
                    console.log('UPDATE-DONE');
                }
                done();
            });
    });
});
*/

                    /*
describe('old_update_old', function(){ this.timeout(25000);
    it("old_update_old", function(done){
        let cloud_error=null;
        let database = {};
        var item_test = Item_Logic.get_test('Item '+Num.get_id(),DATA_TYPE,0);
//let item_test = Item_Logic.get_test("Item_" +Num.get_id(),DataType.BLOG_POST,0);
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
*/

/*
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
*/



/*
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
*/
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
                        let test_group_id=Num.get_id();
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

