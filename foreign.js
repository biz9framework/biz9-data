const async = require('async');
const {Log,Str,Num,Obj,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/code");
const {Type,Data_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-logic/code");
const {get_item_list_adapter,get_count_item_list_adapter}  = require('./adapter.js');
class Foreign {
    static get_data = (database,cache,data_items,option) => {
        return new Promise((callback) => {
            let error = null;
            const foreign_search_items = [];
            async.series([
                function(call){
                    for(const option_foreign of option.foreigns){
                        let foreign_item = Foreign.get_search(option_foreign);
                        //here1
                        for(const data_item of data_items){
                            let query_field = {};
                            query_field[foreign_item.foreign_field] = data_item[foreign_item.parent_field];
                            foreign_item.query.$or.push(query_field);
                        }
                        foreign_search_items.push(foreign_item);
                    }
                    const run_me = async (database,cache,search_item) => {
                        //for(const search_item of foreign_search_items){
                            await get_search_item_data(database,cache,search_item);
                            for(const data_item of data_items){
                                if(search_item.type == Type.SEARCH_ITEMS){
                                    const match_items = search_item.items.filter(item_find => item_find[search_item.foreign_field] === data_item[search_item.parent_field]);
                                    data_item[search_item.title] = match_items;
                                }else if(search_item.type == Type.SEARCH_COUNT){
                                    const match_item = search_item.items.find(item_find => item_find[Type.FIELD_ID] === data_item[Type.FIELD_ID]);
                                    data_item[search_item.title] = match_item.data;
                                }else if(search_item.type == Type.SEARCH_ONE){
                                    data_item[search_item.title] = search_item.items[0];
                                }
                            }
                        //}
                    }
                    const run = async (database,cache) => {
                        for(const search_item of foreign_search_items){
                            await run_me(database,cache,search_item);
                        }
                    }
                    run(database,cache).then(() => {
                        call();
                    });

                },
            ]).then(result => {
                callback([error,data_items]);
            }).catch(err => {
                Log.error("Foreign-Get",err);
                callback([error,[]]);
            });
        });
        function get_items_data(database,cache,search_item) {
            return new Promise((resolve) => {
                let search = Data_Logic.get_search(search_item.foreign_data_type,search_item.query,search_item.sort_by,search_item.page_current,search_item.page_size);
                let foreign_option = search_item.field ? search_item.field : {};
                get_item_list_adapter(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
                    resolve(items);
                }).catch(err => {
                    Log.error('Foreign-Get-Data',err);
                    error=Log.append(error,err);
                });
            });
        }
        //here2
        function get_count_data(database,search_item) {
            return new Promise((resolve) => {
                let data = [];
            function get_data(search_item,query) {
                return new Promise((resolve2) => {
                    let search = Data_Logic.get_search(search_item.foreign_data_type,query,search_item.sort_by,search_item.page_current,search_item.page_size);
                    get_count_item_list_adapter(database,search.data_type,search.filter).then(([biz_error,biz_data])=>{
                        resolve2(biz_data.count?biz_data.count : 0);
                    }).catch(err => {
                        Log.error('Foreign-Get-Data',err);
                        error=Log.append(error,err);
                    });
                });
            }
            const run = async () => {
                for(const search_item_query of search_item.query.$or){
                    const biz_data = await get_data(search_item,search_item_query);
                    data.push({id:search_item_query.parent_id,data:biz_data});
                }
            }
            run().then(() => {
                resolve(data);
            });
            });
        }
        function get_search_item_data(database,cache,search_item) {
            return new Promise((callback) => {
                let error = null;
                let data = null;
                async.series([
                    async function(call) {
                        //here3
                        search_item = await run_search_item_data(database,cache,search_item);
                    },
                    function(call){
                        const run = async (database,cache,search_item) => {
                            let sub_foreign_search_items = [];
                            if(search_item.type != Type.SEARCH_COUNT){
                                for(const sub_search_item of search_item.foreigns){
                                    let sub_search_foreign_item = Foreign.get_search(sub_search_item);
                                    for(const data_item of search_item.items){
                                        let query_field = {};
                                        query_field[sub_search_foreign_item.foreign_field] = data_item[sub_search_foreign_item.parent_field];
                                        sub_search_foreign_item.query.$or.push(query_field);
                                    }
                                    sub_search_foreign_item = await run_search_item_data(database,cache,sub_search_foreign_item);
                                    for(const data_item of search_item.items){
                                        if(sub_search_foreign_item.type == Type.SEARCH_ITEMS){
                                            const match_items = sub_search_foreign_item.items.filter(item_find => item_find[sub_search_foreign_item.foreign_field] === data_item[sub_search_foreign_item.parent_field]);
                                            data_item[sub_search_foreign_item.title] = match_items;

                                        }else if(sub_search_foreign_item.type == Type.SEARCH_COUNT){
                                            const match_item = sub_search_foreign_item.items.find(item_find => item_find[Type.FIELD_ID] === data_item[Type.FIELD_ID]);
                                            data_item[sub_search_foreign_item.title] = match_item.data;
                                        }else if(sub_search_foreign_item.type == Type.SEARCH_ONE){
                                            const match_items = sub_search_foreign_item.items.filter(item_find => item_find[sub_search_foreign_item.foreign_field] === data_item[sub_search_foreign_item.parent_field]);
                                            if(match_items.length>0){
                                                data_item[sub_search_foreign_item.title] = match_items[0];
                                            }else{
                                                data_item[sub_search_foreign_item.title] =  Data_Logic.get_not_found(sub_search_item.foreign_data_type,0);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        run(database,cache,search_item).then(() => {
                            call();
                        });
                    },
                ]).then(result => {
                    callback(search_item);
                }).catch(err => {
                    Log.error("Foreign-Get-Search-Item-Data",err);
                    callback([error,[]]);
                });
            });
            function run_search_item_data(database,cache,search_item) {
                return new Promise((callback) => {
                    let error = null;
                    let data = null;
                    async.series([
                        async function(call) {
                            if(search_item.type == Type.SEARCH_ITEMS){
                                const biz_data = await get_items_data(database,cache,search_item);
                                for(const item of biz_data){
                                    search_item.items.push(item);
                                }
                            }else if(search_item.type == Type.SEARCH_COUNT){
                                const biz_data = await get_count_data(database,search_item);
                                for(const item of biz_data){
                                    search_item.items.push(item);
                                }
                            }else if(search_item.type == Type.SEARCH_ONE){
                                search_item.page_size = 1;
                                const biz_data = await get_items_data(database,cache,search_item);
                                if(biz_data.length>0){
                                    search_item.items.push(biz_data[0]);
                                }else{
                                    search_item.items.push(Data_Logic.get_not_found(search_item.foreign_data_type,0));
                                }
                            }
                        },
                    ]).then(result => {
                        callback(search_item);
                    }).catch(err => {
                        Log.error("Blank-Get",err);
                        //callback([error,[]]);
                    });
                });
            }
        }
    };
    //9_search 9_get_search
    static get_search = (foreign_item) => {
        return {
            type : foreign_item.type ? foreign_item.type : Type.SEARCH_ITEMS,
            foreign_data_type : foreign_item.foreign_data_type,
            foreign_field : foreign_item.foreign_field,
            parent_field : foreign_item.parent_field,
            parent_value : '',
            field : foreign_item.field ? foreign_item.field : null,
            title : foreign_item.title ? foreign_item.title : foreign_item.foreign_data_type,
            page_current : foreign_item.page_current ? foreign_item.page_current : 1,
            page_size : foreign_item.page_size ? foreign_item.page_size : 0,
            sort_by : foreign_item.sort_by ? foreign_item.sort_by : {},
            foreigns : foreign_item.foreigns ? foreign_item.foreigns : [],
            items : [],
            query : { $or: [] },
            data : null
        }
    };
}
module.exports = {
    Foreign
};
