const path = require('path');
const series = require('async-series');
const {DataItem,DataType,Url,Obj,BiZ_Url,Cat,Stock,Schedule,Storage,Business,Product,Service,Event,Template,Page,Category,Review,Blog_Post,Faq,Category_Url} = require('./index');
const {Log,Test,Number} = require('biz9-utility');
const {Scriptz}= require('biz9-scriptz');

/* --- TEST CONFIG START --- */
//const ID='0';
const ID='f23c2372-df8e-4c09-a919-677fe32ba0bb';
const APP_TITLE_ID='cool_bean';
const DATA_TYPE='dt_blank';
const URL="http://localhost:1901";
const biz9_config ={
    SERVICE_HOST_TYPE:'multiple',
    APP_TITLE_ID:APP_TITLE_ID,
    MONGO_IP:'0.0.0.0',
    MONGO_USERNAME_PASSWORD:'',
    MONGO_PORT_ID:"27019",
    MONGO_SERVER_USER:'admin',
    MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
    SSH_KEY:"",
    REDIS_URL:"0.0.0.0",
    REDIS_PORT_ID:"27019",
    PHOTO_URL:"http://localhost:1901/"
};
/* --- TEST DATA CONFIG END --- */

describe("connect", () => {
    it("_connect", () => {
        series([
            function(call) {
                console.log('GET-URL-START');
                let biz9_config = Scriptz.get_biz9_config({biz9_config_file:path.resolve('../../biz9_config')});
                //let action_url = 'test_get_url';
                //let params = '&myparam1=p1&myparam2=p2'
                let data_type = DataType.PRODUCT;
                let id = "123";
                //let cloud_url = BiZ_Url.get_item(biz9_config,data_type,id,"&cool=1");
                let cloud_url = Category_Url.get_page(biz9_config,'cool');
                Log.w('connect_url',cloud_url);
                console.log('GET-URL-SUCCESS');
                //call()
            },

            function(call) {
                console.log('CONNECT-START');

                /* --CONFIG--START */
                //let biz9_config = Scriptz.get_biz9_config({biz9_config_file:path.resolve('../../biz9_config')});
                //let cloud_url = Url.connect(biz9_config);
                /* --CONFIG--END */

                /* --PAGE--START */
                /*
                let page = Page.get_test({item_count:2,page_count:2,get_value:true,get_item:true,value_count:50})
                Log.w("Page",page);
                let page = Page.get_test({item_count:9,page_count:19,get_item:true,get_value:true})
                //let page = Page.get_test()
                Log.w("Page_section_1",page.section_1);
                Log.w("Page_section_1_section_1_section_1",page.section_1.section_1.section_1);
                */
                /* --PAGE--END */

                /* --BLOG_POST--START */
                //let blog_post_list=Blog_Post.get_test_list({category_count:5,blog_post_count:9,get_value:false,get_item:false});
                //let [category_list,blog_post_list]=Blog_Post.get_test_list_by_category({category_count:5,blog_post_count:9});
                //Log.w('blog_post_list',blog_post_list);
                //Log.w('category_list',category_list);

                //let blog_post = Blog_Post.get_test({item_count:9,blog_post_count:19,get_item:true,get_value:true})
                //let blog_post = Blog_Post.get_test()
                //Log.w('blog_post_list',blog_post_list);
                //Log.w("Blog_Post",blog_post);
                //Log.w("BLog_Post_section_1",blog_post.section_1);
                //Log.w("BLog_Post_section_1_section_1_section_1",blog_post.section_1.section_1.section_1);
                /* --BLOG_POST--END */

                /* --CATEGORY--START */
                //let category_list=Category.get_test_list({category_count:5,product_count:9,get_value:false,get_item:false});
                //Log.w('category_list',category_list);
                /* --CATEGORY--END */


                /* --PRODUCT--START */
                //let product_list=Product.get_test_list({category_count:5,product_count:9,get_value:false,get_item:false});
                //Log.w('product_list',product_list);
                //let [category_list,product_list]=Product.get_test_list_by_category({category_count:5,product_count:9});
                //Log.w('category_list',category_list);

                //let product = Product.get_test({item_count:9,product_count:19,get_item:true,get_value:true})
                //let product = Product.get_test()
               //Log.w("Product",product);
                //Log.w("Product_section_1",product.section_1);
                //Log.w("Product_section_1_section_1_section_1",product.section_1.section_1.section_1);
                /* --PRODUCT--END */

                /* --EVENT--START */
                //let event_list=Event.get_test_list({category_count:5,event_count:9,get_value:false,get_item:false});
                //let [category_list,event_list]=Event.get_test_list_by_category({category_count:5,event_count:9});
                //Log.w('event_list',event_list);
                //Log.w('category_list',category_list);
                /* --EVENT--END */

                /* --SERVICE--START */
                //let service_list=Service.get_test_list({category_count:5,service_count:9,get_value:false,get_item:false});
                //let [category_list,service_list]=Service.get_test_list_by_category({category_count:5,service_count:9});
                //Log.w('service_list',service_list);
                //Log.w('category_list',category_list);
                /*
                let service = Service.get_test({item_count:9,service_count:19,get_item:true,get_value:true})
                //let service = Service.get_test()
                Log.w("Service",service);
                Log.w("Service_section_1",service.section_1);
                Log.w("Service_section_1_section_1_section_1",service.section_1.section_1.section_1);
                */
                /* --SERVICE--END */

                /* --SERVICE--START */
                /*
                let event = Event.get_test({item_count:9,event_count:19,get_item:true,get_value:true})
                //let service = Service.get_test()
                Log.w("Event",event);
                Log.w("Event_section_1",event.section_1);
                Log.w("Event_section_1_section_1_section_1",event.section_1.section_1.section_1);
                */
                /* --SERVICE--END */


                /* --FAQ--START */
                //Log.w("FAQ",Faq.get_test());
                //Log.w("FAQ List",Faq.get_test_list());
                /*
                let review_list = Review.get_test_list({review_count:3,get_item:true})
                Log.w("Review List",review_list);
                */
                /* --FAQ--END */


                /* --REVIEW--START */
                //Log.w("Review",Review.get_test());
                //Log.w("Review List",Review.get_test_list());
                /*
                let review_list = Review.get_test_list({review_count:3,get_item:true})
                Log.w("Review List",review_list);
                */
                /* --REVIEW--END */





                /* --BUSINESS--START */
                //Log.w("Business",Business.get_new("Business " + Number.get_id()));
                /* --BUSINESS--END */



                console.log('CONNECT-SUCCESS');
                //call()
            },

            function(call) {
                console.log('GET-FULL-ITEM-START');
                let item = DataItem.get_new(DataType.BLANK,0);
                let parent_item = DataItem.get_new(DataType.BLOG_POST,2);
                let top_item = DataItem.get_new(DataType.PRODUCT,3);
                let options={title:'cool_bean'};
                console.log(DataItem.get_new_full_item(item,parent_item,top_item,options));
                console.log('GET-FULL-ITEM-END');
                //call();
            },

            function(call) {
                console.log('GET-BiZ-Url-Item-Get-Item-START');
                let biz9_config = Scriptz.get_biz9_config({biz9_config_file:path.resolve('../../biz9_config')});
                //let item = DataItem.get_new(DataType.BLANK,0,{title:'title',apple:'butter'});
                //Log.w('item',item);
                //let cloud_url = BiZ_Url.get_item(biz9_config,item.data_type,item.id);
                let title_url = 'primary';
                //let cloud_url = BiZ_Url.get_template(biz9_config,title_url);
                //let cloud_url = BiZ_Url.get_page(biz9_config,title_url);
                let business = {address_1:"addrress 1", address_2:"address 2",city:"city",state:"Geogia",zip:30003};
                //Log.w('kusiness',Business.get_full_address(business));
                //Log.w('connect_url',cloud_url);
                console.log('GET-BiZ-Url-Item-Get-Item-SUCCESS');
                //call()
            },


            function(call) {
                console.log('GET_START_STORAGE-START');
                Log.w('storage-start',Storage.set(Number.get_id()));
                console.log('GET_START_STORAGE-END');
                //call();
            },

            function(call) {
                console.log('GET_START_DATE_TIME-START');
                Log.w('get_start_date_time',Schedule.get_start_date_time({date:new Date(),time: new Date()}));
                console.log('GET_START_DATE_TIME-END');
                //call();
            },
            function(call) {
                console.log('GET_START_DATE_TIME_BY_LIST-START');
                event_list = [
                    {date:new Date(),time: new Date()},
                    {date:new Date(),time: new Date()},
                    {date:new Date(),time: new Date()}
                ];
                Log.w('get_event_list',Schedule.get_start_date_time_by_list(event_list));
                console.log('GET_START_DATE_TIME_BY_LIST-END');
                //call();
            },

            function(call) {
                console.log('GET-ALL-STOCK-LIST-START');
                Log.w('get_event_list',Stock.get_event_stock_list());
                Log.w('get_product_list',Stock.get_product_stock_list());
                Log.w('get_service_list',Stock.get_service_stock_list());
                console.log('GET-ALL-STOCK-LIST-SUCCESS');
                //call();
            },

            function(call) {
                console.log('SET-ITEM-BIZ-BY-LIST-START');
                let item_test_list = [];
                let item_test = Test.get_item('dt_blank',0);
                item_test.cost = String(Number.get_id())+'.55';
                item_test.old_cost = String(Number.get_id())+'.20';
                item_test.title ='_title_'+Number.get_id();

                item_test_list.push(item_test);

                let item_test_1 = Test.get_item('dt_blank',0);
                item_test_1.cost = '5.55';
                item_test_1.old_cost = '9.55';
                item_test_1.title ='_title_'+Number.get_id();

                item_test_list.push(item_test_1);

                let item_list_biz = DataItem.get_biz_by_list(biz9_config,item_test_list,{get_date:false,get_count:false,get_biz_map:false,get_money:true});
                console.log(item_list_biz);
                console.log('SET-ITEM-BIZ-BY-LIST-SUCCESS');
                //call();
            },
            function(call) {
                console.log('SET-ITEM-BIZ-START');
                let item_test = Test.get_item('dt_blank',0);
                item_test.photofilename='abc.png';
                item_test.cost = '5.55';
                item_test.old_cost = '9.55';
                item_test.field_1 = 'my_field_1';
                item_test.value_1 = 'my_value_1';
                item_test.field_2 = 'my_field_2';
                item_test.value_2 = 'my_value_2';
                item_test.field_3 = 'my_field_3';
                item_test.value_3 = 'my_value_3';
                let item_biz = DataItem.get_biz(biz9_config,item_test,{get_date:false,get_count:false,get_biz_map:false,get_money:true});
                console.log(item_biz);
                console.log('SET-ITEM-BIZ-SUCCESS');
                call();
            },

            /*
        function(call) {
                console.log('SET_CATEGORY_DROP_DOWN_LIST-START');
                let biz9_config = Scriptz.get_biz9_config({biz9_config_file:path.resolve('../../biz9_config')});
                let category_list = [];
                category_list.push({data_type:DataType.BLANK,id:0,title:Number.get_id()});
                category_list.push({data_type:DataType.BLANK,id:0,title:Number.get_id()});
                category_list.push({data_type:DataType.BLANK,id:0,title:Number.get_id()});
                Log.w('cat',Cat.set_category_drop_down_list(category_list));
    //let cloud_url = CMS.get_new_query_item_by_item(item);
    //Log.w('connect_url',cloud_url);
    //console.log('SET_CATEGORY_DROP_DOWN_LIST-END');
    //call()
            },




        function(call) {
                console.log('GET-NEW-QUERY-ITEM-BY-ITEM-START');
                let biz9_config = Scriptz.get_biz9_config({biz9_config_file:path.resolve('../../biz9_config')});
                let item = DataItem.get_new(DataType.BLANK,0);
                item.parent_id = Number.get_id();
                item.parent_data_type = DataType.BLANK;
                item.top_id = Number.get_id();
                item.top_data_type = DataType.BLANK;
                Log.w('item',item);
//let cloud_url = CMS.get_new_query_item_by_item(item);
//Log.w('connect_url',cloud_url);
                console.log('GET-NEW-QUERY-ITEM-BY-ITEM-SUCCESS');
//call()
            },


            function(call) {
                console.log('GET-BiZ-Full-Url-Item-Get-Item-START');
                let biz9_config = Scriptz.get_biz9_config({biz9_config_file:path.resolve('../../biz9_config')});
                let item = DataItem.get_new(DataType.BLANK,0);
                let parent_item = DataItem.get_new(DataType.BLANK,0);
                let top_item = DataItem.get_new(DataType.BLANK,0);
                Log.w('item',item);
                let cloud_url = BiZ_Url.get_full_item(biz9_config,item,parent_item,top_item);
                Log.w('connect_url',cloud_url);
                console.log('GET-BiZ-Full-Url-Item-Get-Item-SUCCESS');
//call()
            },


                       function(call) {
                console.log('GET-BIZ9-GET-DATA-TYPE-START');
                console.log(DataType.get_data_type_title(DataType.CART_ITEM));
                console.log(DataType.ID);
                console.log(DataType.TITLE);
                console.log('GET-BIZ9-GET-DATA-TYPE-END');
                call();
            },
            function(call) {
                console.log('GET-BIZ9-CONFIG-FILE-START');
                let biz9_config = Scriptz.get_biz9_config({biz9_config_file:path.resolve('../../biz9_config')});
                Log.w('APP_TITLE_ID',biz9_config.APP_TITLE_ID);
                Log.w('APP_TITLE',biz9_config.TITLE);
                Log.w('URL',biz9_config.URL);
                console.log('----------------------');
                Log.w('DATA_TYPE',DataType.BLANK);
                Log.w('BLOG_POST',DataType.BLOG_POST);
                Log.w('SERVICE',DataType.SERVICE);
                console.log('----------------------');
                console.log('GET-BIZ9-CONFIG-FILE-SUCCESS');
                call()
            },
           function(call) {
                console.log('GET_URL-UPDATE-ITEM-START');
                let biz9_config = Scriptz.get_biz9_config({biz9_config_file:path.resolve('../../biz9_config')});
                let data_type = 'dt_blank';
                let id = 0;
                let cloud_url = Url.update_item(biz9_config,data_type,id);
                Log.w('get_url_update_item',cloud_url);
                console.log('GET_URL-UPDATE-ITEM-SUCCESS');
                call()
            },
            function(call) {
                console.log('GET_URL-GET-ITEM-START');
                let biz9_config = Scriptz.get_biz9_config({biz9_config_file:path.resolve('../../biz9_config')});
                let data_type = 'dt_blank';
                let id = 0;
                let cloud_url = Url.get_item(biz9_config,data_type,id);
                Log.w('get_url_get_item',cloud_url);
                console.log('GET_URL-GET-ITEM-SUCCESS');
                call()
            },
            function(call) {
                console.log('GET_URL-DELETE-ITEM-START');
                let biz9_config = Scriptz.get_biz9_config({biz9_config_file:path.resolve('../../biz9_config')});
                let data_type = 'dt_blank';
                let id = 0;
                let cloud_url = Url.delete_item(biz9_config,data_type,id);
                Log.w('get_url_delete_item',cloud_url);
                console.log('GET_URL-DELETE-ITEM-SUCCESS');
                call()
            },
            function(call) {
                console.log('GET_URL-GET-LIST-ITEM-START');
                let biz9_config = Scriptz.get_biz9_config({biz9_config_file:path.resolve('../../biz9_config')});
                let data_type = 'dt_blank';
                let cloud_url = Url.get_list(biz9_config,data_type);
                Log.w('get_url_get_list',cloud_url);
                console.log('GET_URL-GET-LIST-ITEM-SUCCESS');
                call()
            },
            function(call) {
                console.log('GET_URL-DELETE-LIST-ITEM-START');
                let biz9_config = Scriptz.get_biz9_config({biz9_config_file:path.resolve('../../biz9_config')});
                let data_type = 'dt_blank';
                let cloud_url = Url.delete_list(biz9_config,data_type);
                Log.w('get_url_delete_list_item',cloud_url);
                console.log('GET_URL-DELETE-LIST-ITEM-SUCCESS');
                call()
            },
            function(call) {
                console.log('GET_URL-UPDATE-LIST-ITEM-START');
                let biz9_config = Scriptz.get_biz9_config({biz9_config_file:path.resolve('../../biz9_config')});
                let data_type = 'dt_blank';
                let cloud_url = Url.update_list(biz9_config,data_type);
                Log.w('get_url_update_list_item',cloud_url);
                console.log('GET_URL-UPDATE-LIST-ITEM-SUCCESS');
                call()
            },
            function(call) {
                console.log('GET_FILTER-OBJECT-START');
                let data_type = 'dt_blank';
                let filter = {data_type:'dt_blank'};
                let sort_by = {title:-1};
                let page_current = 0;
                let page_size = 15;
                let filter_obj = Obj.get_filter(data_type,filter,sort_by,page_current,page_size);
                Log.w('get_filter_obj',filter_obj);
                console.log('GET_FILTER-OBJECT-SUCCESS');
                call()
            },
            function(call) {
                console.log('GET-NEW-ITEM-START');
                var new_item = DataItem.get_new(DATA_TYPE,0);
                console.log(new_item);
                console.log('GET-NEW-ITEM-SUCCESS');
                call()
            },
           function(call) {
                console.log('GET_URL-BIZ-ITEM-START');
                let biz9_config = Scriptz.get_biz9_config({biz9_config_file:path.resolve('../../biz9_config')});
                let data_type = 'dt_blank';
//let cloud_url = Url.get_biz_item(biz9_config,data_type,ID);
                let cloud_url = Url.delete_biz_item(biz9_config,data_type,ID);
                Log.w('get_url_biz_item',cloud_url);
                console.log('GET_URL-BIZ-ITEM-SUCCESS');
                call()
            },
           */
    function(call) {
        // never happens, because "second thing"
        // passed an error to the done() callback
    }
        ], function(err) {
            console.log(err.message) // "another thing"
        })
    });
});


