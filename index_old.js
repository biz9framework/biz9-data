	//get_join
				async function(call){
					console.log('aaaaaaaaaaa');
					if(option.get_join && data.data_list.length>0){
						console.log('bbbbbbbbbbbbb');
						for(const parent_search_item of parent_search_item_list){
							let query = { $or: [] };
 							for(const data_item of data.data_list){
								let query_field = {};
								query_field[parent_search_item.primary_field] = { $regex:String(data_item[parent_search_item.item_field]), $options: "i" };
								query.$or.push(query_field);
							};
							let search = App_Logic.get_search(parent_search_item.primary_data_type,query,{},1,0);
							let join_option = parent_search_item.fields ? {get_field:true,fields:parent_search_item.fields} : {};

							Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,join_option).then(([biz_error,item_list,item_count,page_count])=>{
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							parent_search_item.data_list = item_list;
									if(parent_search_item_list.length> 0){
										for(const parent_search_item of parent_search_item_list){
											for(const data_item of data.data_list){
												let item_found = parent_search_item.data_list.find(item_find => item_find[parent_search_item.primary_field] === data_item[parent_search_item.item_field])
												if(parent_search_item.type == Type.OBJ){
													if(parent_search_item.make_flat){
 														for(const prop in item_found) {
															data_item[parent_search_item.title+"_"+prop] = item_found[prop];
														}
													}else{
								  						data_item[parent_search_item.title] = item_found;
													}
												}else if(parent_search_item.type == Type.LIST){
													/*
													let query = {};
													query[parent_search_item.primary_field] = data_item[parent_search_item.item_field];
													let search = App_Logic.get_search(parent_search_item.primary_data_type,query,{},1,0);
													//const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,join_option);
													Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,join_option).then(([biz_error,item_list,item_count,page_count])=>{

													data_item[parent_search_item.title] = [];
													if(biz_error){
														error=Log.append(error,biz_error);
													}else{
														for(const sub_data_item of biz_data.data_list){
															data_item[parent_search_item.title].push(sub_data_item);
													}
													*/
												}else if(parent_search_item.type == Type.COUNT){
													/*
													query[parent_search_item.primary_field] = data_item[parent_search_item.item_field];
													let search = App_Logic.get_search(parent_search_item.primary_data_type,query,{},1,0);
													const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
													if(biz_error){
														error=Log.append(error,biz_error);
													}else{
														data_item[parent_search_item.title] = biz_data;
													}
													*/
												}
										}
									}
									}
							//call();
							//Log.w('ssssss',data.data_list);
						}
					}).catch(err => {
						Log.error('DATA-SEARCH-ERROR-1',err);
						error=Log.append(error,err);
					});
						}
					}
				},

