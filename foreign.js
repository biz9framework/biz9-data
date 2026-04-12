/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Foreign
*/
const async = require('async');
const {Log,Str,Num,Obj,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Data_Value_Type,Data_Logic,Data_Table}=require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {Adapter}  = require('./adapter.js');
class Foreign {

    //9_search 9_get_search
    static get_search = (foreign_item) => {
        return {
            value_type : foreign_item.value_type ? foreign_item.value_type : Data_Value_Type.ITEMS,
            foreign_table : foreign_item.foreign_table,
            foreign_field : foreign_item.foreign_field,
            parent_field : foreign_item.parent_field,
            parent_value : '',
            field : foreign_item.field ? foreign_item.field : null,
            title : foreign_item.title ? foreign_item.title : foreign_item.foreign_table,
            page_current : foreign_item.page_current ? foreign_item.page_current : 1,
            page_size : foreign_item.page_size ? foreign_item.page_size : 0,
            sort_by : foreign_item.sort_by ? foreign_item.sort_by : {},
            foreigns : foreign_item.foreigns ? foreign_item.foreigns : [],
            items : [],
            query : { $or: [] },
            data : null
        }
    };

    static get_data = async (database,cache,data_items,option) => {
        /* options
           - none
           */
        return new Promise((callback) => {
            let response = {};
            let data = [];
            let full_list = [];
            let type_parent = 'TYPE_PARENT';
            let type_sub = 'TYPE_SUB';
            let type_sub_sub = 'TYPE_SUB_SUB';
            let type_sub_sub_sub = 'TYPE_SUB_SUB_SUB';
            let parent = {};
            let sub = {};
            let sub_sub = {};
            let sub_sub_sub = {};

            async.series([
                async function(call){
                    for(const item of option.foreigns){
                        // Get_Parent
                        const biz_data = await Foreign.get_foreign_parent(database,cache,item,data_items);
                        data_items = biz_data;
                    }
                },
                async function(call){
                    //Log.w('66_data_items',data_items);
                },
            ]).then(result => {
                //Log.w('99_option',option);
                //Log.w('99_data_items',data_items);
                //callback([response,data]);
            }).catch(err => {
                Log.error("Blank-Data",err);
                callback([err,{}]);
            });
        });
    };
    static get_foreign_parent = async (database,cache,foreign,data_items) => {
        // --works
        return new Promise((callback) => {
            let response = {};
            let data = {};
            let has_parent = false;
            let has_sub = false;
            let has_sub_sub = false;
            let has_sub_sub_sub = false;

            let parent_search_item = Foreign.get_search(foreign);
            async.series([
                async function(call){
                    if(foreign){
                        has_parent = true;
                    }
                    if(foreign){
                        has_sub = true;
                    }
                    if(foreign?.foreigns[0]?.foreigns?.foreigns){
                        has_sub_sub = true;
                    }
                    if(foreign?.foreigns?.foreigns?.foreigns){
                        has_sub_sub_sub = true;
                    }
                    Log.w('has_parent',has_parent);
                    Log.w('has_sub',has_sub);
                    Log.w('has_sub_sub',has_sub_sub);
                    Log.w('has_sub_sub_sub',has_sub_sub_sub);
                    Log.w('11_foreign',foreign);
                    Log.w('22_foreign',foreign.foreigns[0].foreigns[0]);

                },

                async function(call){
                    if(has_parent){
                        for(const data_item of data_items){
                            if(!Str.check_is_null(data_item.id)){
                                let query_field = {};
                                if(!Str.check_is_null(data_item[parent_search_item.parent_field])){
                                    query_field[parent_search_item.foreign_field] = data_item[parent_search_item.parent_field];
                                    parent_search_item.query.$or.push(query_field);
                                }
                            }
                        }
                        if(parent_search_item.value_type == Data_Value_Type.ITEMS){
                            const biz_data = await Foreign.get_items_data(database,cache,parent_search_item);
                            for(const data_item of data_items){
                                const match_items = biz_data.filter(item_find => item_find[parent_search_item.foreign_field] === data_item[parent_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[parent_search_item.title]){
                                        data_item[parent_search_item.title] = [];
                                    }
                                    data_item[parent_search_item.title] = [...match_items];
                                }
                            }
                        }
                        if(parent_search_item.value_type == Data_Value_Type.COUNT){
                            const biz_data = await Foreign.get_items_data(database,cache,parent_search_item);
                            for(const data_item of data_items){
                                const match_items = biz_data.filter(item_find => item_find[parent_search_item.foreign_field] === data_item[parent_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[parent_search_item.title]){
                                        data_item[parent_search_item.title] = 0;
                                    }
                                    data_item[parent_search_item.title] = match_items.length;
                                }
                            }
                        }
                        if(parent_search_item.value_type == Data_Value_Type.ONE){
                            const biz_data = await Foreign.get_items_data(database,cache,parent_search_item);
                            for(const data_item of data_items){
                                const match_items = biz_data.filter(item_find => item_find[parent_search_item.foreign_field] === data_item[parent_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[parent_search_item.title]){
                                        data_item[parent_search_item.title] = {};
                                    }
                                    data_item[parent_search_item.title] = match_items[0];
                                }
                            }
                        }
                    }
                },
                async function(call){
                    if(has_sub){
                        for(const item of foreign.foreigns){
                            //console.log(item);
                            // Get_Parent
                            const biz_data = await Foreign.get_foreign_sub(database,cache,item,parent_search_item,data_items);
                            //Log.w('22_sub_data',biz_data);
                            data_items = biz_data;
                        }

                    }
                },
            ]).then(result => {
                callback(data_items);
            }).catch(err => {
                Log.error("Blank-Data",err);
                callback([err,{}]);
            });
        });
    };
    static get_foreign_sub = async (database,cache,foreign,parent_search_item,data_items) => {
        /* options
           - none
           */
        return new Promise((callback) => {
            async.series([
                async function(call){
                    // -- get sub
                    let sub_search_item = Foreign.get_search(foreign);
                        for(const data_item of data_items){
                            for(const data_item of data_items){
                                if(!Str.check_is_null(data_item.id)){
                                    let query_field = {};
                                    if(!Str.check_is_null(data_item[sub_search_item.parent_field])){
                                        query_field[sub_search_item.foreign_field] = data_item[sub_search_item.parent_field];
                                        sub_search_item.query.$or.push(query_field);
                                    }
                                }
                            }
                        }
                        if(sub_search_item.value_type == Data_Value_Type.ITEMS){
                            const biz_data = await Foreign.get_items_data(database,cache,sub_search_item);
                            for(const data_item of data_items){
                                const match_items = biz_data.filter(item_find => item_find[sub_search_item.foreign_field] === data_item[sub_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[sub_search_item.title]){
                                        data_item[sub_search_item.title] = [];
                                    }
                                    data_item[sub_search_item.title] = [...match_items];
                                }
                            }
                        }
                        if(sub_search_item.value_type == Data_Value_Type.COUNT){
                            const biz_data = await Foreign.get_items_data(database,cache,sub_search_item);
                            for(const data_item of data_items){
                                const match_items = biz_data.filter(item_find => item_find[sub_search_item.foreign_field] === data_item[sub_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[sub_search_item.title]){
                                        data_item[sub_search_item.title] = 0;
                                    }
                                    data_item[sub_search_item.title] = match_items.length;
                                }
                            }
                        }
                        if(sub_search_item.value_type == Data_Value_Type.ONE){
                            const biz_data = await Foreign.get_items_data(database,cache,sub_search_item);
                            for(const data_item of data_items){
                                const match_items = biz_data.filter(item_find => item_find[sub_search_item.foreign_field] === data_item[sub_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[sub_search_item.title]){
                                        data_item[sub_search_item.title] = {};
                                    }
                                    data_item[sub_search_item.title] = match_items[0];
                                }
                            }
                        }
                },
            ]).then(result => {
                callback(data_items);
            }).catch(err => {
                Log.error("Blank-Data",err);
                callback([err,{}]);
            });
        });
    };
    static get_foreign_sub_sub = async (database,cache,foreign,sub_search_item,data_items) => {
        /* options
           - none
           */
        return new Promise((callback) => {
            async.series([
               async function(call){
                    // -- get sub_sub
                    let sub_sub_search_item = Foreign.get_search(foreign);
                        for(const data_item of data_items){
                            for(const data_item of data_items){
                                if(!Str.check_is_null(data_item.id)){
                                    let query_field = {};
                                    if(!Str.check_is_null(data_item[sub_sub_search_item.parent_field])){
                                        query_field[sub_sub_search_item.foreign_field] = data_item[sub_search_item.parent_field];
                                        sub_sub_search_item.query.$or.push(query_field);
                                    }
                                }
                            }
                        }
                   Log.w('22_sub_sub_search_item',sub_sub_search_item);
                   /*
                        if(sub_sub_search_item.value_type == Data_Value_Type.ITEMS){
                            const biz_data = await Foreign.get_items_data(database,cache,sub_sub_search_item);
                            for(const data_item of data_items){
                                const match_items = biz_data.filter(item_find => item_find[sub_sub_search_item.foreign_field] === data_item[sub_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[sub_sub_search_item.title]){
                                        data_item[sub_sub_search_item.title] = [];
                                    }
                                    data_item[sub_sub_search_item.title] = [...match_items];
                                }
                            }
                        }
                        if(sub_sub_search_item.value_type == Data_Value_Type.COUNT){
                            const biz_data = await Foreign.get_items_data(database,cache,sub_sub_search_item);
                            for(const data_item of data_items){
                                const match_items = biz_data.filter(item_find => item_find[sub_sub_search_item.foreign_field] === data_item[sub_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[sub_sub_search_item.title]){
                                        data_item[sub_sub_search_item.title] = 0;
                                    }
                                    data_item[sub_sub_search_item.title] = match_items.length;
                                }
                            }
                        }
                        if(sub_sub_search_item.value_type == Data_Value_Type.ONE){
                            const biz_data = await Foreign.get_items_data(database,cache,sub_sub_search_item);
                            for(const data_item of data_items){
                                const match_items = biz_data.filter(item_find => item_find[sub_sub_search_item.foreign_field] === data_item[sub_search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[sub_sub_search_item.title]){
                                        data_item[sub_sub_search_item.title] = {};
                                    }
                                    data_item[sub_sub_search_item.title] = match_items[0];
                                }
                            }
                        }
                        */
                },
              ]).then(result => {
                //callback(data_items);
            }).catch(err => {
                Log.error("Blank-Data",err);
                callback([err,{}]);
            });
        });
    };

    static get_foreign_parent_data = async (database,cache,foreign,data_items) => {
        return new Promise((callback) => {
            let response = {};
            let data = {};
            async.series([
                async function(call){
                    // - get parent
                    const biz_data = await Foreign.get_foreign_parent(database,cache,foreign,data_items);
                    Log.w('rrr',biz_data);
                },
                /*
                async function(call){
                // - get parent subs
                    const run = async (database,cache,foreign,data_items) => {
                        for(const item of foreign.foreigns){
                // Get_Parent
                            const biz_data = await Foreign.get_foreign_parent_sub(database,cache,item,data_items);
                            Log.w('sss',biz_data);
                        }

                    }
                    run(database,cache,foreign,data_items).then(() => {
                        call();
                    });
                },
                */
            ]).then(result => {
                //callback([response,data]);
            }).catch(err => {
                Log.error("Blank-Data",err);
                callback([err,{}]);
            });
        });
    };

    static get_foreign_parent_sub = async (database,cache,foreign,data_items) => {
        /* options
           - none
           */
        return new Promise((callback) => {
            let response = {};
            let data = {};
            let has_parent = false;
            let has_sub = false;
            let has_sub_sub = false;
            let has_sub_sub_sub = false;
            /*
            let parent = {};
            let sub = {};
            let sub_sub = {};
            let sub_sub_sub = {};
            */
            let search_item = Foreign.get_search(foreign);
            async.series([
                async function(call){
                    if(foreign){
                        has_parent = true;
                    }
                    if(foreign?.foreigns){
                        has_sub = true;
                    }
                    if(foreign?.foreigns.foreigns){
                        has_sub_sub = true;
                    }
                    if(foreign?.foreigns?.foreigns?.foreigns){
                        has_sub_sub_sub = true;
                    }
                    Log.w('has_parent',has_parent);
                    Log.w('has_sub',has_sub);
                    Log.w('has_sub_sub',has_sub_sub);
                    Log.w('has_sub_sub_sub',has_sub_sub_sub);
                },
                /*
                async function(call){

                    const get_parent = async (database,cache,search_item) => {
                        console.log('1111111111');
            //parent
                        for(const data_item of data_items){
                            if(!Str.check_is_null(data_item.id)){
                                let query_field = {};
                                if(!Str.check_is_null(data_item[search_item.parent_field])){
                                    query_field[search_item.foreign_field] = data_item[search_item.parent_field];
                                    search_item.query.$or.push(query_field);
                                }
                            }
                        }
                        console.log('222222');
                        if(search_item.value_type == Data_Value_Type.ITEMS){
                            const biz_data = await Foreign.get_items_data(database,cache,search_item);
                            for(const data_item of data_items){
                                const match_items = biz_data.filter(item_find => item_find[search_item.foreign_field] === data_item[search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[search_item.title]){
                                        data_item[search_item.title] = [];
                                    }
                                    data_item[search_item.title] = [...match_items];
                                }
                            }
                        }
                        if(search_item.value_type == Data_Value_Type.COUNT){
                            const biz_data = await Foreign.get_items_data(database,cache,search_item);
                            for(const data_item of data_items){
                                const match_items = biz_data.filter(item_find => item_find[search_item.foreign_field] === data_item[search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[search_item.title]){
                                        data_item[search_item.title] = 0;
                                    }
                                    data_item[search_item.title] = match_items.length;
                                }
                            }
                        }
                        if(search_item.value_type == Data_Value_Type.ONE){
                            const biz_data = await Foreign.get_items_data(database,cache,search_item);
                            for(const data_item of data_items){
                                const match_items = biz_data.filter(item_find => item_find[search_item.foreign_field] === data_item[search_item.parent_field]);
                                if(match_items.length>0){
                                    if(!data_item[search_item.title]){
                                        data_item[search_item.title] = {};
                                    }
                                    data_item[search_item.title] = match_items[0];
                                }
                            }
                        }
                        console.log('333333');
                        Log.w('333_search_item',search_item);
                        Log.w('333_search_item',search_item.query);
                        Log.w('333_data',data_items);
                        Log.w('333_data_0',data_items[0]);
                    }
                    const run = async (database,cache,foreign) => {
                        console.log('rrrr');
                        for(const item of foreign.foreigns){
                            console.log('pppppp');
                            await get_parent(database,cache,item);
                        }
                    }
                    console.log('aaaaaa');
                    console.log('aaaaaa');
                    if(has_parent){
                        console.log('1111');
                        run(database,cache,foreign).then(() => {
                            console.log('done');
//call();
                        });
                    }


                },
                async function(call){
                    if(has_sub){
                    }
                },
                */

]).then(result => {
    //callback(data_items);
}).catch(err => {
    Log.error("Blank-Data",err);
    callback([err,{}]);
});
});
};



static get_old_foreign_parent_data = async (database,cache,foreign,data_items) => {
    /* options
           - none
           */
    return new Promise((callback) => {
        let response = {};
        let data = {};
        let has_parent = false;
        let has_sub = false;
        let has_sub_sub = false;
        let has_sub_sub_sub = false;

        async.series([
            async function(call){
                // check subs length
                if(foreign){
                    has_parent = true;
                }
                if(foreign?.foreigns){
                    has_sub = true;
                }
                if(foreign?.foreigns.foreigns){
                    has_sub_sub = true;
                }
                if(foreign?.foreigns?.foreigns?.foreigns){
                    has_sub_sub_sub = true;
                }
                Log.w('has_parent',has_parent);
                Log.w('has_sub',has_sub);
                Log.w('has_sub_sub',has_sub_sub);
                Log.w('has_sub_sub_sub',has_sub_sub_sub);

            },
            async function(call){
                // get parent
                const run_data = async (database,cache,item) => {
                    const biz_data = await Foreign.get_foreign_item_data(database,cache,data_items,item);
                    return biz_data;
                }
                const run = async (database,cache,foreign,data_items) => {
                    //console.log('aaaaaaaaaa');
                    //console.log(foreign);
                    //console.log('bbbbbbbb');
                    for(const item of option.foreigns){
                        const biz_data = await Foreign.get_foreign_detail_data(database,cache,item);
                    }
                }
                run(database,cache,foreign,data_items).then(() => {
                    call();
                });
            },
        ]).then(result => {
            //callback([response,data]);
        }).catch(err => {
            Log.error("Blank-Data",err);
            callback([err,{}]);
        });
    });
};
static get_parent_old = async (database,table,items) => {
    /* options
           - none
           */
    return new Promise((callback) => {
        let response = {};
        let data = {};
        async.series([
            async function(call){
                const [biz_response,biz_data] = await get(database,table,items);
                data = biz_data;
            },
        ]).then(result => {
            callback([response,data]);
        }).catch(err => {
            Log.error("Blank-Data",err);
            callback([err,{}]);
        });
    });
};

static get_foreign_detail_data = async (database,cache,data_items,foreign) => {
    /* options
           - none
           */
    return new Promise((callback) => {
        let response = {};
        let data = {};
        let has_parent = false;
        let has_sub = false;
        let has_sub_sub = false;
        let has_sub_sub_sub = false;
        /*
            let parent = {};
            let sub = {};
            let sub_sub = {};
            let sub_sub_sub = {};
            */
        let search_item = Foreign.get_search(foreign);
        async.series([
            async function(call){
                if(foreign){
                    has_parent = true;
                }
                if(foreign?.foreigns){
                    has_sub = true;
                }
                if(foreign?.foreigns.foreigns){
                    has_sub_sub = true;
                }
                if(foreign?.foreigns?.foreigns?.foreigns){
                    has_sub_sub_sub = true;
                }
                Log.w('has_parent',has_parent);
                Log.w('has_sub',has_sub);
                Log.w('has_sub_sub',has_sub_sub);
                Log.w('has_sub_sub_sub',has_sub_sub_sub);
            },
            async function(call){

                const get_parent = async (database,cache,search_item) => {
                    console.log('1111111111');
                    //parent
                    for(const data_item of data_items){
                        if(!Str.check_is_null(data_item.id)){
                            let query_field = {};
                            if(!Str.check_is_null(data_item[search_item.parent_field])){
                                query_field[search_item.foreign_field] = data_item[search_item.parent_field];
                                search_item.query.$or.push(query_field);
                            }
                        }
                    }
                    console.log('222222');
                    if(search_item.value_type == Data_Value_Type.ITEMS){
                        const biz_data = await Foreign.get_items_data(database,cache,search_item);
                        for(const data_item of data_items){
                            const match_items = biz_data.filter(item_find => item_find[search_item.foreign_field] === data_item[search_item.parent_field]);
                            if(match_items.length>0){
                                if(!data_item[search_item.title]){
                                    data_item[search_item.title] = [];
                                }
                                data_item[search_item.title] = [...match_items];
                            }
                        }
                    }
                    if(search_item.value_type == Data_Value_Type.COUNT){
                        const biz_data = await Foreign.get_items_data(database,cache,search_item);
                        for(const data_item of data_items){
                            const match_items = biz_data.filter(item_find => item_find[search_item.foreign_field] === data_item[search_item.parent_field]);
                            if(match_items.length>0){
                                if(!data_item[search_item.title]){
                                    data_item[search_item.title] = 0;
                                }
                                data_item[search_item.title] = match_items.length;
                            }
                        }
                    }
                    if(search_item.value_type == Data_Value_Type.ONE){
                        const biz_data = await Foreign.get_items_data(database,cache,search_item);
                        for(const data_item of data_items){
                            const match_items = biz_data.filter(item_find => item_find[search_item.foreign_field] === data_item[search_item.parent_field]);
                            if(match_items.length>0){
                                if(!data_item[search_item.title]){
                                    data_item[search_item.title] = {};
                                }
                                data_item[search_item.title] = match_items[0];
                            }
                        }
                    }
                    console.log('333333');
                    Log.w('333_search_item',search_item);
                    Log.w('333_search_item',search_item.query);
                    Log.w('333_data',data_items);
                    Log.w('333_data_0',data_items[0]);
                }
                const run = async (database,cache,foreign) => {
                    console.log('rrrr');
                    for(const item of foreign.foreigns){
                        console.log('pppppp');
                        await get_parent(database,cache,item);
                    }
                }
                console.log('aaaaaa');
                console.log('aaaaaa');
                if(has_parent){
                    console.log('1111');
                    run(database,cache,foreign).then(() => {
                        console.log('done');
                        //call();
                    });
                }


            },
            async function(call){
                if(has_sub){
                }
            },

        ]).then(result => {
            //callback(data_items);
        }).catch(err => {
            Log.error("Blank-Data",err);
            callback([err,{}]);
        });
    });
};

static get_items_data = (database,cache,search_item) =>{
    return new Promise((resolve) => {
        let search = Data_Logic.get_search(search_item.foreign_table,search_item.query,search_item.sort_by,search_item.page_current,search_item.page_size);
        let foreign_option = search_item.field ? search_item.field : {};
        if(search_item.query.$or.length>0){
            (async () => {
                const [items,item_count,page_count] = await Adapter.get_item_list(database,cache,search.table,search.filter,search.sort_by,search.page_current,search.page_size,foreign_option);
                resolve(items);

            })();
        }else{
            resolve([]);
        }
    });
}
static blank = async (database,table,items) => {
    /* options
           - none
           */
    return new Promise((callback) => {
        let response = {};
        let data = {};
        async.series([
            async function(call){
                const [biz_response,biz_data] = await get(database,table,items);
                data = biz_data;
            },
        ]).then(result => {
            callback([response,data]);
        }).catch(err => {
            Log.error("Blank-Data",err);
            callback([err,{}]);
        });
    });
};
}
module.exports = {
    Foreign
};
