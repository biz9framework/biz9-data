class Top_Item_Main{
    static get = async (database, data_type, title_url, option) => {
        /* option params
         * Items
         *  - get_items / bool / ex. true,false / def. true
         * Photos
         *  - get_photos / bool / ex. true,false / def. true
         *  - photo_count / int / ex. 1-999 / def. 19
         *  - photo_sort_by / query obj / ex. {date_create:1}
         */
        return new Promise((callback) => {
            let error = null;
            let top_item = {data_type:data_type,id:0,photos:[],items:[]};
            let full_item_list = [];
            let new_item_list = [];
            if(option == null){
                option = {get_items:false,get_photos:false}
            }
            if(option.get_items==null){
                option.get_items=false;
            }
            if(option.get_photos==null){
                option.get_photos=false;
            }

            async.series([
                function(call){
                    let filter = {};
                    if(title_url){
                        filter = {title_url:title_url};
                    }
                    let sort_by = {title:-1};
                    let page_current = 1;
                    let page_size = 3;
                    Data.get_list(db_connect,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            if(data.length>0){
                                top_item = data[0];
                                top_item.items = [];
                                top_item.photos = [];
                            }
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        call();
                    });
                },
                function(call){
                    if(top_item.id && option.get_items){
                        let filter={top_id:top_item.id};
                        let data_type = DataType.ITEM;
                        let sort_by={title:-1};
                        let page_current = 1;
                        let page_size = 999;
                        Data.get_list(db_connect,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=> {
                            if(error){
                                error=Log.append(error,error);
                            }else{
                                if(data.length > 0){
                                    full_item_list = data;
                                }
                            }
                            call();
                        }).catch(error => {
                            error = Log.append(error,error);
                            call();
                        });
                    }else{
                        call();
                    }
                },
                async function(call){
                    if(top_item.id && option.get_items){
                        const [error,data] = await Sub_Item.get_list(full_item_list);
                        new_item_list = data;
                        call();
                    }else{
                        call();
                    }
                },
                function(call){
                    if(top_item.id && option.get_items){
                        for(let a=0; a<new_item_list.length; a++){
                            new_item_list[a].items = [];
                            let item_title_url = Str.get_title_url(new_item_list[a].title);
                            top_item[item_title_url] = new Object();
                            for(let b=0;b<new_item_list.length;b++){
                                if(new_item_list[a].parent_id == new_item_list[b].id){
                                    new_item_list[a].items.push(new_item_list[b]);
                                }
                            }
                            top_item[item_title_url] = new_item_list[a];
                            top_item.items.push(new_item_list[a]);
                        }
                        call();
                    }
                    else{
                        call();
                    }
                },
                async function(call){
                    if(option.get_photos){
                        if(option.photo_count == null){
                            option.photo_count = 19;
                        }
                        if(option.photo_sort_by == null){
                            option.photo_sort_by = {date_create:1};
                        }
                    }
                    let filter = {parent_id:top_item.id};
                    let sort_by = option.photo_sort_by;
                    let page_current = 1;
                    let page_size = option.photo_count;
                    const [error,data] = await List_Main.get(db_connect,DataType.PHOTO,filter,sort_by,page_current,page_size);
                    if(data.item_list.length > 0){
                        top_item.photos = data.item_list;
                    }
                    call();
                },
            ]).then(result => {
                callback([error,top_item]);
            }).catch(error => {
                Log.error("Portal-Get",error);
                callback([error,[]]);
            });
        });
    };
}

class Blank{
    static get = async (database, title_url, option) => {
        /* option params
         * Items
         *  - get_items / bool / ex. true,false / def. true
         * Photos
         *  - get_photos / bool / ex. true,false / def. true
         *  - photo_count / int / ex. 1-999 / def. 19
         *  - photo_sort_by / query obj / ex. {date_create:1}
         */
        return new Promise((callback) => {
            let item = null;
            async.series([
                function(call){
                },
                function(call){
                },
            ]).then(result => {
                callback([error,item_data]);
            }).catch(error => {
                Log.error("Blank-Get",error);
                callback([error,[]]);
            });
        });


    };

}

