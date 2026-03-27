/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Join
*/
const async = require('async');
const {Log,Str,Num,Obj,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Data_Value_Type,Data_Logic,Data_Field,Data_Table}=require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {Adapter}  = require('./adapter.js');
const {Foreign} = require('./foreign.js');
class Join {
    static get_data = (database,cache,option) => {
        return new Promise((callback) => {
            let response = {};
            let join_search_items = [];
            async.series([
                function(call){
                    for(const option_join of option.joins){
                        join_search_items.push(Join.get_search(option_join));
                    }
                    call();
                },
                function(call){
                    function get_data(search_item) {
                        return new Promise((resolve) => {
                            if(search_item.value_type == Data_Value_Type.ITEMS){
                                search_item.data[search_item.title];
                                let search = Data_Logic.get_search(search_item.search.table,search_item.search.filter,search_item.search.sort_by,search_item.search.page_current,search_item.search.page_size);
                                let join_option = {field:search_item.field,distinct:search_item.distinct};
                                Adapter.get_item_list(database,cache,search.table,search.filter,search.sort_by,search.page_current,search.page_size,join_option).then(([items,item_count,page_count])=>{
                                    search_item.data['count'] = item_count;
                                    search_item.data['page_count'] = page_count;
                                    search_item.data['search'] = search;
                                    search_item.data[Data_Field.ITEMS] = items;
                                    resolve();
                                }).catch(err => {
                                    Log.error('Data-Join-Get-Data',err);
                                });
                            }
                            else if(search_item.value_type == Data_Value_Type.COUNT){
                                let search = Data_Logic.get_search(search_item.search.table,search_item.search.filter,search_item.search.sort_by,search_item.search.page_current,search_item.search.page_size);
                                let join_option = {field:search_item.field};
                                Adapter.get_count_item_list(database,search.table,search.filter).then((biz_data)=>{
                                    search_item.data = biz_data.count;
                                    resolve();
                                }).catch(err => {
                                    Log.error('Data-Join-Get-Data-Count',err);
                                });
                            }
                            else if(search_item.value_type == Data_Value_Type.ONE){
                                let search = Data_Logic.get_search(search_item.search.table,search_item.search.filter,search_item.search.sort_by,search_item.search.page_current,search_item.search.page_size);
                                let join_option = {field:search_item.field};
                                Adapter.get_item_list(database,cache,search.table,search.filter,search.sort_by,search.page_current,search.page_size,join_option).then(([items,item_count,page_count])=>{
                                    let one_item = items.length>0 ? items[0] : Data_Logic.get_not_found(search_item.search.table,0);
                                    search_item.data = one_item;
                                    resolve();
                                }).catch(err => {
                                    Log.error('Data-Join-Get-Data-One',err);
                                });
                            }
                        });
                    }
                    const run = async () => {
                        for(const search_item of join_search_items){
                            await get_data(search_item);
                        }
                    }
                    run().then(() => {
                        call();
                    });
                },
                //foreign
                function(call){
                    function get_foreign_data(database,cache,items,search_item) {
                        return new Promise((resolve) => {
                            Foreign.get_data(database,cache,items,{foreigns:search_item.foreigns}).then(([biz_response,biz_data])=>{
                                resolve(biz_data);
                            }).catch(err => {
                                Log.error('Data-Join-Get-Data-Foreign',err);
                            });
                        }).catch(err => {
                            Log.error("Data-Join-Get-Data-Foreign-2",err);
                        });
                    }
                    const run = async () => {
                        for(const search_item of join_search_items){
                            if(search_item.value_type != Data_Value_Type.COUNT){
                                const biz_data = await get_foreign_data(database,cache,search_item.data[search_item.title+"_"+Data_Field.ITEMS],search_item);
                            }
                        }
                    }
                    run().then(() => {
                        call();
                    });
                },
            ]).then(result => {
                callback([response,join_search_items]);
            }).catch(err => {
                Log.error("Data-Join-Get",err);
            });
        });
    };
    static get_search = (join_item) => {
        return {
            value_type : join_item.value_type ?  join_item.value_type : Data_Value_Type.ITEMS,
            search : join_item.search ? join_item.search : Data_Logic.get_search(Data_Table.BLANK,{},{},1,0),
            field : join_item.field ? join_item.field : null,
            distinct : join_item.distinct ? join_item.distinct : null,
            title : join_item.title ? join_item.title : Str.get_title_url(Data_Logic.get_table_by_name(join_item.table,{plural:true})),
            foreigns : join_item.foreigns ? join_item.foreigns : [],
            data : {},
            foreign_data : {}
        }
    };
}
module.exports = {
    Join
};
