const async = require('async');
const {Log,Str,Num,Obj,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/code");
const {Type,Data_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-logic/code");
const {get_item_list_adapter}  = require('./adapter.js');
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
                    function run_data(search_item) {
                        return new Promise((resolve) => {
	                    let search = Data_Logic.get_search(search_item.foreign_data_type,search_item.query,{},search_item.page_current,search_item.page_size);
				        let foreign_option = search_item.field ? search_item.field : {};
                        get_item_list_adapter(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
                            resolve(items);
                        }).catch(err => {
                            Log.error('Foreign-Get-Data',err);
                            error=Log.append(error,err);
                        });
                        });
                    }
                    const run = async () => {
                        for(const search_item of foreign_search_items){
                            const biz_data = await run_data(search_item);
                            for(const item of biz_data){
                                search_item.items.push(item);
                            }
                        }
                    };
                    run().then(() => {
                        call();
                    })
                },
                //foreign_2
                function(call){
                        function run_data(search_item) {
                            return new Promise((resolve) => {
	                        let search = Data_Logic.get_search(search_item.foreign_data_type,search_item.foreign_query,{},search_item.page_current,search_item.page_size);
				            let foreign_option = search_item.field ? search_item.field : {};
                            get_item_list_adapter(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
                                resolve(items);
                            }).catch(err => {
                                Log.error('Foreign-Get-Data',err);
                                error=Log.append(error,err);
                            });
                        });
                    }
                    const run = async () => {
                        for(const search_item of foreign_search_items){
                            for(const search_foreign_item of search_item.foreigns){
                                let foreign_search_item = Foreign.get_search(search_foreign_item);
					            for(const data_item of search_item.items){
				                    let query_field = {};
				                    query_field[foreign_search_item.foreign_field] = data_item[foreign_search_item.parent_field];
				                    foreign_search_item.foreign_query.$or.push(query_field);
					            }
                                const biz_data = await run_data(foreign_search_item);
                                for(const item of biz_data){
                                    search_item.foreigns_items.push(item);
                                }
                            }
                        }
                    };
                    run().then(() => {
                        call();
                    })

 		        },
			]).then(result => {
				callback([error,foreign_search_items]);
			}).catch(err => {
				Log.error("Blank-Get",err);
				callback([error,[]]);
			});
		});
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
			foreigns : foreign_item.foreigns ? foreign_item.foreigns : 0,
			items : [],
			foreigns_items : [],
			query : { $or: [] },
			foreign_query : { $or: [] }
        }
	};
	//9_get_data_foreigns_search
	static get_foreign_search_data = (database,cache,data_items,search_item) => {
		const get_search_data = (database,cache,data_items,search_item) => {
		return new Promise((callback) => {
			let error = null;
			let query = { $or: [] };
 			let foreign_search_foreign_items = [];
            let option = {};
			for(const data_item of data_items){
				let query_field = {};
				query_field[search_item.foreign_field] = search_item.parent_value;
				query.$or.push(query_field);
			};
			//
			if(search_item.type == Type.SEARCH_ITEMS){
				let search = Data_Logic.get_search(search_item.foreign_data_type,query,{},search_item.page_current,search_item.page_size);
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
						let search = Data_Logic.get_search(search_item.foreign_data_type,query,{},search_item.page_current,search_item.page_size);
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
						let search = Data_Logic.get_search(search_item.foreign_data_type,query,{},search_item.page_current,search_item.page_size);
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



