const async = require('async');
const assert = require('node:assert');
const {Data,Database,Portal} = require(".");
const {Test,Log,Number} = require("biz9-utility");
const {DataType,DataItem} = require("biz9-logic");
/*
 * availble tests
- connect
- item_update
- get_data
- item_delete
- item_list_update
- item_list_get
- item_list_delete
*/
/* --- TEST CONFIG START --- */
//const ID = '0'; // 0 = intialize a new data item.
const ID = '067865b0-b133-4593-96d5-ba9555326bf7';
const TITLE_URL = 'product_1';
const DATA_TYPE = 'product_biz';
//const FILTER = {test_group_id:59367};
const FILTER = {data_type:DATA_TYPE};
const APP_ID = 'test-may26';
const SQL = {};
/* --- TEST CONFIG END --- */

/* --- DATA CONFIG START --- */
const data_config ={
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
/* --- DATA CONFIG END --- */

/* --- BiZ9_CORE_CONFIG-END --- */
describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
        let cloud_error=null;
        let database = {};
        async.series([
        // GET - START
        async function(call){
                console.log('DATABASE-START');
                //const [error,data] = await Team.get_member(db_connect,title_url);
                const [error,data] = await Database.get({app_id:"test-may26",biz9_config_file:"/home/think2/www/doqbox/biz9-framework/biz9-service/code/biz9_config"});
                database = data;
                console.log('DATABASE-END');
        },

        async function(call){
            console.log('ADMIN-START');
                const [error,data] = await Portal.get_admin(database,{get_items:true});
                Log.w('data',data);
                console.log('ADMIN-END');


            /*
            console.log('BUSSINESS-START');
                const [error,data] = await Portal.get_business(database,{get_items:true});
                Log.w('data',data);
                console.log('BUSINESS-END');
                */



            /*
            console.log('PAGE-START');
            let title_url = "page_1";
                const [error,data] = await Portal.get_page(database,title_url,{get_items:true});
                Log.w('data',data);
                console.log('PAGE-END');

*/

            /*
            console.log('PORTAL-COUNT-LIST-START');
                let id = 0;
                let data_type = DataType.BLANK;
                let filter = {};
                let item_list = [];
                Log.w('data',item_list);
                const [error,data] = await Portal.count(database,data_type,filter,{});
                Log.w('data',data);
                console.log('PORTAL-COUNT-LIST-END');
                */

            /*
                console.log('PORTAL-DELETE-LIST-START');
                let id = 0;
                let data_type = DataType.BLANK;
                let filter = {};
                let item_list = [];
                Log.w('data',item_list);
                const [error,data] = await Portal.delete_list(database,data_type,filter,{});
                Log.w('data',data);
                console.log('PORTAL-DELETE-LIST-END');
                */

            /*
                console.log('PORTAL-UPDATE-LIST-START');
                let id = 0;
                let data_type = DataType.BLANK;
                let item = Test.get_item(data_type,id);
                let item_list = [];
                item_list.push(Test.get_item(data_type,id));
                item_list.push(Test.get_item(data_type,id));
                item_list.push(Test.get_item(data_type,id));
                Log.w('data',item_list);
                const [error,data] = await Portal.update_list(database,item_list,{});
                Log.w('data',data);
                console.log('PORTAL-UPDATE-LIST-END');
                //Log.w('database',database);
                */


            /*
                console.log('PORTAL-UPDATE-START');
                let id = 0;
                let data_type = DataType.BLANK;
                let item = Test.get_item(data_type,id);
                Log.w('item',item);
                const [error,data] = await Portal.update(database,data_type,item,{});
                Log.w('data',data);
                console.log('PORTAL-GET-END');
                //Log.w('database',database);
            */

            /*
                console.log('PORTAL-GET-LIST-START');
                let data_type = DataType.BLANK;
                let filter = {};
                let sort_by = {};
                let page_current = 1;
                let page_size = 99;
                const [error,data] = await Portal.get_list(database,data_type,filter,sort_by,page_current,page_size,{get_items:true,get_photos:true});
                console.log(data);
                console.log('PORTAL-GET-LIST-SUCCESS');
                //database = data;
                //Log.w('database',database);
                */
            /*

                console.log('PORTAL-GET-START');
                let data_type = DataType.BLANK;
                let key = "1d5e10eb-8927-442d-83ae-52f2e156daad";
                //let key = 'product_1';
                //const [error,data] = await Portal.get();
                const [error,data] = await Portal.get(database,data_type,key,{get_items:true,get_photos:true});
                console.log(data);
                console.log('PORTAL-GET-SUCCESS');
                //database = data;
                //Log.w('database',database);
                console.log('PORTAL-GET-END');

            */

    /*
                console.log('PORTAL-DELETE-START');
                let data_type = DataType.BLANK;
                let key = "1d5e10eb-8927-442d-83ae-52f2e156daad";
                //let key = 'product_1';
                //const [error,data] = await Portal.get();
                const [error,data] = await Portal.delete(database,data_type,key,{get_items:true,get_photos:true});
                console.log(data);
                console.log('PORTAL-DELETE-SUCCESS');
                //database = data;
                //Log.w('database',database);
                console.log('PORTAL-DELETE-END');
                */



        },

        /*
        async function(call){
                const [error,data] = await Database.close(database);
                Log.w('data_close',data);
               console.log('DATABASE-CLOSE');
                //call();
        },
        */
        // GET - END


        // CONNECT - START
        /*
        async function(call){
                console.log('DATABASE-START');
                let title_url = 'sales_team';
                //const [error,data] = await Team.get_member(db_connect,title_url);
                const [error,data] = await Database.get({app_id:"test-may26",biz9_config_file:"/home/think2/www/doqbox/biz9-framework/biz9-service/code/biz9_config"});
            console.log('connect-good');
                database = data;
                Log.w('database',database);
                //call();
        },
        async function(call){
                const [error,data] = await Database.close(database);
                Log.w('data_close',data);
               console.log('DATABASE-CLOSE');
                //call();
        },
        */
        // CONNECT - END

            /*
            function(call){
                console.log('11111111111');
                Data.open_db(data_config).then(([error,data])=> {
                    console.log('222222222');
                    cloud_error=Log.append(cloud_error,error);
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    Log.w('data',data);
                    console.log('CONNECT-OPEN-SUCCESS');
                    //call();
                }).catch(error => {
                    Log.error('CONNECT-OPEN-ERROR',error);
                    console.log(error);
                    cloud_error=Log.append(cloud_error,error);
                });
            },
            function(call){
                Data.check_db(db_connect).then((data)=> {
                    cloud_error=Log.append(cloud_error,error);
                    Log.w('data',data);
                    Log.w('error',error);
                    assert.notEqual(data,null);
                    console.log(data);
                    console.log('CONNECT-CHECK-SUCCESS');
                    call();
                }).catch(error => {
                    Log.error('CONNECT-CHECK-ERROR',error);
                    cloud_error=Log.append(cloud_error,error);
                });
            },
            function(call){
                Data.close_db(db_connect).then(([error,data])=> {
                    cloud_error=Log.append(cloud_error,error);
                    db_connect = data;
                    assert.equal(db_connect,null);
                    console.log(data);
                    console.log('CONNECT-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    Log.error('CONNECT-CLOSE-ERROR',error);
                    cloud_error=Log.append(cloud_error,error);
                });
            },
            */
        ],
            function(error, result){
                //console.log('CONNECT-DONE');
                done();
            });
    });
});
describe('item_update', function(){ this.timeout(25000);
    it("_item_update", function(done){
        let cloud_error=null;
        let db_connect = {};
        var item_test = Test.get_item('dt_blank',ID);
        async.series([
            function(call){
                console.log('ITEM-UPDATE-START');
                Data.open_db(data_config).then(([error,data])=> {
                    cloud_error=Log.append(cloud_error,error);
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('ITEM-UPDATE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('ITEM-UPDATE-UPDATE-START');
                Data.update_item(db_connect,DATA_TYPE,item_test).then(([error,data])=> {
                    cloud_error=Log.append(cloud_error,error);
                    item_test = data;
                    console.log(item_test);
                    assert.notEqual(data,null);
                    console.log('ITEM-UPDATE-UPDATE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('ITEM-UPDATE-CLOSE-START');
                Data.close_db(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('ITEM-UPDATE-DELETE-CACHE-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('ITEM-UPDATE-ASSERT-START');
                assert.notEqual(item_test.first_name,0);
                assert.notEqual(item_test.first_name,null);
                assert.notEqual(item_test.id,0);
                assert.notEqual(item_test.id,null);
                assert.equal(null,db_connect);
                console.log('ITEM-UPDATE-ASSERT-SUCCESS');
                call();
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("ITEM-UPDATE-ERROR-DONE",cloud_error);
                }else{
                    console.log('ITEM-UPDATE-CONNECT-SUCCESS-DONE');
                    console.log('ITEM-UPDATE-UPDATE-SUCCESS-DONE');
                    console.log('ITEM-UPDATE-CLOSE-SUCCESS-DONE');
                    console.log('ITEM-UPDATE-ASSERT-SUCCESS-DONE');
                    console.log('ITEM-UPDATE-DONE');
                }
                done();
            });
    });
});
describe('get_data', function(){ this.timeout(25000);
    it("_get_data", function(done){
        let cloud_error = null;
        let db_connect = {};
        let item_test = get_new_item(DATA_TYPE,ID);
        async.series([
            function(call){
                console.log('TEST-ITEM-GET-CONNECT-START');
                Data.open_db(data_config).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                        Log.w('error',error);
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('TEST-ITEM-GET-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-ITEM-GET-GET-START');
                Data.get_item(db_connect,DATA_TYPE,item_test.id).then(([error,data])=> {
                //Data.get_item(db_connect,DATA_TYPE,item_test.id,{title_url:TITLE_URL}).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                        Log.w('error',error);
                    }
                    console.log(data);
                    item_test = data;
                    assert.notEqual(0,data.id);
                    assert.equal(DATA_TYPE,data.data_type);
                    assert.equal(ID,data.id);
                    console.log('TEST-GET-ITEM-GET-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-ITEM-GET-CLOSE-START');
                Data.close_db(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('TEST-ITEM-GET-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-ITEM-GET-ASSERT-START');
                assert.notEqual(item_test.first_name,0);
                assert.notEqual(item_test.first_name,null);
                assert.notEqual(item_test.id,0);
                assert.notEqual(item_test.id,null);
                assert.equal(null,db_connect);
                console.log('TEST-ITEM-GET-ASSERT-SUCCESS');
                call();
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("TEST-ITEM-GET-ERROR-DONE",cloud_error);
                }else{

                    console.log('TEST-ITEM-GET-CONNECT-SUCCESS-DONE');
                    console.log('TEST-ITEM-GET-GET-SUCCESS-DONE');
                    console.log('TEST-ITEM-GET-ASSERT-SUCCESS-DONE');
                    console.log('TEST-ITEM-GET-CLOSE-SUCCESS-DONE');
                    console.log('TEST-ITEM-GET-DONE');
                }
                done();
            });
    });
});
describe('item_delete', function(){ this.timeout(25000);
    it("_item_delete", function(done){
        let cloud_error = null;
        let db_connect = {};
        let item_test = get_new_item(DATA_TYPE,ID);
        async.series([
            function(call){
                console.log('TEST-ITEM-DELETE-CONNECT-START');
                Data.open_db(data_config).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                        Log.error('error',error);
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('TEST-ITEM-DELETE-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-ITEM-DELETE-GET-START');
                Data.delete_item(db_connect,DATA_TYPE,item_test.id).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                        Log.error('error',error);
                    }
                    item_test = data;
                    console.log(item_test);
                    console.log('--TEST-DELETE-ITEM-2-SUCCESS--');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            /*
            function(call){
                console.log('TEST-ITEM-DELETE-CACHE-GET-START');
                Data.delete_cache_item(db_connect,DATA_TYPE,item_test.id).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                        Log.error('error',error);
                    }
                    console.log(error);
                    console.log(data);
                    console.log('--TEST-DELETE-CACHE-ITEM-2-SUCCESS--');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            */
            function(call){
                console.log('TEST-ITEM-DELETE-CLOSE-START');
                Data.close_db(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('TEST-ITEM-DELETE-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-ITEM-DELETE-ASSERT-START');
                console.log(item_test);
                assert.equal(item_test.cache_del,true);
                assert.equal(item_test.db_del,true);
                console.log('TEST-ITEM-DELETE-ASSERT-SUCCESS');
                call();
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("TEST-ITEM-DELETE-ERROR-DONE",cloud_error);
                }else{
                    console.log('TEST-ITEM-DELETE-CONNECT-SUCCESS-DONE');
                    console.log('TEST-ITEM-DELETE-GET-SUCCESS-DONE');
                    console.log('TEST-ITEM-DELETE-ASSERT-SUCCESS-DONE');
                    console.log('TEST-ITEM-DELETE-CLOSE-SUCCESS-DONE');
                    console.log('TEST-ITEM-DELETE-DONE');
                }
                done();
            });
    });
});
describe('item_list_update', function(){ this.timeout(25000);
    it("_item_list_update", function(done){
        let cloud_error=null;
        let db_connect = {};
        let item_test_list = [];
        async.series([
            function(call){
                console.log('TEST-LIST-ITEM-UPDATE-CONNECT-START');
                Data.open_db(data_config).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                        Log.error('error',error);
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('TEST-LIST-ITEM-UPDATE-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-UPDATE-UPDATE-START');
                let test_group_id=Number.get_id();
                for(a=0;a<10;a++){
                    item_test=Test.get_item('dt_blank',0);
                    item_test.test_group_id=test_group_id;
                    item_test_list.push(item_test);
                }
                Data.update_list(db_connect,item_test_list).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }
                    console.log(data);
                    assert.notEqual(0,data.length);
                    assert.strictEqual(10,data.length);
                    assert.notEqual(0,data[0].id);
                    console.log('TEST-LIST-ITEM-UPDATE-UPDATE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-UPDATE-CLOSE-START');
                Data.close_db(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('TEST-LIST-ITEM-UPDATE-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-UPDATE-ASSERT-START');
                assert.notEqual(item_test.first_name,0);
                assert.notEqual(item_test.first_name,null);
                assert.notEqual(item_test.id,0);
                assert.notEqual(item_test.id,null);
                assert.equal(null,db_connect);
                console.log('TEST-LIST-ITEM-UPDATE-ASSERT-SUCCESS');
                call();
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("TEST-LIST-ITEM-UPDATE-ERROR-DONE",cloud_error);
                }else{
                    console.log('TEST-LIST-ITEM-UPDATE-CONNECT-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-UPDATE-UPDATE-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-UPDATE-CLOSE-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-UPDATE-ASSERT-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-UPDATE-DONE');
                }
                done();
            });
    });
});
describe('item_list_get', function(){ this.timeout(25000);
    it("_item_list_get", function(done){
        let cloud_error = null;
        let db_connect = {};
        let data_list = [];
        let data_type =DATA_TYPE;
        let filter =FILTER;
        let sort_by ={title:-1};
        let page_current =1;
        let page_size =10;
        async.series([
            function(call){
                console.log('LIST-ITEM-GET-CONNECT-START');
                Data.open_db(data_config).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                        Log.error('error',error);
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('LIST-ITEM-GET-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('LIST-ITEM-GET-GET-ITEM-LIST-START');
                Log.w('data_type',data_type);
                Log.w('filter',filter);
                Log.w('sort_by',sort_by);
                Log.w('page_current',page_current);
                Log.w('page_size',page_size);
                Data.get_list(db_connect,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=> {
                    data_list = data;
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        Log.w('data',data);
                        Log.w('item_count',item_count);
                        Log.w('page_count',page_count);
                        console.log('LIST-ITEM-GET-GET-ITEM-LIST-SUCCESS');
                    }
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('LIST-ITEM-GET-CLOSE-START');
                Data.close_db(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('LIST-ITEM-GET-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('LIST-ITEM-GET-ASSERT-START');
                assert.equal(data_list.length,page_size);
                console.log('LIST-ITEM-GET-ASSERT-SUCCESS');
                call();
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("LIST-ITEM-GET-ERROR-DONE",cloud_error);
                }else{
                    console.log('LIST-ITEM-GET-CONNECT-SUCCESS-DONE');
                    console.log('LIST-ITEM-GET-GET-SUCCESS-DONE');
                    console.log('LIST-ITEM-GET-ASSERT-SUCCESS-DONE');
                    console.log('LIST-ITEM-GET-CLOSE-SUCCESS-DONE');
                    console.log('LIST-ITEM-GET-DONE');
                }
                done();
            });
    });
});
describe('item_list_delete', function(){ this.timeout(25000);
    it("_item_list_delete", function(done){
        let cloud_error = null;
        let db_connect = {};
        let data_list = [];
        let data_type =DATA_TYPE;
        let filter =FILTER;
        async.series([
            function(call){
                console.log('TEST-LIST-ITEM-DELETE-CONNECT-START');
                Data.open_db(data_config).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                        w('error',error);
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('TEST-LIST-ITEM-DELETE-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-GET-DELETE-ITEM-LIST-START');
                Log.error('data_type',data_type);
                Log.error('filter',filter);
                Data.delete_list(db_connect,data_type,filter).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        data_list = data;
                        Log.error('data',data_list);
                        console.log('TEST-LIST-ITEM-GET-GET-ITEM-LIST-SUCCESS');
                    }
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-DELETE-CLOSE-START');
                Data.close_db(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('TEST-LIST-ITEM-DELETE-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-DELETE-ASSERT-START');
                //assert.equal(data_list.length,page_size);
                console.log('TEST-LIST-ITEM-DELETE-ASSERT-SUCCESS');
                call();
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("TEST-LIST-ITEM-DELETE-ERROR-DONE",cloud_error);
                }else{
                    console.log('TEST-LIST-ITEM-DELETE-CONNECT-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-DELETE-GET-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-DELETE-ASSERT-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-DELETE-CLOSE-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-DELETE-DONE');
                }
                done();
            });
    });
});

const get_new_item = (data_type,id) =>{
    return {data_type:data_type,id:id};
}

