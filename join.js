const async = require('async');
const {Log,Str,Num,Obj,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/code");
const {Type,Data_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-logic/code");
const {get_item_list_adapter,get_count_item_list_adapter}  = require('./adapter.js');
const {Foreign} = require('./foreign.js');
class Join {
    static get_data = (database,cache,data_items,option) => {
        return new Promise((callback) => {
            let error = null;
            let join_search_items = [];
            async.series([
                function(call){
                    console.log('3333333');
                    for(const join_item of option.joins){
                        join_search_items.push({
                            type : join_item.type ?  join_item.type : Type.SEARCH_ITEMS,
                            search : join_item.search ? join_item.search : Data_Logic.get_search(Type.DATA_BLANK,{},{},1,0),
                            field : join_item.field ? join_item.field : null,
                            distinct : join_item.distinct ? join_item.distinct : null,
                            title : join_item.title ? join_item.title : Str.get_title_url(Data_Logic.get_data_type_by_type(join_item.search.data_type,{plural:true})),
                            foreigns : join_item.foreigns ? join_item.foreigns : [],
                            items : []
                        });
                    }
                    function get_data(search_item) {
                        console.log('4444444');
                        Log.w('search_item',search_item);
                        data[search_item.title] = [];
                        return new Promise((resolve) => {
                            if(search_item.type == Type.SEARCH_ITEMS){
                                let search = Data_Logic.get_search(search_item.search.data_type,search_item.search.filter,search_item.search.sort_by,search_item.search.page_current,search_item.search.page_size);
                                let join_option = {field:search_item.field,distinct:search_item.distinct};
                                console.log('55555555');
                                get_item_list_adapter(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,join_option).then(([biz_error,items,item_count,page_count])=>{
                                    if(biz_error){
                                        error=Log.append(error,biz_error);
                                    }else{
                                        data[search_item.title+'_item_count'] = item_count;
                                        data[search_item.title+'_page_count'] = page_count;
                                        data[search_item.title+'_search'] = search;
                                        data[search_item.title] = items;
                                    }
                                    resolve();
                                }).catch(err => {
                                    Log.error('Data-Join-Get-Data',err);
                                    error=Log.append(error,err);
                                });
                            }
                            else if(search_item.type == Type.SEARCH_COUNT){
                                let search = Data_Logic.get_search(search_item.search.data_type,search_item.search.filter,search_item.search.sort_by,search_item.search.page_current,search_item.search.page_size);
                                let join_option = {field:search_item.field};
                                get_count_item_list_adapter(database,search.data_type,search.filter).then(([biz_error,biz_data])=>{
                                    if(biz_error){
                                        error=Log.append(error,biz_error);
                                    }else{
                                        data[Str.get_title_url(search_item.title)] = biz_data.count;
                                        resolve();
                                    }
                                }).catch(err => {
                                    Log.error('Data-Join-Get-Data-Count',err);
                                    error=Log.append(error,err);
                                });
                            }
                            else if(search_item.type == Type.SEARCH_ONE){
                                let search = Data_Logic.get_search(search_item.search.data_type,search_item.search.filter,search_item.search.sort_by,search_item.search.page_current,search_item.search.page_size);
                                let join_option = {field:search_item.field};
                                get_item_list_adapter(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,join_option).then(([biz_error,items,item_count,page_count])=>{
                                    if(biz_error){
                                        error=Log.append(error,biz_error);
                                    }else{
                                        let one_item = items.length>0 ? items[0] : Data_Logic.get_not_found(search_item.search.data_type,0);
                                        data[Str.get_title_url(search_item.title)] = one_item;
                                        search_item[Type.FIELD_ITEMS] = [one_item];
                                        resolve();
                                    }
                                }).catch(err => {
                                    Log.error('Data-Join-Get-Data-One',err);
                                    error=Log.append(error,err);
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
                //9_foreigns //9_get_foreigns get_join_foreign
                function(call){
                    if(option.foreigns && data[Type.FIELD_ITEMS].length > 0){
                        Foreign.get_data(database,cache,data[Type.FIELD_ITEMS],option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                data[Type.FIELD_ITEMS] = biz_data;
                                call();
                            }
                        }).catch(err => {
                            Log.error('Data-Join-Get-Data-Foreign',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("Data-Join-Get",err);
                callback([error,[]]);
            });
        });

    };
    static get_search = (join_item) => {
        return {
            type : join_item.type ?  join_item.type : Type.SEARCH_ITEMS,
            search : join_item.search ? join_item.search : Data_Logic.get_search(Type.DATA_BLANK,{},{},1,0),
            field : join_item.field ? join_item.field : null,
            distinct : join_item.distinct ? join_item.distinct : null,
            title : join_item.title ? join_item.title : Str.get_title_url(Data_Logic.get_data_type_by_type(join_item.search.data_type,{plural:true})),
            foreigns : join_item.foreigns ? join_item.foreigns : [],
            items : []
        }
    };
}
module.exports = {
    Join
};
