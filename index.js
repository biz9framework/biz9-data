/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const async = require('async');
const {get_db_connect_main,check_db_connect_main,close_db_connect_main,update_item_main,get_item_main,delete_item_main,get_id_list_main,delete_item_list_main,count_item_list_main} = require('./mongo/index.js');
const {Scriptz}=require("biz9-scriptz");
const {Log,Str,Number,Obj}=require("/home/think2/www/doqbox/biz9-framework/biz9-utility/code");
const {DataItem,DataType,FieldType,Item_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const { get_db_connect_adapter,check_db_connect_adapter,close_db_connect_adapter,update_item_adapter,update_item_list_adapter,get_item_adapter,delete_item_adapter,get_item_list_adapter,delete_item_list_adapter,count_item_list_adapter,delete_item_cache }  = require('./adapter.js');
const {get_database_main} = require("./main");
class Database {
    static get = async (data_config,option) => {
        /* return
         * - n/a
         * option params
         * - biz9_config_file
         *   - source file for data config. / obj / ex. root folder biz9_config.
         * - app_id
         *   - database id. / string / ex. project_500
         */
        let cloud_error=null;
        return new Promise((callback) => {
            option = !Obj.check_is_empty(option) ? option : {biz9_config_file:null,app_id:null};
            if(option.biz9_config_file==null){
                option.biz9_config_file=null;
            }else{
                data_config = Scriptz.get_biz9_config(option);
            }
            if(option.app_id){
                data_config.app_id = option.app_id;
            }
            if(data_config.app_id==null){
                cloud_error=Log.append(cloud_error,"Database Error: Missing app_id.");
            }
            Data.open_db(data_config).then(([error,data])=>{
                cloud_error=Log.append(cloud_error,error);
                data.data_config=data_config;
                data.app_id=data_config.APP_ID;
                callback([error,data]);
            }).catch(error => {
                cloud_error=Log.append(cloud_error,error);
                Log.error("BiZItem-Get-Connect",error);
                callback([error,null]);
            });
        });
    }
    static close = async (database) => {
        /* option params
         * - database
         *      - connected database. / obj / ex. mongo db connection.
         * return objects
         *  - database
         *      - Disconnect database. / obj / ex. null. dispose db obj.
         *  - app_id
         *      - database id. / string / ex. project_500
         */
        let cloud_error=null;
        return new Promise((callback) => {
            Data.close_db(database).then(([error,data])=>{
                cloud_error=Log.append(cloud_error,error);
                callback([error,data]);
            }).catch(error => {
                cloud_error=Log.append(cloud_error,error);
                Log.error("DB-Close",error);
                callback([error,null]);
            });
        });
    }
}
class List_Data {
    static get_list = (database,data_type,filter,sort_by,page_current,page_size,option) => {
        /* option params
         * - database
         *    - tbd
         * - filter
         *    - tbd
         * - sort_by
         *    - tbd
         * - page_current
         *    - tbd
         * - page_size
         *    - tbd
         * - option
         *    - get_group / bool / ex. true,false / def. false /n/a
         *    - group_search / search obj / ex. {} /n/a
         *
         *    - group_child_data_type / category /
         *    - group_parent_field / title /
         *    - group_child_field / category /
         *
         *    - get_photo / bool / ex. true,false / def. false /n/a
         *    - photo_count / int / ex. 1-999 / def. 19 /n/a
         *    - photo_sort_by / query obj / ex. {date_create:1} /n/a
         *
         * -  return objects
         *    - cloud_data
         *      - item_count
         *      - page_count
         *      - filter
         *      - data_type
         *      - item_list
         */
        return new Promise((callback) => {
            let cloud_data = {item_list:[],item_count:0,page_count:0,filter:filter,data_type:data_type,app_id:database.app_id};
            let child_item_list = [];
            let error=null;
            option = !Obj.check_is_empty(option) ? option : {get_item:true};
            async.series([
                function(call){
                    Log.w('data_type',data_type);
                    Log.w('filter',filter);
                    Log.w('sort_by',sort_by);
                    Log.w('page_current',page_current);
                    Log.w('page_size',page_size);
                    Data.get_list(database,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=>{
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            if(data.length>0){
                                cloud_data.item_list=data;
                                cloud_data.item_count=item_count;
                                cloud_data.page_count=page_count;
                                cloud_data.filter = filter;
                                cloud_data.data_type = data_type;
                                cloud_data.app_id = database.app_id;
                                call();
                            }else{
                                call();
                            }
                        }
                    }).catch(error => {
                        error=Log.append(error,error);
                    });
                },
                function(call){
                    if(option.get_group){
                        Log.w('option',option);
                    option.group_search = option.group_search ? option.group_search : Item_Logic.get_search(DataType.BLANK,{},{title:1},1,999);
                    Data.get_list(database,option.group_search.data_type,option.group_search.filter,option.group_search.sort_by,option.group_search.page_current,option.group_search.page_size).then(([error,data,item_count,page_count])=>{
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            if(data.length>0){
                                child_item_list=data;
                                call();
                            }else
                            {
                                call();
                            }
                        }
                    }).catch(error => {
                        error=Log.append(error,error);
                    });
                        }else{
                            call();
                        }
                },
                function(call){
                    if(option.get_group){
                        for(let a = 0; a<child_item_list.length;a++){
                            for(let b = 0; b<child_item_list.length;b++){
                                child_item_list[a][option.group_parent_field].items = [];
                                if(child_item_list[a][option.group_parent_field] == child_item_list[b][option.group_child_field]){
                                    child_item_list[a][option.group_parent_field].items.push(child_item_list[b][option.group_child_field]);
                                }
                            }
                        }
                        call();
                    }else{
                        call();
                    }
                }
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("List-Data-Get",error);
                callback([error,[]]);
            });
        });
    };
    static get_parent_child_list = (full_item_list) => {
        /* option params
         * - full_item_list
         *      - List of objects. Bind all child id values to matching parent id. / list / ex. Products and child attributes items.
         * return objects
         * - full_item_list
         *      - Binded list of objects. / list / ex. Products now binded to child items.
         */
        return new Promise((callback) => {
            let new_item_list=[];
            async.series([
                function(call){
                    for(let a=0; a<full_item_list.length; a++){
                        let item_title_url = Str.get_title_url(full_item_list[a].title);
                        let new_item = full_item_list[a];
                        new_item.items = [];
                        new_item_list[item_title_url] = full_item_list[a];
                        new_item_list[item_title_url].items = [];
                        for(let b=0;b<full_item_list.length;b++){
                            if(full_item_list[a].id == full_item_list[b].parent_id){
                                new_item.items.push(full_item_list[b]);
                            }
                        }
                        new_item_list.push(new_item);
                    }
                    call();
                },
                function(call){
                    for(let a=0; a<new_item_list.length; a++){
                        let item_title_url = Str.get_title_url(new_item_list[a].title);
                        let new_item = new_item_list[a];
                        new_item.items=[];
                        new_item_list[item_title_url] = new_item_list[a];
                        new_item_list[item_title_url].items =[];
                        for(let b=0;b<new_item_list.length;b++){
                            let sub_item_title_url = Str.get_title_url(new_item_list[b].title);
                            if(new_item_list[a].id == new_item_list[b].parent_id){
                                let sub_item = new_item_list[b];
                                sub_item.items = [];
                                new_item.items.push(sub_item);
                                new_item_list[a][sub_item_title_url] = sub_item;
                                new_item_list[a][sub_item_title_url].items = [];
                            }
                        }
                    }
                    call();
                },
            ]).then(result => {
                callback([error,new_item_list]);
            }).catch(error => {
                Log.error("Portal-Get",error);
                callback([error,[]]);
            });
        });
    };
}
class Blog_Post_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            cloud_data.blog_post = {data_type:DataType.BLOG_POST,id:0,photos:[],items:[]};
            let error = null;
            if(option == null){
                option = {get_item:false,get_photo:false}
            }
            if(option.get_item==null){
                option.get_item=false;
            }
            if(option.get_photo==null){
                option.get_photo=false;
            }
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.BLOG_POST,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                            cloud_data.blog_post = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Blog_Post--Data-Get",error);
                callback([error,[]]);
            });
        });
    };
    static get_list = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {item_list:[],item_count:0,page_count:0};
            let error=null;
            if(option==null){
                option = {get_item:true};
            }
            async.series([
                async function(call){
                    const [error,data] = await List_Data.get_list(database,DataType.BLOG_POST,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Blog_Post-Get-List",error);
                callback([error,[]]);
            });
        });
    };
}
class Event_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            cloud_data.event = {data_type:DataType.EVENT,id:0,photos:[],items:[]};
            let error = null;
            if(option == null){
                option = {get_item:false,get_photo:false}
            }
            if(option.get_item==null){
                option.get_item=false;
            }
            if(option.get_photo==null){
                option.get_photo=false;
            }
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.EVENT,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                            cloud_data.event = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Event--Data-Get",error);
                callback([error,[]]);
            });
        });
    };
    static get_list = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {item_list:[],item_count:0,page_count:0};
            option = !Obj.check_is_empty(option) ? option : {get_item:true};
            let error=null;
            async.series([
                async function(call){
                    const [error,data] = await List_Data.get_list(database,DataType.EVENT,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Event-Get-List",error);
                callback([error,[]]);
            });
        });
    };
}
class Content_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            cloud_data.content = {data_type:DataType.CONTENT,id:0,photos:[],items:[]};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            option.get_item = !Str.check_is_null(option.get_item) ? option.get_item : false;
            option.get_photo = !Str.check_is_null(option.get_photo) ? option.get_photo : false;
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.CONTENT,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                            cloud_data.content = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Product--Data-Get",error);
                callback([error,[]]);
            });
        });
    };
    static get_list = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {item_list:[],item_count:0,page_count:0};
            let error=null;
            option = !Obj.check_is_empty(option) ? option : {get_item:true};
            async.series([
                async function(call){
                    const [error,data] = await List_Data.get_list(database,DataType.CONTENT,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Product-Get-List",error);
                callback([error,[]]);
            });
        });
    };
}

class Product_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            cloud_data.product = {data_type:DataType.PRODUCT,id:0,photos:[],items:[]};
            let error = null;
            if(option == null){
                option = {get_item:false,get_photo:false}
            }
            if(option.get_item==null){
                option.get_item=false;
            }
            if(option.get_photo==null){
                option.get_photo=false;
            }
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.PRODUCT,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                            cloud_data.product = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Product--Data-Get",error);
                callback([error,[]]);
            });
        });
    };
    static get_list = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {item_list:[],item_count:0,page_count:0};
            let error=null;
            if(option==null){
                option = {get_item:true};
            }
            async.series([
                async function(call){
                    const [error,data] = await List_Data.get_list(database,DataType.PRODUCT,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Product-Get-List",error);
                callback([error,[]]);
            });
        });
    };

}
class Page_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            cloud_data.page = {data_type:DataType.PAGE,id:0,photos:[],items:[]};
            let error = null;
            if(option == null){
                option = {get_item:false,get_photo:false,get_business:false}
            }
            if(option.get_item==null){
                option.get_item=false;
            }
            if(option.get_photo==null){
                option.get_photo=false;
            }
            if(option.get_business==null){
                option.get_business=false;
            }
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.PAGE,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                            cloud_data.page = data;
                    }
                },
                async function(call){
                    if(option.get_business){
                    cloud_data.business = {data_type:DataType.BUSINESS,id:0};
                    const [error,data] = await Business_Data.get(database,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        if(data.id){
                            cloud_data.business = data;
                        }
                    }
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Page-Get",error);
                callback([error,[]]);
            });
        });
    };
}
class Template_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            cloud_data.template = {data_type:DataType.TEMPLATE,id:0,photos:[],items:[]};
            let error = null;
            if(option == null){
                option = {get_item:false,get_photo:false,get_business:false}
            }
            if(option.get_item==null){
                option.get_item=false;
            }
            if(option.get_photo==null){
                option.get_photo=false;
            }
            if(option.get_business==null){
                option.get_business=false;
            }
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.TEMPLATE,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                            cloud_data.template = data;
                    }
                },
                async function(call){
                    if(option.get_business){
                    cloud_data.business = {data_type:DataType.BUSINESS,id:0};
                    const [error,data] = await Business_Data.get(database,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        if(data.id){
                            cloud_data.business = data;
                        }
                    }
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Template-Get",error);
                callback([error,[]]);
            });
        });
    };
}
class Category_Data {
    static get_list = (database,filter,sort_by,page_current,page_size,option) => {
        /* option params
         * - database
         *    - tbd
         * - filter
         *    - tbd
         * - sort_by
         *    - tbd
         * - page_current
         *    - tbd
         * - page_size
         *    - tbd
         * - option
         *    - get_photo / bool / ex. true,false / def. false /n/a
         *    - get_product / bool / ex. true,false / def. false /n/a
         *    - photo_count / int / ex. 1-999 / def. 19 /n/a
         *    - photo_sort_by / query obj / ex. {date_create:1} /n/a
         * -  return objects
         *    - cloud_data
         *      - item_count
         *      - page_count
         *      - filter
         *      - data_type
         *      - item_list
         */
        return new Promise((callback) => {
            let cloud_data = {item_list:[],item_count:0,page_count:0};
            let product_list = [];
            let search = {};
            let error=null;
            if(option==null){
                option = {get_product:false};
            }
            if(option.get_product==null){
                option.get_product=false;
            }

            async.series([
                async function(call){
                    search = Item_Logic.get_search(DataType.CATEGORY,filter,sort_by,page_current,page_size);
                    const [error,data] = await List_Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
                async function(call){
                    if(option.get_product){

                    search = Item_Logic.get_search(DataType.PRODUCT,{},{},1,999);
                    const [error,data] = await List_Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        product_list = data.item_list;
                    }
                    }
                },
                function(call){
                    if(option.get_product){
                        for(let a = 0;a<cloud_data.item_list.length;a++){
                            cloud_data.item_list[a].product_count = 0;
                            cloud_data.item_list[a].products = [];
                            for(let b = 0;b<product_list.length;b++){
                                if(cloud_data.item_list[a].title == product_list[b].category){
                                    cloud_data.item_list[a].product_count = cloud_data.item_list[a].product_count + 1;
                                    let add = true;
                                    for(let c = 0;c<cloud_data.item_list[a].products.length;c++){
                                        if(cloud_data.item_list[a].products[c].id == product_list[b].id){
                                            add = false;
                                        }
                                    }
                                    if(add){
                                        cloud_data.item_list[a].products.push(product_list[b]);
                                    }
                                }
                            }
                        }
                        call();
                    }else{
                        call();
                    }
                },

            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Portal-Get",error);
                callback([error,[]]);
            });
        });
    };
}
class Business_Data {
    static get = async (database,option) => {
        return new Promise((callback) => {
            let error = null;
            let data_type = DataType.BUSINESS;
            let business = {data_type:DataType.BUSINESS,id:0};
            if(option == null){
                option = {};
            }
            async.series([
                function(call){
                    let filter = {};
                    let sort_by = {};
                    let page_current = 1;
                    let page_size = 3;
                    Data.get_list(database,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            if(data.length>0){
                                business = data[0];
                            }
                        }
                        call();
                    }).catch(error => {
                        Log.error("Portal-Business-Data",error);
                        error = Log.append(error,error);
                        call();
                    });
                },

            ]).then(result => {
                callback([error,business]);
            }).catch(error => {
                Log.error("Business-Data-Get",error);
                callback([error,[]]);
            });
        });
    };
}
class Admin_Data {
    static get = async (database,option) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let error = null;
            let data_type = DataType.ADMIN;
            let admin = {data_type:DataType.ADMIN,id:0};
            if(option == null){
                option = {};
            }
            async.series([
                function(call){
                    let filter = {};
                    let sort_by = {};
                    let page_current = 1;
                    let page_size = 3;
                    Data.get_list(database,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            if(data.length>0){
                                admin = data[0];
                            }
                        }
                        call();
                    }).catch(error => {
                        Log.error("Portal-Admin-Data",error);
                        error = Log.append(error,error);
                        call();
                    });
                },

            ]).then(result => {
                callback([error,admin]);
            }).catch(error => {
                Log.error("Admin-Data-Get",error);
                callback([error,[]]);
            });
        });
    };
}
class Portal {
    static get = async (database,data_type,key,option) => {
        /*
         *
         * Params
         * - title
         *   - description: n/a / type: n/a / example: n/a / required: n/a
         *
         * Option
         * - get_item
         *   - description: n/a / type: bool / example: true / required: false
         * - get_photo
         *   - description: n/a / type: bool / example: true / required: false
         * - photo_count
         *   - description: n/a / type: int / example: 19 / required: false
         * - photo_sort_by
         *   - description: n/a / type: obj / example: {date_create:1} / required: false
         * Return
         * - title
         *   - description: n/a / type: n/a
         *
         */
        return new Promise((callback) => {
            let error = null;
            let item = {data_type:data_type,id:0,items:[],photos:[],app_id:database.app_id};
            let full_item_list = [];
            let new_item_list = [];
            if(option == null){
                option = {get_item:false,get_photo:false,title_url:null}
            }
            if(option.get_item==null){
                option.get_item=false;
            }
            if(option.get_photo==null){
                option.get_photo=false;
            }
            async.series([
                function(call){
                    if(!Number.check_is_guid(key)){
                        option.title_url = key;
                    }
                    call();
                },
                function(call){
                    Data.get_item(database,data_type,key,option).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            item = data;
                            item.items = [];
                            item.photos = [];
                        }
                        call();
                    }).catch(error => {
                        Log.error("Portal-Get-Key-A",error);
                        error = Log.append(error,error);
                        call();
                    });
                },
                function(call){
                    let filter = {};
                    if(item.id && option.get_item || option.get_section){
                        if(Str.check_is_null(item.top_id)){
                            filter={top_id:item.id};
                        }else{
                            filter={top_id:item.top_id};
                        }
                        let data_type = DataType.ITEM;
                        let sort_by={title:-1};
                        let page_current = 1;
                        let page_size = 999999;
                        Data.get_list(database,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=> {
                            if(error){
                                error=Log.append(error,error);
                            }else{
                                if(data.length > 0){
                                    full_item_list = data;
                                }
                            }
                            call();
                        }).catch(error => {
                            error = Log.append(error,error);
                            call();
                        });
                    }else{
                        call();
                    }
                },
                async function(call){
                    if(item.id && option.get_item || option.get_section){
                        const [error,data] = await List_Data.get_parent_child_list(full_item_list);
                        new_item_list = data;
                    }
                },
                function(call){
                    if(item.id && option.get_item || option.get_section){
                        for(let a=0; a<new_item_list.length; a++){
                            if(new_item_list[a].parent_id == item.id){
                                let item_title_url = Str.get_title_url(new_item_list[a].title);
                                item[item_title_url] = new Object();
                                item[item_title_url] = new_item_list[a];
                                item.items.push(new_item_list[a]);
                            }
                        }
                        call();
                    }
                    else{
                        call();
                    }
                },
                async function(call){
                    if(option.get_photo){
                        if(option.photo_count == null){
                            option.photo_count = 19;
                        }
                        if(option.photo_sort_by == null){
                            option.photo_sort_by = {date_create:1};
                        }
                        let filter = {parent_id:item.id};
                        let sort_by = option.photo_sort_by;
                        let page_current = 1;
                        let page_size = option.photo_count;
                        const [error,data] = await Portal.get_list(database,DataType.PHOTO,filter,sort_by,page_current,page_size,option);
                        if(data.item_list.length > 0){
                            item.photos = data.item_list;
                        }
                    }
                },
            ]).then(result => {
                callback([error,item]);
            }).catch(error => {
                Log.error("Portal-Get",error);
                callback([error,[]]);
            });
        });
    };
    static get_list = (database,data_type,filter,sort_by,page_current,page_size,option) => {
        /* option params
         * Items
         *  - get_item / bool / ex. true,false / def. true
         * Photos
         *  - get_photo / bool / ex. true,false / def. true
         *  - photo_count / int / ex. 1-999 / def. 19
         *  - photo_sort_by / query obj / ex. {date_create:1}
         */
        return new Promise((callback) => {
            let cloud_data = {item_list:[],item_count:0,page_count:0,app_id:database.app_id};
            let error=null;
            if(option==null){
                option = {get_item:true};
            }
            async.series([
                function(call){
                    Data.get_list(database,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=>{
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.item_count=item_count;
                            cloud_data.page_count=page_count;
                            cloud_data.filter=filter;
                            cloud_data.data_type=data_type;
                            if(data.length>0){
                                cloud_data.item_list=data;
                                call();
                            }else{
                                call();
                            }
                        }
                    }).catch(error => {
                        error=Log.append(error,error);
                    });
                },
                async function(call){
                    if(option.get_item){
                        const [error,data] = await List_Data.get_parent_child_list(cloud_data.item_list);
                        cloud_data.item_list = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Portal-Get",error);
                callback([error,[]]);
            });
        });
    };
    static update = async (database,data_type,item_data,option) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let error = null;
            let item = DataItem.get_new(data_type,0);
            if(option == null){
                option = {};
            }
            async.series([
                function(call){
                    Data.update_item(database,data_type,item_data).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            item = data;
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        call();
                    });
                },
            ]).then(result => {
                callback([error,item]);
            }).catch(error => {
                Log.error("Update-Item",error);
                callback([error,[]]);
            });
        });
    };
    static delete_cache_item = async (database,data_type,key,option) => {
        /*
         * params
         * - title_tbd
         *   - description. / type / ex.
         * option
         * - title_tbd
         *   - description. / type / ex.
         * return
         * - title_tbd
         *   - description. / type / ex.
         *
         */
        return new Promise((callback) => {
            let error = null;
            let item = DataItem.get_new(data_type,0);
            if(option == null){
                option = {};
            }
            async.series([
                function(call){
                    if(Number.check_is_guid(key)){
                        Data.get_item(database,data_type,key).then(([error,data])=> {
                            if(error){
                                error=Log.append(error,error);
                            }else{
                                item = data;
                            }
                            call();
                        }).catch(error => {
                            Log.error("Delete-Cache-Item-A",error);
                            error = Log.append(error,error);
                            call();
                        });
                    }else{
                        let filter = {};
                        if(key){
                            filter = {title_url:key};
                        }
                        let sort_by = {title:-1};
                        let page_current = 1;
                        let page_size = 3;
                        Data.get_list(database,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=> {
                            if(error){
                                error=Log.append(error,error);
                            }else{
                                if(data.length>0){
                                    item = data[0];
                                }
                            }
                            call();
                        }).catch(error => {
                            Log.error("Delete-Cache-Item-B",error);
                            error = Log.append(error,error);
                            call();
                        });
                    }
                },
                function(call){
                    Data.delete_cache_item(database,data_type,item.id).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            item = data;
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        call();
                    });
                },
            ]).then(result => {
                callback([error,item]);
            }).catch(error => {
                Log.error("Delete-Cache-Item",error);
                callback([error,[]]);
            });
        });
    };
    static delete = async (database,data_type,id,option) => {
        /*
         * Params
         * - title
         *   - description / type / example / required
         * Option
         * - delete_items
         *   - description / bool / example / default: false
         * - delete_photos
         *   - description / bool / example / default: false
         * Return
         * - title
         *   - description / type /
         */
        return new Promise((callback) => {
            let error = null;
            let item = DataItem.get_new(data_type,id,{delete_items:false,delete_photos:false});
            if(option == null){
                option = {delete_items:false,delete_photos:false};
            }
            if(option.delete_items==null){
                option.delete_items=false;
            }
            if(option.delete_photos==null){
                option.delete_photos=false;
            }
            async.series([
                function(call){
                    Data.delete_item(database,data_type,id).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            item = data;
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        call();
                    });
                },
                function(call){
                    if(option.delete_items){
                        let data_type = DataType.ITEM;
                        let filter = {parent_id:item.id};
                        Data.delete_list(database,data_type,filter).then(([error,data])=> {
                            if(error){
                                error=Log.append(error,error);
                            }else{
                                item.delete_items = true;
                            }
                            call();
                        }).catch(error => {
                            error = Log.append(error,error);
                            call();
                        });
                    }else{
                        call();
                    }
                },
                function(call){
                    if(option.delete_photos){
                        let data_type = DataType.PHOTO;
                        let filter = {parent_id:item.id};
                        Data.delete_list(database,data_type,filter).then(([error,data])=> {
                            if(error){
                                error=Log.append(error,error);
                            }else{
                                item.delete_photos = true;
                            }
                            call();
                        }).catch(error => {
                            error = Log.append(error,error);
                            call();
                        });
                    }else{
                        call();
                    }
                },
            ]).then(result => {
                callback([error,item]);
            }).catch(error => {
                Log.error("Delete-Item",error);
                callback([error,[]]);
            });
        });
    };
    //class Portal
    static update_list = async (database,item_data_list,option) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let error = null;
            let item_list = [];
            if(option == null){
                option = {}
            }
            async.series([
                function(call){
                    Data.update_list(database,item_data_list).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            item_list = data;
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        call();
                    });
                },
            ]).then(result => {
                callback([error,item_list]);
            }).catch(error => {
                Log.error("Update-List-Data",error);
                callback([error,[]]);
            });
        });
    };
    static delete_list = async (database,data_type,filter,option) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let error = null;
            let item_list = [];
            if(option == null){
                option = {};
            }
            async.series([
                function(call){
                    Data.delete_list(database,data_type,filter).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            item_list = data;
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        call();
                    });
                },

            ]).then(result => {
                callback([error,item_list]);
            }).catch(error => {
                Log.error("Delete-List-Data",error);
                callback([error,[]]);
            });
        });
    };
    static count = async (database,data_type,filter,option) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let error = null;
            let count = 0;
            if(option == null){
                option = {};
            }
            async.series([
                function(call){
                    Data.count_list(database,data_type,filter).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            count = data;
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        call();
                    });
                },
            ]).then(result => {
                callback([error,count]);
            }).catch(error => {
                Log.error("Count-List-Data",error);
                callback([error,[]]);
            });
        });
    };
    static copy = async (database,data_type,id,option) => {
        /*
         * params
         * - title_tbd
         *   - description. / type / ex.
         * options
         * - title_tbd
         *   - description. / type / ex.
         * return
         * - title_tbd
         *   - description. / type / ex.
         *
         */
        return new Promise((callback) => {
            let error = null;
            let top_item = {data_type:data_type,id:0};
            let copy_top_item = {data_type:data_type,id:0};
            let item_list = [];
            let copy_item_list = [];
            if(option == null){
                option = {get_item:false,get_photo:false}
            }
            async.series([
                function(call){
                    Data.get_item(database,data_type,id).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }
                        top_item=data;
                        call();
                    })
                },
                function(call){
                    copy_top_item[FieldType.TITLE] = 'Copy '+top_item[FieldType.TITLE];
                    copy_top_item[FieldType.TITLE_URL] = 'copy_'+top_item[FieldType.TITLE_URL];
                    copy_top_item[FieldType.SOURCE_ID] = top_item.id;
                    copy_top_item[FieldType.SOURCE_DATA_TYPE] = top_item.data_type;

                    for(const key in top_item) {
                        if(key!=FieldType.ID&&key!=FieldType.SOURCE&&key!=FieldType.TITLE&&key!=FieldType.TITLE_URL){
                            copy_top_item[key]=top_item[key];
                        }
                    }
                    call();
                },
                function(call){
                    Data.update_item(database,copy_top_item.data_type,copy_top_item).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            copy_top_item=data;
                        }
                        call();
                    }).catch(error => {
                        error=Log.append(error,error);
                        call();
                    });
                },
                function(call){
                    if(top_item.id){
                        let filter={top_id:top_item.id};
                        let data_type=DataType.ITEM;
                        let sort_by={title:-1};
                        let page_current = 1;
                        let page_size = 999;
                        Data.get_list(database,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=> {
                            if(error){
                                error=Log.append(error,error);
                            }else{
                                if(data.length > 0){
                                    item_list = data;
                                }
                            }
                            call();
                        }).catch(error => {
                            error = Log.append(error,error);
                            call();
                        });
                    }else{
                        call();
                    }
                },
                function(call){
                    let source_top_items = [];
                    for(let a=0;a<item_list.length;a++){
                        let copy_sub_item={data_type:DataType.ITEM,id:0,top_id:copy_top_item.id,top_data_type:copy_top_item.data_type};
                        copy_sub_item[FieldType.SOURCE_ID] = item_list[a].id;
                        copy_sub_item[FieldType.SOURCE_DATA_TYPE] = item_list[a].data_type;
                        copy_sub_item[FieldType.SOURCE_PARENT_ID] = item_list[a].parent_id;
                        copy_sub_item[FieldType.SOURCE_PARENT_DATA_TYPE] = item_list[a].parent_data_type;
                        copy_sub_item[FieldType.SOURCE_TOP_ID] = item_list[a].top_id;
                        copy_sub_item[FieldType.SOURCE_TOP_DATA_TYPE] = item_list[a].top_data_type;
                        for(const key in item_list[a]) {
                            if( key != FieldType.ID && key != FieldType.SOURCE && key != FieldType.PARENT_ID && key != FieldType.PARENT_DATA_TYPE ){
                                copy_sub_item[key] = item_list[a][key];
                            }
                        }
                        copy_item_list.push(copy_sub_item);
                    }
                    call();
                },
                function(call){
                    Data.update_list(database,copy_item_list).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }
                        copy_item_list=data;
                        call();
                    })
                },
                function(call){
                    for(let a=0;a<copy_item_list.length;a++){
                        if(copy_item_list[a][FieldType.SOURCE_PARENT_ID] == top_item.id){
                            copy_item_list[a][FieldType.PARENT_ID] = copy_top_item[FieldType.ID];
                            copy_item_list[a][FieldType.PARENT_DATA_TYPE] = copy_top_item[FieldType.DATA_TYPE];
                        }else{
                            for(let b=0;b<copy_item_list.length;b++){
                                if(copy_item_list[a][FieldType.SOURCE_PARENT_ID] == copy_item_list[b][FieldType.SOURCE_ID] && !copy_item_list[a][FieldType.PARENT_ID] ){
                                    copy_item_list[a][FieldType.PARENT_ID] = copy_item_list[b][FieldType.ID];
                                    copy_item_list[a][FieldType.PARENT_DATA_TYPE] = copy_item_list[b][FieldType.DATA_TYPE];
                                }
                            }
                        }
                    }
                    call();
                },
                function(call){
                    Data.update_list(database,copy_item_list).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }
                        copy_item_list=data;
                        call();
                    })
                },
            ]).then(result => {
                callback([error,copy_top_item]);
            }).catch(error => {
                Log.error("Blank-Get",error);
                callback([error,[]]);
            });
        });
    };
}
class Blank {
    static get = async (database,data_type,title_url,option) => {
        /*
         *
         * Params
         * - title
         *   - description: n/a / type: n/a / example: n/a / required: true
         *
         * Option
         * - title
         *   - description: n/a / type: n/a / example: n/a / required: false
         *
         * Return
         * - title
         *   - description: n/a / type: n/a
         *
         */
        return new Promise((callback) => {
            let error = null;
            let top_item = {data_type:data_type,id:0,photos:[],items:[]};
            if(option == null){
                option = {get_item:false,get_photo:false}
            }
            async.series([
                function(call){
                    Data.get(database).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            top_item = data;
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        call();
                    });
                },
                function(call){
                },
            ]).then(result => {
                callback([error,item_data]);
            }).catch(error => {
                Log.error("Blank-Get",error);
                callback([error,[]]);
            });
        });
    };
}
class Faq{
    static get = (database,title_url,option) => {
        return new Promise((callback) => {
            let faq = DataItem.get_new(DataType.FAQ,0,{questions:[]});
            let error = null;
            let items = [];
            series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.FAQ,title_url,option);
                    if(data.id){
                        faq=data;
                        faq.questions=[];
                    }
                    call();
                },
                async function(call){
                    for(let a=0;a<19;a++){
                        if(faq[faq["field_"+a]]){
                            faq.questions.push({question:faq["field_"+a],answer:faq[faq["field_"+a]]});
                        }
                    }
                    call();
                },
            ],
                function(error, result){
                    callback([error,faq]);
                });
        });
    }
}
class Stat_Data {
   static update_item_view_count = async (database,data_type,id,customer_id,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let new_view = false;
            let item_count = 0;
            cloud_data.item = DataItem.get_new(data_type,0);
            cloud_data.stat = DataItem.get_new(DataType.STAT,0,{count:0,item_id:id,customer_id:customer_id,type_id:FieldType.STAT_VIEW_ID});
            let error = null;
            async.series([
               async function(call){
                    let search = Item_Logic.get_search(DataType.STAT,{customer_id:cloud_data.item.customer_id,item_id:cloud_data.item.id,type_id:FieldType.STAT_VIEW_ID},{},1,999);
                    const [error,data] = await Portal.count(database,search.data_type,search.filter);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        new_view = data<=0 ? true : false;
                        cloud_data.item.count = data;
                    }
                },
                //get item
                async function(call){
                    if(new_view){
                        console.log('aaaaaaaa');
                    const [error,data] = await Portal.get(database,cloud_data.item.data_type,cloud_data.item.id,{get_item:false});
                        Log.w('data',data);
                        /*
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        if(data.id){
                            cloud_data.item = data;
                        }
                    }
                    */
                    }
                    Log.w('cloud_44',cloud_data);
                },
                /*
                //save stat
                async function(call){
                    if(new_view){
                    const [error,data] = await Portal.update(database,DataType.STAT,cloud_data.stat);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        if(data.id){
                            cloud_data.stat = data;
                        }
                    }
                }
                    Log.w('cloud',cloud_data);
                },
                 //update item
                async function(call){
                    if(new_view){
                        cloud_data.item.view_count = cloud_data.item.view_count>0 ? (parseInt(cloud_data.item.view_count + 1)): 1;
                    const [error,data] = await Portal.update(database,cloud_data.item.data_type,cloud_data.item);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        if(data.id){
                            cloud_data.item = data;
                        }
                    }

                    }
            },
            */
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("-Update-Item-View-Count-",error);
                callback([error,[]]);
            });
        });
    };

    /*
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            cloud_data.blog_post = {data_type:DataType.BLOG_POST,id:0,photos:[],items:[]};
            let error = null;
            if(option == null){
                option = {get_item:false,get_photo:false}
            }
            if(option.get_item==null){
                option.get_item=false;
            }
            if(option.get_photo==null){
                option.get_photo=false;
            }
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.BLOG_POST,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        if(data.id){
                            cloud_data.blog_post = data;
                        }
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Blog_Post--Data-Get",error);
                callback([error,[]]);
            });
        });
    };
    static get_list = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {item_list:[],item_count:0,page_count:0};
            let error=null;
            if(option==null){
                option = {get_item:true};
            }
            async.series([
                async function(call){
                    const [error,data] = await List_Data.get_list(database,DataType.BLOG_POST,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },

            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Blog_Post-Get-List",error);
                callback([error,[]]);
            });
        });
    };
module.exports = function(){
    // item = {item_data_type,item_tbl_id,customer_id,type_id}
    STAT_VIEW_ID='1';
    STAT_LIKE_ID='2';
    STAT_POST_ID='3';
    module.get_customer_item_like_list=function(customer_like_list,item_list,callback){
        for(var a=0;a<customer_like_list.length;a++){
            for(var b=0;b<item_list.length;b++){
                if(customer_like_list[a].item_tbl_id==item_list[b].tbl_id){
                    item_list[b].customer_like='true';
                }
            }
        }
            callback(null,item_list);
    }
    module.update_item_view_count=function(db,item_data_type,item_tbl_id,customer_id,callback){
        var new_view=true;
        var item_count=0;
        var update_item = biz9.get_new_item(item_data_type,item_tbl_id);
        var new_stat = biz9.get_new_item(DT_STAT,0);
        var error=null;
        async.series([
            function(call){
                if(customer_id){
                    sql = {customer_id:customer_id,item_tbl_id:item_tbl_id,type_id:STAT_VIEW_ID};
                    sort={};
                    dataz.get_sql_cache(db,DT_STAT,sql,sort,function(error,data_list) {
                        if(data_list.length>0){
                            new_view=false;
                        }
                        call();
                    });
                }else{
                    call();
                }
            },
            function(call){
                if(new_view){
                    new_stat.item_data_type=item_data_type;
                    new_stat.item_tbl_id=item_tbl_id;
                    new_stat.customer_id=customer_id;
                    new_stat.type_id=STAT_VIEW_ID;
                    biz9.update_item(db,DT_STAT,new_stat,function(error,data) {
                        call();
                    });
                }else{
                    call();
                }
            },
            function(call){
                if(new_view){
                    sql={type_id:STAT_VIEW_ID,item_tbl_id:item_tbl_id};
                    biz9.count(db,DT_STAT,sql,function(error,data) {
                        if(!data){
                            item_count=0;
                        }else if(data==STAT_VIEW_ID){
                            item_count=0;//bug fix
                        }else{
                            item_count=parseInt(data);
                        }
                        call();
                    });
                }else{
                    call();
                }
            },
            function(call){
                if(new_view){
                    update_item.view_count=parseInt(item_count)+1;
                    biz9.update_item(db,item_data_type,update_item,function(error,data) {
                        update_item=data;
                        call();
                    });
                }else{
                    call();
                }
            },
        ],
            function(err, result){
                update_item.new_view=new_view;
                callback(error,update_item);
            });
    }
    module.update_item_like_count=function(db,item_data_type,item_tbl_id,customer_id,callback){
        var new_like=true;
        var item_count=0;
        var update_item = biz9.get_new_item(item_data_type,item_tbl_id);
        var new_stat = biz9.get_new_item(DT_STAT,0);
        var error=null;
        async.series([
            function(call){
                if(customer_id){
                    sql = {customer_id:customer_id,item_tbl_id:item_tbl_id,type_id:STAT_LIKE_ID};
                    sort={};
                    dataz.get_sql_cache(db,DT_STAT,sql,sort,function(error,data_list) {
                        if(data_list.length>0){
                            new_like=false;
                        }
                        call();
                    });
                }else{
                    call();
                }
            },
            function(call){
                if(new_like){
                    new_stat.item_data_type=item_data_type;
                    new_stat.item_tbl_id=item_tbl_id;
                    new_stat.customer_id=customer_id;
                    new_stat.type_id=STAT_LIKE_ID;
                    biz9.update_item(db,DT_STAT,new_stat,function(error,data) {
                        call();
                    });
                }else{
                    call();
                }
            },
            function(call){
                if(new_like){
                    sql={type_id:STAT_LIKE_ID,item_tbl_id:item_tbl_id};
                    biz9.count(db,DT_STAT,sql,function(error,data) {
                        if(!data){
                            item_count=1;
                        }else{
                            item_count=parseInt(data);
                        }
                        call();
                    });
                }else{
                    item_count=1;
                    call();
                }
            },
            function(call){
                update_item.like_count=item_count;
                    biz9.update_item(db,item_data_type,update_item,function(error,data) {
                        update_item=data;
                        call();
                    });
            },
        ],
            function(err, result){
                update_item.new_like=new_like;
                callback(error,update_item);
            });
    }
        return module;
}
    */
}

class Data {
    static open_db = async (data_config) => {
        return [error,data] = await get_db_connect_adapter(data_config);
    };
    static close_db = async (db_connect) => {
        return [error,data] = await close_db_connect_adapter(db_connect);
    };
    static check_db = async (db_connect) => {
        return check_db_connect_adapter(db_connect);
    };
    static update_item = async (db_connect,data_type,item_data) => {
        return [error,data] = await update_item_adapter(db_connect,data_type,item_data);
    };
    static get_item = async (db_connect,data_type,key,option) => {
        return [error,data] = await get_item_adapter(db_connect,data_type,key,option);
    };
    static delete_item = async (db_connect,data_type,id) => {
        return [error,data] = await delete_item_adapter(db_connect,data_type,id);
    };
    static delete_cache_item = async (db_connect,data_type,id) => {
        return [error,data] = await delete_item_cache(db_connect,data_type,id);
    };
    static update_list = async (db_connect,item_data_list) => {
        return [error,data] = await update_item_list_adapter(db_connect,item_data_list);
    };
    static get_list = async (db_connect,data_type,filter,sort_by,page_current,page_size) => {
        const [error,data,item_count,page_count] = await get_item_list_adapter(db_connect,data_type,filter,sort_by,page_current,page_size);
        return [error,data,item_count,page_count];
    };
    static delete_list = async (db_connect,data_type,filter) => {
        return [error,data_list] = await delete_item_list_adapter(db_connect,data_type,filter);
    };
    static count_list = async (db_connect,data_type,filter) => {
        return [error,data] = await count_item_list_adapter(db_connect,data_type,filter);
    };
}
module.exports = {
    Admin_Data,
    Business_Data,
    Category_Data,
    Content_Data,
    Data,
    Database,
    List_Data,
    Page_Data,
    Template_Data,
    Portal,
    Product_Data,
    Blog_Post_Data,
    Event_Data,
    Stat_Data,
};
