/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Group
*/
const async = require('async');
const {Log,Str,Num,Obj,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Value_Type,Data_Logic,Field,Table}=require("/home/think1/www/doqbox/biz9-framework/biz9-logic/source");
const {Adapter}  = require('./adapter.js');
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
                    for(const search_item of group_search_items){
                        //get by title
                        let has_title = false;
                        if(!Obj.check_is_empty(search_item.title)){
                            has_title = true;
                            for(const field in search_item.title) {
                                let new_item = {};
                                new_item[field] = search_item.title[field];
                                if(new_item[field]){
                                    let query_field = {};
                                    query_field[Field.TITLE_URL] = field;
                                    query.$or.push(query_field);
                                }
                            }
                        }
                        if(!has_title){
                            for(const item of data_items){
                                let query_field = {};
                                query_field[Field.PARENT_ID] = item.id;
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
                        call();
                    });
                },
                function(call){
                    for(const data_item of data_items){
                        data_item.groups = [];
                        for(const search_item of group_search_items){
                            const match_items = search_item.items.filter(item_find => item_find.parent_id === data_item.id);
                            for(const group of match_items){
                                if(!data_item[Str.get_title_url(group.title)]){
                                    data_item[Str.get_title_url(group.title)] = [];
                                }
                                data_item[Str.get_title_url(group.title)].push(group);
                                data_item.groups.push(group);
                            }
                        }
                    }
                    call();
                },
            ]).then(result => {
                callback([error,data_items]);
            }).catch(err => {
                Log.error("Group-Get-Data",err);
                callback([error,[]]);
            });
        });
        function get_search_item_data(database,cache,search_item) {
            return new Promise((callback) => {
                let error = null;
                let data = [];
                async.series([
                    function(call) {
                        let search = Data_Logic.get_search(Table.GROUP,search_item.query,{},search_item.page_current,search_item.page_size);
                        let option = search_item.field ? search_item.field : {};
                        Adapter.get_item_list(database,cache,search.table,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
                            data = items;
                            call();
                        }).catch(err => {
                            Log.error('Group-Get-Search-Item-Data',err);
                            error=Log.append(error,err);
                        });
                    },
                    function(call){
                        if(search_item.foreigns.length>0 && data.length>0){
                            Foreign.get_data(database,cache,data,{foreigns:search_item.foreigns}).then(([biz_error,biz_data])=>{
                                if(biz_error){
                                    error=Log.append(error,biz_error);
                                }else{
                                    data = biz_data;
                                }
                                call();
                            }).catch(err => {
                                Log.error('Data-Group-Foreign',err);
                                error=Log.append(error,err);
                            });
                        }else{
                            call();
                        }
                    },
                ]).then(result => {
                    callback(data);
                }).catch(err => {
                    Log.error("Group-Get-Search-Item-Data-2",err);
                    callback([error,[]]);
                });
            });
        }
    };
    //9_search 9_get_search
    static get_search = (group_item) => {
        return {
            field : group_item.field ? group_item.field : {},
            title : group_item.title ? group_item.title : {}, // {groupShow:1,groupHide:0},{0:all}
            page_current : group_item.page_current ? group_item.page_current : 1,
            page_size : group_item.page_size ? group_item.page_size : 0,
            foreigns : group_item.foreigns ? group_item.foreigns : [],
            query : {$or:[],$and:[]},
            items : []
        }
    };
}
module.exports = {
    Group
};
