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
                                (async () => {
                                    const [items,item_count,page_count] = await Adapter.get_item_list(database,cache,search.table,search.filter,search.sort_by,search.page_current,search.page_size,join_option);
                                    search_item.data['count'] = item_count;
                                    search_item.data['page_count'] = page_count;
                                    search_item.data['search'] = search;
                                    search_item.data[Data_Field.ITEMS] = items;
                                    resolve();
                                })();
                            }
                            else if(search_item.value_type == Data_Value_Type.COUNT){
                                let search = Data_Logic.get_search(search_item.search.table,search_item.search.filter,search_item.search.sort_by,search_item.search.page_current,search_item.search.page_size);
                                let join_option = {field:search_item.field};
                                (async () => {
                                    const biz_data = await Adapter.get_count_item_list(database,search.table,search.filter);
                                    search_item.data = biz_data;
                                    resolve();
                                })();
                            }
                            else if(search_item.value_type == Data_Value_Type.ONE){
                                let search = Data_Logic.get_search(search_item.search.table,search_item.search.filter,search_item.search.sort_by,search_item.search.page_current,search_item.search.page_size);
                                let join_option = {field:search_item.field};
                                (async () => {
                                    const [items,item_count,page_count] = await Adapter.get_item_list(database,cache,search.table,search.filter,search.sort_by,search.page_current,search.page_size,join_option);
                                    let one_item = items.length>0 ? items[0] : Data_Logic.get_not_found(search_item.search.table,0);
                                    search_item.data = one_item;
                                    resolve();
                                })();
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
                            (async () => {
                                const [biz_response,biz_data] = await Foreign.get_data(database,cache,items,{foreigns:search_item.foreigns});
                                resolve(biz_data);
                            })();
                        }).catch(err => {
                            Log.error("Data-Join-Get-Data-Foreign-2",err);
                        });
                    }
                    const run = async () => {
                        for(const search_item of join_search_items){
                            if(search_item.value_type == Data_Value_Type.ITEMS){
                                const biz_data = await get_foreign_data(database,cache,search_item.data.items,search_item);
                            }
                            else if(search_item.value_type == Data_Value_Type.ONE){
                                const biz_data = await get_foreign_data(database,cache,[search_item.data],search_item);
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
