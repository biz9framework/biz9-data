const async = require('async');
const assert = require('node:assert');
const { get_db_connect,close_db_connect,check_db_connect,update_item,update_item_list,get_item,delete_item,get_item_list,delete_item_list,count_item_list } = require("./");
const {get_guid,get_id,w,get_test_item} = require("biz9-utility");
/*
 * availble tests
connect
- item_update
- item_get
- item_delete
- item_list_update
- item_list_get
- item_list_delete
*/
/* --- TEST CONFIG START --- */
//const ID = '0'; // 0 = intialize a new data item.
const ID = '1db7ccdf-6990-4593-9fdf-d84c3c642362';
const DATA_TYPE = 'dt_blank';
const APP_TITLE_ID = 'db_title_feb_11';
const SQL = {};
/* --- TEST CONFIG END --- */

/* --- DATA CONFIG START --- */
const data_config ={
    APP_TITLE_ID:APP_TITLE_ID,
    MONGO_IP:'0.0.0.0',
    MONGO_USERNAME_PASSWORD:'',
    MONGO_PORT_ID:"27019",
    MONGO_SERVER_USER:'admin',
    MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
    SSH_KEY:"",
    REDIS_URL:"0.0.0.0",
    REDIS_PORT_ID:"27019"
};
/* --- DATA CONFIG END --- */

/* --- BiZ9_CORE_CONFIG-END --- */
describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
        let cloud_error=null;
        let db_connect = {};
        async.series([
            function(call){
                console.log('TEST-CONNECT-LOCAL-START');
                get_db_connect(data_config).then(([error,data])=> {
                    db_connect = data;
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                    }else{
                        assert.notEqual(db_connect,null);
                        console.log(data);
                        console.log('TEST-CONNECT-LOCAL-SUCCESS');
                    }
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-CHECK-DB-CONNECT-START');
                check_db_connect(db_connect).then((data)=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                    }
                    console.log(data);
                    console.log('TEST-CHECK-DB-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-CLOSE-DB-CONNECT-START');
                close_db_connect(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                    }
                    db_connect = data;
                    assert.equal(db_connect,null);
                    console.log(data);
                    console.log('TEST-CLOSE-DB-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                });
            },
        ],
            function(error, result){
                if(cloud_error){
                    w_error("TEST-CONNECT-ERROR-DONE",cloud_error);
                }else{
                    console.log('TEST-CONNECT-LOCAL-SUCCESS-DONE');
                    console.log('TEST-CONNECT-CHECK-SUCCESS-DONE');
                    console.log('TEST-CONNECT-CLOSE-SUCCESS-DONE');
                    console.log('TEST-CONNECT-DONE');
                }
                done();
            });
    });
});
describe('item_update', function(){ this.timeout(25000);
    it("_item_update", function(done){
        let cloud_error=null;
        let db_connect = {};
        let item_test = get_test_item('dt_blank',0);
        async.series([
            function(call){
                console.log('TEST-ITEM-UPDATE-CONNECT-START');
                get_db_connect(data_config).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                        w('error',error);
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('TEST-ITEM-UPDATE-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-ITEM-UPDATE-UPDATE-START');
                update_item(db_connect,DATA_TYPE,item_test).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                    }
                    item_test = data;
                    assert.notEqual(data,null);
                    console.log(item_test);
                    console.log('TEST-ITEM-UPDATE-UPDATE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-ITEM-UPDATE-CLOSE-START');
                close_db_connect(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('TEST-ITEM-UPDATE-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-ITEM-UPDATE-ASSERT-START');
                assert.notEqual(item_test.first_name,0);
                assert.notEqual(item_test.first_name,null);
                assert.notEqual(item_test.id,0);
                assert.notEqual(item_test.id,null);
                assert.equal(null,db_connect);
                console.log('TEST-ITEM-UPDATE-ASSERT-SUCCESS');
                call();
            },
        ],
            function(error, result){
                if(cloud_error){
                    w_error("TEST-ITEM-UPDATE-ERROR-DONE",cloud_error);
                }else{
                    console.log('TEST-ITEM-UPDATE-CONNECT-SUCCESS-DONE');
                    console.log('TEST-ITEM-UPDATE-UPDATE-SUCCESS-DONE');
                    console.log('TEST-ITEM-UPDATE-CLOSE-SUCCESS-DONE');
                    console.log('TEST-ITEM-UPDATE-ASSERT-SUCCESS-DONE');
                    console.log('TEST-ITEM-UPDATE-DONE');
                }
                done();
            });
    });
});
describe('item_get', function(){ this.timeout(25000);
    it("_item_get", function(done){
        let cloud_error = null;
        let db_connect = {};
        let item_test = get_new_item(DATA_TYPE,ID);
        async.series([
            function(call){
                console.log('TEST-ITEM-GET-CONNECT-START');
                get_db_connect(data_config).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                        w('error',error);
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('TEST-ITEM-GET-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-ITEM-GET-GET-START');
                get_item(db_connect,DATA_TYPE,item_test.id).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                        w('error',error);
                    }
                    console.log(data);
                    item_test = data;
                    assert.notEqual(0,data.id);
                    assert.equal(DATA_TYPE,data.data_type);
                    assert.equal(ID,data.id);
                    console.log('TEST-GET-ITEM-GET-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-ITEM-GET-CLOSE-START');
                close_db_connect(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('TEST-ITEM-GET-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
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
                    w_error("TEST-ITEM-GET-ERROR-DONE",cloud_error);
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
                get_db_connect(data_config).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                        w('error',error);
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('TEST-ITEM-DELETE-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-ITEM-DELETE-GET-START');
                delete_item(db_connect,DATA_TYPE,item_test.id).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                        w('error',error);
                    }
                    item_test = data;
                    console.log(item_test);
                    console.log('--TEST-DELETE-ITEM-2-SUCCESS--');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-ITEM-DELETE-CLOSE-START');
                close_db_connect(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('TEST-ITEM-DELETE-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-ITEM-DELETE-ASSERT-START');
                assert.equal(item_test.cache_del,true);
                assert.equal(item_test.db_del,true);
                console.log('TEST-ITEM-DELETE-ASSERT-SUCCESS');
                call();
            },
        ],
            function(error, result){
                if(cloud_error){
                    w_error("TEST-ITEM-DELETE-ERROR-DONE",cloud_error);
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
                get_db_connect(data_config).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                        w('error',error);
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('TEST-LIST-ITEM-UPDATE-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-UPDATE-UPDATE-START');
                test_group_id=get_id();
                for(a=0;a<10;a++){
                    item_test=get_test_item('dt_blank',0);
                    item_test.test_group_id=test_group_id;
                    item_test_list.push(item_test);
                }
                update_item_list(db_connect,item_test_list).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                    }
                    console.log(data);
                    assert.notEqual(0,data.length);
                    assert.strictEqual(10,data.length);
                    assert.notEqual(0,data[0].id);
                    console.log('TEST-LIST-ITEM-UPDATE-UPDATE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-UPDATE-CLOSE-START');
                close_db_connect(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('TEST-LIST-ITEM-UPDATE-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
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
                    w_error("TEST-LIST-ITEM-UPDATE-ERROR-DONE",cloud_error);
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
        let data_type ='dt_blank';
        let filter ={title:'title_1813'};
        let sort_by ={title:-1};
        let page_current =1;
        let page_size =10;
        async.series([
            function(call){
                console.log('TEST-LIST-ITEM-GET-CONNECT-START');
                get_db_connect(data_config).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                        w('error',error);
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('TEST-LIST-ITEM-GET-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-GET-GET-ITEM-LIST-START');
                w('data_type',data_type);
                w('filter',filter);
                w('sort_by',sort_by);
                w('page_current',page_current);
                w('page_size',page_size);
                get_item_list(db_connect,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                    }else{
                        data_list = data;
                        w('data',data_list);
                        w('item_count',item_count);
                        w('page_count',page_count);
                        console.log('TEST-LIST-ITEM-GET-GET-ITEM-LIST-SUCCESS');
                    }
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-GET-CLOSE-START');
                close_db_connect(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('TEST-LIST-ITEM-GET-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-GET-ASSERT-START');
                assert.equal(data_list.length,page_size);
                console.log('TEST-LIST-ITEM-GET-ASSERT-SUCCESS');
                call();
            },
        ],
            function(error, result){
                if(cloud_error){
                    w_error("TEST-LIST-ITEM-GET-ERROR-DONE",cloud_error);
                }else{
                    console.log('TEST-LIST-ITEM-GET-CONNECT-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-GET-GET-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-GET-ASSERT-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-GET-CLOSE-SUCCESS-DONE');
                    console.log('TEST-LIST-ITEM-GET-DONE');
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
        let data_type ='dt_blank';
        let filter ={title:'title_1813'};
        async.series([
            function(call){
                console.log('TEST-LIST-ITEM-DELETE-CONNECT-START');
                get_db_connect(data_config).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                        w('error',error);
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('TEST-LIST-ITEM-DELETE-CONNECT-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-GET-DELETE-ITEM-LIST-START');
                w('data_type',data_type);
                w('filter',filter);
                delete_item_list(db_connect,data_type,filter).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                    }else{
                        data_list = data;
                        w('data',data_list);
                        console.log('TEST-LIST-ITEM-GET-GET-ITEM-LIST-SUCCESS');
                    }
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
                    call();
                });
            },
            function(call){
                console.log('TEST-LIST-ITEM-DELETE-CLOSE-START');
                close_db_connect(db_connect).then(([error,data])=> {
                    if(error){
                        cloud_error=error_append(cloud_error,error);
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('TEST-LIST-ITEM-DELETE-CLOSE-SUCCESS');
                    call();
                }).catch(error => {
                    cloud_error=error_append(cloud_error,error);
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
                    w_error("TEST-LIST-ITEM-DELETE-ERROR-DONE",cloud_error);
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

