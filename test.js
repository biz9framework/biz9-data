/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Test
*/
const async = require('async');
const assert = require('node:assert');
const {Database,Data} = require(".");
const {Log,Str,Obj,Response_Logic,Response_Field,Status_Type}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Store_Field,Store_Type,Store_Table,Store_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-store/source");
const {Website_Title,Form_Field,Website_Table}=require("/home/think1/www/doqbox/biz9-framework/biz9-website/source");
const {Cart_Data}=require("/home/think1/www/doqbox/biz9-framework/biz9-store-data/source");
const {User_Field,User_Type,User_Table,User_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-user/source");
const {Data_Logic,Data_Value_Type,Data_Table,Data_Field}=require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
/*
 * availble tests
- connect
-- data_count
-- data_copy
-- data_delete
-- data_delete_search
-- data_get
-- data_post
-- data_post_items
-- data_search
---group_add
*/
/* --- TEST CONFIG START --- */
const APP_ID = 'test-stage-march27';
/* --- TEST CONFIG END --- */

/* --- DATA CONFIG START --- */
const DATA_CONFIG ={
    APP_ID:APP_ID,
    MONGO_IP:'0.0.0.0',
    MONGO_USERNAME_PASSWORD:'',
    MONGO_PORT_ID:"27019",
    MONGO_SERVER_USER:'admin',
    MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
    MONGO_SSH_KEY:"",
    REDIS_URL:"0.0.0.0",
    REDIS_PORT_ID:"27019"
};
class Project_Table{
    static BLANK = 'blank_biz';
    static BLOG_POST = 'blog_post_biz';
    static PRODUCT = 'product_biz';
    static PAGE = 'page_biz';
    static GROUP = 'group_biz';
    static IMAGE = 'image_biz';
}
/* --- DATA CONFIG END --- */
//9_connect - 9_test_connect
describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
        let response={};
        let cache=null;
        let database = {};
        let data = {};
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                //-->
                let print_test = false;
                // -- POST-START --//
            },
        ],
            function(error, result){
                console.log('CONNECT-DONE');
                done();
            });
    });
});
//9_count - 9_test_count
describe('data_count', function(){ this.timeout(25000);
    it("_data_count", function(done){
        console.log('COUNT-START');
        let response=Response_Logic.get();
        let database = {};
        let data = {};
        let option = {};
        let post_data = Data_Logic.get(Project_Table.PRODUCT,'929');
        let post_search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Data.count(database,post_search.table,post_search.filter,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_response',biz_response);
            },
            async function(call){
                console.log('COUNT-SUCCESS');
            },
        ],
            function(error, result){
                console.log('COUNT-DONE');
                done();
            });
    });
});
//9_copy - 9_test_copy
describe('data_copy', function(){ this.timeout(25000);
    it("_data_copy", function(done){
        console.log('COPY-START');
        let response=Response_Logic.get();
        let database = {};
        let data = {};
        let option = {};
        let post_data = Data_Logic.get(Project_Table.PRODUCT,'247');
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Data.copy(database,post_data.table,post_data.id,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_response',biz_response);
            },
            async function(call){
                console.log('COPY-SUCCESS');
            },
        ],
            function(error, result){
                console.log('COPY-DONE');
                done();
            });
    });
});
//9_delete - 9_test_delete
describe('data_delete', function(){ this.timeout(25000);
    it("_data_delete", function(done){
        console.log('DELETE-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let post_data = Data_Logic.get(Project_Table.PRODUCT,'182');
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Data.delete(database,post_data.table,post_data.id,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_response',biz_response);
            },
            async function(call){
                console.log('DELETE-SUCCESS');
            },
        ],
            function(error, result){
                console.log('DELETE-DONE');
                done();
            });
    });
});
//9_delete_search - 9_delete_search //data_delete_search
describe('data_many_delete_search', function(){ this.timeout(25000);
    it("_data_many_delete_search", function(done){
        console.log('DELETE-SEARCH-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let post_search = Data_Logic.get_search(Project_Table.PRODUCT,{id:'768'},{},1,0,{});
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Data.delete_search(database,post_search.table,post_search.filter,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_response',biz_response);
            },
            async function(call){
                console.log('DELETE-SEARCH-SUCCESS');
            },
        ],
            function(response, result){
                console.log('DELETE-SEARCH-DONE');
                done();
            });
    });
});
//9_get - 9_test_get
describe('data_get', function(){ this.timeout(25000);
    it("_data_get", function(done){
        console.log('GET-START');
        let response={};
        let database = {};
        let data = {};
        //let option = {};
        let option_foreign_blank = Data_Logic.get_foreign(Data_Value_Type.COUNT,Store_Table.BLANK,Data_Field.ID,Data_Field.PARENT_ID,{title:'blank_me'});
        let join_search = Data_Logic.get_search(Project_Table.BLANK,{},{},1,0);
        let option = {
            //cache_delete:true,
            //field:{id:1,title:1}
            //foreigns:[Data_Logic.get_foreign(Data_Value_Type.COUNT,Store_Table.PRODUCT,Data_Field.ID,Data_Field.PARENT_ID,{title:'parent'})]
            //joins:[Data_Logic.get_join(Data_Value_Type.ITEMS,join_search)]
        };
        let post_data = Data_Logic.get(Project_Table.PRODUCT,'829');
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Data.get(database,post_data.table,post_data.id,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_response',biz_response);
            },
            async function(call){
                console.log('GET-SUCCESS');
            },
        ],
            function(error, result){
                console.log('GET-DONE');
                done();
            });
    });
});
//9_post - 9_test_post
describe('data_post', function(){ this.timeout(25000);
    it("_data_post", function(done){
        console.log('POST-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let post_data = Store_Logic.get_test_product();
        post_data.parent_id = '490';
        post_data.blank_id = '266';
        post_data.table = Project_Table.BLANK;
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Data.post(database,post_data.table,post_data,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_response',biz_response);
            },
            async function(call){
                console.log('POST-SUCCESS');
            },
        ],
            function(error, result){
                console.log('POST-DONE');
                done();
            });
    });
});
//9_post_items - 9_test_post_items //data_post_items
describe('data_many_post_items', function(){ this.timeout(25000);
    it("_data_many_post_items", function(done){
        console.log('POST-ITEMS-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let post_data = Store_Logic.get_test_products();
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Data.post_items(database,post_data,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_response',biz_response);
            },
            async function(call){
                console.log('POST-ITEMS-SUCCESS');
            },
        ],
            function(error, result){
                console.log('POST-ITEMS-DONE');
                done();
            });
    });
});
//9_search - 9_test_search
describe('data_search', function(){ this.timeout(25000);
    it("_data_search", function(done){
        console.log('BLANK-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let post_search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Data.search(database,post_search.table,post_search.filter,post_search.sort_by,post_search.page_current,post_search.page_size,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_response',biz_response);
            },
            async function(call){
                console.log('BLANK-SUCCESS');
            },
        ],
            function(error, result){
                console.log('BLANK-DONE');
                done();
            });
    });
});
//9_blank - 9_test_blank
describe('data_blank', function(){ this.timeout(25000);
    it("_data_blank", function(done){
        console.log('BLANK-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let post_data = Data_Logic.get(Project_Table.PRODUCT,'929');
        let post_search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Data.count(database,post_search.table,post_search.filter,option);
                Log.w('biz_data',biz_data);
                Log.w('biz_response',biz_response);
            },
            async function(call){
                console.log('BLANK-SUCCESS');
            },
        ],
            function(error, result){
                Log.error('BLANK-DONE',error);
                done();
            });
    });
});


