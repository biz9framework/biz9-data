/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Foreign
*/
const async = require('async');
const {Log,Str,Num,Obj,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Data_Value_Type,Data_Logic,Data_Table}=require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {Adapter}  = require('./adapter.js');
class Foreign {
   static get_data = async (database,cache,data_items,option) => {
        return new Promise((callback) => {
            async.series([
                async function(call){
                    for(const item of option.foreigns){
                        const biz_data = await Foreign.get_foreign_data(database,cache,item,data_items);
                        data_items = biz_data;
                    }
                },
            ]).then(result => {
                callback(data_items);
            }).catch(err => {
                Log.error("Foreign-Get-Data",err);
                callback([err,{}]);
            });
        });
    };
    static get_foreign_data = async (database,cache,foreign,data_items) => {
        // --works
        return new Promise((callback) => {
            let response = {};
            let data = {};
            let has_parent = false;
            let has_sub = false;
            let parent_search_item = Foreign.get_search(foreign);
            async.series([
                async function(call){
                    if(foreign){
                        has_parent = true;
                    }
                    if(foreign?.foreigns[0]){
                        has_sub = true;
                    }
                },
                async function(call){
                    if(has_parent){
                        for(let data_item of data_items){
                            if(!Str.check_is_null(data_item.id)){
                                let query_field = {};
                                if(!Str.check_is_null(data_item[parent_search_item.parent_field])){
                                    query_field[parent_search_item.foreign_field] = data_item[parent_search_item.parent_field];
                                    parent_search_item.query.$or.push(query_field);
                                }
                            }
                        }
                        if(parent_search_item.value_type == Data_Value_Type.ITEMS){
                            if(parent_search_item.query.$or.length){
                                const biz_data = await Foreign.get_items_data(database,cache,parent_search_item);
                                for(let data_item of data_items){
                                    const match_items = biz_data.filter(item_find => item_find[parent_search_item.foreign_field] === data_item[parent_search_item.parent_field]);
                                    if(match_items.length>0){
                                        if(!data_item[parent_search_item.title]){
                                            data_item[parent_search_item.title] = [];
                                        }
                                        data_item[parent_search_item.title] = [...match_items];
                                    }else{
                                        data_item[parent_search_item.title] = [];
                                    }
                                }
                            }
                        }
                        if(parent_search_item.value_type == Data_Value_Type.COUNT){
                            const biz_data = await Foreign.get_items_data(database,cache,parent_search_item);
                            for(let data_item of data_items){
                                const match_items = biz_data.filter(item_find => item_find[parent_search_item.foreign_field] === data_item[parent_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[parent_search_item.title]){
                                        data_item[parent_search_item.title] = 0;
                                    }
                                    data_item[parent_search_item.title] = match_items.length;
                                }else{
                                    data_item[parent_search_item.title] = 0;
                                }
                            }
                        }
                        if(parent_search_item.value_type == Data_Value_Type.ONE){
                            const biz_data = await Foreign.get_items_data(database,cache,parent_search_item);
                            for(let data_item of data_items){
                                const match_items = biz_data.filter(item_find => item_find[parent_search_item.foreign_field] === data_item[parent_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[parent_search_item.title]){
                                        data_item[parent_search_item.title] = {};
                                    }
                                    data_item[parent_search_item.title] = match_items[0];
                                }else{
                                    data_item[parent_search_item.title] = Data_Logic.get_not_found(parent_search_item.foreign_table,0);
                                }
                            }
                        }
                    }
                },
                async function(call){
                    if(has_sub){
                        for(const item of foreign.foreigns){
                            const biz_data = await Foreign.get_foreign_sub(database,cache,item,parent_search_item,data_items);
                            data_items = biz_data;
                        }
                    }
                },
            ]).then(result => {
                callback(data_items);
            }).catch(err => {
                Log.error("Foreign-Get-Foreign-Data",err);
                callback([err,{}]);
            });
        });
    };
    static get_foreign_sub = async (database,cache,foreign,parent_search_item,data_items) => {
        /* options
           - none
           */
        return new Promise((callback) => {
            let  sub_search_item = {};
            async.series([
                async function(call){
                    // -- get sub
                    sub_search_item = Foreign.get_search(foreign);
                    for(let data_item of data_items){
                        if(data_item[parent_search_item.title]){
                            for(let sub_data_item of data_item[parent_search_item.title]){
                                if(!Str.check_is_null(sub_data_item.id)){
                                    let query_field = {};
                                    if(!Str.check_is_null(sub_data_item[sub_search_item.parent_field])){
                                        query_field[sub_search_item.foreign_field] = sub_data_item[sub_search_item.parent_field];
                                        sub_search_item.query.$or.push(query_field);
                                    }
                                }
                            }
                        }
                    }
                    if(sub_search_item.value_type == Data_Value_Type.ITEMS){
                        if(sub_search_item.query.$or.length>0){
                            const biz_data = await Foreign.get_items_data(database,cache,sub_search_item);
                            for(let data_item of data_items){
                                for(let sub_data_item of data_item[parent_search_item.title]){
                                    const match_items = biz_data.filter(item_find => item_find[sub_search_item.foreign_field] === sub_data_item[sub_search_item.parent_field]);
                                    if(match_items.length>0){
                                        if(!sub_data_item[sub_search_item.title]){
                                            sub_data_item[sub_search_item.title] = [];
                                        }
                                        sub_data_item[sub_search_item.title] = [...match_items];
                                    }
                                }
                            }
                        }
                    }
                    if(sub_search_item.value_type == Data_Value_Type.COUNT){
                        const biz_data = await Foreign.get_items_data(database,cache,sub_search_item);
                        for(let data_item of data_items){
                            for(let sub_data_item of data_item[parent_search_item.title]){
                                const match_items = biz_data.filter(item_find => item_find[sub_search_item.foreign_field] === sub_data_item[sub_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!sub_data_item[sub_search_item.title]){
                                        sub_data_item[sub_search_item.title] = 0;
                                    }
                                    sub_data_item[sub_search_item.title] = match_items.length;
                                }
                            }
                        }
                    }
                    if(sub_search_item.value_type == Data_Value_Type.ONE){
                        const biz_data = await Foreign.get_items_data(database,cache,sub_search_item);
                        for(let data_item of data_items){
                            for(let sub_data_item of data_item[parent_search_item.title]){
                                const match_items = biz_data.filter(item_find => item_find[sub_search_item.foreign_field] === sub_data_item[sub_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!sub_data_item[sub_search_item.title]){
                                        sub_data_item[sub_search_item.title] = {};
                                    }
                                    sub_data_item[sub_search_item.title] = match_items[0];
                                }else{
                                    sub_data_item[sub_search_item.title] = Data_Logic.get_not_found(sub_search_item.foreign_table,0);
                                }
                            }
                        }
                    }
                },
                async function(call){
                    // -- get sub-sub
                    for(const item of foreign.foreigns){
                        for(let data_item of data_items){
                            for(const sub_data_item of data_item[parent_search_item.title]){
                                const biz_data = await Foreign.get_foreign_data(database,cache,item,sub_data_item[sub_search_item.title]);
                            }
                        }
                    }

                },
            ]).then(result => {
                callback(data_items);
            }).catch(err => {
                Log.error("Foreign-Get-Foreign-Sub",err);
                callback([err,{}]);
            });
        });
    };
    static get_foreign_sub_sub = async (database,cache,foreign,parent_search_item,sub_search_item,data_items) => {
        /* options
           - none
           */
        return new Promise((callback) => {
            async.series([
                async function(call){
                    // -- get sub-sub
                    let sub_sub_search_item = Foreign.get_search(foreign);
                    for(let data_item of data_items){
                        for(let sub_data_item of data_item[parent_search_item.title]){
                            if(!Str.check_is_null(sub_data_item.id)){
                                let query_field = {};
                                if(!Str.check_is_null(sub_data_item[sub_sub_search_item.parent_field])){
                                    query_field[sub_sub_search_item.foreign_field] = sub_data_item[sub_sub_search_item.parent_field];
                                    sub_sub_search_item.query.$or.push(query_field);
                                }
                            }
                        }
                    }
                    if(sub_sub_search_item.value_type == Data_Value_Type.ITEMS){
                        if(sub_sub_search_item.query.$or.length>0){
                            const biz_data = await Foreign.get_items_data(database,cache,sub_sub_search_item);
                            for(let data_item of data_items){
                                for(let sub_data_item of data_item[parent_search_item.title]){
                                    const match_items = biz_data.filter(item_find => item_find[sub_sub_search_item.foreign_field] === sub_data_item[sub_sub_search_item.parent_field]);
                                    if(match_items.length>0){
                                        if(!sub_data_item[sub_sub_search_item.title]){
                                            sub_data_item[sub_sub_search_item.title] = [];
                                        }
                                        sub_data_item[sub_sub_search_item.title] = [...match_items];
                                    }
                                }
                            }
                        }
                    }
                    if(sub_sub_search_item.value_type == Data_Value_Type.COUNT){
                        const biz_data = await Foreign.get_items_data(database,cache,sub_sub_search_item);
                        for(let data_item of data_items){
                            for(let sub_data_item of data_item[parent_search_item.title]){
                                const match_items = biz_data.filter(item_find => item_find[sub_sub_search_item.foreign_field] === sub_data_item[sub_sub_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!sub_data_item[sub_sub_search_item.title]){
                                        sub_data_item[sub_sub_search_item.title] = 0;
                                    }
                                    sub_data_item[sub_sub_search_item.title] = match_items.length;
                                }else{
                                    sub_data_item[sub_sub_search_item.title] = 0;
                                }
                            }
                        }
                    }
                    if(sub_sub_search_item.value_type == Data_Value_Type.ONE){
                        const biz_data = await Foreign.get_items_data(database,cache,sub_sub_search_item);
                        for(let data_item of data_items){
                            for(let sub_data_item of data_item[parent_search_item.title]){
                                for(let sub_sub_data_item of data_item[sub_search_item.title]){
                                    const match_items = biz_data.filter(item_find => item_find[sub_sub_search_item.foreign_field] === sub_sub_data_item[sub_sub_search_item.parent_field]);
                                    if(match_items.length>0){
                                        if(!sub_sub_data_item[sub_sub_search_item.title]){
                                            sub_sub_data_item[sub_sub_search_item.title] = {};
                                        }
                                        sub_sub_data_item[sub_sub_search_item.title] = match_items[0];
                                    }
                                    else{
                                        sub_data_item[sub_sub_search_item.title] = Data_Logic.get_not_found(sub_sub_search_item.foreign_table,0);
                                    }
                                }
                            }
                        }
                    }
                },
            ]).then(result => {
                callback(data_items);
            }).catch(err => {
                Log.error("Foreign-Get-Foreign-Sub-Sub",err);
                callback([err,{}]);
            });
        });
    };

    static get_items_data = (database,cache,search_item) =>{
        return new Promise((resolve) => {
            let search = Data_Logic.get_search(search_item.foreign_table,search_item.query,search_item.sort_by,search_item.page_current,search_item.page_size);
            let foreign_option = search_item.field ? search_item.field : {};
            if(search_item.query.$or.length>0){
                (async () => {
                    const [items,item_count,page_count] = await Adapter.get_item_list(database,cache,search.table,search.filter,search.sort_by,search.page_current,search.page_size,foreign_option);
                    resolve(items);

                })();
            }else{
                resolve([]);
            }
        });
    }
    //9_search 9_get_search
    static get_search = (foreign_item) => {
        return {
            value_type : foreign_item.value_type ? foreign_item.value_type : Data_Value_Type.ITEMS,
            foreign_table : foreign_item.foreign_table,
            foreign_field : foreign_item.foreign_field,
            parent_field : foreign_item.parent_field,
            parent_value : '',
            field : foreign_item.field ? foreign_item.field : null,
            title : foreign_item.title ? foreign_item.title : foreign_item.foreign_table,
            page_current : foreign_item.page_current ? foreign_item.page_current : 1,
            page_size : foreign_item.page_size ? foreign_item.page_size : 0,
            sort_by : foreign_item.sort_by ? foreign_item.sort_by : {},
            foreigns : foreign_item.foreigns ? foreign_item.foreigns : [],
            items : [],
            query : { $or: [] },
            data : null
        }
    };
    static blank = async (database,table,items) => {
        /* options
           - none
           */
        return new Promise((callback) => {
            let response = {};
            let data = {};
            async.series([
                async function(call){
                    const [biz_response,biz_data] = await get(database,table,items);
                    data = biz_data;
                },
            ]).then(result => {
                callback([response,data]);
            }).catch(err => {
                Log.error("Blank-Data",err);
                callback([err,{}]);
            });
        });
    };
}
module.exports = {
    Foreign
};
