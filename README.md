# BiZ9-Data

BiZ9-Data is a data-cache access library for web, service, and or mobile based applications, which utilizes [MongoDB](https://mongodb.com/) for database and [Redis](https://redis.com) for caching.

## Installation

Use the [npm](https://npm.com) installer to install.

```bash
npm install biz9-data
```

## Contents

* [Express.js Full Example](#expressjsexample)
* [Initialize Reference Object](#reference)
* [Open Database Connection](#get_connection)
* [Close Database Connection](#close_connection)
* [Update Item](#update_item)
* [Get SQL](#get_item)
* [Delete SQL](#delete_sql)
* [Get SQL With Paging](#get_sql_with_paging)
* [Get Item](#get_item)
* [Delete Item](#delete_item)
* [Update List](#update_list)
* [Delete List](#delete_list) 
* [Count](#count) 
* [Drop](#drop) 
## [Full Express.js Example](expressjsexample)
```node
// index.js
 $ npm install express
 $ npm i async
router.post("/update/:data_type/:tbl_id", function(req, res) {
    var db = {};
    async.series([
        function(call){
            biz9data.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            var item = {tbl_id:0,data_type:"dt_blank",first_name:"BoB", last_name:"Smith"};
            biz9data.update_item(db,item.data_type,item,function(error,data) {
                item=data;
                call();
            });
        },
        function(call){
            var data_type="dt_blank";
            var tbl_id="d31facf1-769e-48a6-a7d2-6c349e4b808e";
            biz9.get_item(db,data_type,tbl_id,function(error,data){
                item =data;
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
            res.send({helper:helper});
            res.end();
        });
});
```

## [Intialize Reference Object](#reference)
```node
// App.js
var data_config={
    mongo_server_user:"localhost",
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

## [Open Database Connection](#get_connection)
Establish and open connection with Mongo database.
### Params
- db_name ( required )
-- Title: Database Name 
-- Type: string
### Returns
- client_db
-- Title: Open client database connection
-- Type: database object
### Example
```node
let db_name = "my_database_1";
biz9data.get_client_db(function(error,_client_db){
    client_db=_client_db;
    db = client_db.db(db_name);
});
```
## [Close database connection](#close_connection)
Close and dispose Mongo database connection.
### Params
- client_db ( required )
-- Title: Open client database connection
-- Type: database object
### Returns
- client_db 
-- Title: Closed client database connection.
-- Type: database object
### Example
```node
biz9data.close_client_db(client_db,function(error){
    client_db = null;
});
```
## [Update Item](#update_item)
Create and or update record in table database. 
### Params
- client_db ( required )
-- Title: Open client database connection
-- Type: database object
- tbl_id ( required )
-- Title: Primary key  
-- Type: GUID
- data_type ( required )
-- Title: Table Name  
-- Type: string
- data_item ( required )
-- Title: Data item object to be saved.   
-- Type: object
### Returns
- data_item
-- Title: Data item of updated record. On create record, tbl_id field unique GUID is generated.
-- Type: object
### Example
```node
var db = db_open_connect_object; 
var item = {tbl_id:0,,data_type:DT_BLANK,title:'my_title'};
biz9data.update_item(db,DT_BLANK,item,function(error,data) {
});
```
## [Get SQL](#get_sql)
Find records in table by filter.
### Params
- client_db ( required )
-- Title: Open client database connection
-- Type: database object
- data_type ( required )
-- Title: Table Name  
-- Type: string
- filter_object ( required )
-- Title: Filter by properties object. 
-- Type: object
- sort_by_object ( required )
-- Title: The order to sort the returned records. 
-- 1 = ascending order /  -1 = descending order.
-- Type: object
### Returns
- data_list 
-- Title: List of records from database table
-- Type: list of objects
### Example
```node
var db = db_open_connect_object;
var sql = {title:"my_title"};
var sort = {title:-1};
var data_type = 'dt_blank';
biz9data.get_sql(db,data_type,sql,sort,function(error,data_list) {
});
```
## [Delete SQL](#delete_sql)
Delete records in table by filter.
### Params
- filter_object ( required )
-- Title: Filter by properties object. 
-- Type: object
- data_type ( required )
-- Title: Table Name  
-- Type: string
### Returns
- data_list [];
-- Title: Empty data list
-- Type: list
### Example
```node
var db = db_open_connect_object;
var sql = {title:"my_title"};
var data_type = 'blank_dt';
biz9data.delete_sql(db,data_type,sql,function(error,data_list) {
});
```
## [Get SQL With Paging](#get_sql_with_paging)
Find records in table by filter with paging.
### Params
- client_db ( required )
-- Title: Open client database connection
-- Type: database object
- filter_object ( required )
-- Title: Filter by properties object. 
-- Type: object
- data_type ( required )
    -- Title: Table Name  
    -- Type: string
- sort_by_object ( required )
    -- Title: The order to sort the returned records. 
    -- 1 = ascending order /  -1 = descending order.
    -- Type: object
- page_current ( required )
    -- Title: Current page of list  
    -- Type: int
- page_size ( required )
    -- Title: Max size of list  
    -- Type: int
### Returns
- data_list
-- Title: List of records from database table
-- Type: list
- total_count
-- Title: Count of records from database table
-- Type: int
- page_count
-- Title: Page count per list of records from database table
-- Type: int
### Example
```node
var db = db_open_connect_object;
var sql = {title:"my_title"};
var data_type="blank_dt";
var sort={title:-1};
var page_current=1;
var page_size=12;
biz9data.get_sql_paging(db,data_type,sql,sort,page_current,page_size,function(error,data_list,total_count,page_count){
});
```
## [Get Item](#get_item)
Get record from table in database by primary key field.
### Params
- client_db ( required )
    -- Title: Open client database connection
    -- Type: database object
- data_type ( required )
    -- Title: Table Name  
    -- Type: string
- tbl_id ( optional, recommended )
    -- Title: Primary key of record in table from database.  
    -- Type: GUID
- title_url ( optional )
    -- Title: Title url of the title of the data item.
    -- Type: string
### Returns
- data_item
-- Title: Record from table in database
-- Type: object
### Example
```node
var db = db_open_connect_object;
let tbl_id="a6d94ccf-3da7-4389-b5db-f4f74518be3a";
let data_type = "dt_blank";
biz9data.get_item(db,data_type,tbl_id,function(error,data) {
});
```
## [Delete Item](#delete_item)
Delete Item from table in database by filter.
### Params
- client_db ( required )
    -- Title: Open client database connection
    -- Type: database object
- data_type ( required )
    -- Title: Table Name  
    -- Type: string
- tbl_id ( optional, recommended )
    -- Title: Primary key of record in table from database.  
    -- Type: GUID
### Returns
- data_item 
-- Title: Empty Record from table in database
-- Type: object
### Example
```node
var db = db_open_connect_object;
var tbl_id="a6d94ccf-3da7-4389-b5db-f4f74518be3a";
var data_type = 'dt_blank';
biz9data.delete_item(db,data_type,tbl_id,function(error,data) {
});
```
## [Update List](#update_list)
Create and or update a list of records for a table in the database.
### Params
- client_db ( required )
    -- Title: Open client database connection
    -- Type: database object
- data_list ( required )
    -- Title: List of records to be added or upated on the table in the database.  
    -- Type: list
### Returns
- data_list 
-- Title:  Data items of updated records. On create records, tbl_id field unique GUID is generated.
-- Type: list
### Example
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
## [Delete List](#delete_list)
Delete a list of records from table in database by filter.
### Params
- client_db ( required )
    -- Title: Open client database connection
    -- Type: database object
- data_list ( required )
    -- Title: List of records to be added or upated on the table in the database.  
    -- Type: list
### Returns
- data_list 
-- Title:  Empty Data items of updated records. 
-- Type: list
### Example
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
## [Count](#count)
Count records in table from database.
### Params
- client_db ( required )
    -- Title: Open client database connection
    -- Type: database object
- data_type ( required )
    -- Title: Table Name  
    -- Type: string 
### Returns
- count 
-- Title:  Numbers of records. 
-- Type: int
### Example
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
## [Drop](#drop)
Drop table from database.
### Params
- client_db ( required )
    -- Title: Open client database connection
    -- Type: database object
- data_type ( required )
    -- Title: Table Name  
    -- Type: string 
### Returns
- null 
-- Title:  Success if complete. 
-- Type: string
### Example
```node
var data_type = 'dt_blank';
biz9data.drop(db,data_type,function(error,data) {
});
```





## Contributing

### Company
- BoSS AppZ

### Code
- [BiZ9 Framework Github](https://github.com/biz9framework)
- [BiZ9 Core NPM](https://www.npmjs.com/package/biz9-core)

### E-mail
- contact@bossappz.com
- certifiedcoderz@gmail.com

### Website
- [bossappz.com](https://bossappz.com)
- [mobile.bossappz.com](https://mobile.bossappz.com)

### BoSS AppZ 💰
BoSS AppZ are web and mobile applications built for the BoSS on the go. The primary features of the BoSS AppZ are ThemeForest.net, The BiZ9 Framework, and Amazon Web Services. BoSS ApZZ powers many applications in the healthcare, retail and manufacturing industries.
- [Blog](https://bossappz.medium.com)

### App Money NoteZ 💯
Application Development NoteZ That Make $ense! Cuts out all the blah, blah, blah and gets right to the resultZ!

### The BiZ9 Framework 🦾
The BiZ9 Framework is a user-friendly platform for building fast and scalable network applications. The framework consists of libraries and software tools like: Node,js, React Native, Angular, ExpressJS, MongoDB, Nginx, Redis, GIT, and Bash scripts. The BIZ9 Framework is designed to build, maintain, and deploy rich and robust, applications for web, Android and Apple devices. Other 3rd party  Application Programming Interfaces included are Amazon Web Service, Stripe, and Bravely.
- [Website](https://github.com/biz9framework)
- [Blog](https://bossappz.medium.com/what-is-the-biz9-framework-29731c49ad79)

### BoSS AppZ Developer  ClaZZ💡
The BoSS AppZ Application Development Class is custom designed for each individual that desires to learn the art of application development for career or self-use purposes. We will teach you and train you on how to become a full stack application developer. Mobile applications are the future. Stay informed with the best and greatest tools for application development. 
- [Website](https://bossappz.com/clazz)

### TaNK9 Code 👽
Brandon Poole Sr also known as ‘TaNK’ is a full stack application developer 
born and raised in Atlanta Ga and graduated with a Computer Information Systems degree from Fort Valley State University (FVSU).  While attending FVSU Mr. Poole created a social network titled CrunkFriends. It accumulated over 50k registered members and was the first of its kind back in 2005.

Mr. Poole went on to have a career as a Senior Application Developer for many premium Technology companies. The names of those tech companies are Colonial Pipeline, Boeing, Nascar, Home Depot, the Center for Disease Control, American Cancer Society, and the United Parcel Service (UPS). 

He is sometimes referred to as “the real Tank” from the movie The Matrix.

- [Website](https://certifiedcoderz.com)
- [Blog](https://medium.com/@tank9code/about-brandon-poole-sr-ac2fe8e06a09)
- [Email](mailto:certifiedcoderz@gmail.com)


### Brandon Poole Sr.
- BoSS AppZ Creator
- 9_OPZ #Certified CoderZ Founder
- The Real Tank from the #Matrix movie! 
- Expert in Open Source Software

### LinkZ:
- [bossappz.com](bossappz.com)
- [medium.com/bossappz](medium.com/bossappz)
- [bossappz.blogspot.com](https://bossappz.blogspot.com)
- [twitter.com/boss_appz](https:twitter.com/boss_appz)
- [youtube.com/boss_appz](https://www.youtube.com/@bossappzclazz/videos)
- [instagram.com/bossappz_showcase](instagram.com/bossappz_showcase)
- [facebook.com/bossappz](facebook.com/bossappz)

### TagZ:
#### #BoSSAppZ
#### #BiZ9Framework
#### #EBook
#### #Mobile
#### #Apple
#### #Android
#### #IOS
#### #Linux
#### #AmazonWebServices
#### #AppMoneyNoteZ
#### #TaNKCode9
#### Thank you for your time.
####  Looking forward to working with you.




## License

[MIT](https://choosealicense.com/licenses/mit/)
