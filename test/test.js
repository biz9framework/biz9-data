/*
* Express.JS BiZ9-Service Sample App

* Required
$ npm i mocha
$ npm i express
$ npm i async
$ npm i axios

$ Files
$ app.js = App Express server configuration file.
$ test.js = Mocha test sample.
$ index.js = controller for url http://localhost:1901/

$ Run Test
$> mocha -g 'connect' test.js
*/

const axios = require('axios');
const { get_db_connect,close_db_connect,update_item,get_item,delete_item } = require("biz9-data");

describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
        let url = "http://localhost:1901/connect?app_id=dynamic_app_id";
        axios.get(url, {
            data: {}
        })
            .then(function (response) {
                console.log(response.data.item);
            })
            .catch(function (error) {
                console.log("TEST-BIZ9-Connect-ERROR"+ " " + error);
            });
    });
});


