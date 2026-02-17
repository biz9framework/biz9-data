const series = require('async-series');
const {Type,App_Logic,Data_Logic,User_Logic,Cart_Logic,Order_Logic,Page_Logic} = require('./index');
const {Log,Num,Str,Obj} = require('biz9-utility');
const {Scriptz}= require('biz9-scriptz');

/* --- TEST CONFIG START --- */
//const ID='0';
const ID='f23c2372-df8e-4c09-a919-677fe32ba0bb';
const APP_ID='cool_bean';
const DATA_TYPE='dt_blank';
const URL="http://localhost:1901";
const biz9_config ={
    SERVICE_HOST_TYPE:'multiple',
    URL:'http://localhost:1901',
    APP_ID:APP_ID,
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

//9_connect
describe("connect", () => {
    it("_connect", () => {
        series([
            function(call) {
                console.log('CONNECT-BASE-START');
                // -- SEARCH START -- //
                //let search = Data_Logic.get_search(Type.DATA_USER,{},{},1,0,{cool:'bean'});
                //let search = Data_Logic.get_search(Type.DATA_USER,{},{},10,33,{field:{id:1,title:1}});
                //Log.w('11_search',search);
                // -- SEARCH END -- //


                // -- GET START -- //
                /*
                let user = Data_Logic.get(Type.DATA_USER,123,{test:true});
                let parent = Data_Logic.get(Type.DATA_PRODUCT,404,{test:true,user:user});
                let group = Data_Logic.get(Type.DATA_GROUP,123,{test:true,parent:parent});
                let image = Data_Logic.get(Type.DATA_IMAGE,0,{test:true,parent:group,user:user,count:2});
                //Log.w('11_parent',parent);
                Log.w('11_item',image);
                //Log.w('22_item',group);
                Log.w('parent',parent);
                */
                // -- GET END -- //


                // -- PAGE_SUB_VALUE_EDIT START -- //
                //let page_sub_value_edit = Page_Logic.get_page_sub_value_edit(Type.DATA_PAGE,Type.PAGE_SECTION_BODY);
                //Log.w('page_sub_value_edit',page_sub_value_edit);
                // -- PAGE_SUB_VALUE_EDIT END -- //
                // -- FAQ START -- //
                //let faq = Data_Logic.get(Type.DATA_FAQ,0,{test:true,count:5});
                //Log.w('faq',faq);
                // -- FAQ END -- //

                // -- GROUP START -- //
                /*
                let option = {groups:[Data_Logic.get_search_group({image:true})]};
                let parent = Data_Logic.get(Type.DATA_PRODUCT,0,option);
                Log.w('option',option);
                Log.w('parent',parent);
                */
                // -- GROUP END -- //



                // -- REVIEW START -- //
                //let review = Data_Logic.get(Type.DATA_REVIEW,0,{test:true,count:5,user:true});
                //Log.w('reviews',review);
                // -- REVIEW END -- //

                // -- PAGE START -- //
                // -->
                // - SubValue
                // -- parent_data_type
                // -- parent_id
                // -- title
                // -- value
                // -- title_url
                //let page_section = Page_Logic.get_page_section(Type.PAGE_SECTION_HEADER);
                //Log.w('page_section',page_section);
                //let page = Data_Logic.get(Type.DATA_PAGE,3,{blank:false,test:false,sub_value_count:1});
                //let page = Data_Logic.get(Type.DATA_PRODUCT,0,{blank:false,test:true,count:3,sub_value_count:1,title:'cool'});
                //let page = Data_Logic.get(Type.DATA_PRODUCT,3,{blank:true,test:true,count:2});
                //let sub_value = Data_Logic.get_sub_value(page.data_type,page.id,'my_title',{type:Type.SUB_VALUE_TITLE,value:'my_value1'});
                //Log.w('44_sub_value',sub_value);
                //Log.w('33_page',page);
                //Log.w('33_page',page[0]);
                //Log.w('44_page',page[0].sub_values);
                // -- PAGE END -- //
                // --
                //console.log('CONNECT-BASE-START');
                // -->
                // -- CART START -- //
                /*
                let user = Data_Logic.get(Type.USER,Num.get_id(),{test:true});
                let cart_product_1 = Data_Logic.get(Type.DATA_PRODUCT,Num.get_id(),{test:true});
                let cart_sub_item_product_1 = Data_Logic.get(Type.DATA_PRODUCT,Num.get_id(),{test:true});
                //let cart_sub_item_product_2 = Data_Logic.get(Type.DATA_PRODUCT,Num.get_id(),{test:true});
                // -- cart start //
                let cart = Cart_Logic.get(user.id,{cart_code:'CA'});
                // -- cart end //
                // -- cart item start //
                let cart_item_1 = Cart_Logic.get_cart_item(cart_product_1.data_type,cart_product_1.id,1,cart_product_1.cost,{cart_code:'CA'});
                cart_item_1.id = Num.get_id();
                // -- cart item sub item start //
                let cart_sub_item_1 = Cart_Logic.get_cart_sub_item(cart_item_1.id,Type.CART_SUB_TYPE_STANDARD,1,cart_sub_item_product_1.cost);
                // -- cart item sub item end //
                // -- bind start //
                cart_item_1.cart_sub_items.push(cart_sub_item_1);
                cart.cart_items.push(cart_item_1);
                cart = Cart_Logic.get_total(cart);
                // -- bind end //
                */
                // -- CART END -- //
                // -- ORDER START -- //
                // -- order start //
                //let order = Order_Logic.get(cart,{order_code:'OR'});
                let order_payment = Order_Logic.get_order_payment('123',Type.PAYMENT_METHOD_CASH,'1.00',{transaction_code:'TR'});
                Log.w('22_order_payment',order_payment);
                //Log.w('order',order);
                //Log.w('order_items',order.order_items[0]);
                // -- order end //
                // -- order item start //
                // -- order item end //

                // -- ORDER END -- //

                // -- LIST START -- //
                //let data_type = Data_Logic.get_data_type_by_type(Type.DATA_PRODUCT,{plural:true});
                //Log.w('my_data_type',data_type);

                // -- LIST END -- //

                // -->
                //let parent = Data_Logic.get_new(Type.DATA_PRODUCT,0);
                //let parent = Data_Logic.get_new(Type.DATA_PRODUCT,0,{test:true,count:3,blank:false,data:{field_1:'apple'}});
                // -->
                //let join = App_Logic.get_join({},'','',{});
                // -->
                //let data = Data_Logic.get(Type.DATA_BLANK,0,{test:true});
                //let data = Data_Logic.get(Type.DATA_PRODUCT,0,{test:true,count:1,parent:parent,data:{title:'cool',title_url:'cool'}});
                //let data = Data_Logic.get(Type.DATA_BLANK,0,{title:'cool bean',data:{field_1:'field_1',field_2:'field_2'}});
                //let data = Data_Logic.get(Type.DATA_BLANK,0,{title:'cool bean'});
                //let data = Data_Logic.get(Type.DATA_BLANK,0,{data:{field_1:'field_1',field_2:'field_2'}});
                //let data = Data_Logic.get(Type.DATA_BLANK,0,{test:true});
                // -->
                //
                //let parent = Data_Logic.get(Type.DATA_REVIEW,0,{test_blank:false,test:true,title:'cool',generate_title:true,parent:{data_type:Type.DATA_BLANK,id:2},data:{field_1:'cool1',field_2:'cool2'}});
                //let data_items = Type.get_order_statuses();
                // -->
                //let data_items = Type.get_app_links();
                // -->
                //let data = User_Logic.get_user_role_by_type(Type.USER_ROLE_USER);
                //Log.w('99_result_data',data.label);
                //Log.w('99_result_parent',parent);
                //Log.w('99_result_data_items',data_items);

                //Log.w('Title',Type.get_title(Type.ORDER_STATUS_NEW));
                //Log.w('Title 2',Type.get_title(Type.ORDER_STATUS_COMPLETE));
                //Log.w('Title 2',Field_Logic.get_field_value_title(Type.FIELD_VALUE_LIST,3,4,'cool'));
                //Log.w('item_list',item_list);
                //Log.w('bind_obj_list',App_Logic.bind_item_parent_user_list(item_list));
                //Log.w('countries',User_Logic.get_countries());

                //item.id = 333;
                //item.items = ['a','b'];
                //Log.w('bind_obj',App_Logic.bind_item_parent_user_obj(item,parent_item,user));
                //let stat = Stat_Logic.get_new(parent_data_type,parent_id,Type.STAT_VIEW,user_id,item);
                //Log.w('stat',stat);
                //Log.w('blog_post',Data_Logic.get(Type.DATA_BLOG_POST,0,{test:true,count:9}));
                console.log('CONNECT-BASE-END');
            }
        ], function(err) {
            console.log(err.message) // "another thing"
        })
    });
});


