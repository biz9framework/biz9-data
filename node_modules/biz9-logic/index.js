/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Logic-JS
*/
const moment = require('moment');
const { get_new_item_main,get_data_config_main,get_cloud_url_main,get_biz_item_main,get_cloud_filter_obj_main,get_new_full_item_main } = require('./main');
const { Log,Str,DateTime,Num,Obj } = require('biz9-utility');
class Message {
	static SUCCESS="Success";
	static CONFIRM="Are You Sure?";
	static USER_LOGIN_SUCCESS="Login Success";
	static USER_LOGIN_BAD="Login Incorrect";
	static USER_REGISTER_SUCCESS="Register Success";
	static USER_REGISTER_BAD="Register Fail";
	static USER_EMAIL_BAD="Please Enter A Valid Email.";
	static USER_EMAIL_NEW_CONFIRM_BAD="The New and Confirm Email Dont Match.";
	static USER_PASSWORD_NEW_CONFIRM_BAD="The New and Confirm Password Dont Match.";
	static USER_PASSWORD_BAD="Please Enter A Valid Password.";
	static USER_EMAIL_NOT_UNIQUE="Email Not Availble. Please Choose Another.";
	static USER_USERNAME_BAD="Please Enter A Valid Username.";
	static USER_USERNAME_NOT_UNIQUE="Username Not Availble. Please Choose Another.";
	static ITEM_TITLE_BAD="Please Enter A Valid Title.";
	static DATA_NOT_FOUND="Data Not Found.";
	static SYSTEM_NOT_FOUND="System Not Found.";
	static FAVORITE_ADD_SUCCESS="Favorite Add Success.";
	static FAVORITE_REMOVE_SUCCESS="Favorite Remove Success.";
	static FAVORITE_USER_LOGIN="Please Login To Add Favorite.";
	static REVIEW_ADD_SUCCESS="Review Add Success.";
	static REVIEW_REMOVE_SUCCESS="Review Remove Success.";
	static REVIEW_USER_LOGIN="Please Login To Add Review.";
}
class Item_Logic {
	static get_new = (title,data_type,option)=>{
		option = option ? option : {};
		const item = DataItem.get_new(data_type,0,{title:title,title_url:Str.get_title_url(title),setting_visible:"1"});
		return item;
	};

	static bind_child_parent_obj = (child_obj,parent_obj)=>{
		for(const prop in parent_obj) {
			child_obj['parent_'+prop] = parent_obj[prop];
		}
    	return child_obj;
	};
	static get_test = (title,data_type,id,option)=>{
		data_type = data_type ? data_type : DataType.BLANK;
		id = id ? id : 0;
		option = Field_Logic.get_option(data_type,option?option:{});
		let item = DataItem.get_new(data_type,0,Field_Logic.get_test(title,option));
		if(option.get_item){
			item.items = Sub_Item_Logic.get_test_list(item,item,option);
			item = Sub_Item_Logic.bind_parent_child_list(item,item.items);
		}
		return item;
	}
static get_test_list = (data_type,option) =>{
		option = Field_Logic.get_option(data_type,option?option:{});
		let item_list = [];
		for(let a=0;a<parseInt(option.item_count)+1;a++){
			item_list.push(Item_Logic.get_test("Item " +String(parseInt(a+1)),data_type,option));
		}
		return item_list;
	}
}
class Title {
	//page
	static PAGE_ABOUT='About';
	static PAGE_BLOG_POST='Blog Post';
	static PAGE_BLOG_POST_HOME='Blog Post Home';
	static PAGE_CONTACT='Contact';
	static PAGE_EVENT='Event';
	static PAGE_EVENT_HOME='Event Home';
	static PAGE_FAQ='FAQs';
	static PAGE_GALLERY='Gallery';
	static PAGE_GALLERY_HOME='Gallery Home';
	static PAGE_HOME='Home';
	static PAGE_PRODUCT='Product';
	static PAGE_PRODUCT_HOME='Product Home';
	static PAGE_SERVICE='Service';
	static PAGE_SERVICE_HOME='Service Home';
	static PAGE_REVIEW_HOME='Review Home';
	//order
	static ORDER_NUMBER="OR-";
	static ORDER_TRANSACTION_ID="TR-";
	static ORDER_STATUS_CANCELLED="Cancelled";
	static ORDER_STATUS_COMPLETE="Complete";
	static ORDER_STATUS_NEW="New";
	static ORDER_STATUS_OPEN="Open";
	static ORDER_STATUS_ON_HOLD="On Hold";
	static ORDER_STATUS_RETURNED="Returned";
	static ORDER_PAYMENT_PLAN_NEW="New";
	static ORDER_PAYMENT_PLAN_1="1 Payment";
	static ORDER_PAYMENT_PLAN_2="2 Payments";
	static ORDER_PAYMENT_PLAN_3="3 Payments";
	static ORDER_PAYMENT_PLAN_4="4 Payments";
	static ORDER_PAYMENT_METHOD_STRIPE="Stripe";
	static ORDER_PAYMENT_METHOD_CASH="Cash";
	static ORDER_PAYMENT_METHOD_OTHER="Other";
	static ORDER_PAYMENT_METHOD_TEST="Test";
	//cart
	static CART_NUMBER="CA-";
	//data_type
	static DATA_TYPE_BLOG_POST="Blog Post";
	static DATA_TYPE_CATEGORY="Category";
	static DATA_TYPE_CONTENT="Content";
	//role
	static USER_ROLE_SUPER_ADMIN='Super Admin';
	static USER_ROLE_ADMIN='Admin';
	static USER_ROLE_MANAGER='Manager';
	static USER_ROLE_USER='User';
	static USER_ROLE_GUEST='Guest';
	//app
	static APP_MOBILE="Mobile";
	static APP_WEBSITE="Website";
	static APP_LANDING="Landing";
	//social
	static SOCIAL_URL_FACEBOOK="https://facebook.com/";
	static SOCIAL_URL_TWITTER="https://twitter.com/";
	static SOCIAL_URL_INSTAGRAM="https://instagram.com/";
	static SOCIAL_URL_YOUTUBE="https://youtube.com/";
	static SOCIAL_URL_LINKEDIN="https://linkedin.com/";
	//str
	static CATEGORY='Category';
	static DESCRIPTION='Description';
	static TYPE='Type';
}
class Demo_Logic {
	static get_new_type = (title,option) => {
		title = !Str.check_is_null(title)?title:Title.TYPE+" " +Num.get_id(999);
		option = option ? option : {get_category:false,category_count:6,categorys:'',category_data_type:DataType.BLANK,get_item:false,items:'',item_data_type:DataType.BLANK,item_count:6}; const item = Item_Logic.get_new(title,DataType.TYPE); //category
		if(option.get_category){
			item.categorys = [];
			let category_title_list = [];
			if(option.categorys){
				category_title_list = option.categorys.split(',');
				option.category_count = category_title_list.length;
			}else{
				if(!option.category_count){
					option.category_count = 1;
				}
				for(let a = 1;a<parseInt(option.category_count)+1;a++){
					category_title_list.push(Title.CATEGORY+" "+a);
				}
			}
			category_title_list.forEach(cat_item => {
				item.categorys.push(Category_Logic.get_new(cat_item,item.title,option.category_data_type));
			});
		}
		//item
		if(option.get_item){
			let full_item_list = [];

			let item_title_list = [];
			if(option.items){
				item_title_list = option.items.split(',');
				option.item_count = item_title_list.length;
			}else{
					for(let b = 1;b<parseInt(option.item_count)+1;b++){
						item_title_list.push(title+" " +Type.get_title(item.categorys[Num.get_id(option.category_count)].category)+" "+ b);
					}
			}
			for(const child_item_title of item_title_list){
				const cat_item = item.categorys[Num.get_id(option.category_count)];
					if(!cat_item.items){
						cat_item.items = [];
					}
					let child_item = Item_Logic.get_new(child_item_title,option.item_data_type);
						if(option.item_data_type == DataType.PRODUCT){
							child_item.cost = Num.get_id(9000);
							child_item.old_cost = Num.get_id(90000);
						}
						child_item.type = cat_item.type;
						child_item.tag = "Tag "+ Num.get_id() + ", Tag "+Num.get_id() + ", Tag "+ Num.get_id();
						child_item.category = cat_item.title;
						child_item.description =Title.DESCRIPTION+" "+ String(Num.get_id());
						child_item.note = Field_Logic.get_test_note(),
						cat_item.items.push(child_item);
						full_item_list.push(child_item);
				}
		}
		return item;
	};
}
class Type {
	//app_status
	static APP_ENV_TEST='test';
	static APP_ENV_STAGE='stage';
	static APP_ENV_PROD='prod';
	static APP_LINK_TYPE_WEBSITE='website';
	static APP_LINK_TYPE_GOOGLE_PLAY='google_play';
	static APP_LINK_TYPE_APPLE_STORE='apple_store';
	static APP_LINK_TYPE_CMS='cms';
	//field
	static ASC='asc';
	static BLANK='blank';
	static CART_ITEM_LIST='cart_item_list';
	static CART_SUB_ITEM_LIST='cart_sub_item_list';
	static DATA_TYPE='data_type';
	static DESC='desc';
	static DATE_CREATE='date_create';
	static DATE_SAVE='date_save';
	static ID='id';
	static OBJ='obj';
	static LIST='list';
	static COUNT='count';
	static N_A='n/a';
	static USER='user';
	static USER_ID='user_id';
	static CART_ITEM_LIST='cart_item_list';
	static CART_SUB_ITEM_LIST='cart_sub_item_list';
	static ORDER_ITEM_LIST='order_item_list';
	static ORDER_SUB_ITEM_LIST='order_sub_item_list';
	static PARENT_ID='parent_id';
	static PARENT_ITEM='parent_item';
	static PARENT_DATA_TYPE='parent_data_type';
	static SETTING_VISIBLE='setting_visible';
	static SOURCE='source';
	static SOURCE_ID='source_id';
	static SOURCE_PARENT_ID='source_parent_id';
	static TITLE='title';
	static TITLE_URL='title_url';
	//page
	static PAGE_ABOUT='about';
	static PAGE_CONTACT='contact';
	static PAGE_HOME='home';
	static PAGE_FAQ='faq';
	static PAGE_BLOG_POST='blog_post';
	static PAGE_BLOG_POST_HOME='blog_post_home';
	static PAGE_BLOG_POST_SEARCH='blog_post_search';
	static PAGE_EVENT='event';
	static PAGE_EVENT_HOME='event_home';
	static PAGE_EVENT_SEARCH='event_search';
	static PAGE_GALLERY='gallery';
	static PAGE_GALLERY_HOME='gallery_home';
	static PAGE_GALLERY_SEARCH='gallery_search';
	static PAGE_PRODUCT='product';
	static PAGE_PRODUCT_HOME='product_home';
	static PAGE_PRODUCT_SEARCH='product_search';
	static PAGE_REVIEW_HOME='review_home';
	static PAGE_SERVICE='service';
	static PAGE_SERVICE_HOME='service_home';
	static PAGE_SERVICE_SEARCH='service_search';
	//stat
	static STAT_CART='cart_post';
	static STAT_CART_ITEM='cart_item_post';
	static STAT_CART_SUB_ITEM='cart_sub_item_post';
	static STAT_FAVORITE='favorite_post';
	static STAT_LIKE='like_post';
	static STAT_LOGIN='login_post';
	static STAT_ORDER='order_post';
	static STAT_ORDER_ITEM='order_item_post';
	static STAT_ORDER_SUB_ITEM='order_sub_item_post';
	static STAT_ORDER_PAYMENT='order_payment_post';
	static STAT_REGISTER='register_post';
	static STAT_VIEW='view_post';
	static STAT_REVIEW='review_post';
	//template
	static TEMPLATE_PRIMARY='primary';
	static TEMPLATE_HEADER='header';
	static TEMPLATE_NAVIGATION='navigation';
	static TEMPLATE_BODY='body';
	static TEMPLATE_FOOTER='footer';
	//field_value
	static FIELD_VALUE_TEXT="text";
	static FIELD_VALUE_NOTE="note";
	static FIELD_VALUE_IMAGE="image";
	static FIELD_VALUE_LIST="list";
	//user_role
	static USER_ROLE_SUPER_ADMIN='super_admin';
	static USER_ROLE_ADMIN='admin';
	static USER_ROLE_MANAGER='manager';
	static USER_ROLE_USER='user';
	static USER_ROLE_GUEST='guest';
	//data_source
	static DATA_SOURCE_CACHE="cache";
	static DATA_SOURCE_DATABASE="database";
	static DATA_SOURCE_SERVER="server";
	static DATA_SOURCE_NOT_FOUND="not_found";
	//env
	static ENV_TEST="test";
	static ENV_STAGE="stage";
	static ENV_PRODUCTION="production";
	//size
	static IMAGE_SIZE_THUMB="thumb";
	static IMAGE_SIZE_MID="mid";
	static IMAGE_SIZE_LARGE="large";
	static IMAGE_SIZE_ORIGINAL="original";
	static IMAGE_SIZE_SQUARE_THUMB="squre_thumb";
	static IMAGE_SIZE_SQUARE_MID="squre_mid";
	static IMAGE_SIZE_SQUARE_LARGE="squre_large";
	//re_size
	static IMAGE_RESIZE_NORMAL="normal";
	static IMAGE_RESIZE_SQUARE="squre";
	static IMAGE_RESIZE_NONE="none";
	//order
	static ORDER_STATUS_NEW="new";
	static ORDER_STATUS_OPEN="open";
	static ORDER_STATUS_COMPLETE="complete";
	static ORDER_STATUS_RETURNED="returned";
	static ORDER_STATUS_ON_HOLD="on_hold";
	static ORDER_STATUS_CANCELLED="cancelled";
	static get_order_status_list(){
		return [
			{value:Type.ORDER_STATUS_NEW,label:Title.ORDER_STATUS_NEW},
			{value:Type.ORDER_STATUS_OPEN,label:Title.ORDER_STATUS_OPEN},
			{value:Type.ORDER_STATUS_COMPLETE,label:Title.ORDER_STATUS_COMPLETE},
			{value:Type.ORDER_STATUS_RETURNED,label:Title.ORDER_STATUS_RETURNED},
			{value:Type.ORDER_STATUS_ON_HOLD,label:Title.ORDER_STATUS_ON_HOLD},
			{value:Type.ORDER_STATUS_CANCELLED,label:Title.ORDER_STATUS_CANCELLED},
		];
	};
	static get_user_role_list(){
		return [
			{value:Type.USER_ROLE_ADMIN,label:Title.USER_ROLE_ADMIN},
			{value:Type.USER_ROLE_MANAGER,label:Title.USER_ROLE_MANAGER},
			{value:Type.USER_ROLE_USER,label:Title.USER_ROLE_USER},
			{value:Type.USER_ROLE_GUEST,label:Title.USER_ROLE_GUEST},
		];
	};
	static get_page_list(){
		return [
			{value:Type.PAGE_ABOUT,label:Title.PAGE_ABOUT,url:Url.PAGE_ABOUT},
			{value:Type.PAGE_BLOG_POST,label:Title.PAGE_BLOG_POST,url:Url.PAGE_BLOG_POST},
			{value:Type.PAGE_BLOG_POST_HOME,label:Title.PAGE_BLOG_POST_HOME,url:Url.PAGE_BLOG_POST_HOME},
			{value:Type.PAGE_CONTACT,label:Title.PAGE_CONTACT,label:Title.PAGE_CONTACT,url:Url.PAGE_CONTACT},
			{value:Type.PAGE_EVENT,label:Title.PAGE_EVENT,url:Url.PAGE_EVENT},
			{value:Type.PAGE_EVENT_HOME,label:Title.PAGE_EVENT_HOME,url:Url.PAGE_EVENT_HOME},
			{value:Type.PAGE_FAQ,label:Title.PAGE_FAQ,url:Url.PAGE_FAQ},
			{value:Type.PAGE_HOME,label:Title.PAGE_HOME,url:Url.PAGE_HOME},
			{value:Type.PAGE_GALLERY,label:Title.PAGE_GALLERY,url:Url.PAGE_GALLERY},
			{value:Type.PAGE_GALLERY_HOME,label:Title.PAGE_GALLERY_HOME,url:Url.PAGE_GALLERY_HOME},
			{value:Type.PAGE_PRODUCT,label:Title.PAGE_PRODUCT,url:Url.PAGE_PRODUCT},
			{value:Type.PAGE_PRODUCT_HOME,label:Title.PAGE_PRODUCT_HOME,url:Url.PAGE_PRODUCT_HOME},
			{value:Type.PAGE_REVIEW_HOME,label:Title.PAGE_REVIEW_HOME,url:Url.PAGE_REVIEW_HOME},
			{value:Type.PAGE_SERVICE,label:Title.PAGE_SERVICE,url:Url.PAGE_SERVICE},
			{value:Type.PAGE_SERVICE_HOME,label:Title.PAGE_SERVICE_HOME,url:Url.PAGE_SERVICE_HOME},
		];
	};
	static get_stat_type_list = () =>{
		return [
			{title:Type.get_title(Type.STAT_CART),type:Type.STAT_CART,label:Type.get_title(Type.STAT_CART),value:Type.STAT_CART},
			{title:Type.get_title(Type.STAT_CART_ITEM),type:Type.STAT_CART_ITEM,label:Type.get_title(Type.STAT_CART_ITEM),value:Type.STAT_CART_ITEM},
			{title:Type.get_title(Type.STAT_CART_SUB_ITEM),type:Type.STAT_CART_SUB_ITEM,label:Type.get_title(Type.STAT_CART_SUB_ITEM),value:Type.STAT_CART_SUB_ITEM},
			{title:Type.get_title(Type.STAT_FAVORITE),type:Type.STAT_FAVORITE,label:Type.get_title(Type.STAT_FAVORITE),value:Type.STAT_FAVORITE},
			{title:Type.get_title(Type.STAT_LIKE),type:Type.STAT_LIKE,label:Type.get_title(Type.STAT_LIKE),value:Type.STAT_LIKE},
			{title:Type.get_title(Type.STAT_LOGIN),type:Type.STAT_LOGIN,label:Type.get_title(Type.STAT_LOGIN),value:Type.STAT_LOGIN},
			{title:Type.get_title(Type.STAT_ORDER),type:Type.STAT_ORDER,label:Type.get_title(Type.STAT_ORDER),value:Type.STAT_ORDER},
			{title:Type.get_title(Type.STAT_ORDER_ITEM),type:Type.STAT_ORDER_ITEM,label:Type.get_title(Type.STAT_ORDER_ITEM),value:Type.STAT_ORDER_ITEM},
			{title:Type.get_title(Type.STAT_ORDER_SUB_ITEM),type:Type.STAT_ORDER_SUB_ITEM,label:Type.get_title(Type.STAT_ORDER_SUB_ITEM),value:Type.STAT_ORDER_ITEM},
			{title:Type.get_title(Type.STAT_ORDER_PAYMENT),type:Type.STAT_ORDER_PAYMENT,label:Type.get_title(Type.STAT_ORDER_PAYMENT),value:Type.STAT_ORDER_PAYMENT},
			{title:Type.get_title(Type.STAT_REGISTER),type:Type.STAT_REGISTER,label:Type.get_title(Type.STAT_REGISTER),value:Type.STAT_REGISTER},
			{title:Type.get_title(Type.STAT_REVIEW),type:Type.STAT_REVIEW,label:Type.get_title(Type.STAT_REVIEW),value:Type.STAT_REVIEW},
			{title:Type.get_title(Type.STAT_VIEW),type:Type.STAT_VIEW,label:Type.get_title(Type.STAT_VIEW),value:Type.STAT_VIEW},
		]
	};
	static get_data_type_list = () =>{
		return [
			{title:Type.get_title(DataType.BLOG_POST),type:DataType.BLOG_POST,label:Type.get_title(DataType.BLOG_POST),value:DataType.BLOG_POST},
			{title:Type.get_title(DataType.CATEGORY),type:DataType.CATEGORY,label:Type.get_title(DataType.CATEGORY),value:DataType.CATEGORY},
			{title:Type.get_title(DataType.CONTENT),type:DataType.CONTENT,label:Type.get_title(DataType.CONTENT),value:DataType.CONTENT},
			{title:Type.get_title(DataType.EVENT),type:DataType.EVENT,label:Type.get_title(DataType.EVENT),value:DataType.EVENT},
			{title:Type.get_title(DataType.FAQ),type:DataType.FAQ,label:Type.get_title(DataType.FAQ),value:DataType.FAQ},
			{title:Type.get_title(DataType.GALLERY),type:DataType.GALLERY,label:Type.get_title(DataType.GALLERY),value:DataType.GALLERY},
			{title:Type.get_title(DataType.USER),type:DataType.USER,label:Type.get_title(DataType.USER),value:DataType.USER},
			{title:Type.get_title(DataType.PAGE),type:DataType.PAGE,label:Type.get_title(DataType.PAGE),value:DataType.PAGE},
			{title:Type.get_title(DataType.PRODUCT),type:DataType.PRODUCT,label:Type.get_title(DataType.PRODUCT),value:DataType.PRODUCT},
			{title:Type.get_title(DataType.SERVICE),type:DataType.SERVICE,label:Type.get_title(DataType.SERVICE),value:DataType.SERVICE}
		]
	};
	static get_type_list = () =>{
		return [
			{title:Type.get_title(DataType.BLOG_POST),type:DataType.BLOG_POST,label:Type.get_title(DataType.BLOG_POST),value:DataType.BLOG_POST},
			{title:Type.get_title(DataType.CATEGORY),type:DataType.CATEGORY,label:Type.get_title(DataType.CATEGORY),value:DataType.CATEGORY},
			{title:Type.get_title(DataType.CONTENT),type:DataType.CONTENT,label:Type.get_title(DataType.CONTENT),value:DataType.CONTENT},
			{title:Type.get_title(DataType.EVENT),type:DataType.EVENT,label:Type.get_title(DataType.EVENT),value:DataType.EVENT},
			{title:Type.get_title(DataType.GALLERY),type:DataType.GALLERY,label:Type.get_title(DataType.GALLERY),value:DataType.GALLERY},
			{title:Type.get_title(DataType.USER),type:DataType.USER,label:Type.get_title(DataType.USER),value:DataType.USER},
			{title:Type.get_title(DataType.PAGE),type:DataType.PAGE,label:Type.get_title(DataType.PAGE),value:DataType.PAGE},
			{title:Type.get_title(DataType.PRODUCT),type:DataType.PRODUCT,label:Type.get_title(DataType.PRODUCT),value:DataType.PRODUCT},
			{title:Type.get_title(DataType.SERVICE),type:DataType.SERVICE,label:Type.get_title(DataType.SERVICE),value:DataType.SERVICE},
			{title:Type.get_title(DataType.TYPE),type:DataType.TYPE,label:Type.get_title(DataType.TYPE),value:DataType.TYPE}
		]
	};
	static get_app_environment_list = () =>{
		return [
			{title:Type.get_title(Type.APP_ENV_TEST),type:Type.APP_ENV_TEST,label:Type.get_title(Type.APP_ENV_TEST),value:Type.APP_ENV_TEST},
			{title:Type.get_title(Type.APP_ENV_STAGE),type:Type.APP_ENV_STAGE,label:Type.get_title(Type.APP_ENV_STAGE),value:Type.APP_ENV_STAGE},
			{title:Type.get_title(Type.APP_ENV_PROD),type:Type.APP_ENV_PROD,label:Type.get_title(Type.APP_ENV_PROD),value:Type.APP_ENV_PROD},
		]
	};
	static get_app_link_list = () =>{
		return [
			{title:Type.get_title(Type.APP_LINK_TYPE_WEBSITE),type:Type.APP_LINK_TYPE_WEBSITE,label:Type.get_title(Type.APP_LINK_TYPE_WEBSITE),value:Type.APP_LINK_TYPE_WEBSITE},
			{title:Type.get_title(Type.APP_LINK_TYPE_GOOGLE_PLAY),type:Type.APP_LINK_TYPE_GOOGLE_PLAY,label:Type.get_title(Type.APP_LINK_TYPE_GOOGLE_PLAY),value:Type.APP_LINK_TYPE_GOOGLE_PLAY},
			{title:Type.get_title(Type.APP_LINK_TYPE_APPLE_STORE),type:Type.APP_LINK_TYPE_APPLE_STORE,label:Type.get_title(Type.APP_LINK_TYPE_APPLE_STORE),value:Type.APP_LINK_TYPE_APPLE_STORE},
		]
	};
	//9_get_title
	static get_title = (type,option)=>{
		/* option
		 * get_lowercase = ex. true,false / def. false
		 * get_plural = ex. true,false /  def. false
		 * get_url = ex. true,false /  def. false
		*/
		type = type?type:"";
		let r_type = "";
		option = option ? option : {get_lowercase:false,get_plural:false,get_url:false};
		switch(type){
			case Type.STAT_CART:
				r_type = "Cart";
				break;
			case Type.STAT_CART_ITEM:
				r_type = "Cart Item";
				break;
			case Type.STAT_CART_SUB_ITEM:
				r_type = "Cart Sub Item";
				break;
			case Type.STAT_FAVORITE:
				r_type = "Favorite";
				break;
			case Type.STAT_LIKE:
				r_type = "Like";
				break;
			case Type.STAT_LOGIN:
				r_type = "Login";
				break;
			case Type.STAT_ORDER:
				r_type = "Order";
				break;
			case Type.STAT_ORDER_ITEM:
				r_type = "Order Item";
				break;
			case Type.STAT_ORDER_SUB_ITEM:
				r_type = "Order Sub Item";
				break;
			case Type.STAT_ORDER_PAYMENT:
				r_type = "Order Payment";
				break;
			case Type.STAT_REGISTER:
				r_type = "Register";
				break;
			case Type.STAT_REVIEW:
				r_type = "Review";
				break;
			case Type.STAT_VIEW:
				r_type = "View";
				break;
			case Type.APP_ENV_TEST:
				r_type = "Testing";
				break;
			case Type.APP_ENV_STAGE:
				r_type = "Staging";
				break;
			case Type.APP_ENV_PROD:
				r_type = "Production";
				break;
			case Type.APP_LINK_TYPE_WEBSITE:
				r_type = "Website";
				break;
			case Type.APP_LINK_TYPE_GOOGLE_PLAY:
				r_type = "Google Play";
				break;
			case Type.APP_LINK_TYPE_APPLE_STORE:
				r_type = "Apple Store";
				break;
			case Type.APP_LINK_TYPE_CMS:
				r_type = "Content Management System";
				break;
			case Type.ID:
				r_type = "ID";
			case Type.N_A:
				r_type = "N/A";
			case Type.PAGE_ABOUT:
			case Type.PAGE_BLOG_POST:
			case Type.PAGE_BLOG_POST_HOME:
			case Type.PAGE_CONTACT:
			case Type.PAGE_EVENT:
			case Type.PAGE_EVENT_HOME:
			case Type.PAGE_FAQ:
			case Type.PAGE_GALLERY:
			case Type.PAGE_GALLERY_HOME:
			case Type.PAGE_HOME:
			case Type.PAGE_PRODUCT:
			case Type.PAGE_PRODUCT_HOME:
			case Type.PAGE_SERVICE:
			case Type.PAGE_SERVICE_HOME:
			case Type.PAGE_REVIEW_HOME:
			case Type.USER_ROLE_SUPER_ADMIN:
			case Type.USER_ROLE_ADMIN:
			case Type.USER_ROLE_MANAGER:
			case Type.USER_ROLE_USER:
			case Type.USER_ROLE_GUEST:
			case Type.ORDER_STATUS_NEW:
			case Type.ORDER_STATUS_OPEN:
			case Type.ORDER_STATUS_COMPLETE:
			case Type.ORDER_STATUS_RETURNED:
			case Type.ORDER_STATUS_ON_HOLD:
			case Type.ORDER_STATUS_CANCELLED:
			case Type.ORDER_PAYMENT_PLAN_NEW:
			case Type.ORDER_PAYMENT_PLAN_1:
			case Type.ORDER_PAYMENT_PLAN_2:
			case Type.ORDER_PAYMENT_PLAN_3:
			case Type.ORDER_PAYMENT_PLAN_4:
			case Type.ORDER_PAYMENT_METHOD_STRIPE:
			case Type.ORDER_PAYMENT_METHOD_CASH:
			case Type.ORDER_PAYMENT_METHOD_OTHER:
			case Type.ORDER_PAYMENT_METHOD_TEST:
			case DataType.APP:
			case DataType.BLANK:
			case DataType.BLOG_POST:
			case DataType.CART:
			case DataType.CART_ITEM:
			case DataType.CART_SUB_ITEM:
			case DataType.CATEGORY:
			case DataType.CUSTOM_FIELD:
			case DataType.CONTENT:
			case DataType.EVENT:
			case DataType.FAQ:
			case DataType.FAVORITE:
			case DataType.GALLERY:
			case DataType.ITEM_MAP:
			case DataType.ITEM:
			case DataType.LINK:
			case DataType.ORDER:
			case DataType.ORDER_ITEM:
			case DataType.ORDER_SUB_ITEM:
			case DataType.ORDER_PAYMENT:
			case DataType.PRODUCT:
			case DataType.IMAGE:
			case DataType.PAGE:
			case DataType.REVIEW:
			case DataType.SERVICE:
			case DataType.SECURITY:
			case DataType.STAT:
			case DataType.TEMPLATE:
			case DataType.TYPE:
			case DataType.USER:
			case DataType.VIDEO:
			r_type = String(Str.get_title(type.replaceAll('_',' ').replaceAll('dt','').replace('biz',''))).trim();
			break;
			default:
				r_type = "N/A";
				break;
		}
			if(option.get_plural){
				r_type = r_type + 's';
			}
			if(option.get_lowercase){
				r_type = r_type.toLowerCase();
			}
			if(option.get_url){
				r_type = r_type.replace(" ","_").toLowerCase();
			}
			return r_type;
	};
	static get_type_title = (data_type) => {
		return String(data_type.replaceAll('_',' ').replaceAll('dt','').replace('biz','')).trim();
	};
}
class Stat_Logic {
	static get_new = (parent_data_type,parent_id,stat_type,user_id,post_data) => {
		let new_stat = DataItem.get_new(DataType.STAT,0,
			{
				user_id:user_id,
				stat_type:stat_type,
				parent_data_type:parent_data_type,
				parent_id:parent_id
			});
		if(!Obj.check_is_empty(post_data)){
			new_stat = Obj.merge(new_stat,Stat_Logic.filter_stat(post_data));
		}
		return new_stat;
	};
	static filter_stat = (post_data) =>{
		let filter_stat = {};
		for(const prop in post_data) {
    		const value = post_data[prop];
			if (!Array.isArray(value)
				&& prop != Type.SOURCE
				&& prop != Type.DATE_CREATE
				&& prop != Type.DATE_SAVE
				&& prop != Type.DATA_TYPE
  				&& prop != Type.CART_ITEM_LIST
				&& prop != Type.CART_SUB_ITEM_LIST
                && prop != Type.ORDER_ITEM_LIST
				&& prop != Type.ORDER_SUB_ITEM_LIST
                && prop != Type.SOURCE
				&& prop != Type.SOURCE_ID
				&& prop != Type.ID) {
			 		filter_stat[prop] = post_data[prop];
    			}
  		}
		return filter_stat;
	}
}
class Page_Logic {
static get_test = (title,option) =>{
		[title,option] = Field_Logic.get_option_title(title,option);
		option = Field_Logic.get_option(DataType.PAGE,option?option:{});
		let page = DataItem.get_new(DataType.PAGE,0,Field_Logic.get_test(title,option));
		if(option.get_section){
			page.items = Sub_Item_Logic.get_test_section_list(page,page,option);
			page = Sub_Item_Logic.bind_parent_child_list(page,page.items);
		}
		return page;
	};
	static get_test_list = (option) =>{
		option = Field_Logic.get_option(DataType.PAGE,option?option:{});
		let item_list = [];
		for(let a=0;a<parseInt(option.page_count)+1;a++){
			item_list.push(Page_Logic.get_test( "Page " +parseInt(a+1)? !option.get_blank : "",option));
		}
		return item_list;
	};
}
class Order_Logic {
	static get_new = (cart,option) => {
		option = option?option:{get_payment_plan:false,payment_plan:Title.ORDER_PAYMENT_PLAN_1};
		let order = DataItem.get_new(DataType.ORDER,0,{
			order_number:Title.ORDER_NUMBER + Num.get_id(99999),
			parent_data_type:cart.parent_data_type,
			user_id:cart.user_id,
			cart_number:cart.cart_number,
			grand_total:cart.grand_total,
			status:Type.ORDER_STATUS_NEW,
			order_item_list:[]
		});
		for(const key in cart) {
			if(!Str.check_is_null(cart[key])
				&& key != Type.ID && key != Type.DATA_TYPE
				&& key != Type.PARENT_ITEM && key != Type.USER
                && key != Type.CART_ITEM_LIST && key != Type.CART_SUB_ITEM_LIST
                && key != Type.ORDER_ITEM_LIST && key != Type.ORDER_SUB_ITEM_LIST
                && key != Type.SOURCE && key != Type.SOURCE_ID
                && key != Type.DATE_CREATE && key != Type.DATE_SAVE){
				order[key] = cart[key];
             }
        }
		if(option.get_payment_plan){
			order.payment_plan = option.payment_plan;
		}
		cart.cart_item_list.forEach(cart_item => {
			let order_item = DataItem.get_new(DataType.ORDER_ITEM,0,{
				order_number:order.order_number,
				parent_data_type:cart_item.parent_data_type,
				parent_id:cart_item.parent_id,
				user_id:order.user_id,
				quanity:cart_item.quanity?cart_item.quanity:0,
				cost:cart_item.cost?cart_item.cost:0,
				order_sub_item_list:[]
			});
		for(const key in cart_item){
			if(!Str.check_is_null(cart_item[key])
				&& key != Type.ID && key != Type.DATA_TYPE
				&& key != Type.PARENT_ITEM && key != Type.USER
                && key != Type.CART_ITEM_LIST && key != Type.CART_SUB_ITEM_LIST
                && key != Type.ORDER_ITEM_LIST && key != Type.ORDER_SUB_ITEM_LIST
                && key != Type.SOURCE && key != Type.SOURCE_ID
                && key != Type.DATE_CREATE && key != Type.DATE_SAVE){
					order_item[key] = cart_item[key];
             }
        }
			cart_item.cart_sub_item_list.forEach(cart_sub_item => {
				let order_sub_item = DataItem.get_new(DataType.ORDER_SUB_ITEM,0,{
					order_number:order.order_number,
					parent_data_type:cart_sub_item.parent_data_type,
					parent_id:cart_sub_item.parent_id,
					user_id:order.user_id,
					quanity:cart_sub_item.quanity?cart_sub_item.quanity:0,
					cost:cart_sub_item.cost?cart_sub_item.cost:0
				})
				for(const key in cart_sub_item){
					if(!Str.check_is_null(cart_sub_item[key])
						&& key != Type.ID && key != Type.DATA_TYPE
						&& key != Type.PARENT_ITEM && key != Type.USER
                		&& key != Type.CART_ITEM_LIST && key != Type.CART_SUB_ITEM_LIST
                		&& key != Type.ORDER_ITEM_LIST && key != Type.ORDER_SUB_ITEM_LIST
                		&& key != Type.SOURCE && key != Type.SOURCE_ID
                		&& key != Type.DATE_CREATE && key != Type.DATE_SAVE){
						order_sub_item[key] = cart_sub_item[key];
             		}
        		}
				order_item.order_sub_item_list.push(order_sub_item);
			});
			order.order_item_list.push(order_item);
		});
		return order;
	};
	static get_new_order_payment = (order_number,payment_method_type,payment_amount) => {
		return DataItem.get_new(DataType.ORDER_PAYMENT,0,
			{
				order_number:order_number,
				payment_method_type:payment_method_type,
				payment_amount:payment_amount,
				transaction_id:Title.ORDER_TRANSACTION_ID + Num.get_id(99999)
			});
	};
 	static get_total = (order) => {
        let grand_total = 0;
        order.order_item_list.forEach(order_item => {
            order_item.sub_total = 0;
            if(!isNaN(order_item.cost)){
                order_item.sub_total = (order_item.sub_total + order_item.cost) * order_item.quanity;
                grand_total = grand_total + order_item.sub_total;
            }
            order_item.order_sub_item_list.forEach(order_sub_item => {
                order_sub_item.sub_total = 0;
                if(!isNaN(order_sub_item.cost)){
                    order_sub_item.sub_total = (order_sub_item.sub_total + order_sub_item.cost) * order_sub_item.quanity;
                    grand_total = grand_total + order_sub_item.sub_total;
                }
            });
        });
		order.grand_total = grand_total;
        return order;
    };
}
class Cart_Logic {
	static get_new = (parent_data_type,user_id) => {
		return DataItem.get_new(DataType.CART,0,{user_id:user_id,cart_number:Title.CART_NUMBER + Num.get_id(99999),parent_data_type:parent_data_type,grand_total:0,cart_item_list:[]});
	};
	static get_new_cart_item = (parent_data_type,parent_id,cart_number,quanity,cost) =>{
		return DataItem.get_new(DataType.CART_ITEM,0,{parent_data_type:parent_data_type,parent_id:parent_id,cart_number:cart_number,quanity:quanity?quanity:0,cost:cost?cost:0,cart_sub_item_list:[]});
	};
	static get_new_cart_sub_item = (parent_data_type,parent_id,cart_number,quanity,cost) =>{
		return DataItem.get_new(DataType.CART_SUB_ITEM,0,{parent_data_type:parent_data_type,parent_id:parent_id,cart_number:cart_number,quanity:quanity?quanity:0,cost:cost?cost:0});
	};
    static get_total = (cart) => {
        let grand_total = 0;
        cart.cart_item_list.forEach(cart_item => {
            cart_item.sub_total = 0;
            if(!isNaN(cart_item.cost)){
                cart_item.sub_total = (cart_item.sub_total + cart_item.cost) * cart_item.quanity;
                grand_total = grand_total + cart_item.sub_total;
            }
            cart_item.cart_sub_item_list.forEach(cart_sub_item => {
                cart_sub_item.sub_total = 0;
                if(!isNaN(cart_sub_item.cost)){
                    cart_sub_item.sub_total = (cart_sub_item.sub_total + cart_sub_item.cost) * cart_sub_item.quanity;
                    grand_total = grand_total + cart_sub_item.sub_total;
                }
            });
        });
		cart.grand_total = grand_total;
        return cart;
    };
}
class Product_Logic {
static get_new = (title,type,category,option) => {
		option = option ? option : {};
		const item = Item_Logic.get_new(title,DataType.PRODUCT);
		item.type = type;
		item.category = category = category?category:"";
		return item;
	};
	static get_stock_list = () => {
		const r_list=
			[
				{ value: "0", label: "Out of Stock" },
				{ value: "1", label: "Only 1 Left" },
				{ value: "2", label: "Less Than 3 Left" },
				{ value: "3", label: "Availble" }
			];
		return r_list;
	};
	static get_stock_by_value = (stock_val) => {
		switch(stock_val)
		{
			case "0":
				return 'Out of Stock';
				break;
			case "1":
				return 'Only 1 Left';
				break;
			case "2":
				return 'Less Than 3 Left';
				break;
			case "3":
				return 'Availble';
				break;
			default:
				return 'Availble';
				break;
		}
	};
	static get_test = (title,option) =>{
		[title,option] = Field_Logic.get_option_title(title,option);
		option = Field_Logic.get_option(DataType.PRODUCT,option?option:{});
		let product = DataItem.get_new(DataType.PRODUCT,0,Field_Logic.get_test(title,option));
		if(option.get_blank ==false){
			product.cost = Field_Logic.get_test_cost();
			product.old_cost = Field_Logic.get_test_cost();
			product.cart_count = 0;
			product.order_count = 0;
			product.type = "Type "+String(Num.get_id());
			product.sub_type = "Sub Type "+String(Num.get_id());
			product.stock = String(Num.get_id(3-1));
			product.tag = "Tag "+ Num.get_id() + ", Tag "+Num.get_id() + ", Tag "+ Num.get_id();
		}else{
			product.cost = "";
			product.old_cost = "";
			product.type = "";
			product.sub_type = "";
			product.stock = "";
			product.tag = "";
		}
		if(option.get_item){
			product.items = Sub_Item_Logic.get_test_list(product,product,option);
		}
		return product;
	};
	static get_test_cart = (cart_number,user_id,option) =>{
		[cart_number,option] = ield_Logic.get_option_title(cart_number,option);
		option = Field_Logic.get_option(DataType.CART,option?option:{});
		let cart = DataItem.get_new(DataType.CART,Num.get_guid(),Field_Logic.get_test(cart_number,option));
		cart.user_id = user_id;
		cart.cart_number = cart_number;
		if(option.get_cart_item){
			let product_option = {product_count:option.cart_item_count,generate_id:true};
			let product_list = Product_Logic.get_test_list(product_option);
			cart.cart_item_list = [];
			for(let a = 0;a<product_list.length;a++){
				let product_cart_item =Cart_Logic.get_test_item(cart_number,cart.id,user_id,product_list[a].data_type,product_list[a].id,{get_value:false,get_cart_sub_item:option.get_cart_sub_item,cart_sub_item_count:option.cart_sub_item_count,generate_id:true});
				product_cart_item.item_item = product_list[a];
				cart.cart_item_list.push(product_cart_item);
			}
		}
		return cart;
	};
	static get_test_list = (option) =>{
		option = Field_Logic.get_option(DataType.PRODUCT,option?option:{});
		let item_list = [];
		for(let a=0;a<option.product_count+1;a++){
			item_list.push(Product_Logic.get_test("Product "+String(parseInt(a+1)),option));
		}
		return item_list;
	}
	static get_test_list_by_category = (option) =>{
		option = Field_Logic.get_option(DataType.PRODUCT,option?option:{});
		let product_list = [];
		let category_list = Category_Logic.get_type_category_list(DataType.PRODUCT,option.category_count);
		let item_count = 0;
		for(let a=0;a<category_list.length;a++){
			for(let b=0;b<option.product_count;b++){
				item_count++;
				let product = Product_Logic.get_test("Product "+String(parseInt(b+1)),option);
				product.category = category_list[Num.get_id(category_list.length+1)].title;
				product_list.push(product);
			}
		}
		return [category_list,product_list]
	};
}
class Service_Logic {
	static get_stock_list = () => {
		const r_list=
			[
				{ value: "0", label: "No Sessions Availble" },
				{ value: "1", label: "Ready For Booking" },
				{ value: "2", label: "No Sessions Availble" }
			];
		return r_list;
	};
	static get_stock_by_value = (stock_val) => {
		switch(stock_val)
		{
			case "0":
				return 'No Sessions Availble';
				break;
			case "1":
				return 'Ready For Booking';
				break;
			case "2":
				return 'No Sessions Availble';
				break;
		}
	};
	static get_test = (title,option) =>{
		[title,option] = Field_Logic.get_option_title(title,option);
		option = Field_Logic.get_option(DataType.SERVICE,option?option:{});
		let service = DataItem.get_new(DataType.SERVICE,0,Field_Logic.get_test(title,option));
		service.cost = Field_Logic.get_test_cost();
		service.old_cost = Field_Logic.get_test_cost();
		service.type = "Type "+String(Num.get_id());
		service.sub_type = "Sub Type "+String(Num.get_id());
		service.stock = String(Num.get_id(3-1));
		service.tag = "Tag "+ Num.get_id() + ", Tag "+Num.get_id() + ", Tag "+ Num.get_id();
		if(option.get_item){
			service.items = Sub_Item_Logic.get_test_list(service,service,option);
		}
		return service;
	};
	static get_test_list = (option) =>{
		option = Field_Logic.get_option(DataType.SERVICE,option?option:{});
		let item_list = [];
		for(let a=0;a<parseInt(option.service_count)+1;a++){
			item_list.push(Service_Logic.get_test("Service "+String(parseInt(a+1)),option));
		}
		return item_list;
	}
	static get_test_list_by_category = (option) =>{
		option = Field_Logic.get_option(DataType.SERVICE,option?option:{});
		let service_list = [];
		let category_list = Category_Logic.get_type_category_list(DataType.SERVICE,option.category_count);
		let item_count = 0;
		for(let a=0;a<category_list.length;a++){
			for(let b=0;b<parseInt(option.service_count);b++){
				item_count++;
				let service = Service_Logic.get_test("Service "+String(parseInt(b+1)),option);
				service.category = category_list[Num.get_id(category_list.length+1)].title;
				service_list.push(service);
			}
		}
		return [category_list,service_list]
	};
}
class Content_Logic {
	static get_test = (title,option) =>{
		[title,option] = Field_Logic.get_option_title(title,option);
		option = Field_Logic.get_option(DataType.CONTENT,option?option:{});
		let content = DataItem.get_new(DataType.CONTENT,0,Field_Logic.get_test(title,option));
		if(option.get_item){
			content.items = Sub_Item_Logic.get_test_section_list(content,content,option);
			if(option.get_item_bind){
				content = Sub_Item_Logic.bind_parent_child_list(content,content.items);
			}
		}
		return content;
	};
	static get_test_list = (option) =>{
		option = Field_Logic.get_option(DataType.CONTENT,option?option:{});
		let item_list = [];
		for(let a=0;a<parseInt(option.content_count)+1;a++){
			item_list.push(Content_Logic.get_test("Content " +String(parseInt(a+1)),option));
		}
		return item_list;
	}
	static get_test_list_by_category = (option) =>{
		option = Field_Logic.get_option(DataType.CONTENT,option?option:{});
		let content_list = [];
		let category_list = Category_Logic.get_type_category_list(DataType.CONTENT,option.category_count);
		let item_count = 0;
		for(let a=0;a<category_list.length;a++){
			for(let b=0;b<parseInt(option.content_count);b++){
				item_count++;
				let content = Content_Logic.get_test("Content "+String(parseInt(b+1)),option);
				content.category = category_list[Num.get_id(category_list.length+1)].title;
				content_list.push(content);
			}
		}
		return [category_list,content_list]
	};
}
class Template_Logic {
	static get_test = (title,option) =>{
		[title,option] = Field_Logic.get_option_title(title,option);
		option = Field_Logic.get_option(DataType.TEMPLATE,option?option:{});
		let template = DataItem.get_new(DataType.TEMPLATE,0,Field_Logic.get_test(title,option));
		return template;
	};
}
class Blog_Post_Logic {
	static get_test = (title,option) =>{
		[title,option] = Field_Logic.get_option_title(title,option);
		option = Field_Logic.get_option(DataType.BLOG_POST,option?option:{});
		let blog_post = DataItem.get_new(DataType.BLOG_POST,0,Field_Logic.get_test(title,option));
		if(!option.get_blank){
			blog_post.author="First Name "+ Num.get_id();
			blog_post.tag = "Tag "+ Num.get_id() + ", Tag "+Num.get_id() + ", Tag "+ Num.get_id(), " Tag "+ Num.get_id() + ", Tag "+Num.get_id() + ", Tag "+ Num.get_id();
		}else{
			blog_post.author="";
			blog_post.tag = "";
		}
		if(option.get_item){
			blog_post.items = Sub_Item_Logic.get_test_list(blog_post,blog_post,option);
		}
		return blog_post;
	};
	static get_test_list = (option) =>{
		option = Field_Logic.get_option(DataType.BLOG_POST,option?option:{});
		let item_list = [];
		for(let a=0;a<parseInt(option.blog_post_count)+1;a++){
			item_list.push(Blog_Post_Logic.get_test("Blog Post " +String(parseInt(a+1)),option));
		}
		return item_list;
	}
	static get_test_list_by_category = (option) =>{
		option = Field_Logic.get_option(DataType.BLOG_POST,option?option:{});
		let blog_post_list = [];
		let category_list = Category_Logic.get_type_category_list(DataType.BLOG_POST,option.category_count);
		let item_count = 0;
		for(let a=0;a<category_list.length;a++){
			for(let b=0;b<parseInt(option.blog_post_count);b++){
				item_count++;
				let blog_post = Blog_Post_Logic.get_test("Blog Post "+String(parseInt(b+1)),option);
				blog_post.category = category_list[Num.get_id(category_list.length+1)].title;
				blog_post_list.push(blog_post);
			}
		}
		return [category_list,blog_post_list]
	};
}
class Gallery_Logic {
	static get_test = (title,option) =>{
		[title,option] = Field_Logic.get_option_title(title,option);
		option = Field_Logic.get_option(DataType.GALLERY,option?option:{});
		let gallery = DataItem.get_new(DataType.GALLERY,0,Field_Logic.get_test(title,option));
		if(!option.get_blank){
			gallery.date = String(String(Num.get_id(2030)) + "-" + String(Num.get_id(13)) + "-" + String(Num.get_id(30))).trim();
			gallery.time = String(Num.get_id(24)) + ":" + String(Num.get_id(59));
			gallery.website = "Website "+String(Num.get_id());
		}else{
			gallery.website = "";
		}
		if(option.get_item){
			gallery.items = Sub_Item_Logic.get_test_list(gallery,gallery,option);
		}
		return gallery;
	};
};
class Event_Logic {
	static get_stock_list = () => {
		const r_list=
			[
				{ value: "0", label: "Sold Out" },
				{ value: "1", label: "Less Than 25 Tickets Remaining" },
				{ value: "2", label: "Tickets Are Availble" },
				{ value: "3", label: "Sold Out" },
			];
		return r_list;
	};
	static get_stock_by_value = (stock_val) => {
		switch(stock_val)
		{
			case "0":
				return 'Sold Out';
				break;
			case "1":
				return 'Less Than 25 Tickets Remaining';
				break;
			case "2":
				return 'Tickets Are Availble';
				break;
			case "3":
				return 'Sold Out';
				break;
		}
	};
	static get_test = (title,option) =>{
		[title,option] = Field_Logic.get_option_title(title,option);
		option = Field_Logic.get_option(DataType.EVENT,option?option:{});
		let event = DataItem.get_new(DataType.EVENT,0,Field_Logic.get_test(title,option));
		if(!option.get_blank){
			event.cost = Field_Logic.get_test_cost();
			event.old_cost = Field_Logic.get_test_cost();
			event.date = String(String(Num.get_id(2030)) + "-" + String(Num.get_id(13)) + "-" + String(Num.get_id(30))).trim();
			event.time = String(Num.get_id(24)) + ":" + String(Num.get_id(59));
			event.website = "Website "+String(Num.get_id());
			event.location = "Location "+String(Num.get_id());
			event.meeting_link = "Meeting Link "+String(Num.get_id());
			event.stock = String(Num.get_id(3-1));
			event.category ="Category " + String(Num.get_id());
			event.tag = "Tag "+ Num.get_id() + ", Tag "+Num.get_id() + ", Tag "+ Num.get_id();
		}else{
			event.cost = "";
			event.old_cost = "";
			event.date = "";
			event.time = "";
			event.website = "";
			event.location = "";
			event.meeting_link = "";
			event.stock = "";
			event.category ="";
			event.tag = "";
		}
		if(option.get_item){
			event.items = Sub_Item_Logic.get_test_list(event,event,option);
		}
		return event;
	};
	static get_test_list = (option) =>{
		option = Field_Logic.get_option(DataType.EVENT,option?option:{});
		let item_list = [];
		for(let a=0;a<parseInt(option.event_count)+1;a++){
			item_list.push(Event_Logic.get_test("Event "+String(parseInt(a+1)),option));
		}
		return item_list;
	}
	static get_test_list_by_category = (option) =>{
		option = Field_Logic.get_option(DataType.EVENT,option?option:{});
		let event_list = [];
		let category_list = Category_Logic.get_type_category_list(DataType.EVENT,option.category_count);
		let item_count = 0;
		for(let a=0;a<category_list.length;a++){
			for(let b=0;b<parseInt(option.event_count);b++){
				item_count++;
				let event = Event_Logic.get_test("Event "+String(parseInt(b+1)),option);
				event.category = category_list[Num.get_id(category_list.length+1)].title;
				event_list.push(event);
			}
		}
		return [category_list,event_list]
	};
}
class Field_Logic {
	static get_item_max_group_id = (value_id,item) => {
		let max_group_id = 0;
		let full_prop_str = "";
		for(const prop in item){
			full_prop_str = String(prop + " "+full_prop_str);
		}
		for(let b = 1; b < 75; b++){
			const exists = Str.check_if_str_exist(full_prop_str,"list_value_"+value_id+"_group_"+b);
			if(exists){
				if(b>max_group_id){
					max_group_id = b;
				}
			}
		}
		return max_group_id;
	}
	static get_item_field_value_list = (data) => {
		let max_value_id = 1;
		let max_group_id = 1;
		let full_prop_str = "";
		for(const prop in data){
			full_prop_str = String(prop + " "+full_prop_str);
		}
		for(let a = 1; a < 75; a++){
    		const exists = Str.check_if_str_exist(full_prop_str,"list_value_"+a);
			if(exists){
				if(a>max_value_id){
					max_value_id = a;
				}
			}
			for(let b = 1; b < 20; b++){
				const exists = Str.check_if_str_exist(full_prop_str,"list_value_"+a+"_group_"+b);
				if(exists){
					if(b>max_group_id){
						max_group_id = b;
					}
				}
			}
		}
		for(let a = 1; a <= max_value_id+1; a++){
			let sub_check_str = 'list_value_'+a;
			data[sub_check_str] = [];
			for(let b = 1; b < max_group_id+1; b++){
				let full_sub_check_str = sub_check_str+"_group_"+b;
				let new_item = {};
				for(const sub_prop in data){
					if(sub_prop.startsWith(full_sub_check_str)){
						new_item[sub_prop.replace(full_sub_check_str+"_","")] = data[sub_prop];
					}
				}
				if(!Obj.check_is_empty(new_item)){
					data[sub_check_str].push(new_item);
				}
			}
			if(data[sub_check_str].length<=0){
				delete data[sub_check_str];
			}
		}
		return data;
	}
	static get_item_field_value_type_list = () => {
		return [
			{value:'text',label:'Text'},
			{value:'note',label:'Note'},
			{value:'image',label:'Image'},
			{value:'list',label:'List'},
		];
	};
	static get_field_value_value = (value_type,item,value_id) =>{
		if(value_type!=Type.FIELD_VALUE_LIST){
			return !Str.check_is_null(item[Field_Logic.get_field_value_title(value_type,value_id)]) ? item[Field_Logic.get_field_value_title(value_type,value_id)] : ""
		}else{
			return item[Field_Logic.get_field_value_list_title(value_id)] ?  item[Field_Logic.get_field_value_list_title(value_id)] : [];
		}
	};
	static get_field_value_title = (value_type,value_id,group_id,sub_field_title) =>{
		switch(value_type){
			case Type.FIELD_VALUE_TEXT:
				return 'text'+'_value_'+value_id;
				break;
			case Type.FIELD_VALUE_NOTE:
				return 'note'+'_value_'+value_id;
				break;
			case Type.FIELD_VALUE_IMAGE:
				return 'image'+'_value_'+value_id;
				break;
			case Type.FIELD_VALUE_LIST:
				if(!group_id){
					return 'list'+'_value_'+value_id;
				}else{
					return 'list'+'_value_'+value_id +'_group_' +group_id+"_"+Str.get_title_url(sub_field_title);
				}
				break;
			default:
				return 'text'+'_value_'+value_id;
		};
	}
	static get_test_cost(){
		return String(Num.get_id(999)) + "." + String(Num.get_id(99));
	}
	static get_test_note = () => {
		return "Note "+String(Num.get_id()) + " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
	}
	static get_test = (title,option) =>{
		option = !Obj.check_is_empty(option) ? option : {};
		let item = {};
		if(option.get_blank == true){
			option.category_title = "";
			item = {
				title:title,
				title_url:title,
				title_url:Str.get_title_url(title),
				setting_visible:"1",
			}
		}else{
			item = {
				title:title,
				setting_visible:"1",
				title_url:Str.get_title_url(title),
				description:"Description "+String(Num.get_id()),
				note:Field_Logic.get_test_note(),
				id:0,
				date_create:new moment().toISOString(),
				date_save:new moment().toISOString()
			}
		}
		if(!Str.check_is_null(option.category_title)){
			item.category =  'Category ' + Num.get_id();
		}
		if(option.generate_id){
			item.id=Num.get_guid();
		}
		if(option.get_value){
			item = Field_Logic.get_value_list(item,option);
		}
		if(option.fields){
			let field_list = String(option.fields).split(',');
			for(let a = 0; a<field_list.length;a++){
				if(option.get_blank == true){
					if(item[field_list[a]]){
						item[field_list[a]] = "";
					}
				}else{
					if(!Str.check_is_null(field_list[a])){
						item[Str.get_title_url(field_list[a])] = Str.get_title(field_list[a]) +"_" + Num.get_id();
					}
				}
			}
		}
		return item;
	}
	//here
	static get_field_value_list_title(value_id){
		return 'list_value_'+value_id;
	}
	static get_value_list_group(item,value_id,group_id){
		let full_str = 'list_value_'+value_id+"_group_"+group_id;
		let new_list = [];
		Log.w(full_str,full_str);
		let count = 0;
		for(const prop in item){
			let new_item = {};
			if(prop.startsWith(full_str)){
				count = count+1;
				new_item[prop.replace(full_str+"_","")] = item[prop];
				new_list.push(new_item);
			}
		}
		return new_list;
	}
	static get_value_list(item,option){
		for(let b=0;b<parseInt(option.value_count);b++){
			if(option.get_blank == false){
				item['value_'+String(b+1)] = 'value ' + String(b+1);
				item['field_'+String(b+1)] = Str.get_title_url(item['value_'+String(b+1)]);
				item[Str.get_title_url('value ' + String(b+1))] = item.title + ' value ' + String(b+1);
			}else{
				item['value_'+String(b+1)] = "";
				item['field_'+String(b+1)] = "";
				item[Str.get_title_url('value ' + String(b+1))] ="";
			}
		}
		return item;
	};
	static get_option(data_type,option){
		data_type = data_type ? data_type : DataType.BLANK;
		option = !Obj.check_is_empty(option) ? option : {get_value:false,get_item:false,get_image:false,item_count:9,value_count:9};
		option.generate_id = option.generate_id ? option.generate_id : false;
		option.get_image = option.get_image ? true : false;
		option.get_value = option.get_value ? true : false;
		option.get_item = option.get_item ? true : false;
		option.get_blank = option.get_blank ? true : false;
		option.get_item_bind = option.get_item_bind ? true : true;
		option.value_count = option.value_count ? option.value_count : 9;
		option.section_count = option.section_count ? option.section_count : 9;
		option.item_count = option.item_count ? option.item_count : 9;
		option.category_count = option.category_count ? option.category_count : 9;
		option.category_title = option.category_title ? option.category_title : "";
		option.fields = option.fields ? option.fields : [];
		if(option.data_type==DataType.PAGE){
			option.page_count = option.page_count ? option.page_count : 9;
			option.section_count = option.section_count ? option.section_count : 9;
			option.get_section = option.get_section ? true : false;
		}
		if(data_type==DataType.PRODUCT){
			option.product_count = option.product_count ? option.product_count : 9;
		}
		if(data_type==DataType.SERVICE){
			option.service_count = option.service_count ? option.service_count : 9;
		}
		if(data_type==DataType.BLOG_POST){
			option.blog_post_count = option.blog_post_count ? option.blog_post_count : 9;
		}
		if(data_type==DataType.EVENT){
			option.event_count = option.event_count ? option.event_count : 9;
		}
		if(data_type==DataType.FAQ){
			option.question_count = option.question_count ? option.question_count : 9;
		}
		if(data_type==DataType.CONTENT){
			option.content_count = option.content_count ? option.content_count : 9;
		}
		if(data_type==DataType.SUB_ITEM){
			option.item_count = option.item_count ? option.item_count : 9;
		}
		if(data_type==DataType.USER){
			option.user_count = option.user_count ? option.user_count : 9;
		}
		if(data_type==DataType.CART){
			option.category_title = option.category_title ? option.category_title : "";
			option.value_count = option.value_count ? option.value_count : 9;
			option.get_cart_item = option.get_cart_item ? option.get_cart_item : false;
			option.cart_item_count = option.cart_item_count ? option.cart_item_count : 5;
			option.get_cart_sub_item = option.get_cart_sub_item ? option.get_cart_sub_item : false;
			option.cart_sub_item_count = option.cart_sub_item_count ? option.cart_sub_item_count : 3;
		}
		if(data_type==DataType.CART_ITEM){
			option.category_title = option.category_title ? option.category_title : "";
			option.value_count = option.value_count ? option.value_count : 9;
			option.get_cart_sub_item = option.get_cart_sub_item ? option.get_cart_sub_item : false;
			option.cart_sub_item_count = option.cart_sub_item_count ? option.cart_sub_item_count : 1;
		}
		if(data_type==DataType.ORDER){
			option.category_title = option.category_title ? option.category_title : "";
			option.value_count = option.value_count ? option.value_count : 9;
			option.get_order_item = option.get_order_item ? option.get_order_item : false;
			option.order_item_count = option.order_item_count ? option.order_item_count : 5;
			option.get_order_sub_item = option.get_order_sub_item ? option.get_order_sub_item : false;
			option.order_sub_item_count = option.order_sub_item_count ? option.order_sub_item_count : 3;
		}
		if(data_type==DataType.ORDER_ITEM){
			option.category_title = option.category_title ? option.category_title : "";
			option.value_count = option.value_count ? option.value_count : 9;
			option.get_order_sub_item = option.get_order_sub_item ? option.get_order_sub_item : false;
			option.order_sub_item_count = option.order_sub_item_count ? option.order_sub_item_count : 1;
		}
		return option;
	}
	static get_option_title = (title,option) =>{
		if(!title){
			let title = '';
		}
		if(!option){
			let option = {};
		}
		if(!Str.check_is_null(title) && Obj.check_is_empty(option)){
			if(Obj.check_is_empty(option)){
				if(!Str.check_is_null(title) && Obj.check_is_empty(option)){
					if(typeof title === 'string'){
						option = {};
					}else{
						option = title;
						title = "Test " + Num.get_id();
					}
				}
			}
		}else{
			if(Str.check_is_null(title) && Obj.check_is_empty(option)){
				title = "Test " + Num.get_id();
				option = {};
			}
		}
		return [title,option];
	}
	static get_option_admin(req){
		let option = {};
		option.value_count = req.query.value_count ? req.query.value_count : 9;
		option.section_count = req.query.section_count ? req.query.section_count : 9;

		option.get_faq = req.query.get_faq ? req.query.get_faq : false;
		option.question_count = req.query.question_count ? req.query.question_count : 9;

		option.get_blog_post = req.query.get_blog_post ? req.query.get_blog_post : false;
		option.get_category_blog_post = req.query.get_category_blog_post ? req.query.get_category_blog_post : false;
		option.category_blog_post_count = req.query.category_blog_post_count ? req.query.category_blog_post_count : 9;
		option.blog_post_count = req.query.blog_post_count ? req.query.blog_post_count : 9;

		option.get_product = req.query.get_product ? req.query.get_product : false;
		option.get_category_product = req.query.get_category_product ? req.query.get_category_product : false;
		option.category_product_count = req.query.category_product_count ? req.query.category_product_count : 9;
		option.product_count = req.query.product_count ? req.query.product_count : 9;

		option.get_service = req.query.get_service ? req.query.get_service : false;
		option.get_category_service = req.query.get_category_service ? req.query.get_category_service : false;
		option.category_service_count = req.query.category_service_count ? req.query.category_service_count : 9;
		option.service_count = req.query.service_count ? req.query.service_count : 9;

		option.get_event = req.query.get_event ? req.query.get_event : false;
		option.get_category_event = req.query.get_category_event ? req.query.get_category_event : false;
		option.category_event_count = req.query.category_event_count ? req.query.category_event_count : 9;
		option.event_count = req.query.event_count ? req.query.event_count : 9;

		option.get_product_review = req.query.get_product_review ? req.query.get_product_review : false;
		option.product_review_count = req.query.product_review_count ? req.query.product_review_count : 19;

		option.get_business_review = req.query.get_business_review ? req.query.get_business_review : false;
		option.business_review_count = req.query.business_review_count ? req.query.business_review_count : 19;

		option.user_count = req.query.user_count ? req.query.user_count : 9;
		option.get_admin = req.query.get_admin ? req.query.get_admin : false;
		option.get_template = req.query.get_template ? req.query.get_template : false;
		option.get_page = req.query.get_page ? req.query.get_page : false;

		return option;
	}
}
class DataType {
	static APP='app_biz';
	static BLANK='blank_biz';
	static BLOG_POST='blog_post_biz';
	static CART_ITEM="cart_item_biz";
	static CART="cart_biz";
	static CART_ITEM="cart_item_biz";
	static CART_SUB_ITEM="cart_sub_item_biz";
	static CATEGORY='category_biz';
	static CUSTOM_FIELD='custom_field_biz';
	static CONTENT='content_biz';
	static EVENT='event_biz';
	static FAQ='faq_biz';
	static FAVORITE='favorite_biz';
	static GALLERY='gallery_biz';
	static IMAGE='image_biz';
	static ITEM='item_biz';
	static LINK='link_biz';
	static ORDER="order_biz";
	static ORDER_ITEM="order_item_biz";
	static ORDER_SUB_ITEM="order_sub_item_biz";
	static ORDER_PAYMENT="order_payment_biz";
	static PRODUCT='product_biz';
	static PAGE='page_biz';
	static REVIEW='review_biz';
	static SERVICE='service_biz';
	static SECURITY='security_biz';
	static STAT='stat_biz';
	static TEMPLATE='template_biz';
	static TYPE='type_biz';
	static USER='user_biz';
	static VIDEO='video_biz';
}
class Favorite_Logic {
	static get_new = (parent_data_type,parent_id,user_id) =>{
		return DataItem.get_new(DataType.FAVORITE,0,{
			parent_data_type:parent_data_type,
			parent_id:parent_id,
			user_id:user_id
		});
	}
	static old_get_favorite_by_list = (favorite_list,item_list) =>{
		if(!item_list){
			item_list = [];
		}
		if(item_list.length>0){
		favorite_list.forEach(item => {
			const item_match = item_list.find(item_find => item_find.id === item.parent_id);
			if (item_match) {
				item_match.is_favorite = true;
			}
		});
		}
		return item_list;
	}
	static get_user_search_filter = (item_data_type,user_id) =>{
		return {
			$and: [
				{ parent_data_type: { $regex:String(parent_data_type), $options: "i" } },
				{ user_id: { $regex:String(user_id), $options: "i" } }
			] };
	}
	static get_search_filter = (parent_data_type,parent_id,user_id) =>{
		return {
			$and: [
				{ parent_data_type: { $regex:String(parent_data_type), $options: "i" } },
				{ parent_id: { $regex:String(parent_id), $options: "i" } },
				{ user_id: { $regex:String(user_id), $options: "i" } }
			] };
	}
}
class Review_Logic {
	static get_new = (parent_data_type,parent_id,user_id,title,comment,rating) =>{
		return DataItem.get_new(DataType.REVIEW,0,{
			parent_data_type:parent_data_type,
			parent_id:parent_id,
			user_id:user_id,
			title:title ? title : "",
			comment:comment ? comment : "",
			rating:rating ? rating : 5
		});
	}
	static get_user_search_filter = (item_data_type,user_id) =>{
		return {
			$and: [
				{ item_data_type: { $regex:String(item_data_type), $options: "i" } },
				{ user_id: { $regex:String(user_id), $options: "i" } }
			] };
	}
	static get_search_filter = (item_data_type,parent_id) =>{
		return {
			$and: [
				{ item_data_type: { $regex:String(item_data_type), $options: "i" } },
				{ parent_id: { $regex:String(parent_id), $options: "i" } },
			] };
	}
	static get_test = (item_data_type,item_id,user_id,option) =>{
		option = Field_Logic.get_option(DataType.REVIEW,option?option:{});
		let review = DataItem.get_new(DataType.REVIEW,0);
		if(!option.get_blank){
			review.title = 'Title ' + Num.get_id();
			review.item_data_type = item_data_type;
			review.item_id = item_id;
			review.rating = Num.get_id(6);
			review.user_id = user_id;
			review.comment = "My comment "+ Field_Logic.get_test_note();
		}else{
			review.title = '';
			review.item_data_type = item_data_type;
			review.item_id = item_id;
			review.rating = 0;
			review.user_id = user_id;
			review.comment = "";
		}
		return review;
	};
	static get_test_list=(option)=>{
		option = !Obj.check_is_empty(option) ? option : {review_count:19};
		let item_list = [];
		for(let a=0;a<option.review_count;a++){
			item_list.push(Review_Logic.get_test(option));
		}
		return item_list;
	};
}
class Admin_Logic {
	static get_new = (title,option) =>{
		[title,option] = Field_Logic.get_option_title(title,option);
		return DataItem.get_new_full_item(
			DataItem.get_new(DataType.ADMIN,0),
			DataItem.get_new(DataType.ADMIN,0),
			DataItem.get_new(DataType.ADMIN,0),{
				title:title,
				email:"",
			});
	};
	static get_test = (title,option) =>{
		[title,option] = Field_Logic.get_option_title(title,option);
		option = Field_Logic.get_option(DataType.ADMIN,option?option:{});
		let item = DataItem.get_new(DataType.ADMIN,0);
		let admin = DataItem.get_new(DataType.ADMIN,0,Field_Logic.get_test(title,option));
		if(!option.get_blank){
			admin.email="ceo@admin"+Num.get_id()+".com";
			admin.password="1234567";
		}else{
			admin.email="";
			admin.password="";
		}
		return admin;
	};
	static get_full_address(admin){
		admin.address_1 = (admin.address_1) ? admin.address_1 : "";
		admin.address_2 = (admin.address_2) ? admin.address_2 : "";
		admin.city = (admin.city) ? admin.city : "";
		admin.state = (admin.state) ? admin.state : "";
		admin.zip = (admin.zip) ? admin.zip : "";
		return admin.address_1 + " "+ admin.address_2 + " " + admin.city + " " + admin.state + " " + admin.zip;
	}
}
class DataItem {
	static get_new = (data_type,id,option) => {
		return get_new_item_main(data_type,id,option?option:{});
	};
	static get_new_full_item = (item,parent_item,top_item,option) => {
		return get_new_full_item_main(item,parent_item,top_item,option?option:{});
	};
}
class Category_Logic {
	static get_new = (title,type,category,option) => {
		option = option ? option : {};
		const item = Item_Logic.get_new(title,DataType.CATEGORY);
		item.type = type;
		item.category = category = category?category:"";
		return item;
	};
	static get_test = (title,option) =>{
		title = (title) ? title : "Category 1";
		option = Field_Logic.get_option(DataType.CATEGORY,option?option:{});
		let category = DataItem.get_new(DataType.CATEGORY,0,Field_Logic.get_test(title,option));
		if(option.get_item){
			category.items = Sub_Item_Logic.get_test_list(category,category,option);
		}
		return category;
	};
	static get_test_list = (option) =>{
		option = Field_Logic.get_option(DataType.CATEGORY,option);
		let item_list = [];
		for(let a=0;a<option.category_count;a++){
			item_list.push(Category_Logic.get_test("Category " +String(parseInt(a+1)),option));
		}
		return item_list;
	}
	static get_test_list_by_type = (type,option) =>{
		option = Field_Logic.get_option(DataType.CATEGORY,option);
		let category_list = [];
		for(let a=0;a<option.category_count;a++){
			let category = DataItem.get_new(DataType.CATEGORY,0,Field_Logic.get_test("Category " +String(parseInt(a+1)),option));
			category.type = type;
			category_list.push(category);
		}
		return category_list;
	};
	static get_category_drop_down_list_by_list = (cat_list) => {
		let category_list = [];
		for(let a=0;a<cat_list.length;a++){
			category_list.push({value:cat_list[a].title,label:cat_list[a].title});
		}
		return category_list;
	};
};
class Storage {
	static get = (window,key) => {
		if(!Obj.check_is_empty(window)){
			if(Str.check_is_null(window.localStorage.getItem(key))){
				return null;
			}else{
				return JSON.parse(window.localStorage.getItem(key));
			}
		}else{
			return null;
		}
	}
	static post = (window,key,obj) => {
		if(!Obj.check_is_empty(window)){
			if(window.localStorage){
				window.localStorage.setItem(key,JSON.stringify(obj));
			}
		}
	}
	static delete = (window,key) =>{
		if(!Obj.check_is_empty(window)){
			if(window.localStorage){
				window.localStorage.removeItem(key);
			}
		}
	}
	static delete_all = (window) =>{
		if(!Obj.check_is_empty(window)){
			if(window.localStorage){
				window.localStorage.clear();
			}
		}
	}
}
class User_Logic {
	static url_register = (app_id,url,param) => {
		let action_url="user/register";
		return get_cloud_url_main(app_id,url,action_url,param);
	};
	static url_login = (app_id,url,param) => {
		let action_url="user/login";
		return get_cloud_url_main(app_id,url,action_url,param);
	};
	static url_logout = (app_id,url,param) => {
		let action_url="user/logout";
		return get_cloud_url_main(app_id,url,action_url,param);
	};
	static get_country_state_city(item){
		let country_state_city = "";
		if(item.country == "United States"){
			let state = "";
			if(!Str.check_is_null(item.state)){
				country_state_city = item.state;
			}
			if(!Str.check_is_null(item.city)){
				if(!Str.check_is_null(item.state)){
					country_state_city = item.city + ", " + item.state;
				}else{
					country_state_city = item.city;
				}
			}
		}
		else{
			if(!Str.check_is_null(item.city)){
				country_state_city = item.city + ", " + item.country;
			}else{
				country_state_city = item.country;
			}
		}
		return country_state_city;
	}
	static get_full_name(first_name,last_name){
		let str_first_name = !Str.check_is_null(first_name) ? first_name : "";
		let str_last_name = !Str.check_is_null(last_name) ? last_name : "";
		return !Str.check_is_null(String(str_first_name + " " + str_last_name)) ? String(str_first_name + " " + str_last_name).trim() : "N/A";

	}
	static get_guest(){
		return DataItem.get_new(DataType.USER,0,{is_guest:true,title_url:'guest',first_name:'Guest',last_name:'User',email:'guest@email.com',title:"Guest",country:"United States"});
	}
	static get_request_user(req){
		if(!req || !req.session.user){
			let user=DataItem.get_new(DataType.USER,Num.get_id(9999999),{is_guest:true});
			req.session.user=user;
		}
		return req.session.user;
	}
	static post_request_user(req,user){
		req.session.user=user;
	}
	static delete_request_user(req){
		req.session.user=null;
		delete req.session.user;
	}
	static get_test = (title,option) =>{
		[title,option] = Field_Logic.get_option_title(title,option);
		option = Field_Logic.get_option(DataType.USER,option?option:{});
		let user = DataItem.get_new(DataType.USER,0,
			Field_Logic.get_test(title,option));
		if(option.get_blank){
			user.first_name="";
			user.last_name="";
			user.email="";
			user.city="";
			user.state="";
			user.password="";
			user.country="";
		}else{
			user.first_name="First Name "+ Num.get_id();
			user.last_name="First Name "+ Num.get_id();
			user.email="email"+ Num.get_id() + "@email.com";
			user.city="City"+ Num.get_id();
			user.state="State"+ Num.get_id();
			user.password="1234567";
			user.country="United States";
		}
		return user;
	};
	static get_test_list = (option) =>{
		option = Field_Logic.get_option(DataType.USER,option?option:{});
		let item_list = [];
		for(let a=0;a<option.user_count+1;a++){
			item_list.push(User_Logic.get_test("User " +String(parseInt(a+1)),option));
		}
		return item_list;
	}
}
class Sub_Item_Logic {
	static get_test(title,parent_item,top_item,option){
		option = Field_Logic.get_option(DataType.ITEM,option?option:{});
		let item_title =title;
		let item = DataItem.get_new(
			DataType.ITEM,0, {
				top_id:top_item.id?top_item.id:0,
				top_data_type:top_item.data_type?top_item.data_type:DataType.BLANK,
				parent_id:parent_item.id?parent_item.id:0,
				parent_data_type:parent_item.data_type?parent_item.data_type:DataType.BLANK,
				title:item_title,
				title_url:Str.get_title_url(item_title),
				description:"Description "+String(Num.get_id()),
				note:Field_Logic.get_test_note()
			}
		);
		if(option.get_value){
			item = Field_Logic.get_value_list(item,option);
		}
		return item;
	}
	static get_test_list(parent_item,top_item,option){
		option = Field_Logic.get_option(DataType.SUB_ITEM,option?option:{});
		let new_list = [];
		for(let a=0;a<option.item_count;a++){
			let item_title ="Item " + String(parseInt(a+1));
			new_list.push(Sub_Item_Logic.get_test(item_title,parent_item,top_item,option));
		}
		return new_list;
	}
	static get_test_section_list(parent_item,top_item,option){
		let new_list = [];
		for(let a=0;a<option.section_count;a++){
			let item_title ="Section " + String(parseInt(a+1));
			let item = Sub_Item_Logic.get_test(item_title,parent_item,top_item,option);
			new_list.push(item);
		}
		return new_list;
	}
	static bind_parent_child_list(item,item_list){
		for(let a=0;a<item_list.length;a++){
			item[Str.get_title_url(item_list[a].title)] = item_list[a];
		}
		return item;
	}
}
class App_Logic {
	static get_url = (app_id,host,url,param) => {
		return get_cloud_url_main(app_id,host,url,param);
	};
	static bind_item_parent_user_list = (item,parent_item,user)=>{
		for(const prop in parent_item) {
			item['parent_'+prop] = parent_item[prop];
		}
		for(const prop in user) {
			item['user_'+prop] = user[prop];
		}
    	return item;
	};
	static bind_item_parent_user_list = (item_list)=>{
		for(let item of item_list) {
			item = App_Logic.bind_item_parent_user_obj(item);
		}
    	return item_list;
	};
	static bind_item_parent_user_obj = (item)=>{
		if(!item.user){
			item.user = {};
		}
		if(!item.parent_item){
			item.parent_item = {};
		}
		for(const prop in item.parent_item) {
			item['parent_'+prop] = item.parent_item[prop];
		}
		for(const prop in item.user) {
			item['user_'+prop] = item.user[prop];
		}
    	return item;
	};
	static url_dashboard_user_home = (app_id,url,param) => {
		let action_url="dashboard/user_home";
		return get_cloud_url_main(app_id,url,action_url,param);
	};
	static url_dashboard_app_home = (app_id,url,param) => {
		let action_url="dashboard/app_home";
		return get_cloud_url_main(app_id,url,action_url,param);
	};
	static get_new = (title,user_id,type,option) =>{
		option = Field_Logic.get_option(DataType.APP,option?option:{});
		let app = DataItem.get_new(DataType.APP,0);
		app.title = title;
		app.user_id = user_id;
		app.type = type;
		return app;
	}
	static get_search = (data_type,filter,sort_by,page_current,page_size) => {
		return {data_type:data_type,filter:filter,sort_by:sort_by,page_current:page_current,page_size:page_size};
	}
	static get_not_found = (data_type,id,option) =>{
		option=option?option:{};
		if(data_type != DataType.USER){
		if(!id){
			id=0;
		}
		let item = Item_Logic.get_test("",data_type,id,{get_blank:true})
		item.id = 0;
		item.id_key = id;
		item.title = "Item Not Found";
		item.title_url = Str.get_title_url(item.title);
		item.images = [];
		item.items = [];
		return item;
		}else{
		let user = User_Logic.get_test("",{get_blank:true})
		user.id = 0;
		user.id_key = id;
		user.title = "User Not Found";
		user.first_name = "User Not Found";
		user.title_url = Str.get_title_url(user.title);
		user.images = [];
		user.items = [];
		return user;
		}

	};
	static get_search_query(search){
		let url = "";
		if(search.data_type){
			url = url + "&data_type="+search.data_type;
		}else{
			url = url + "&data_type="+DataType.BLANK;
		}
		if(search.sort_by_key){
			url = url + "&sort_by_key="+search.sort_by_key;
		}else{
			url = url + "&sort_by_key=title";
		}
		if(search.sort_by_value){
			url = url + "&sort_by_value="+search.sort_by_value;
		}else{
			url = url + "&sort_by_value=-1";
		}
		if(search.page_current){
			url = url + "&page_current="+search.page_current;
		}else{
			url = url + "&page_current=1";
		}
		if(search.page_size){
			url = url + "&page_size="+search.page_size;
		}else{
			url = url + "&page_size=9";
		}
		for(let a=1;a<19;a++){
			if(!Str.check_is_null(search['filter_key_'+String(a)])){
				url = url + "&filter_key_"+String(a)+"="+ search['filter_key_'+String(a)];
				url = url + "&filter_value_"+String(a)+"="+ search['filter_value_'+String(a)];
			}
		}
		return url;
	}
	static get_search_by_query(query){
		let filter = [];
		let sort_by = [];
		if(query['sort_by_key']){
			sort_by[query['sort_by_key']] = query['sort_by_value'];
		}
		for(let a = 0; a < 19; a++){
			if(query['filter_key_'+a]){
				filter[query['filter_key_'+a]] = query['filter_value_'+a]
			}
		}
		return App_Logic.get_search(query.data_type,filter,sort_by,query.page_current,query.page_size);
	}
	static get_data_search_result = (app_id,data_type,item_count,page_count,filter,data_list,option) =>{
		return{
			option:option?option:{},
			data_type:data_type?data_type:DataType.BLANK,
			item_count:item_count?item_count:0,
			page_count:page_count?page_count:1,
			filter:filter?filter:{},
			data_list:data_list?data_list:[]
		}
	}
}
class Image_Logic {
	static url_post = (app_id,url,param) => {
		let action_url="main/image/post";
		return get_cloud_url_main(app_id,url,action_url,param);
	};
	static url_post_cdn = (app_id,url,param) => {
		let action_url="main/image/post_cdn";
		return get_cloud_url_main(app_id,url,action_url,param);
	};
	static url = (host,image_filename,size,param) =>{
		host = host ? host : "";
		image_filename = image_filename ? image_filename : "";
		size = size ? size : "";
		param = param ? param : "";
		return host+"/"+size + "_"+image_filename+param;
	}
	static get_process_list = (upload_dir,image_filename) =>{
		upload_dir = upload_dir ? upload_dir : "";
		image_filename = image_filename ? image_filename : "";
		return [
			{
				image_filename:Type.IMAGE_SIZE_ORIGINAL+"_"+image_filename,
				path_filename:upload_dir+"/"+Type.IMAGE_SIZE_ORIGINAL+"_"+image_filename,
				size:0,
				type_resize:Type.IMAGE_RESIZE_NONE,
			},
			{
				image_filename:Type.IMAGE_SIZE_THUMB+"_"+image_filename,
				path_filename:upload_dir+"/"+Type.IMAGE_SIZE_THUMB+"_"+image_filename,
				size:250,
				type_resize:Type.IMAGE_RESIZE_NORMAL,
			},
			{
				image_filename:Type.IMAGE_SIZE_MID+"_"+image_filename,
				path_filename:upload_dir+"/"+Type.IMAGE_SIZE_MID+"_"+image_filename,
				size:720,
				type_resize:Type.IMAGE_RESIZE_NORMAL,
			},
			{
				image_filename:Type.IMAGE_SIZE_LARGE+"_"+image_filename,
				path_filename:upload_dir+"/"+Type.IMAGE_SIZE_LARGE+"_"+image_filename,
				size:1000,
				type_resize:Type.IMAGE_RESIZE_NORMAL,
			},
			{
				image_filename:Type.IMAGE_SIZE_SQUARE_THUMB+"_"+image_filename,
				path_filename:upload_dir+"/"+Type.IMAGE_SIZE_SQUARE_THUMB+"_"+image_filename,
				size:250,
				type_resize:Type.IMAGE_RESIZE_SQUARE,
			},
			{
				image_filename:Type.IMAGE_SIZE_SQUARE_MID+"_"+image_filename,
				path_filename:upload_dir+"/"+Type.IMAGE_SIZE_SQUARE_MID+"_"+image_filename,
				size:720,
				type_resize:Type.IMAGE_RESIZE_SQUARE,
			},
			{
				image_filename:Type.IMAGE_SIZE_SQUARE_LARGE+"_"+image_filename,
				path_filename:upload_dir+"/"+Type.IMAGE_SIZE_SQUARE_LARGE+"_"+image_filename,
				size:1000,
				type_resize:Type.IMAGE_RESIZE_SQUARE,
			},
		];
	}
}
class Url {
	//cart
	static CART_DELETE="item/cart_delete";
	static CART="item/cart";
	static CART_POST="item/cart_post";
	//cms
	static CMS_DEMO_POST="cms/demo_post";
	static CMS_POST="cms/post";
	static CMS_ITEM_PARENT_TOP_TYPE_CATEGORY="cms/item_parent_top_type_category";
	static CMS_SEARCH_ITEM_TYPE_CATEGORY="cms/search_item_type_category";
	//content
	static CONTENT="item/content";
	//crud
	static COPY="main/crud/copy";
	static DELETE="main/crud/delete";
	static DELETE_CHECK_PROTECTION="main/crud/delete_item_check_protection";
	static DELETE_SEARCH="main/crud/delete_search";
	static GET="main/crud/get";
	static PARENT_TOP="main/crud/parent_top";
	static POST="main/crud/post";
	static POST_LIST="main/crud/post_list";
	static SEARCH="main/crud/search";
	static DATABASE_INFO="main/crud/database_info";
	//dashboard
	static DASHBOARD_USER_HOME="dashboard/user_home";
	static DASHBOARD_APP_HOME="dashboard/app_home";
	//favorite
	static FAVORITE_POST="item/favorite_post";
	//field
	static CUSTOM_FIELD="item/custom_field";
	static FIELD_VALUE_POST="item/field_value_post";
	//image
	static IMAGE_POST="main/image/post";
	static IMAGE_CDN_POST="main/image/cdn_post";
	//order
	static ORDER_DELETE="item/order_delete";
	static ORDER="item/order";
	static ORDER_POST="item/order_post";
	//page
	static PAGE_ABOUT="page/about";
	static PAGE_BLOG_POST="page/blog_post";
	static PAGE_BLOG_POST_HOME="page/blog_post_home";
	static PAGE_BLOG_POST_SEARCH="page/blog_post_search";
	static PAGE_CONTACT="page/contact";
	static PAGE_EVENT="page/event";
	static PAGE_EVENT_HOME="page/event_home";
	static PAGE_EVENT_SEARCH="page/event_search";
	static PAGE_FAQ="page/faq";
	static PAGE_GALLERY="page/gallery";
	static PAGE_GALLERY_HOME="page/gallery_home";
	static PAGE_GALLERY_SEARCH="page/gallery_search";
	static PAGE_HOME="page/home";
	static PAGE_PRODUCT="page/product";
	static PAGE_PRODUCT_HOME="page/product_home";
	static PAGE_PRODUCT_SEARCH="page/product_search";
	static PAGE_SERVICE="page/service";
	static PAGE_SERVICE_HOME="page/service_home";
	static PAGE_SERVICE_SEARCH="page/service_search";
	static PAGE_REVIEW_HOME="page/review_home";
	//review
	static REVIEW_POST="item/review_post";
	static REVIEW_SEARCH="item/review_search";
	//user
	static USER_LOGIN="user/login";
	static USER_LOGOUT="user/logout";
	static USER_REGISTER="user/register";
	static USER_POST="user/post";
	//stat
	static STAT_SEARCH="item/stat_search";
	//template
	static TEMPLATE="item/template";
}
module.exports = {
	App_Logic,
	Admin_Logic,
	Blog_Post_Logic,
	Cart_Logic,
	Category_Logic,
	Content_Logic,
	DataItem,
	DataType,
	Demo_Logic,
	Event_Logic,
	Field_Logic,
	Favorite_Logic,
	Gallery_Logic,
	Item_Logic,
	Image_Logic,
	Message,
	Order_Logic,
	Page_Logic,
	Product_Logic,
	Review_Logic,
	Service_Logic,
	Sub_Item_Logic,
	Stat_Logic,
	Storage,
	Template_Logic,
	Type,
	Title,
	User_Logic,
	Url
};
