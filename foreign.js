const async = require('async');
const {Log,Str,Num,Obj,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/code");
const {Type,Data_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-logic/code");
const {get_item_list_adapter,get_count_item_list_adapter}  = require('./adapter.js');
class Foreign {
    static get_data = (database,cache,data_items,option) => {
        return new Promise((callback) => {
            let error = null;
            let foreign_data_items = [];
            const foreign_search_items = [];
            async.series([
                //foreign_1
                function(call){
                    for(const option_foreign of option.foreigns){
                        let foreign_item = Foreign.get_search(option_foreign);
                        for(const data_item of data_items){
                            let query_field = {};
                            query_field[foreign_item.foreign_field] = data_item[foreign_item.parent_field];
                            foreign_item.query.$or.push(query_field);
                        }
                        foreign_search_items.push(foreign_item);
                    }
                    //foreign_1a
                    const run = async (database,cache) => {
                        for(const search_item of foreign_search_items){
                            await get_search_item_data(database,cache,search_item);
                        }
                    }
                    run(database,cache).then(() => {
                        call();
                    });
                },
                function(call){
                    for(const search_item of foreign_search_items){
                        for(const search_foreign_item of search_item.foreigns){
                            let foreign_search_item = Foreign.get_search(search_foreign_item);
                                for(const data_item of search_item.items){
                                    let query_field = {};
                                    query_field[foreign_search_item.foreign_field] = data_item[foreign_search_item.parent_field];
                                    foreign_search_item.query.$or.push(query_field);
                                }
                        }
                    }
                        Log.w('cool',foreign_search_items);
                },

                //foreign_3 good
                /*
                function(call){
                    for(const foreign_search of foreign_search_items){
                        for(const data_item of data_items){
                            if(foreign_search.type == Type.SEARCH_ITEMS){
                                const match_items = foreign_search.items.filter(item_find => item_find[foreign_search.foreign_field] === data_item[foreign_search.parent_field]);
                                data_item[foreign_search.title] = match_items;
                            }else if(foreign_search.type == Type.SEARCH_COUNT){
                                data_item[foreign_search.title] = foreign_search.data;
                            }
                        }
                    }
                    call();
                },
                */
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
        function get_count_data(database,search_item) {
            return new Promise((resolve) => {
                let search = Data_Logic.get_search(search_item.foreign_data_type,search_item.query,search_item.sort_by,search_item.page_current,search_item.page_size);
                get_count_item_list_adapter(database,search.data_type,search.filter).then(([biz_error,biz_data])=>{
                    resolve(biz_data.count?biz_data.count : 0);
                }).catch(err => {
                    Log.error('Foreign-Get-Data',err);
                    error=Log.append(error,err);
                });
            });
        }
        function get_search_item_data(database,cache,search_item) {
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
                            search_item.data = await get_count_data(database,search_item);
                        }else if(search_item.type == Type.SEARCH_ONE){
                            search_item.page_size = 1;
                            const biz_data = await get_items_data(database,cache,search_item);
                            search_item.data = biz_data[0].id ? biz_data[0] : Data_Logic.get_not_found(search_item.foreign_data_type,0);
                        }
                    },
                ]).then(result => {
                    callback(search_item);
                }).catch(err => {
                    Log.error("Foreign-Get-Search-Item-Data",err);
                    callback([error,[]]);
                });
            });
        }
    };
    /*
    static async run_data(foreign_search_items) {
        return new Promise((callback) => {
                   callback(foreign_search_items);
            }).catch(err => {
                Log.error("Blank-Get",err);
                callback([error,[]]);
            });
    };
    */

    //9_search 9_get_search
    static get_search = (foreign_item) => {
        /*
        if(foreign_item.type == Type.SEARCH_COUNT){
            foreign_item.page_size = 1;
        }
        */
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



