/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const async = require('async');
const {Scriptz}=require("biz9-scriptz");
const {Log,Str,Num,Obj,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Type,Favorite_Logic,Stat_Logic,Review_Logic,Data_Logic,Product_Logic,Demo_Logic,Category_Logic,Cart_Logic,Order_Logic,Field_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-logic/source");
const {Cache} = require('./redis.js');
const {Foreign} = require('./foreign.js');
const {Group} = require('./group.js');
const {Join} = require('./join.js');
const {Adapter}  = require('./adapter.js');
class Search_Type {
    //type - search
    static ITEMS='items';
    static ONE='one';
    static COUNT='count';
}
class Data_Field{
    //result
    static RESULT_OK = 'resultOK';
    static RESULT_OK_DELETE = 'delete_resultOK';
    static RESULT_OK_GROUP_DELETE = 'group_delete_resultOK';
    static RESULT_OK_GROUP_IMAGE_DELETE = 'group_image_delete_resultOK'; //remove
    static RESULT_OK_IMAGE_DELETE = 'image_delete_resultOK'; //remove

    static RESULT_OK_DELETE_CACHE = 'delete_cache_resultOK';
    static RESULT_OK_DELETE_DATABASE = 'delete_database_resultOK';
    static SOURCE='source';
    static SOURCE_DATA_TYPE='source_data_type';
    static SOURCE_KEY='source_key';
    static SOURCE_ID='source_id';
    static SOURCE_PARENT_ID='source_parent_id';
    //sort_by
    static SORT_BY_ASC='asc';
    static SORT_BY_DESC='desc';
    //data_source
    static DATA_SOURCE_CLIENT_CACHE="client_cache";
    static DATA_SOURCE_SERVER_CACHE="server_cache";
    static DATA_SOURCE_DATABASE="database";
    static DATA_SOURCE_CLIENT="client";
    static DATA_SOURCE_SERVER="server";
    static DATA_SOURCE_NOT_FOUND="not_found";

    //static FIELD_GROUP_ID='group_id';
}
class Data_Title{
    //general
    static GROUP='Group';
    static N_A='N/A';
    //source
    static SOURCE_DATABASE='Database';
    static SOURCE_CACHE='Cache';
    static SOURCE_NOT_FOUND='Not-Found';
}
class Data_Type {
    static BLANK='blank_biz';
    static GROUP='group_biz';
}
class Data_Logic {
    static get_new = (data_type,id,option) => {
        return Data_Logic.get(data_type,id,option);
    };
    static get_search = (data_type,filter,sort_by,page_current,page_size,option) => {
        option = !Obj.check_is_empty(option)  ? option : {};
        return {data_type:data_type,filter:filter,sort_by:sort_by,page_current:page_current,page_size:page_size,option:option};
    }
    static get_search_group = (option) => {
        option = !Obj.check_is_empty(option)  ? option : {};
        let type  = option.type ? option.type : Type.SEARCH_ITEMS;
        let field = option.field ? option.field : {};
        let title = option.title ? Str.get_title_url(option.title) : {};
        let image = option.image ? option.image : false;
        let page_current = option.page_current ? option.page_current : 1;
        let page_size = option.page_size ? option.page_size : 0;
        return {type:type,field:field,title:title,image:image,page_current:page_current,page_size:page_size};
    }
    static get_search_foreign = (type,foreign_data_type,foreign_field,parent_field,option) => {
        option = !Obj.check_is_empty(option)  ? option : {};
        type = type ? type : Type.SEARCH_ITEMS;
        foreign_data_type = foreign_data_type ? foreign_data_type : Str.get_title_url(Data_Logic.get_data_type_by_type(foreign_data_type,{plural:true}));
        foreign_field = foreign_field ? foreign_field : Type.FIELD_PARENT_ID;
        parent_field = parent_field ? parent_field : parent_field;
        let field = option.field ? option.field : null;
        let title = option.title ? Str.get_title_url(option.title) : Str.get_title_url(Data_Logic.get_data_type_by_type(foreign_data_type,{plural:true}));
        let page_current = option.page_current ? option.page_current : 1;
        let page_size = option.page_size ? option.page_size : 0;
        return {type:type,foreign_data_type:foreign_data_type,foreign_field:foreign_field,parent_field:parent_field,type:type,field:field,title:title,page_current:page_current,page_size:page_size};
    }
    static get_search_join = (type,search,option) => {
        option = !Obj.check_is_empty(option)  ? option : {};
        type = type ? type : Type.SEARCH_ITEMS;
        search = search ? search : Data_Logic.get_search(Type.DATA_BLANK,{},{},1,0);
        let field = option.field ? option.field : {};
        let distinct = option.distinct ? option.distinct : null; //distinct:{field:'title',sort_by:Type.SEARCH_SORT_BY_DESC}
        let title = option.title ? Str.get_title_url(option.title) : Str.get_title_url(Data_Logic.get_data_type_by_type(search.data_type,{plural:true}));
        let foreigns = option.foreigns ? option.foreigns : [];
        let page_current = option.page_current ? option.page_current : 1;
        let page_size = option.page_size ? option.page_size : 0;
        return {type:type,search:search,field:field,title:title,distinct:distinct,foreigns:foreigns,page_current:page_current,page_size:page_size};
    }
    static copy = (data_type,item,option)=>{
        let copy_item = Data_Logic.get_new(data_type,0);
        option = !Obj.check_is_empty(option)  ? option : {};
        const keys = Object.keys(item);
        keys.forEach(key => {
            if(
                key!=Type.FIELD_ID&&
                key!=Type.FIELD_SOURCE&&
                key!=Type.FIELD_DATE_CREATE&&
                key!=Type.FIELD_DATE_SAVE&&
                key!=Type.TITLE_OBJ&&
                key!=Type.TITLE_USER&&
                key!=Type.TITLE_GROUP&&
                key!=Type.TITLE_ITEM&&
                !Obj.check_is_array(item[key])&&
                Obj.check_is_value(item[key])
            ){
                copy_item[key]=item[key];
            }
        });
        return copy_item;
    };
    static get_not_found = (data_type,id,option) =>{
        option=!Obj.check_is_empty(option)?option:{};
        if(!data_type){
            data_type = Type.DATA_BLANK;
        }
        if(!id){
            id = 0;
        }
        if(data_type != Type.DATA_USER){
            if(!id){
                id=0;
            }
            let item = Data_Logic.get(data_type,id);
            item.id = 0;
            item.id_key = id;
            item.title = "Item Not Found";
            item.title_url = Str.get_title_url(item.title);
            item.source = Type.TITLE_SOURCE_NOT_FOUND;
            return item;
        }else{
            let user = Data_Logic.get(data_type,id);
            user.id = 0;
            user.id_key = id;
            user.title = "User Not Found";
            user.first_name = "User Not Found";
            user.title_url = Str.get_title_url(user.title);
            user.source = Type.TITLE_SOURCE_NOT_FOUND;
            return user;
        }
    };

}
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
        let error=null;
        let data={};
        return new Promise((callback) => {
            option = !Obj.check_is_empty(option) ? option : {biz9_config_file:null,app_id:null};
            if(option.biz9_config_file==null){
                option.biz9_config_file=null;
            }else{
                data_config = Scriptz.get_biz9_config(option);
            }
            if(option.app_id){
                data_config.APP_ID = option.app_id;
            }
            if(data_config.APP_ID==null){
                error=Log.append(error,"Database Error: Missing app_id.");
            }
            Adapter.get_database(data_config).then(([biz_error,biz_data])=>{
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    biz_data.data_config=data_config;
                    biz_data.app_id=data_config.APP_ID;
                    callback([error,biz_data]);
                }
            }).catch(err => {
                Log.error('Data-Database-Get',err);
                error=Log.append(error,err);
            });
        });
    }
    static delete = async (database) => {
        /* option params
         * - database
         *      - connected database. / obj / ex. mongo db connection.
         * return objects
         *  - database
         *      - Disconnect database. / obj / ex. null. dispose db obj.
         *  - app_id
         *      - database id. / string / ex. project_500
         */
        let error=null;
        return new Promise((callback) => {
            Adapter.delete_database(data_config).then(([biz_error,biz_data])=>{
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    biz_data.data_config=data_config;
                    biz_data.app_id=data_config.APP_ID;
                    callback([err,null]);
                }
            }).catch(err => {
                Log.error('Data-Db-Delete',err);
                error=Log.append(error,err);
            });
        });
    }
    static info = async (database,option) => {
        /* return
         * tbd
         */
        return new Promise((callback) => {
            let data = [];
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {};
            async.series([
                async function(call){
                    const collections = await database.listCollections().toArray();
                    for (const collectionInfo of collections) {
                        const collectionName = collectionInfo.name;
                        const collection = database.collection(collectionName);
                        const count = await collection.estimatedDocumentCount();
                        data.push({title:collectionName,item_count:count});
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("Database-Info",err);
                callback([err,null]);
            });
        });
    }
}
class Data {
    //9_portal_get
    static get = async(database,data_type,id,option) => {
        /* Options
         * ID
           - id_field / type. str / ex. title_url / default. id
         * Cache
           - cache_delete / type. bool / ex. true/false / default. false
         * Fields
           - field / type. obj / ex. {field_show_1:1,field_hide_2:0} / default. throw error
         * Sub Values ( Page Edit )
           - sub_value / type. bool / ex. true/false / default. throw error
         *  Group
            -- groups / type. obj. group_search / ex. [
                    {
                        type:Type.Type.SEARCH_ITEMS,Type.SEARCH_ONE,
                        field:{field_show_1:1,field_hide_2:0},
                        title:{group_show_1:1,group_hide_2:0},
                        page_current:1,
                        page_size:0,
                    }];
         *  Foreign
            -- foreigns / type. obj. foreign_search / ex. [
                    {
                        type:Type.Type.SEARCH_ITEMS,Type.SEARCH_ONE,
                        foreign_data_type:Type.DATA_PRODUCT,
                        foreign_field:'id',
                        parent_field:'parent_id',
                        field:{field_show_1:1,field_hide_2:0},
                        title:'field_title',
                        page_current:1,
                        page_size:0,
                    }];
         *  Join
            -- joins / type. obj. join_search / ex. [
                    {
                        type:Type.Type.SEARCH_ITEMS,Type.SEARCH_ONE
                        search:search_obj,
                        title:'field_title',
                        page_current:1,
                        page_size:0
                    }];
           --
         * Stat
            -- stat / type. obj / ex. [
                    {
                        user_id:123,
                        type:Type.STAT_VIEW,
                        unique:true/false,
                        print:true/false
                    };
                    */
        return new Promise((callback) => {
            let error= null;
            let cache = null;
            let data = Data_Logic.get(data_type,0);
            let field_result_ok = false;
            option = !Obj.check_is_empty(option) ? option : {};
            async.series([
                async function(call) {
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                function(call){
                    if(option.cache_delete){
                        Adapter.delete_item_cache(database,cache,data.data_type,data.id,option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                call();
                            }
                        }).catch(err => {
                            Log.error('Data-Delete-Cache',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
                //item_by_id
                function(call){
                    Adapter.get_item(database,cache,data_type,id,option).then(([biz_error,biz_data])=>{
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            data = biz_data;
                            call();
                        }
                    }).catch(err => {
                        Log.error('Data-Get',err);
                        error=Log.append(error,err);
                    });
                },
                //9_get_item_join 9_join get_item
                function(call){
                    if(option.joins){
                        Join.get_data(database,cache,option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                for(const search_item of biz_data){
                                    data[search_item.title] = search_item.data;
                                }
                                call();
                            }
                        }).catch(err => {
                            Log.error('Data-Get-Item-Join',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
                //9_group //9_get_group get_item_group
                function(call){
                    if(option.groups && data.id){
                        Group.get_data(database,cache,[data],option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                data = biz_data[0];
                            }
                            call();
                        }).catch(err => {
                            Log.error('Data-Item-Group',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
                //sub_value
                function(call){
                    if(option.sub_value && data.id){
                        if(!option.foreigns){
                            option.foreigns = [];
                        }
                        option.foreigns.push(Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_SUB_VALUE,Type.Field_PARENT_ID,Type.FIELD_ID));
                        call();
                    }else{
                        call();
                    }
                },
                //9_foreigns //9_get_foreigns get_item_foreign
                function(call){
                    if(option.foreigns && data.id){
                        Foreign.get_data(database,cache,[data],option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                data = biz_data[0];
                            }
                            call();
                        }).catch(err => {
                            Log.error('Data-Search-Foreign',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
                async function(call){
                    if(option.sub_value && data.id){
                        data.sub_values = Data_Logic.get_sub_value_items(data.sub_values);;
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("ERROR-PORTAL-GET",err);
                callback([error,{}]);
            });
        });
    };
    //9_portal_search
    static search = (database,data_type,filter,sort_by,page_current,page_size,option) => {
        /* OPTIONS - START
         * Fields
           - field / type. obj / ex. {field_show_1:1,field_hide_2:0} / default. throw error
         * Distinct
           - distinct / type. obj.
                    {
                        field:'title'
                        sort_by:Type.SEARCH_SORT_BY_ASC,
                    };
         *  Foreign
            -- foreigns / type. obj items / ex. [
                    {
                        type:Type.Type.SEARCH_ITEMS,Type.SEARCH_ONE,Type.SEARCH_ONE
                        foreign_data_type:Type.DATA_ITEM,
                        foreign_field:'id',
                        parent_field:'parent_id',
                        field:{field_show_1:1,field_hide_2:0},
                        title:'field_title',
                    }];
         *  Join
            -- joins / type. obj. join_search / ex. [
                    {
                        type:Type.Type.SEARCH_ITEMS,Type.SEARCH_ONE
                        search:search_obj,
                        title:'field_title',
                        page_current:1,
                        page_size:0
                    }];
         *  Group
            -- groups / type. obj. group_search / ex. [
                    {
                        type:Type.Type.SEARCH_ITEMS,Type.SEARCH_ONE,
                        field:{field_show_1:1,field_hide_2:0},
                        title:{group_show_1:1,group_hide_2:0},
                        page_current:1,
                        page_size:0,
                    }];

         * Return
            - data_type
            - item_count
            - page_count
            - filter
            - items
        /* OPTIONS - END*/
        return new Promise((callback) => {
            let data = {data_type:data_type,item_count:0,page_count:1,filter:{},items:[]};
            let cache = null;
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {};
            async.series([
                async function(call) {
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                function(call){
                    let search = Data_Logic.get_search(data_type,filter,sort_by,page_current,page_size);
                    Adapter.get_item_list(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            data.item_count=item_count;
                            data.page_count=page_count;
                            data.search=search;
                            data[Type.FIELD_ITEMS]=items;
                        }
                        call();
                    }).catch(err => {
                        Log.error('Data-Search',err);
                        error=Log.append(error,err);
                    });
                },
                //9_get_items_join 9_join get_items
                function(call){
                    if(option.joins){
                        Join.get_data(database,cache,option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                for(const search_item of biz_data){
                                    data[search_item.title] = search_item.data;
                                }
                                call();
                            }
                        }).catch(err => {
                            Log.error('Data-Get-Item-Join',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
                //9_foreigns //9_get_foreigns get_items_foreign
                function(call){
                    if(option.foreigns && data[Type.FIELD_ITEMS].length > 0){
                        Foreign.get_data(database,cache,data[Type.FIELD_ITEMS],option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                data[Type.FIELD_ITEMS] = biz_data;
                                call();
                            }
                        }).catch(err => {
                            Log.error('Data-Search-Foreign',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
                //9_get_items_group 9_group
                function(call){
                    if(option.groups && data[Type.FIELD_ITEMS].length>0){
                        Group.get_data(database,cache,data[Type.FIELD_ITEMS],option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                data[Type.FIELD_ITEMS] = biz_data;
                            }
                            call();
                        }).catch(err => {
                            Log.error('Data-Item-Group',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error('DATA-PORTAL-SEARCH-ERROR',err);
                callback([err,[]]);
            });
        });
    };
    //9_portal_post
    static post = async (database,data_type,data,option) => {
        /* option params
         * Fields
           - overwrite / type. bool / ex. true,false / default. false -- post brand new obj.deleteing old.
           - reset / type. bool / ex. true,false / default. false -- get update item aka recently saved item.
           - clean / type. bool / ex. true,false / default. false -- checks and removes any list, groups, etc.
           - delete_cache / type. bool / ex. true,false / default. false -- clear cache.
           */
        return new Promise((callback) => {
            let error = null;
            let cache = {};
            option = !Obj.check_is_empty(option) ? option : {};
            async.series([
                async function(call) {
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                //clean
                function(call){
                    if(option.clean){
                        let new_data = {};
                        for(const field in data){
                            if(!Obj.check_is_array(data[field]) &&
                                !Obj.check_is_array(data[field]) &&
                                Obj.check_is_value(data[field]) &&
                                !Str.check_if_str_exist(field,'_item_count') &&
                                !Str.check_if_str_exist(field,'_page_count'))
                            {
                                new_data[field] = data[field];
                            }
                        }
                        data = new_data;
                        call();
                    }else{
                        call();
                    }
                },
                //delete cache item
                function(call){
                    if(option.overwrite || option.delete_cache){
                        Adapter.delete_item_cache(database,cache,data_type,data.id).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                call();
                            }
                        }).catch(err => {
                            Log.error('Data-Post-Delete-Cache',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
                function(call){
                    Adapter.post_item(database,cache,data_type,data,option).then(([biz_error,biz_data])=>{
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            data = biz_data;
                            call();
                        }
                    }).catch(err => {
                        Log.error('Data-Post-Post-Item-Apapter',err);
                        error=Log.append(error,err);
                    });
                },
                //reset
                function(call){
                    if(option.reset && data.id){
                        Adapter.get_item(database,cache,data.data_type,data.id).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                data = biz_data;
                                call();
                            }
                        }).catch(err => {
                            Log.error('Data-Get-Reset',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("Post-Data",err);
                callback([err,{}]);
            });
        });
    };
    //9_portal_post_bulk
    static post_bulk = async (database,data_type,items) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let error = null;
            let data = Data_Logic.get(data_type,0);
            async.series([
                async function(call){
                    const [biz_error,biz_data] = await Adapter.post_bulk(database,data_type,items);
                    if(biz_error){
                        error=Log.append(error,biz_error);
                    }else{
                        data = biz_data;
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("Post-Bulk-Data",err);
                callback([err,{}]);
            });
        });
    };
    //9_portal_delete
    static delete = async(database,data_type,id,option) => {
        /*
         * Params
         * - title
         *   - description / type / example / required
         * Option
         *   - delete_group / bool / true/false / default: false - delete Type.DATA_GROUP
         *   - delete_image / bool / true/false / default: false - delete Type.DATA_GROUP
         * Return
         * - tbd
         */
        return new Promise((callback) => {
            let error = null;
            let cache = null;
            let data = Data_Logic.get(data_type,id);
            data[Type.FIELD_RESULT_OK_DELETE] = false;
            data[Type.FIELD_RESULT_OK_DELETE_CACHE] = false;
            data[Type.FIELD_RESULT_OK_DELETE_DATABASE] = false;
            data[Type.FIELD_RESULT_OK_GROUP_DELETE] = false;
            data[Type.FIELD_RESULT_OK_GROUP_IMAGE_DELETE] = false;
            option = !Obj.check_is_empty(option) ? option : {delete_group:true,delete_image:true};
            let delete_group_list = [];
            async.series([
                async function(call){
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    const [biz_error,biz_data] = await Adapter.delete_item(database,cache,data_type,id);
                    if(biz_error){
                        error=Log.append(error,biz_error);
                    }else{
                        if(biz_data[Type.FIELD_RESULT_OK_DELETE]){
                            data[Type.FIELD_RESULT_OK_DELETE]  = true;
                            data[Type.FIELD_RESULT_OK_DELETE_CACHE] = true;
                            data[Type.FIELD_RESULT_OK_DELETE_DATABASE] = true;
                        }
                    }
                },
                async function(call){
                    if(option.delete_group){
                        data[Type.FIELD_RESULT_OK_GROUP_DELETE] = false;
                        let filter = {parent_id:data.id};
                        let data_type = Type.DATA_GROUP;
                        const [biz_error,biz_data] = await Data.delete_search(database,data_type,filter);
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            if(biz_data[Type.FIELD_RESULT_OK_DELETE]){
                                data[Type.FIELD_RESULT_OK_GROUP_DELETE] = true;
                                data[Type.FIELD_RESULT_OK_GROUP_IMAGE_DELETE] = true;
                            }
                        }
                    }
                },
                async function(call){
                    if(option.delete_image){
                        data[Type.FIELD_RESULT_OK_IMAGE_DELETE] = false;
                        let filter = {parent_id:data.id};
                        let data_type = Type.DATA_IMAGE;
                        const [biz_error,biz_data] = await Data.delete_search(database,data_type,filter);
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            if(biz_data[Type.FIELD_RESULT_OK_DELETE]){
                                data[Type.FIELD_RESULT_OK_IMAGE_DELETE] = true;
                            }
                        }
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("Delete-Item",err);
                callback([err,{}]);
            });
        });
    };
    //9_portal_post_items - 9_post_items
    static post_items = async (database,data_items) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let cache = {};
            let error = null;
            async.series([
                async function(call) {
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    const [biz_error,biz_data] = await Adapter.post_item_list(database,cache,data_items);
                    if(biz_error){
                        error=Log.append(error,biz_error);
                    }else{
                        data_items = biz_data;
                    }
                },
            ]).then(result => {
                callback([error,data_items]);
            }).catch(err => {
                Log.error("Post-List-Data",err);
                callback([err,{}]);
            });
        });
    };
    //9_portal_delete_search
    static delete_search = async (database,data_type,filter,option) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let error = null;
            let data = Data_Logic.get(data_type,0,{data:{filter:filter}});
            let cache = {};
            data[Type.FIELD_RESULT_OK_DELETE] = false;
            data[Type.FIELD_RESULT_OK_GROUP_IMAGE_DELETE] = false;
            let delete_item_query = { $or: [] };
            let delete_group_list = [];
            let delete_items = [];
            option = !Obj.check_is_empty(option) ? option : {delete_group:true,delete_image:true};
            async.series([
                async function(call) {
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                function(call){
                    let search = Data_Logic.get_search(data_type,filter,{},1,0);
                    Adapter.get_item_list(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            if(items.length>0){
                                delete_items = items;
                            }
                            call();
                        }
                    }).catch(err => {
                        Log.error('Data-Search',err);
                        error=Log.append(error,err);
                    });
                },
                async function(call){
                    for(const data_item of delete_items){
                        let query_field = {};
                        query_field[Type.FIELD_PARENT_ID] = data_item.id
                        delete_item_query.$or.push(query_field);
                        data[Type.FIELD_RESULT_OK_DELETE] = true;
                        const [biz_error,biz_data] = await Adapter.delete_item(database,cache,data_item.data_type,data_item.id);
                    }
                },
                //get_group_ids
                function(call){
                    if(option.delete_group && delete_item_query.$or.length > 0){
                        let data_type = Type.DATA_GROUP;
                        let search = Data_Logic.get_search(data_type,{},{},1,0,{field:{id:1,title:1,data_type:1}});
                        Adapter.get_item_list(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                delete_group_list = items;
                                call();
                            }
                        });
                    }else{
                        call();
                    }
                },
                //delete_group_photo
                async function(call){
                    if(option.delete_group && delete_group_list.length > 0){
                        let query = { $or: [] };
                        let delete_group_photo_query = { $or: [] };
                        for(const data_item of delete_group_list){
                            let query_field = {};
                            query_field[Type.FIELD_PARENT_ID] = data_item.id
                            delete_group_photo_query.$or.push(query_field);
                        };
                        let data_type = Type.DATA_IMAGE;
                        let search = Data_Logic.get_search(data_type,delete_group_photo_query,{},1,0);
                        const [biz_error,biz_data] = await Adapter.delete_item_list(database,cache,data_type,search.filter);
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            data[Type.FIELD_RESULT_OK_GROUP_IMAGE_DELETE] = true;
                        }
                    }
                },
                async function(call){
                    if(option.delete_group && delete_item_query.$or.length > 0){
                        data[Type.FIELD_RESULT_OK_GROUP_DELETE] = false;
                        let data_type = Type.DATA_GROUP;
                        let search = Data_Logic.get_search(data_type,delete_item_query,{},1,0);
                        const [biz_error,biz_data] = await Adapter.delete_item_list(database,cache,data_type,search.filter);
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            data[Type.FIELD_RESULT_OK_GROUP_DELETE] = true;
                        }
                    }
                },
                async function(call){
                    if(option.delete_image && delete_item_query.$or.length > 0){
                        data[Type.FIELD_RESULT_OK_IMAGE_DELETE] = false;
                        let data_type = Type.DATA_IMAGE;
                        let search = Data_Logic.get_search(data_type,delete_item_query,{},1,0);
                        const [biz_error,biz_data] = await Adapter.delete_item_list(database,cache,data_type,search.filter);
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            data[Type.FIELD_RESULT_OK_IMAGE_DELETE] = true;
                        }
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("Delete-List-Data",err);
                callback([err,[]]);
            });
        });
    };
    //9_portal_count
    static count = async (database,data_type,filter) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let error = null;
            let cache = {};
            let data = {};
            async.series([
                async function(call) {
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    const [biz_error,biz_data] = await Adapter.get_count_item_list(database,cache,data_type,filter);
                    if(biz_error){
                        error=Log.append(error,biz_error);
                    }else{
                        data = biz_data.count;
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("Count-List-Data",err);
                callback([err,{}]);
            });
        });
    };
    //9_portal_copy
    static copy = async (database,data_type,id,option) => {
        /*
         * params
         * - title_tbd
         *   - description. / type / ex.
         * options
         * - copy_group
         *   - description. / type / ex. true/false
         * return
         * - title_tbd
         *   - description. / type / ex.
         *
         */
        return new Promise((callback) => {
            let error = null;
            let cache = {};
            let data = Data_Logic.get(data_type,id);
            let top_data = Data_Logic.get(data_type,0);
            let copy_data = Data_Logic.get(data_type,0);
            option = !Obj.check_is_empty(option) ? option : {};
            async.series([
                async function(call) {
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    let data_group_option = Data_Logic.get_search_group();
                    const [biz_error,biz_data] = await Data.get(database,data_type,id,{groups:[data_group_option]});
                    if(biz_error){
                        error=Log.append(error,biz_error);
                    }else{
                        top_data=biz_data;
                    }
                },
                //top_item
                async function(call){
                    if(top_data.id){
                        copy_data = Data_Logic.copy(data_type,top_data);
                        copy_data[Type.FIELD_TITLE] = 'Copy '+top_data[Type.FIELD_TITLE];
                        copy_data[Type.FIELD_TITLE_URL] = 'copy_'+top_data[Type.FIELD_TITLE_URL];
                        copy_data[Type.FIELD_SOURCE_ID] = top_data.id;
                        copy_data[Type.FIELD_SOURCE_DATA_TYPE] = top_data.data_type;
                        const [biz_error,biz_data] = await Data.post(database,copy_data.data_type,copy_data);
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            copy_data=biz_data;
                        }
                    }else{
                        copy_data = Data_Logic.get_not_found(data_type,id);
                    }
                },
                async function(call){
                    if(top_data.id && top_data.groups.length > 0){
                        copy_data.groups = [];
                        let post_groups = [];
                        for(const group of top_data.groups){
                            let copy_group = Data_Logic.copy(Type.DATA_GROUP,group);
                            copy_group[Type.FIELD_TITLE] = 'Copy '+group[Type.FIELD_TITLE];
                            copy_group[Type.FIELD_TITLE_URL] = 'copy_'+group[Type.FIELD_TITLE_URL];
                            copy_group[Type.FIELD_SOURCE_ID] = group.id;
                            copy_group[Type.FIELD_SOURCE_DATA_TYPE] = group.data_type;

                            copy_group[Type.FIELD_PARENT_DATA_TYPE] = copy_data.data_type;
                            copy_group[Type.FIELD_PARENT_ID] = copy_data.id;
                            post_groups.push(copy_group);
                        }
                        const [biz_error,biz_data] = await Adapter.post_item_list(database,cache,post_groups);
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            copy_data.groups=biz_data;
                        }
                    }
                },
            ]).then(result => {
                data = copy_data;
                callback([error,data]);
            }).catch(err => {
                Log.error("Copy",err);
                callback([err,{}]);
            });
        });
    };
}
module.exports = {
    Database,
    Data,
};
