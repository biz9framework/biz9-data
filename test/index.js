let express = require('express');
const async=require("async");
let router = express.Router();

const { get_db_connect,close_db_connect,update_item,get_item,delete_item } = require("biz9-data");

router.get('/connect', function(req, res, next) {

    let db_connect = {};

    async.series([

        // get_db_connect
        function(call){
            let data_config = {
                APP_ID:'mongo_database_app_id',
                MONGO_IP:"0.0.0.0",
                MONGO_USERNAME_PASSWORD:"",
                MONGO_PORT_ID:"27019",
                MONGO_SERVER_USER:"admin",
                MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
                SSH_KEY:"",
                REDIS_URL:"0.0.0.0",
                REDIS_PORT_ID:"27019",
            };

            get_db_connect(data_config).then(([error,data]) => {
                db_connect = data;
                call();
            }).catch(error => {
                call([error,null]);
            });
        },

        // update_item
        function(call){
            let data_type = 'dt_blank';
            let item =
                {
                    data_type: 'dt_blank',
                    id: 0,
                    title: 'title_6100',
                    first_name: 'first_name_6100',
                    last_name: 'last_name_6100',
                    user_name: 'user_name_6100',
                    test_group_id: 6100
                };

            update_item(db_connect,data_type,item).then(([error,data]) => {
                item = data;
                call();

            }).catch(error => {
                call([error,null]);
            });
        },

        // get_item
        function(call){
            let data_type = item.data_type;
            let id = item.id;

            get_item(db_connect,data_type,id).then(([error,data]) => {
                item = data;
                call();
            }).catch(error => {
                call([error,null]);
            });
        },

        // delete_item
        function(call){
            let data_type = item.data_type;
            let id = item.id;

            delete_item(db_connect,data_type,id).then(([error,data]) => {
                item = data;
                call();
            }).catch(error => {
                call([error,null]);
            });
        },
        // get_item_2
        function(call){
            let data_type = item.data_type;
            let id = item.id;

            get_item(db_connect,data_type,id).then(([error,data]) => {
                item = data;
                call();
            }).catch(error => {
                call([error,null]);
            });
        },
        // close_db_connect
        function(call){

            close_db_connect(db_connect).then(([error,data]) => {
                call();
            }).catch(error => {
                call([error,null]);
            });
        },
    ],
        function(err, result){
            res.send({item:item});
            res.end();
        });
});
module.exports = router;

