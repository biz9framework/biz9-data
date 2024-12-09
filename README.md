# BiZ9-Data
**BiZ9-Data** is a object-relational mapper **(ORM)** that lets you build a clean, portable, and high-level data access layer with Node.js for data driven applications. It is the engine compartment to the [**BiZ9 Framework**](https://github.com/biz9framework). The primary libriaries are [**MongoDB**](https://www.mongodb.com/) which is a cross-platform, document-oriented database and [**Redis**](https://redis.io/), an in-memory storage, used as a distributed, in memory key-value database. **BiZ9-Data** is the **ORM** solution currently promoted for use with [**React**](https://react.dev/), [**React-Native**](https://reactnative.dev/), [**Angular**](https://angular.dev/), and [**Express.js**](http://Express.js) based projects as part of the data access stack.
## Installation
Use the [npm](https://npm.com) installer to install.

```bash
npm install biz9-data
```
## Required
* [MongoDB](https://www.mongodb.com/docs/manual/installation/)
* [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)
## Contents
* [Example with Express.js](#expressjsexample)
* [Initialize Reference Object](#reference)
* [Open Database Connection](#get_connection)
* [Close Database Connection](#close_connection)
* [Update Item](#update_item)
* [Get Item](#get_item)
* [Get SQL](#get_item)
* [Get SQL With Paging](#get_sql_with_paging)
* [Delete Item](#delete_item)
* [Delete SQL](#delete_sql)
* [Update List](#update_list)
* [Delete List](#delete_list) 
* [Count](#count) 
* [Drop](#drop) 
* [Credit](#credit) 

### <a id="expressjsexample"></a>Example with Express.js
```node
// Expressjs index.js
 How to use:
 $ npm install express 
 $ npm i  async

router.post("/update_form/", function(req, res) {
    var db = {};
    async.series([
        function(call){
            var db_name = 'db_one';
            biz9data.get_client_db(function(error,_client_db){
                client_db = _client_db;
                db = client_db.db(db_name);
                call();
            });
        },
        function(call){
            var item = {tbl_id:0,data_type:"dt_blank",first_name:"BoB", last_name:"Smith"};
            biz9data.update_item(db,item.data_type,item,function(error,data) {
                item = data;
                call();
            });
        },
        function(call){
            var data_type="dt_blank";
            var tbl_id="d31facf1-769e-48a6-a7d2-6c349e4b808e";
            biz9.get_item(db,data_type,tbl_id,function(error,data){
                item = data;
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({data_item:item});
            res.end();
        });
});
```
### <a id="reference"></a>Intialize Reference Object
Intialize biz9-data object to be used in application. 
```node
// Expressjs App.js
var data_config={
    mongo_server_user:"admin",
    mongo_username_password:"ban:12345678",
    mongo_ip:"localhost",
    mongo_port:"27017",
    mongo_config:"/etc/mongod.conf",
    ssh_key:"",
    redis_url:"0.0.0.0",
    redis_port:"27018"
};
var biz9data=require("biz9-data")(data_config);
```
### <a id="get_connection"></a>Open Database Connection
Establish and open connection with Mongo database.
#### Params
- db_name ( required ) / database name / string
#### Returns
- client_db / open client database connection / database object
#### Example
```node
var db_name = "my_database_1";
var db = {}:
biz9data.get_client_db(function(error,_client_db){
    client_db = _client_db;
    db = client_db.db(db_name);
});
```
### <a id="close_connection"></a>Close database connection
Close and dispose Mongo database connection.
#### Params
- client_db ( required ) / client database connection / database object
#### Returns
- client_db / Closed client database connection / database object
#### Example
```node
biz9data.close_client_db(client_db,function(error){
});
```
### <a id="update_item"></a>Update Item
Create and or update record in table database. 
### Params
- client_db ( required ) / open client database connection / database object
- tbl_id ( required ) / primary key / GUID
- data_type ( required ) / table name / string
- data_item ( required ) / data item object to be saved / object
### Returns
- data_item / Data item of updated record. On create record, tbl_id field unique GUID is generated / object
### Example
```node
var db = db_open_connect_object; 
var data_type = "dt_blank";
var item = {tbl_id:0,,data_type:data_type,title:'my_title'};
biz9data.update_item(db,data_type,item,function(error,data) {
});
```
### <a id="get_sql"></a>Get SQL
Find records in table by filter.
### Params
- client_db ( required ) / Open client database connection / database object
- data_type ( required ) / Table Name / string
- filter_object ( required ) / Filter by properties object / object
- sort_by_object ( required ) / The order to sort the returned records.  / 1 = ascending order /  -1 = descending order / object
### Returns
- data_list / List of records from database table / list of objects
### Example
```node
var db = db_open_connect_object;
var sql = {title:"my_title"};
var sort = {title:-1};
var data_type = 'dt_blank';
biz9data.get_sql(db,data_type,sql,sort,function(error,data_list) {
});
```
### <a id="delete_sql"></a>Delete SQL
Delete records in table by filter.
### Params
- filter_object ( required ) / filter by properties object / object
- data_type ( required ) / table name / string
### Returns
- data_list / empty data list / list
### Example
```node
var db = db_open_connect_object;
var sql = {title:"my_title"};
var data_type = 'blank_dt';
biz9data.delete_sql(db,data_type,sql,function(error,data_list) {
});
```
### <a id="get_sql_with_paging"></a>Get SQL With Paging
Find records in table by filter with paging.
#### Params
- client_db ( required ) / open client database connection / database object
- filter_object ( required ) / filter by properties object / object
- data_type ( required ) / table name / string
- sort_by_object ( required ) / the order to sort the returned records /
    1 = ascending order /  -1 = descending order / object
- page_current ( required ) / current page of list  / int
- page_size ( required ) / Mmx size of list / int
#### Returns
- data_list / list of records from database table / list
- total_count / count of records from database table / int
- page_count / page count per list of records from database table / int
#### Example
```node
var db = db_open_connect_object;
var sql = {title:"my_title"};
var data_type = "blank_dt";
var sort = {title:-1};
var page_current = 1;
var page_size = 12;
biz9data.get_sql_paging(db,data_type,sql,sort,page_current,page_size,function(error,data_list,total_count,page_count){
});
```
### <a id="get_item"></a>Get Item
Get record from table in database by primary key field.
#### Params
- client_db ( required ) / open client database connection / database object
- data_type ( required ) / table name / string
- tbl_id ( optional, recommended ) / primary key of record in table from database / GUID
- title_url ( optional ) / Title url of the title of the data item / string
#### Returns
- data_item / Record from table in database / object
#### Example
```node
var db = db_open_connect_object;
let tbl_id = "a6d94ccf-3da7-4389-b5db-f4f74518be3a";
let data_type = "dt_blank";
biz9data.get_item(db,data_type,tbl_id,function(error,data) {
});
```
### <a id="delete_item"></a>Delete Item
Delete Item from table in database by filter.
#### Params
- client_db ( required ) / open client database connection / database object
- data_type ( required ) / table name / string
- tbl_id ( optional, recommended ) / primary key of record in table from database / guid
#### Returns
- data_item / empty record from table in database / object
#### Example
```node
var db = db_open_connect_object;
var tbl_id = "a6d94ccf-3da7-4389-b5db-f4f74518be3a";
var data_type = 'dt_blank';
biz9data.delete_item(db,data_type,tbl_id,function(error,data) {
});
```
### <a id="update_list"></a>Update List
Create and or update a list of records for a table in the database.
#### Params
- client_db ( required ) / client database connection / database object
- data_list ( required ) / list of records to be added or upated on the table in the database / list
#### Returns
- data_list / data items of updated records. On create records, tbl_id field unique guid is generated / list
#### Example
```node
var db = db_open_connect_object;
var item_list = [
    {tbl_id:"0",
    data_type:"dt_blank",
    title:"my_title_2"},
    {tbl_id:"0",
    data_type:"dt_blank",
    title:"my_title_3"},
    {tbl_id:"0",
    data_type:"dt_blank",
    title:"my_title_4"}
    ];
biz9data.update_list(db,item_list,function(error,data_list) {
});
```
### <a id="delete_list"></a>Delete List
### [Delete List](#delete_list)
Delete a list of records from table in database by filter.
#### Params
- client_db ( required ) / client database connection / database object
- data_list ( required ) / list of records to be added or upated on the table in the database / list
#### Returns
- data_list / empty data items of updated records / list
#### Example
```node
var db = db_open_connect_object;
var item_list = [
        {tbl_id:"d31facf1-769e-48a6-a7d2-6c349e4b808e",
        data_type:"dt_blank",
        title:"my_title_2"},
        {tbl_id:"c700b4b5-8e67-4bc3-bcf2-f3ec720e0d90",
        data_type:"dt_blank",
        title:"my_title_3"},
        {tbl_id:"d043227e-0511-4827-8c82-96a39ef1094f",
        data_type:"dt_blank",
        title:"my_title_4"}
];
biz9data.delete_list(db,item_list,function(error,data_list) {
});
```
### <a id="count"></a>Count
Count records in table from database.
#### Params
- client_db ( required ) / client database connection / database object
- data_type ( required ) / table name / string 
#### Returns
- count / number of records / int
#### Example
```node
var db = db_open_connect_object;
var item_list = [
        {tbl_id:"d31facf1-769e-48a6-a7d2-6c349e4b808e",
        data_type:"dt_blank",
        title:"my_title_2"},
        {tbl_id:"c700b4b5-8e67-4bc3-bcf2-f3ec720e0d90",
        data_type:"dt_blank",
        title:"my_title_3"},
        {tbl_id:"d043227e-0511-4827-8c82-96a39ef1094f",
        data_type:"dt_blank",
        title:"my_title_4"}
];
var data_type = 'dt_blank';
biz9data.count(db,data_type,function(error,data) {
});
```
### <a id="drop"></a>Drop
Drop table from database.
#### Params
- client_db ( required ) / client database connection / database object
- data_type ( required ) / table name / string 
#### Returns
- null / success if complete / string
#### Example
```node
var data_type = 'dt_blank';
biz9data.drop(db,data_type,function(error,data) {
});
```
### <a id="credit"></a>Credits

#### Company
- BoSS AppZ

#### Code
- [BiZ9 Framework Github](https://github.com/biz9framework)
- [BiZ9 Core NPM](https://www.npmjs.com/package/biz9-core)

#### E-mail
- contact@bossappz.com
#### Website
- [bossappz.com](https://bossappz.com)
- [mobile.bossappz.com](https://mobile.bossappz.com)
#### BoSS AppZ 💰
BoSS AppZ are web and mobile applications built for the BoSS on the go. The primary features of the BoSS AppZ are ThemeForest.net, The BiZ9 Framework, and Amazon Web Services. BoSS ApZZ powers many applications in the healthcare, retail and manufacturing industries.
- [Blog](https://bossappz.medium.com)
#### App Money NoteZ 💯
Application Development NoteZ That Make $ense! Cuts out all the blah, blah, blah and gets right to the resultZ!
#### The BiZ9 Framework 🦾
The BiZ9 Framework is a user-friendly platform for building fast and scalable network applications. The framework consists of libraries and software tools like: Node,js, React Native, Angular, ExpressJS, MongoDB, Nginx, Redis, GIT, and Bash scripts. The BIZ9 Framework is designed to build, maintain, and deploy rich and robust, applications for web, Android and Apple devices. Other 3rd party  Application Programming Interfaces included are Amazon Web Service, Stripe, and Bravely.
- [Website](https://github.com/biz9framework)
- [Blog](https://bossappz.medium.com/what-is-the-biz9-framework-29731c49ad79)
#### BoSS AppZ Developer  ClaZZ💡
The BoSS AppZ Application Development Class is custom designed for each individual that desires to learn the art of application development for career or self-use purposes. We will teach you and train you on how to become a full stack application developer. Mobile applications are the future. Stay informed with the best and greatest tools for application development. 
- [Website](https://bossappz.com/clazz)
#### TaNK9 Code 👽
Brandon Poole Sr also known as ‘TaNK’ is a full stack application developer
born and raised in Atlanta Ga and graduated with a Computer Information Systems degree from Fort Valley State University (FVSU).  While attending FVSU Mr. Poole created a social network titled CrunkFriends. It accumulated over 50k registered members and was the first of its kind back in 2005.

Mr. Poole went on to have a career as a Senior Application Developer for many premium Technology companies. The names of those tech companies are Colonial Pipeline, Boeing, Nascar, Home Depot, the Center for Disease Control, American Cancer Society, and the United Parcel Service (UPS). 

He is sometimes referred to as “the real Tank” from the movie The Matrix.

- [Website](https://certifiedcoderz.com)
- [Blog](https://medium.com/@tank9code/about-brandon-poole-sr-ac2fe8e06a09)
- [Email](mailto:certifiedcoderz@gmail.com)
#### Brandon Poole Sr.
- BoSS AppZ Creator
- 9_OPZ #Certified CoderZ Founder
- The Real Tank from the #Matrix movie! 
- Expert in Open Source Software
#### LinkZ:
- [bossappz.com](bossappz.com)
- [medium.com/bossappz](medium.com/bossappz)
- [bossappz.blogspot.com](https://bossappz.blogspot.com)
- [twitter.com/boss_appz](https:twitter.com/boss_appz)
- [youtube.com/boss_appz](https://www.youtube.com/@mybossapp/videos)
- [instagram.com/bossappz_showcase](instagram.com/bossappz_showcase)
- [facebook.com/bossappz](facebook.com/bossappz)
#### TagZ:
##### #BoSSAppZ
##### #BiZ9Framework
##### #EBook
##### #Mobile
##### #Apple
##### #Android
##### #IOS
##### #Linux
##### #AmazonWebServices
##### #AppMoneyNoteZ
##### #TaNKCode9
##### Thank you for your time.
#####  Looking forward to working with you.
### License
[MIT](https://choosealicense.com/licenses/mit/)
