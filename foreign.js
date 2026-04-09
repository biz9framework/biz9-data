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
    static get_data = (database,cache,data_items,option) => {
        return new Promise((callback) => {
            let response = {};
            const foreign_search_items = [];
            async.series([
                function(call){
                    if(data_items.length>0){
                        for(const option_foreign of option.foreigns){
                            let foreign_item = Foreign.get_search(option_foreign);
                            for(const data_item of data_items){
                                if(!Str.check_is_null(data_item.id)){
                                    let query_field = {};
                                    query_field[foreign_item.foreign_field] = data_item[foreign_item.parent_field];
                                    foreign_item.query.$or.push(query_field);
                                }
                            }
                            foreign_search_items.push(foreign_item);
                        }
                    }
                    const run_data = async (database,cache,search_item) => {
                        search_item = await Foreign.get_search_item_data(database,cache,search_item);
                        for(const data_item of data_items){
                            if(!data_item[search_item.title]){
                                data_item[search_item.title] = [];
                            }
                            if(search_item.value_type == Data_Value_Type.ITEMS){
                                const match_items = search_item.items.filter(item_find => item_find[search_item.foreign_field] === data_item[search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[search_item.title]){
                                        data_item[search_item.title] = [];
                                    }
                                    data_item[search_item.title] = [...match_items];
                                }
                            }else if(search_item.value_type == Data_Value_Type.COUNT){
                                data_item[search_item.title] = search_item.data;
                            }else if(search_item.value_type == Data_Value_Type.ONE){
                                const match_item = search_item.items.find(item_find => item_find[search_item.foreign_field] === data_item[search_item.parent_field]);
                                if(match_item){
                                    data_item[search_item.title] = match_item;
                                }else{
                                    data_item[search_item.title] = Data_Logic.get_not_found(search_item.foreign_table,0);
                                }
                            }
                        }
                    }
                    const run = async (database,cache) => {
                        for(const search_item of foreign_search_items){
                            await run_data(database,cache,search_item);
                        }
                    }
                    run(database,cache).then(() => {
                        call();
                    });
                },
            ]).then(result => {
                callback([response,data_items]);
            }).catch(err => {
                Log.error("Foreign-Get",err);
            });
        });
    };
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
    static run_search_item_data = (database,cache,search_item)=> {
        return new Promise((callback) => {
            let response = {};
            let data = null;
            async.series([
                async function(call) {
                    if(search_item.value_type == Data_Value_Type.ITEMS || search_item.value_type == Data_Value_Type.ONE){
                        const biz_data = await Foreign.get_items_data(database,cache,search_item);
                        search_item.items = [...biz_data];
                    }
                    else if(search_item.value_type == Data_Value_Type.COUNT){
                        const biz_data = await Foreign.get_count_data(database,search_item);
                        search_item.data = biz_data;
                    }
                },
            ]).then(result => {
                callback(search_item);
            }).catch(err => {
                Log.error("Foreign-Run-Search-Item-Data",err);
            });
        });
    }
    static  get_count_data = (database,search_item) =>{
        return new Promise((resolve) => {
            let data = [];
            function get_data(search_item,query) {
                return new Promise((resolve2) => {
                    let search = Data_Logic.get_search(search_item.foreign_table,query,search_item.sort_by,search_item.page_current,search_item.page_size);
                    (async () => {
                        const biz_data = await Adapter.get_count_item_list(database,search.table,search.filter);
                        resolve2(biz_data?biz_data : 0);
                    })();
                });
            }
            const run = async () => {
                for(const search_item_query of search_item.query.$or){
                    const biz_data = await get_data(search_item,search_item_query);
                    if(search_item.value_type != Data_Value_Type.COUNT){
                        data.push({id:search_item_query.parent_id,data:biz_data});
                    }else{
                        data = biz_data;
                    }
                }
            }
            run().then(() => {
                resolve(data);
            });
        });
    }
    static get_search_item_data =(database,cache,search_item)=> {
        return new Promise((callback) => {
            let response = {};
            let data = {};
            async.series([
                async function(call) {
                    search_item = await Foreign.run_search_item_data(database,cache,search_item);
                },
                function(call){
                    Foreign.get_search_item_detail_data(database,cache,search_item).then((biz_response,search_item) => {
                        search_item = search_item;
                        call();
                    });
                },
            ]).then(result => {
                callback(search_item);
            }).catch(err => {
                Log.error("Foreign-Get-Search-Item-Data",err);
            });
        });
    }
    static get_search_item_detail_data = async (database,cache,search_item) => {
        return new Promise((callback) => {
            let response = {};
            var sub_search_foreign_items = [];
            let foreign_reseult_items = [];
            let foreign_sub_reseult_items = [];
            async.series([
                async function(call){
                    console.log('here');
                    //if(search_item.value_type != Data_Value_Type.COUNT){
                        for(const sub_search_item of search_item.foreigns){
                            let sub_search_foreign_item = Foreign.get_search(sub_search_item);
                            let search_item_data_result = {};
                            for(const data_item of search_item.items){
                                let query_field = {};
                                if(!Str.check_is_null(data_item[sub_search_foreign_item.parent_field])){
                                    query_field[sub_search_foreign_item.foreign_field] = data_item[sub_search_foreign_item.parent_field];
                                    sub_search_foreign_item.query.$or.push(query_field);
                                }
                            }
                            search_item_data_result = await Foreign.run_search_item_data(database,cache,sub_search_foreign_item);
                            for(const item of search_item_data_result.items){
                                foreign_reseult_items.push(item);
                            }
                        }
                        /*
                    }else{
                        console.log('11111111');
                        for(const sub_search_item of search_item.foreigns){
                            let sub_search_foreign_item = Foreign.get_search(sub_search_item);
                            let search_item_data_result = {};
                            for(const data_item of search_item.items){
                                let query_field = {};
                                query_field[sub_search_foreign_item.foreign_field] = data_item[sub_search_foreign_item.parent_field];
                                sub_search_foreign_item.query.$or.push(query_field);
                            }
                            console.log('2222222');
                            search_item_data_result = await Foreign.run_search_item_data(database,cache,sub_search_foreign_item);
                            //Log.w('33_here',search_item_data_result);
                            for(const item of search_item_data_result.items){
                                foreign_reseult_items.push(item);
                            }
                        }
                        */
                    //}
                },
                async function(call){
                        for(const sub_search_item of search_item.foreigns){
                            for(const sub_foreign_search_item of sub_search_item.foreigns){
                                let sub_search_foreign_item = Foreign.get_search(sub_foreign_search_item);
                                let search_item_data_result = {};
                                for(const data_item of foreign_reseult_items){
                                    let query_field = {};
                                    query_field[sub_search_foreign_item.foreign_field] = data_item[sub_search_foreign_item.parent_field];
                                    sub_search_foreign_item.query.$or.push(query_field);
                                }
                                search_item_data_result = await Foreign.run_search_item_data(database,cache,sub_search_foreign_item);
                                for(const item of search_item_data_result.items){
                                    foreign_sub_reseult_items.push(item);
                                }
                                for(const data_item of foreign_reseult_items){
                                    if(sub_search_foreign_item.value_type == Data_Value_Type.ONE){
                                        const match_item = sub_search_foreign_item.items.find(item_find => item_find[sub_search_foreign_item.foreign_field] === data_item[sub_search_foreign_item.parent_field]);
                                        if(!data_item[sub_foreign_search_item.title] ){
                                            data_item[sub_foreign_search_item.title] = [];
                                        }
                                        if(match_item){
                                            data_item[sub_foreign_search_item.title] = match_item;
                                        }else{
                                            data_item[sub_foreign_search_item.title] = Data_Logic.get_not_found(sub_foreign_search_item.foreign_table,0);
                                        }
                                    }
                                    if(sub_search_foreign_item.value_type == Data_Value_Type.ITEMS){
                                        const match_items = sub_search_foreign_item.items.filter(item_find => item_find[sub_search_foreign_item.foreign_field] === data_item[sub_search_foreign_item.parent_field]);
                                        if(!data_item[sub_foreign_search_item.title] ){
                                            data_item[sub_foreign_search_item.title] = [];
                                        }
                                        if(match_items){
                                            data_item[sub_foreign_search_item.title] = match_items;
                                        }
                                    }
                                    if(sub_search_foreign_item.value_type == Data_Value_Type.COUNT){
                                        Log.w('sssss',sub_search_foreign_item);
                                        /*
                                        if(!data_item[sub_foreign_search_item.title] ){
                                            data_item[sub_foreign_search_item.title] = 0;
                                        }
                                        data_item[sub_foreign_search_item.title] = search_item_data_result.data;
                                        */
                                    }
                                }
                            }
                        }
                },
                async function(call){
                    for(const sub_search_item of search_item.foreigns){
                        if(search_item.value_type == Data_Value_Type.ITEMS){
                            for(const data_item of search_item.items){
                                const match_items = foreign_reseult_items.filter(item_find => item_find[sub_search_item.foreign_field] === data_item[sub_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[sub_search_item.title] ){
                                        data_item[sub_search_item.title] = [];
                                    }
                                    data_item[sub_search_item.title] = [...match_items];
                                }
                            }
                        }
                    }
                },
            ]).then(result => {
                callback([response,search_item]);
            }).catch(err => {
                Log.error("Get-Search-Item-Detail",err);
            });
        });
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
