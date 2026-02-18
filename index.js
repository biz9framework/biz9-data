/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const async = require('async');
const {Scriptz}=require("biz9-scriptz");
const {Log,Str,Obj}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
//const {Cache} = require('./redis.js');
//const {Foreign} = require('./foreign.js');
//const {Group} = require('./group.js');
//const {Join} = require('./join.js');
//const {Adapter}  = require('./adapter.js');

class Value_Type {
    //type - search
    static COUNT = 'count';
    static ITEMS = 'items';
    static ONE = 'one';
}
class Table_Field {
    static DATE_CREATE='date_create';
    static TABLE='table';
    static DATE_SAVE='date_save';
    static ID='id';
    static ITEM='item';
    static ITEMS='items';
    static OBJ='obj';
    static GROUP='group';
    static USER='user';
    static USER_ID = 'user_id';
    static USER_TABLE='user_table';
    static PARENT_ID = 'parent_id';
    static PARENT_TABLE='parent_table';
    static SOURCE='source';
    static TITLE='title';
    static TITLE_URL='title_url';
}
class Data_Type {
    //result
    static RESULT_OK = 'resultOK';
    static RESULT_OK_DELETE = 'delete_resultOK';
    static RESULT_OK_GROUP_DELETE = 'group_delete_resultOK';
    static RESULT_OK_DELETE_CACHE = 'delete_cache_resultOK';
    static RESULT_OK_DELETE_DATABASE = 'delete_database_resultOK';
    //source
    static SOURCE='source';
    static SOURCE_TABLE='source_table';
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
}
class Data_Title {
    //general
    static GROUP='Group';
    static N_A='N/A';
    //source
    static SOURCE_DATABASE='Database';
    static SOURCE_CACHE='Cache';
    static SOURCE_NOT_FOUND='Not-Found';
}
class Data_Table {
    static BLANK='blank_biz';
    static GROUP='group_biz';
}
class Data_Logic {
    static get = (table,id,option) => {
        /* Option
         * count / 3
         * parent / {parent_table,parent_id}
         * user / {user_table,user_id}
         * data / {}
        */
        let data = {table:table,id:id};
        if(option.data){
            data = Obj.merge(data,option.data);
        }
        if(option.title){
            data[Table_Field.TITLE] = option.title;
            data[Table_Field.TITLE_URL] = Str.get_title_url(option.title);
        }
        if(option.parent){
            data[Table_Field.PARENT_TABLE] = option.parent[Table_Field.TABLE];
            data[Table_Field.PARENT_ID] = option.parent[Table_Field.ID];
        }
        if(option.user){
            data[Table_Field.USER_TABLE] = option.user[Table_Field.TABLE];
            data[Table_Field.USER_ID] = option.user[Table_Field.ID];
        }
        if(option.count){
            let data_items = [];
            if(!data.title){
                data.title = 'Item';
                data.title_url = Str.get_title_url(data.title);
            }
            for(let a = 1; a < option.count+1; a++){
                const copy = { ...data };
                copy.title = data.title + " " + a;
                copy.title_url = Str.get_title_url(copy.title);
                data_items.push(copy);
            }
            data = data_items;
        }
        return data;
    };
    static get_search = (table,filter,sort_by,page_current,page_size,option) => {
        console.log('aaaaaa');
        option = !Obj.check_is_empty(option) ? option : {};
        console.log('bbbb');
        return {table:table,filter:filter,sort_by:sort_by,page_current:page_current,page_size:page_size,option:option};
    }
    static get_group = (option) => {
        option = !Obj.check_is_empty(option)  ? option : {};
        let value_type  = option.value_type ? option.value_type : Value_Type.SEARCH_ITEMS;
        let field = option.field ? option.field : {};
        let title = option.title ? Str.get_title_url(option.title) : {};
        let page_current = option.page_current ? option.page_current : 1;
        let page_size = option.page_size ? option.page_size : 0;
        let foreigns = option.foreigns ? option.foreigns : [];
        return {value_type:value_type,field:field,title:title,page_current:page_current,page_size:page_size,foreigns:foreigns};
    }
    /*
    static get_foreign = (value_type,foreign_table,foreign_field,parent_field,option) => {
        option = !Obj.check_is_empty(option)  ? option : {};
        value_type = value_type ? value_type : Value_Type.SEARCH_ITEMS;
        foreign_table = foreign_table ? foreign_table : Str.get_title_url(Data_Logic.get_data_type_by_type(foreign_table,{plural:true}));
        foreign_field = foreign_field ? foreign_field : Table_Field.PARENT_ID;
        parent_field = parent_field ? parent_field : parent_field;
        let field = option.field ? option.field : null;
        let title = option.title ? Str.get_title_url(option.title) : Str.get_title_url(Data_Logic.get_data_type_by_type(foreign_table,{plural:true}));
        let page_current = option.page_current ? option.page_current : 1;
        let page_size = option.page_size ? option.page_size : 0;
        return {value_type:value_type,foreign_table:foreign_table,foreign_field:foreign_field,parent_field:parent_field,field:field,title:title,page_current:page_current,page_size:page_size};
    }
    static get_join = (value_type,search,option) => {
        option = !Obj.check_is_empty(option)  ? option : {};
        value_type = value_type ? value_type : Value_Type.SEARCH_ITEMS;
        search = search ? search : Data_Logic.get_search(Value_Type.DATA_BLANK,{},{},1,0);
        let field = option.field ? option.field : {};
        let distinct = option.distinct ? option.distinct : null; //distinct:{field:'title',sort_by:Data_Type.SORT_BY_DESC}
        let title = option.title ? Str.get_title_url(option.title) : Str.get_title_url(Data_Logic.get_data_type_by_type(search.data,{plural:true}));
        let foreigns = option.foreigns ? option.foreigns : [];
        let page_current = option.page_current ? option.page_current : 1;
        let page_size = option.page_size ? option.page_size : 0;
        return {value_type:value_type,search:search,field:field,title:title,distinct:distinct,foreigns:foreigns,page_current:page_current,page_size:page_size};
    }
    static copy = (table,item,option)=>{
        let copy_item = Data_Logic.get_new(table,0);
        option = !Obj.check_is_empty(option)  ? option : {};
        const keys = Object.keys(item);
        keys.forEach(key => {
            if(
                key!=Data_Field.ID&&
                key!=Data_Field.SOURCE&&
                key!=Data_Field.DATE_CREATE&&
                key!=Data_Field.DATE_SAVE&&
                key!=Data_Field.OBJ&&
                key!=Data_Field.USER&&
                key!=Data_Field.GROUP&&
                key!=Data_Field.ITEM&&
                !Obj.check_is_array(item[key])&&
                Obj.check_is_value(item[key])
            ){
                copy_item[key]=item[key];
            }
        });
        return copy_item;
    };
    static get_not_found = (table,id,option) =>{
        option=!Obj.check_is_empty(option)?option:{};
        if(!table){
            table = Data_Table.BLANK;
        }
        if(!id){
            id = 0;
        }
        let item = Data_Logic.get(table,id);
        item.id = 0;
        item.id_key = id;
        item.title = "Item Not Found";
        item.title_url = Str.get_title_url(item.title);
        item.source = Data_Title.SOURCE_NOT_FOUND;
        return item;
    };
    */
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
    module.exports = {
        Data_Logic
        //Database
        //Data
        /*
    Data_Table,
    Data_Type,
    Data_Title,
    Value_Type,
    Table_Field,
    */
    };
