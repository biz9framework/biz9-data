const async = require('async');
const assert = require('node:assert');

const {Data,Database,Category_Data,Product_Data,Page_Data,Blog_Post_Data,Content_Data,Stat_Data,List_Data,Review_Data,Favorite_Data,Search_Data,Admin_Data,Business_Data,Order_Data,User_Data,Faq_Data,Portal,Cart_Data,Activity_Data,Blog_Post,Event_Data} = require(".");

const {Log,Num,Str} = require("biz9-utility");
const {DataType,DataItem,Type_Logic,Item_Logic,App_Logic,Page_Logic,Template_Logic,Blog_Post_Logic,Content_Logic,Product_Logic,Field_Logic,Admin_Logic,Business_Logic,Service_Logic,Category_Logic,Type,User_Logic,Order_Logic,Title,FieldType,Cart_Logic,Stat_Logic,Review_Logic,PageType,BLog_Post_Logic,Sub_Item_Logic,Event_Logic,Demo_Logic} = require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
/*
 * availble tests
- connect
- item_update
- get_data
- item_delete
- item_list_update
- item_list_get
- item_list_delete
- post_data
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
        let error=null;
        let database = {};
        let cart = {};
        let order = {};
        let data = {};
        let data_type = DataType.PRODUCT;
        let id = "95fc25b7-43d0-49ff-bb86-0f5ba207cf18";
        let user_id = "f63d6bd2-ce86-4a36-808f-40fe59069077";
        let option = {post_stat:true,user_id:user_id};
        async.series([
            async function(call){
                console.log('DATABASE-START');
                const [biz_error,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
                console.log('DATABASE-END');
            },
            //- POST_ITEM - START
            async function(call){
                let data_type = DataType.PRODUCT;
                let id = "3e6cbb33-afa8-47d4-95c0-9df60e02b3ee";
                let key = "mobile_product_12";
                let user_id = "63e7b9ea-7bf8-4780-bf90-5050e501f44c";
                //let option = {post_stat:true,post_unique:false,user_id:user_id,stat_type:Type.STAT_ORDER_PAYMENT,order_payment_list_sort_by:{date_create:'-1'}};
                let option = {get_join:true,field_key_list:[{primary_data_type:DataType.ORDER_ITEM,primary_field:'parent_id',item_field:'id',title:'cool_orders',type:Type.LIST}]};
                //let order_number = "OR-4249";
                //let order_payment = Order_Logic.get_new_order_payment(order_number,Title.ORDER_PAYMENT_METHOD_TEST,Num.get_id(99));
                //Log.w('order_payment',order_payment);
                //Log.w('option',option);
                //const [biz_error,biz_data] = await Portal.post(database,data_type,order_payment,option);
                const [biz_error,biz_data] = await Portal.get(database,data_type,key,option);
                Log.w('33_post',biz_data);
                //cart = biz_data;
                //Log.w('33_cart',cart);
             },
            //- POST_ITEM - END
            //- SEARCH - START
            /*
            async function(call){
                let search = App_Logic.get_search(DataType.PRODUCT,{},{view_count:-1},1,9);
                let option = {get_join:true,field_key_list:[{primary_data_type:DataType.PRODUCT,primary_field:'id',item_field:'parent_id',title:'product',make_flat:true}],get_user:true,make_user_flat:true};
                //const [biz_error,biz_data] = await Portal.search(database,data_type,id);
                const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,{});
                //Log.w('search_data',biz_data);
                for(let a = 0; a<biz_data.product_list.length;a++){
                    console.log('title='+biz_data.product_list[a].title);
                    console.log('view_count='+biz_data.product_list[a].view_count);
                }
             },
             */
            //- SEARCH - END
            /*
             //- STAT - START
            async function(call){
                const [biz_error,biz_data] = await Portal.get(database,data_type,id);
                data.item = biz_data;
             },
            async function(call){
                let post_stat = Stat_Logic.get_new(data_type,Type.STAT_VIEW,user_id);
                let post_stat_item = Stat_Logic.get_new_stat_item(post_stat,data.item);
                let option = {post_unique:true,post_stat:true};
                post_stat.stat_item_list.push(post_stat_item);
                Log.w('11_post_stat_item',post_stat_item);
                const [biz_error,biz_data] = await Stat_Data.post(database,post_stat,option);
                //data.item = biz_data;
                //Log.w('22_caIrt',data);
             },
             //- STAT - END
            */

            //- GET_ITEM - START
            /*
            async function(call){
                let data_type = DataType.BLOG_POST;
                let id = "deb6489d-7471-4fa9-982d-31463ace67af";
                let user_id = "f63d6bd2-ce86-4a36-808f-40fe59069077";
                let option = {get_item:true,post_stat:true,post_unique:true,user_id:user_id};
                console.log('111111111111111');
                console.log('111111111111111');
                const [biz_error,biz_data] = await Portal.get(database,data_type,id,option);
                Log.w('22_get_data',biz_data);
                //cart = biz_data;
                //Log.w('33_cart',cart);
             },
             */
            //- GET_ITEM - END

            /*
            //- REVIEW - START
            async function(call){
                console.log('REVIEW-START');
                let parent_data_type = DataType.PRODUCT;
                let parent_id = "95fc25b7-43d0-49ff-bb86-0f5ba207cf18";
                let user_id = "f63d6bd2-ce86-4a36-808f-40fe59069077";
                //let review = Review_Logic.get_new(parent_data_type,parent_id,user_id,Num.get_id()+"_My_Title",Num.get_id()+"_Comment_",Num.get_id(5));
                let option = {post_stat:true,user_id:user_id};
                //Log.w('review',review);
                //const [biz_error,biz_data] = await Review_Data.post(database,parent_data_type,parent_id,user_id,review,option);
                const [biz_error,biz_data] = await Review_Data.get(database,parent_data_type,parent_id,{date_create:-1},1,0,{});
                Log.w('portal_review',biz_data);
                console.log(biz_data.review_list[0].title);
                console.log(biz_data.review_list[1].title);
                console.log('REVIEW-END');
            },
            //- REVIEW - END
            */
            /*
            //-- FAVORITE -- START
            async function(call){
                console.log('FAVORITE-START');
                let parent_data_type = DataType.PRODUCT;
                let parent_id = 'cd59ec5d-fe65-49de-860c-3730d71fe986';
                let user_id = '2a545946-3330-43b2-8ffa-99e40e201e99';
                let option = {get_favorite:true,favorite_parent_data_type:parent_data_type,favorite_user_id:user_id};
                //let option = {get_favorite:true,favorite_user_id:user_id};
                //let option = {post_stat:true,user_id:user_id};
                //console.log('11111111');
                //const [biz_error,biz_data] = await Favorite_Data.get(database,parent_data_type,parent_id,user_id);
                //const [biz_error,biz_data] = await Favorite_Data.delete(database,parent_data_type,parent_id,user_id);
                const [biz_error,biz_data] = await Favorite_Data.post(database,parent_data_type,parent_id,user_id);
                //const [biz_error,biz_data] = await Portal.get(database,parent_data_type,parent_id,option);
                //let search = App_Logic.get_search(DataType.PRODUCT,{category:'Music'},{},1,0);
                //let search = App_Logic.get_search(DataType.STAT,{},{},1,0);
                //const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
                Log.w('biz_data',biz_data);
                //Log.w('biz_data',biz_data.length);
                //console.log('FAVORITE-END');
            },
            //-- FAVORITE -- END
            */
            //-- DEMO -- START
            /*
            async function(call){
                console.log('TEST-DATA-DEMO-START');
                let category_type = DataType.PRODUCT;
                let category_count = 12;
                let item_count = 500;
                let category_type_title_list = ['Add On','Admin Panel','Hosting','Landing Page','Mobile','Website'];
                let category_title_list = ['Beauty','Church','Fashion','Food Trucks','Health Care','Music','Pets','Services','Service Repair','Sports','Trucking'];
                let item_title_list = [];
                let post_type_list = [];
                let val_category_title = '';
                let cat_max = 0;
                let option = {get_category:true,category_count:category_count,category_data_type:category_type,categorys:val_category_title?val_category_title:null,
                    get_item:true,item_count:item_count,item_data_type:category_type,items:null}

                if(category_title_list.length >0){
                    cat_max = category_title_list.length;
                }else{
                    if(category_count.length){
                        cat_max = category_count;
                    }else{
                        cat_max = 0;
                    }
                }
                option.item_count = item_count / cat_max;
                for(const item of category_type_title_list){
                    post_type_list.push(
                        Demo_Logic.get_new_type(item,option));
                }

                Log.w('11_post_type_list',post_type_list);
                Log.w('22_post_type_list_item',post_type_list[0].categorys[0]);

                const [biz_error,biz_data] = await Portal.demo_post(database,DataType.PRODUCT,post_type_list);
                Log.w('biz_data',biz_data);
                console.log('TEST-DATA-DEMO-END');
            },
            //-- DEMO -- END
            */
            //- CART-ORDER-APP LOGIC -- START
            /*
            async function(call){
                console.log('CART-ORDER-START');
                //let cart_number = "CA-73551";
                //let order_number = 'OR-92773';
                let blog_post_id = "4d752aa0-0ad2-410b-88cc-467bb41d712f";
                let product_id = "95fc25b7-43d0-49ff-bb86-0f5ba207cf18";
                let cms_id = "fbc0ed54-8dd9-4b36-8bc0-039fa96b8ed8";
                let hosting_id = "035bdda6-d8cd-4c0b-ab34-7fd7f511151e";
                let user_id = "bb10aa9c-ed88-43f3-b196-a0251db954fa";
                cart = Cart_Logic.get_new(DataType.PRODUCT,user_id);
                cart.product_id = product_id;
                cart.hosting_id = hosting_id;
                cart.blog_post_id = blog_post_id;
                cart.cms_id = cms_id;
                cart.cool_me = 'what_aaa';
                cart.cool_me_2 = 'who_bbb';
                //cart item
                let cart_item_product = Cart_Logic.get_new_cart_item(DataType.PRODUCT,product_id,cart.cart_number,1,Num.get_id(9999));
                cart_item_product.cool = 'cool_bean';
                cart_item_product.cool_2 = 'cool_bean_2';
                // cart sub item product_sub_cms_type
                let cart_sub_cms_type = Cart_Logic.get_new_cart_sub_item(DataType.PRODUCT,cms_id,cart.cart_number,1,Num.get_id(99))
                cart_sub_cms_type.what = "bean_water";
                cart_sub_cms_type.what_2 = "bean_water_2";
                cart_item_product.cart_sub_item_list.push(cart_sub_cms_type);
                // cart sub item product_sub_hosting_type
                let cart_sub_hosting_type = Cart_Logic.get_new_cart_sub_item(DataType.PRODUCT,hosting_id,cart.cart_number,1,Num.get_id(99));
                cart_sub_hosting_type.what = "bean_sauce";
                cart_sub_hosting_type.what_2 = "bean_sauce_2";
                cart_item_product.cart_sub_item_list.push(cart_sub_hosting_type);
                cart.cart_item_list.push(cart_item_product);
                //Log.w('11_cart',cart);
            //let search = App_Logic.get_search(DataType.PRODUCT,{cart_number:cart_number},{},1,0);
            //console.log('ccccccccc');
            //Log.w('cart_22',cart_item_product);
            let option_post_cart = {post_stat:true};
            const [biz_error,biz_data] = await Cart_Data.post(database,cart,option_post_cart,option);
            //const [biz_error,biz_data] = await Cart_Data.get(database,cart_number);
            //const [biz_error,biz_data] = await Order_Data.get(database,order_number);
            //console.log('33333333');
                cart = biz_data;
                //Log.w('22_cart',cart);
            },
            async function(call){
                order = Order_Logic.get_new(cart,{get_payment_plan:true,payment_plan:Title.ORDER_PAYMENT_PLAN_1,payment_plan_status:Title.ORDER_PAYMENT_STATUS_OPEN});
                order.what='today';
                let order_payment = Order_Logic.get_new_order_payment(order.order_number,Title.ORDER_PAYMENT_METHOD_TEST,Num.get_id(99));
                //Log.w('44_order_payment',order_payment);
                let option_post_order = {post_stat:true};
                const [biz_error,biz_data] = await Order_Data.post(database,order,[order_payment],option_post_order);
                order = biz_data;
                Log.w('55_order_post',order);
            },
            //create app
            async function(call){
                let app_num = order.order_number.replace('OR-','');
                let app = DataItem.get_new(DataType.APP,0,{
                app_id:app_num,
                user_id:user_id,
                title:"App " + app_num,
                order_number:order.order_number,
                product_id: order.product_id,
                hosting_id: order.hosting_id,
                blog_post_id: order.blog_post_id,
                cms_id: order.cms_id
                });
                //Log.w('66_app',app);
                const [biz_error,biz_data] = await Portal.post(database,DataType.APP,app);
                //Log.w('66_app',biz_data);
            },
            */
            //- APP-START
            /*
            async function(call){
                let id = "25c278ad-7553-4850-ab33-24a4917045c0";
                let data_type = DataType.APP;
                let search = App_Logic.get_search(DataType.APP,{},{title:1},1,0);
                let option = {get_user:true,make_user_flat:true,get_join:true,field_key_list:[
                    {make_flat:true,primary_data_type:DataType.PRODUCT,primary_field:'id',item_field:'product_id',title:'product',fields:'title,id,category,type'},
                    {make_flat:true,primary_data_type:DataType.PRODUCT,primary_field:'id',item_field:'product_cms_id',title:'cms',fields:'title,id,category,type'},
                    {make_flat:true,primary_data_type:DataType.PRODUCT,primary_field:'id',item_field:'product_hosting_id',title:'hosting',fields:'title,id,category,type'},
                ]};
                const [biz_error,biz_data] = await Portal.get(database,data_type,id,option);
                //const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
                Log.w('77_search_app',biz_data);
                Log.w('88_search_app',biz_data.product);
                Log.w('99_search_app',biz_data.cms);
                Log.w('100_search_app',biz_data.hosting);
                //Log.w('88_search_app',biz_data.data_list[0]);

            },
            */
            //- APP-END
            /*
            //- LOGIC -- START
            async function(call){
                console.log('DATA-START-1');
                let key = "OR-16505";
                //let key = "item_24184";
                let option = {get_payment:true};
                //Log.w('key',key);
                //const [biz_error,biz_data] = await Order_Data.get(database,key,option);
                //const [biz_error,biz_data] = await Blog_Post_Data.get(database,key,option);
                //const [biz_error,biz_data] = await Portal.get(database,DataType.EVENT,key,option);
                //Log.w('99_biz_data',order);
                //Log.w('biz_dat_22a',order.grand_total);
                console.log('DATA-END');
            },
            //- LOGIC -- END
            //- CART-ORDER LOGIC -- END
            // GET - END
            // CONNECT - START
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
//9_post_data
describe('post_data', function(){ this.timeout(25000);
    it("_post_data", function(done){
        let data = {cart:DataItem.get_new(DataType.CART,0)};
        let error=null;
        let database = {};
        let parent_item = {};
        let content_item_list = [];
        //var item = DataItem.get_new(DATA_TYPE,KEY);
        async.series([
            async function(call){
                console.log('TEST-CONNECT-START');
                const [biz_error,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
                console.log('TEST-CONNECT-SUCCESS');
                console.log('TEST-CONNECT-END');
            },
            async function(call){
                let data = {
                    product_type_list:[],
                    product_category_list:[],
                    product_list:[],
                };
                let post_application_development_product_category_title_list = [
                    'Beauty',
                    'Church',
                    'Fashion',
                    'Food Trucks',
                    'Health Care',
                    'Music',
                    'Pets',
                    'Services',
                    'Service Repair',
                    'Sports',
                    'Trucking',
                ];
                //let post_product_type_list = [
                //Demo_Logic.get_new_type('Admin Panel',{get_category:true,categorys:'Beauty,Church,Fashion,Food Trucks,Health Care,Music,Pets,Services,Service Repair,Sports,Trucking'})];
                //Demo_Logic.get_new_type('Admin Panel',{get_category:true,categorys:'Beauty,Church',get_item:true,item_count:9,item_data_type:DataType.PRODUCT,category_data_type:DataType.PRODUCT})];
                //Product_Logic.get_new_type('Landing Page'),
                //Product_Logic.get_new_type('Mobile'),
                //Product_Logic.get_new_type('Website')];

                //-bulk write

                /*
                try {
                    database.collection('blog_post_biz').bulkWrite( [
                        { insertOne: { document: {  type: "beef", size: "medium", price: 6 } } },
                        { insertOne: { document: {  type: "sausage", size: "large", price: 10 } } }
                    ],
                        { ordered: false } )
                } catch( error ) {
                    console.log( error )
                }
                */
                //
                let post_type_list = [];

                //for(let a = 0; a<9;a++){
                //post_type_list.push(Product_Logic.get_test('Title '+Num.get_id()))
                //}
                post_type_list = [Demo_Logic.get_new_type('Landing Page',{get_category:true,categorys:'Beauty,Pets',get_item:true,item_count:9,item_data_type:DataType.PRODUCT,category_data_type:DataType.PRODUCT})];

                Log.w('post_type_list',post_type_list);

                const [biz_error,biz_data] = await Portal.demo_post(database,DataType.PRODUCT,post_type_list);
                //Log.w('parent_item',data);
            },

            /*
            async function(call){
                parent_item = DataItem.get_new(DataType.BLOG_POST,0,{title:'my_parent_'+Num.get_id()});
                const [error,data] = await Portal.post(database,parent_item.data_type,parent_item);
                parent_item = data;
        //Log.w('parent_item',parent_item);
            },
            async function(call){
            //console.log(parent_item.data_type);
                content_item_list.push(Sub_Item_Logic.get_test('Content Item 1',parent_item,parent_item));
                content_item_list.push(Sub_Item_Logic.get_test('Content Item 2',parent_item,parent_item));
                const [error,data] = await Portal.post_list(database,content_item_list);
                content_item_list = data;
            //Log.w('content_item_list',content_item_list);
            },
            async function(call){
                const [error,data] = await Portal.get(database,parent_item.data_type,parent_item.id,{get_item:true});
                Log.w('get_parent_item',data);
            },
            */


                async function(call){
                    //console.log('POST-DATA-START');
                    //- GET_ITEM_SEARCH - START
                    /*
                let query = {category:'Application'};
                let search = App_Logic.get_search(DataType.CATEGORY,query,{title:1},1,13);
                let option = {get_search:true,search_data_type:DataType.PRODUCT,search_data_type:DataType.PRODUCT,search_field:'category',item_search_parent_field:'title'};
                */
                    //- GET_ITEM_SEARCH - END
                    // - GET_ITEM_COUNT - START
                    /*
                let query = {category:'Application'};
                let search = App_Logic.get_search(DataType.CATEGORY,query,{title:1},1,13);
                let option = {
                    get_count:true,
                    item_data_type:DataType.PRODUCT,
                    item_field:'category',
                    item_value:'title',
                    get_field:false,
                    fields:'id,title,title_url,photo_data,cost'
                };
                */
                    // - GET_ITEM_COUNT - END

                    // - PORTAL-SEARCH - START
                    /*
                const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
                Log.w('data',biz_data);
                */
                    // - PORTAL-SEARCH - END

                    //
                    //- user - start
                    //let user = DataItem.get_new(DataType.USER,0,{title:'ceo',title_url:'ceo',email:"ceo@bossappz.com",password:"1234567",role:FieldType.USER_ROLE_SUPER_ADMIN});
                    //let title = Num.get_id() + "user";
                    //let user = DataItem.get_new(DataType.USER,0,{title:title,title_url:title,email:title+"@bossappz.com",password:"1234567",role:FieldType.USER_ROLE_USER});
                    //let user = DataItem.get_new(DataType.USER,0,{email:'ceo@bossappz.com',password:"1234567"});
                    //Log.w('user',user);
                    //const [error,data] = await User_Data.register(database,user,null,null,null);
                    //const [error,data] = await User_Data.login(database,user,null,null,null);
                    //Log.w('data',data);
                    //- user - end


        //- FAVORITE - START
        /*
                let parent_data_type = DataType.PRODUCT;
                let parent_id = "604f0e31-816e-47f4-a411-0c507b859460";
                let user_id = "80009d4a-1df4-421a-9105-d9450ebc5e01";
                let filter = {user_id:user_id};
                    //const [biz_error,biz_data] = await Favorite_Data.post(database,parent_data_type,parent_id,user_id);
                const [biz_error,biz_data] = await Favorite_Data.get(database,parent_data_type,filter,{},1,0);
                Log.w('portal_favorite',biz_data);
                */
                    //- FAVORITE - END

                    //console.log('111111');
                    //let title = Num.get_id()+"_title";
                    //let title_2 = Num.get_id()+"_title_2";
                    //let blog_post = DataItem.get_new(DataType.BLOG_POST,'d86ec25e-4b15-4c4a-8ef9-ce82c9067571',{title:title,title_url:Str.get_title_url(title),author:Num.get_id()+"_cool"});
                    //let blog_post = DataItem.get_new(DataType.BLOG_POST,key);
                    //let item = DataItem.get_new(DataType.ITEM,0,{title:title_2,title_url:Str.get_title_url(title_2)});
                    //let full_item = DataItem.get_new_full_item(item,blog_post,blog_post,{title:title,title_url:Str.get_title_url(title)});
                    //console.log('aaaa');
                    //console.log(blog_post);
                    //console.log(item);
                    //console.log(full_item);
                    //let sub_item = DataItem.get_new_full_item());
                    //console.log('bbbbb');
                    //Log.w('sub_item',sub_item);
                    //console.log('ccccc');
                    //const [error,data] = await Portal.post(database,DataType.BLOG_POST,blog_post);
                    //const [error,data] = await Portal.post(database,DataType.ITEM,full_item);
                    //Log.w('cool',data);
                    /*
                if(error){
                    cloud_error=Log.append(cloud_error,error);
                }else{
                    console.log(data);
                    console.log('BLOG-POST-ADD-SUCCESS');
                }
                */
                    console.log('POST-DATA-END');
                },

            /*
            async function(call){
                console.log('CART-POST-START');
                let parent_data_type = DataType.PRODUCT;
                let parent_id = "7620c413-e542-4b89-82e6-60c5b1e06a55";
                let user_id = "ea790ecf-2a91-4fe4-951d-5cae0d9551a4";
                let parent_sub_item_1_data_type = DataType.ITEM;
                let parent_sub_item_1_id = "0eb7b268-7c19-4705-a94e-e939568b85d8";

                let parent_sub_item_2_data_type = DataType.ITEM;
                let parent_sub_item_2_id = "1e95bd1b-f902-4fc0-8424-da0c93b81b48";

                let cart = Cart_Logic.get_new(parent_data_type,user_id);
                let cart_item = Cart_Logic.get_new_cart_item(parent_data_type,parent_id,cart.cart_number,user_id,1);
                cart.cart_item_list.push(cart_item);

                let cart_sub_item_1 = Cart_Logic.get_new_cart_sub_item(parent_sub_item_1_data_type,parent_sub_item_1_id,cart.cart_number,user_id,1);
                cart_item.cart_sub_item_list.push(cart_sub_item_1);

                let cart_sub_item_2 = Cart_Logic.get_new_cart_sub_item(parent_sub_item_2_data_type,parent_sub_item_2_id,cart.cart_number,user_id,1);
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
                let order = Order_Logic.get_new(cloud_data.cart);
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
            */
        ],
            function(error, result){
                if(error){
                    Log.error("GET-ERROR-DONE",error);
                }else{
                    console.log('POST-DONE');
                }
                done();
            });
    });
});
/*
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
                let parent_data_type = DataType.SERVICE;
                let parent_id = "a9956e2f-a9ca-4c32-a432-993ecccff0ad";
                let sub_item_1_data_type = DataType.ITEM;
                let sub_item_1_id = "cd2cd782-cdc8-4eef-8284-779d0b065969";
                let sub_item_2_data_type =  DataType.ITEM;
                let sub_item_2_id = "01b4fd96-27ec-43f8-874d-78b7ba01ef22";

                let cart = Cart_Logic.get_cart(user_id);
                //cart item
                //let cart_item_product = Cart_Logic.get_cart_item(parent_data_type,parent_id,cart.cart_number,user_id,1);
                //cart_item_product.apple = 'butter';
                // cart sub item 1
                //let cart_sub_item_cms_type = Cart_Logic.get_cart_item(sub_item_1_data_type,sub_item_1_id,cart.cart_number,user_id,1);
                // cart sub item 2
                //let cart_sub_item_hosting_type = Cart_Logic.get_cart_item(sub_item_2_data_type,sub_item_2_id,cart.cart_number,user_id,1);
                //cart_item_product.cart_sub_item_list.push(cart_sub_item_cms_type);
                //cart_item_product.cart_sub_item_list.push(cart_sub_item_hosting_type);
                cart.cart_item_list.push(cart_item_product);
                //Log.w('cart',cart.cart_item_list);

                //const [error,data] = await Cart_Data.update(database,parent_data_type,user_id,cart);
                //Log.w('data',cart);

                Log.w('rrrrr',cart);
                //Log.w('data',data);
                //Log.w('data_item_list',data.cart.cart_item_list);
                //console.log('CART-UPDATE-END');

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
describe('item_delete', function(){ this.timeout(25000);
    it("_item_delete", function(done){
        let error=null;
        let database = {};
        let data_type = DataType.PRODUCT;
        let id = '05620fca-9de3-4268-bff7-885adc99ddb3';
        let option = {delete_item:true,delete_item_query:{parent_id:id},delete_image:true,delete_image_query:{parent_id:id}};
        var item = DataItem.get_new(data_type,id);
        async.series([
            async function(call){
                console.log('DATABASE-START');
                //const [error,data] = await Team.get_member(db_connect,title_url);
                const [error,data] = await Database.get(DATA_CONFIG);
                database = data;
                console.log('DATABASE-END');
            },
            async function(call){
                Log.w('delete_item',item);
                Log.w('delete_option',option);
            },
            async function(call){
                console.log('DELETE-START');
                const [biz_error,biz_data] = await Portal.delete(database,item.data_type,item.id,option);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    Log.w('biz_data',biz_data);
                    console.log('DELETE-SUCCESS');
                }
                console.log('DELETE-END');
            },
            /*
            async function(call){
                console.log('CLOSE-CLOSE');
                const [biz_error,biz_data] = await Database.close(database,{});
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    database = data;
                    assert.Equal(data,null);
                    console.log('CLOSE-SUCCESS');
                }
                console.log('CLOSE-END');
            },
            */
        ],
            function(error, result){
                if(error){
                    Log.error("UPDATE-ERROR-DONE",error);
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

describe('get_data', function(){ this.timeout(25000);
    it("__get_data", function(done){
        let cloud_error = null;
        let database = {};
        let item = get_new_item(DATA_TYPE,KEY);
        async.series([
            async function(call){
                console.log('TEST-CONNECT-START');
                const [error,data] = await Database.get(DATA_CONFIG);
                database = data;
                console.log('TEST-CONNECT-SUCCESS');
                console.log('TEST-CONNECT-END');
            },
            async function(call){
                console.log('TEST-GET-START');
                let data_type = DataType.BLOG_POST;
                //let key = "CA-51129";
                let key = "apple";
                //let key = "d86ec25e-4b15-4c4a-8ef9-ce82c9067571";
                //let search  = App_Logic.get_search(DataType.BLOG_POST,{},{},1,0);
                //let option = {get_search:true,search_data_type:DataType.CATEGORY,search_field:'category',item_search_value:'title'};
                //const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.parent_current,search.page_size,option);
                //
                //let option = {};
                //let option = {get_count:true,item_data_type:DataType.PRODUCT,item_field:'category',item_value:'title'};
                //Log.w('search',search);
                //const [biz_error,biz_data] = await Portal.get(database,data_type,key,{get_item:true,get_field:true,fields:'title,title_url'});
                //////const [biz_error,biz_data] = await Content_Data.get(database,key,{get_item:true});
                //const [biz_error,biz_data] = await Faq_Data.get(database,'primary');
                //const [biz_error,biz_data] = await Blog_Post_Data.get(database,key,{get_item:true});
                //console.log('aaaaaaa');
                //Log.w('search',search);
                //const [biz_error,biz_data] = await Activity_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
                //const [biz_error,biz_data] = await Order_Data.get(database,key);
                //const [biz_error,biz_data] = await Cart_Data.get(database,key);
                //const [biz_error,biz_data] = await Cart_Data.search(database,DataType.PRODUCT,search.filter,search.sort_by,search.parent_current,search.page_size);
                //const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.parent_current,search.page_size,option);
                //Log.w('data',biz_data);
                console.log('TEST-GET-SUCCESS');
                console.log('TEST-GET-END');
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("TEST-GET-DONE",cloud_error);
                }else{
                    console.log('TEST-GET-DATA-DONE');
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

