# BiZ9-Data

BiZ9-Data is a data-cache access library for web, service, and or mobile based applications, which utilizes [MongoDB](https://mongodb.com/) for database and [Redis](https://redis.com) for caching.

## Installation

Use the [npm](https://npm.com) installer to install.

```bash
npm install biz9-data
```

## Usage

* [reference](#reference)
* [get_item](#get_item)
* [get_sql](#get_sql)
* [get_sql_paging](#get_sql_paging)
* [update_item](#update_item)
* [update_list](#update_list)



```node

## <a id="reference"></a>Reference Object

data_config={
mongo_server_user:"localhost",
                  mongo_username_password:"ban:12345678",
                  mongo_ip:"localhost",
                  mongo_port:"27017",
                  mongo_config:"/etc/mongod.conf",
                  ssh_key:"",
                  redis_url:"0.0.0.0",
                  redis_port:"27018",
};

biz9data=require("biz9-data")(data_config);

- get database connection
function get_connection(){
    let db_name = "my_database_1";
    biz9data.get_client_db(function(error,_client_db){
        client_db=_client_db;
        db = client_db.db(db_name);
    });
}

- close database connection #important
function close_connection(){
    biz9data.close_client_db(client_db,function(error){
        client_db = null;
    });
}

- update item
function update_item(){
    let item = {tbl_id:0,title:'my_title',data_type:DT_BLANK};
    biz9data.update_item(db,DT_BLANK,item,function(error,data) {
        data = { tbl_id:"a6d94ccf-3da7-4389-b5db-f4f74518be3a" /* guid generated */
                ,title:"my_title",
                data_type:"blank_dt"};
    });
}

- get sql
function get_sql(){
    let sql = {title:"my_title"};
    let sort={title:1};
    biz9data.get_sql(db,DT_BLANK,sql,sort,function(error,data_list) {
        data_list = [{ tbl_id:"a6d94ccf-3da7-4389-b5db-f4f74518be3a" /* guid generated on created items */
                       ,title:"my_title",
                       data_type:"blank_dt"}];
    });
}

- delete sql
function delete_sql(){
    let sql = {title:"my_title"};
    biz9data.delete_sql(db,DT_BLANK,sql,function(error,data_list) {
        data_list = null
    });
}

- get sql with paging
function get_sql_paging(){
    let sql = {title:"my_title"};
    let data_type="blank_dt";
    let sort={title:-1};
    let page_current=1;
    let page_size=12;
    biz9data.get_sql_paging(db,data_type,sql,sort,page_current,page_size,function(error,data_list,total_count,page_count){
        data_list = [];
        total_count = full total items
        page_count = total page count
    });
}

- get item
function get_item(){
    let tbl_id="a6d94ccf-3da7-4389-b5db-f4f74518be3a";
    let data_type = "dt_blank";
    biz9data.get_item(db,data_type,tbl_id,function(error,data) {
        data = { tbl_id:"a6d94ccf-3da7-4389-b5db-f4f74518be3a" /* guid generated */
        ,title:"my_title",
        data_type:"blank_dt"};
    });
}

- delete_item
function(){
    let tbl_id="a6d94ccf-3da7-4389-b5db-f4f74518be3a";
    let data_type = 'dt_blank';
    biz9data.delete_item(db,data_type,tbl_id,function(error,data) {
        data = null;
    });
}

- update_list
function update_list(){
    let item_list = [
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
        data_list = [
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
    });
}

- delete_list
    function delete_list(){
    let item_list = [
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
        data_list = [
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
    });
}

- count
function count(){
    let data_type = 'dt_blank';
    biz9data.count(db,data_type,function(error,data) {
        data = 99;
    });
}

- drop
function drop(){
    let data_type = 'dt_blank';
    biz9data.drop(db,data_type,function(error,data) {
        data = null;
    });
}




```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
