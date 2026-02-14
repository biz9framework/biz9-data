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
                    const run_data = async (database,cache,search_item) => {
                            const biz_data = await get_search_item_data(database,cache,search_item);
                            if(search_item.type == Type.SEARCH_ITEMS){
                                const biz_data = await get_items_data(database,cache,search_item);
                                Log.w('sssss',biz_data);
                                //Log.w('sssss',biz_data.length);
                                /*
                                for(const item of biz_data){
                                    search_item.items.push(item);
                                }
                                */
                                Log.w('rrrr',search_item);
                            }else if(search_item.type == Type.SEARCH_COUNT){
                                const biz_data = await get_count_data(database,cache,search_item);
                                search_item.data = biz_data ? biz_data : 0;
                            }else if(search_item.type == Type.SEARCH_ONE){
                                search_item.page_size = 1;
                                const biz_data = await get_items_data(database,cache,search_item);
                                search_item.data = biz_data[0].id ? biz_data[0] : Data_Logic.get_not_found(search_item.foreign_data_type,0);
                            }
                    };
                    const run = async (database,cache) => {
                        for(const search_item of foreign_search_items){
                            await run_data(database,cache,search_item);
                        }
                    }
                     run(database,cache).then(() => {
                         //Log.w('rrr',foreign_search_items);
                         //Log.w('rrr',foreign_search_items[0].items);
                        //call();
                    });

                    /*
                    run_data().then(() => {
                        Log.w('aaaa',foreign_search_items);
                        Log.w('aaaa',foreign_search_items[0]);
                        //call();
                    })
                    */
                },
                //foreign_2
                function(call){

                    /*
                    function run_data_old(search_item) {
                        return new Promise((resolve) => {
                            let search = Data_Logic.get_search(search_item.foreign_data_type,search_item.query,{},search_item.page_current,search_item.page_size);
                            let foreign_option = search_item.field ? search_item.field : {};
                            if(search_item.type == Type.SEARCH_ITEMS){
                                get_item_list_adapter(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
                                    resolve(items);
                                }).catch(err => {
                                    Log.error('Foreign-Get-Data',err);
                                    error=Log.append(error,err);
                                });
                            }

                        });
                    }
                    */
                    function run_data(search_item) {
                        return new Promise((callback) => {
                            let error = null;
                            let data = null;
                            async.series([
                                async function(call) {
                                    if(search_item.type == Type.SEARCH_ITEMS){
                                        const biz_data = await get_items_data(search_item);
                                        for(const item of biz_data){
                                            search_item.items.push(item);
                                        }
                                    }else if(search_item.type == Type.SEARCH_COUNT){
                                        const biz_data = await get_count_data(search_item);
                                        search_item.data = biz_data ? biz_data : 0;
                                    }else if(search_item.type == Type.SEARCH_ONE){
                                        search_item.page_size = 1;
                                        const biz_data = await get_items_data(search_item);
                                        search_item.data = biz_data[0].id ? biz_data[0] : Data_Logic.get_not_found(search_item.foreign_data_type,0);
                                    }
                                },
                            ]).then(result => {
                                callback(search_item);
                            }).catch(err => {
                                Log.error("Blank-Get",err);
                                callback([error,[]]);
                            });
                        });
                    };
                    const run = async () => {
                        for(const search_item of foreign_search_items){
                            for(const search_foreign_item of search_item.foreigns){
                                let foreign_search_item = Foreign.get_search(search_foreign_item);
                                for(const data_item of search_item.items){
                                    let query_field = {};
                                    query_field[foreign_search_item.foreign_field] = data_item[foreign_search_item.parent_field];
                                    foreign_search_item.query.$or.push(query_field);
                                }
                                const biz_data = await run_data(foreign_search_item);
                                //Log.w('ddd',foreign_search_item);
                                /*
                                for(const data_item of search_item.items){
                                    if(search_item.type == Type.SEARCH_ITEMS){
                                    const match_items = biz_data.filter(item_find => item_find[foreign_search_item.foreign_field] === data_item[foreign_search_item.parent_field]);
                                        data_item[foreign_search_item.title] = match_items;
                                    }else if(search_item.type == Type.SEARCH_COUNT){
                                        data_item[foreign_search_item.title] = biz_data;
                                    }else if(search_item.type == Type.SEARCH_ONE){
                                        data_item[foreign_search_item.title] = biz_data;
                                    }
                                }
                                */
                            }
                        }
                    };
                    run().then(() => {
                        //Log.w('rrr',data_items);
                        //call();
                    })
                },
                //foreign_3
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
                Log.w('fffffff',search);
                Log.w('fffffff',search.filter);
                /*
                get_count_item_list_adapter(database,search.data_type,search.filter).then(([biz_error,biz_data])=>{
                    resolve(biz_data.count);
                }).catch(err => {
                    Log.error('Foreign-Get-Data',err);
                    error=Log.append(error,err);
                });
                */
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
                            console.log('1111111');
                            const biz_data = await get_count_data(search_item);
                            search_item.data = biz_data.count ? biz_data.count : 0;
                        }else if(search_item.type == Type.SEARCH_ONE){
                            search_item.page_size = 1;
                            const biz_data = await get_items_data(search_item);
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
        function run_data_old(foreign_search_items) {
            return new Promise((callback) => {
                let error = null;
                async.series([
                    async function(call) {
                    },
                ]).then(result => {
                    callback(foreign_search_items);
                }).catch(err => {
                    Log.error("Blank-Get",err);
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
    //9_get_data_foreigns_search
    static get_foreign_search_data_old = (database,cache,data_items,search_item) => {
        const get_search_data = (database,cache,data_items,search_item) => {
            return new Promise((callback) => {
                let error = null;
                let query = { $or: [] };
                let option = {};
                for(const data_item of data_items){
                    let query_field = {};
                    query_field[search_item.foreign_field] = search_item.parent_value;
                    query.$or.push(query_field);
                };
                //
                if(search_item.type == Type.SEARCH_ITEMS){
                    let search = Data_Logic.get_search(search_item.foreign_data_type,query,search_item.sort_by,search_item.page_current,search_item.page_size);
                    let foreign_option = search_item.field ? search_item.field : {};
                    get_item_list_adapter(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,foreign_option).then(([biz_error,items,item_count,page_count])=>{
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            search_item.items = items;
                            for(const data_item of data_items){
                                data_item[search_item.title] =[];
                                let match_items =  search_item.items.filter(item => item[search_item.foreign_field] === data_item[search_item.parent_field]);
                                data_item[search_item.title] =
                                    data_item[search_item.title] = match_items;
                            }
                        }
                        callback(data_items);
                    });
                }
                else if(search_item.type == Type.SEARCH_COUNT){
                    let search = Data_Logic.get_search(search_item.foreign_data_type,query,search_item.sort_by,search_item.page_current,search_item.page_size);
                    let foreign_option = search_item.field ? search_item.field : {field:{id:1,title:1}};
                    foreign_option.field[search_item.foreign_field] = 1;
                    get_item_list_adapter(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,foreign_option).then(([biz_error,items,item_count,page_count])=>{
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            search_item.items = items;
                            for(const data_item of data_items){
                                data_item[search_item.title] =[];
                                let match_items =  search_item.items.filter(item => item[search_item.foreign_field] === data_item[search_item.parent_field]);
                                data_item[search_item.title] = match_items.length;
                            }
                        }
                        callback(data_items);
                    });
                }
                if(search_item.type == Type.SEARCH_ONE){
                    let search = Data_Logic.get_search(search_item.foreign_data_type,query,search_item.sort_by,search_item.page_current,search_item.page_size);
                    let foreign_option = search_item.field ? search_item.field : {};
                    get_item_list_adapter(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,foreign_option).then(([biz_error,items,item_count,page_count])=>{
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            search_item.items = items;
                            for(const data_item of data_items){
                                data_item[search_item.title] =[];
                                let match_items =  search_item.items.filter(item => item[search_item.foreign_field] === data_item[search_item.parent_field]);
                                data_item[search_item.title] = match_items;
                                data_item[search_item.title] = items.length ? match_items[0] : Data_Logic.get_not_found(search_item.foreign_data_type,0);
                            }
                        }
                        callback(data_items);
                    });
                }
            }).catch(err => {
                Log.error("Blank-Get",err);
                callback([error,[]]);
            });
        };
    }
}
module.exports = {
    Foreign
};



