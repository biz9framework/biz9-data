const async = require('async');
const {Log,Str,Num,Obj,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/code");
const {Type,Data_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-logic/code");
const {get_item_list_adapter,get_count_item_list_adapter}  = require('./adapter.js');
const {Foreign} = require('./foreign.js');
class Group {
    static get_data = (database,cache,data_items,option) => {
        return new Promise((callback) => {
            let error = null;
            let group_search_items = [];
            async.series([
                function(call){
                    for(const option_group of option.groups){
                        group_search_items.push(Group.get_search(option_group));
                    }
                    call();
                },
                function(call){
                    let query = {$or:[]};
                    let has_title = false;
                    for(const search_item of group_search_items){
                        //get by title
                        for(const field in search_item.title) {
                            has_title = true;
                            let new_item = {};
                            new_item[field] = search_item.title[field];
                            if(new_item[field]){
                                let query_field = {};
                                query_field[Type.FIELD_TITLE_URL] = field;
                                query.$or.push(query_field);
                            }
                        }
                        if(!has_title){
                            for(const item of data_items){
                                let query_field = {};
                                query_field[Type.FIELD_PARENT_ID] = item.id;
                                query.$or.push(query_field);
                            }
                        }
                        search_item.query = query;
                    }
                    call();
                },
                function(call){
                    const run_data = async (database,cache,search_item) => {
                        const biz_data = await get_search_item_data(database,cache,search_item);
                        for(const item of biz_data){
                            search_item.items.push(item);
                        }
                    };
                    const run = async (database,cache) => {
                        for(const search_item of group_search_items){
                            await run_data(database,cache,search_item);
                        }
                    };
                    run(database,cache).then(() => {
                        Log.w('1111',group_search_items);
                        call();
                    });
                },
                function(call){
                    Log.w('here11',group_search_items);
                },
                function(call){
                    for(const data_item of data_items){
                        data_item.groups = [];
                        for(const search_item of group_search_items){
                            //const match_items = search_item.items.filter(item_find => item_find[search_item.foreign_field] === data_item[search_item.parent_field]);
                            data_item.groups = search_item.items.filter(item_find => item_find[search_item.parent_id] === data_item[Type.PARENT_ID]);

                            /*
                            for(const group of search_item.items){
                                if(data_item.id == group.parent_id){
                                    if(!data_item[Str.get_title_url(group.title)]){
                                        data_item[Str.get_title_url(group.title)] = [];
                                    }
                                    data_item[Str.get_title_url(group.title)].push(group);
                                    data_item.groups.push(group);
                                }
                            }
                            */
                        }
                    }
                    call();
                },
            ]).then(result => {
                //callback([error,data_items]);
            }).catch(err => {
                Log.error("Group-Get",err);
                callback([error,[]]);
            });
        });
        function get_search_item_data(database,cache,search_item) {
            return new Promise((callback) => {
                let error = null;
                let data = null;
                let search = Data_Logic.get_search(Type.DATA_GROUP,search_item.query,{},search_item.page_current,search_item.page_size);
                let option = search_item.field ? search_item.field : {};
                get_item_list_adapter(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
                    callback(items);
                }).catch(err => {
                    Log.error('Group-Get-Items-Data-1',err);
                    error=Log.append(error,err);
                });
            }).catch(err => {
                Log.error("Group-Search-Item-Data",err);
                callback([error,[]]);
            });
        };
        function get_search_item_data_old(database,cache,search_item) {
            return new Promise((callback) => {
                let error = null;
                let data = null;
                async.series([
                    async function(call) {
                        console.log('55555555');
                        const biz_data = await get_items_data(database,cache,search_item);
                        Log.w('6666',biz_data);
                        if(biz_data.length>0){
                            for(const item of biz_data){
                                search_item.items.push(item);
                            }
                        }
                    },
                ]).then(result => {
                    callback(search_item);
                }).catch(err => {
                    Log.error("Group-Search-Item-Data",err);
                    callback([error,[]]);
                });
            });
        };
        function get_items_data_old(database,cache,search_item) {
            return new Promise((callback) => {
                let error = null;
                let data = null;
                async.series([
                    function(call) {
                        let search = Data_Logic.get_search(Type.DATA_GROUP,search_item.query,{},search_item.page_current,search_item.page_size);
                        let option = search_item.field ? search_item.field : {};
                        get_item_list_adapter(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
                            data = items;
                            call();
                        }).catch(err => {
                            Log.error('Group-Get-Items-Data-1',err);
                            error=Log.append(error,err);
                        });
                    },
                    function(call) {
                        call();
                        /*
                        if(search_item.image && search_item.items.length>0){
                            let foreign_image = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_IMAGE,Type.FIELD_PARENT_ID,Type.FIELD_ID);
                            let option = {foreigns:[foreign_image]};
                            Foreign.get_data(database,cache,search_item.items,option).then(([biz_error,biz_data])=>{
                                if(biz_error){
                                    error=Log.append(error,biz_error);
                                }else{
                                    search_item.items = biz_data;
                                }
                                call();
                            }).catch(err => {
                                Log.error('Group-Get-Items-Data-2',err);
                                error=Log.append(error,err);
                            });
                        }else{
                            call();
                        }
                        */
                    },
                ]).then(result => {
                    callback(data);
                }).catch(err => {
                    Log.error("Group-Get-Items-Data",err);
                    callback([error,[]]);
                });
            });
        }
    };
    static get_search_item_info = (search_item,data_items) => {
        let group_list = [];
        let hide_group_list = [];
        let group_query = {$or:[],$and:[]};
        for(const field in search_item.title) {
            let new_item = {};
            new_item[field] = search_item.title[field];
            if(new_item[field]){
                let query_field = {};
                query_field[Type.FIELD_TITLE_URL] = field;
                group_query.$or.push(query_field);
            }else{
                let query_field = {};
                query_field[Type.FIELD_TITLE_URL] = {$ne:field};
                group_query.$and.push(query_field);
            }
        }
        for(const item of data_items){
            let query_field = {};
            query_field[Type.FIELD_PARENT_ID] = item.id;
            group_query.$and.push(query_field);
        }
        if(group_query.$or.length <= 0){
            delete group_query.$or;
        }
    };
    //9_search 9_get_search
    static get_search = (group_item) => {
        return {
            field : group_item.field ? group_item.field : {},
            title : group_item.title ? group_item.title : {}, // {groupShow:1,groupHide:0},{0:all}
            image : group_item.image ? group_item.image : false,
            page_current : group_item.page_current ? group_item.page_current : 1,
            page_size : group_item.page_size ? group_item.page_size : 0,
            query : {$or:[],$and:[]},
            items : []
        }
    };
}
module.exports = {
    Group
};
