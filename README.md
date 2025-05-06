# BiZ9 Data
**The BiZ9-Data Package** is an **object-relational mapper** (ORM) data access layer using [**Node.js**](http://Node.js). The package consists of **create**, **read**, **update** and **destroy** (CRUD) methods to handle data access and manipulations. The framework is fast and used for rapid application development for scaling applications from 0 to millions of records seamlessly and effortless. New data is written and persisted to the [**MongoDB**](https://www.mongodb.com/) tables/collections. Fetching data is obtained from the server cache memory using [**Redis**](https://redis.io/). Using **MongoDB** with **Redis** will speed up your overall application tremendously.
This framework is used as a **data access component** for **mobile** and **website applications**. It is best suited to be used as a package within [**Express.js**](http://Express.js). It can also be utilized for other **Javascript** based applications.

**The BiZ9-Data-Server** is the **ORM** solution currently promoted for use with [**React**](https://react.dev/), [**React-Native**](https://reactnative.dev/), [**Angular**](https://angular.dev/), and web based projects as a component of the [**data access stack**](https://angular.dev/).

![Mongo and Redis Chart](https://github.com/biz9framework/biz9-data/blob/main/img/mongo-redis.jpg?raw=true)

## Installation
Use the [npm](https://npm.com) installer to install.

```bash
npm i biz9-data
```

## Required
* [MongoDB](https://www.mongodb.com/docs/manual/installation/)
* [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)

## Contents
* [Example with Express.js](#expressjsexample)
* [Data.open_db](#get_db_connect)
* [Data.close_db](#close_db_connect)
* [Data.update_item](#update_item)
* [Data.get_item](#get_item)
* [Data.delete_item](#delete_item)
* [Data.get_list](#get_item_list)
* [Data.update_list](#update_item_list)
* [Data.delete_list](#delete_item_list)
* [Credits](#credit)

### <a id="expressjsexample"></a>Example with Express.js
View the full working [test example.](https://github.com/biz9framework/biz9-data/blob/main/test/index.js)
```javascript
const { Data } = require("biz9-data");

// get_db_connect
function(){
    let db_connect = {};

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

    Data.open_db(data_config).then(([error,data]) => {

        /*
            db_connect = data;
        */
    });

}

// update_item
function(){

    let data_type = 'dt_blank';
    let id = 0; // 0 intialize new data item;
    let item =
        {
            data_type: 'dt_blank',
            id: id,
            title: 'title_6100',
            first_name: 'first_name_6100',
            last_name: 'last_name_6100',
            user_name: 'user_name_6100',
            test_group_id: 6100
        };

    Data.update_item(db_connect,data_type,item).then(([error,data]) => {

        /*
            data = {
                data_type: 'dt_blank',
                id: 'f54d788f-9fcb-4def-889f-5b7562741c99',
                title: 'title_6100',
                first_name: 'first_name_6100',
                last_name: 'last_name_6100',
                user_name: 'user_name_6100',
                test_group_id: 6100,
                date_create: '2025-02-10T17:55:31.629Z',
                date_save: '2025-02-10T17:55:31.632Z',
                app_id: 'mongo_database_app_id',
                source: 'DB'
            };
        */
    });
}

// get_item
function(){

    let data_type = 'dt_blank';
    let id = 'f54d788f-9fcb-4def-889f-5b7562741c99';

    Data.get_item(db_connect,data_type,id).then(([error,data]) => {

        /*
            data = {
                data_type: 'dt_blank',
                id: 'f54d788f-9fcb-4def-889f-5b7562741c99',
                title: 'title_6100',
                first_name: 'first_name_6100',
                last_name: 'last_name_6100',
                user_name: 'user_name_6100',
                test_group_id: 6100,
                date_create: '2025-02-10T17:57:55.024Z',
                date_save: '2025-02-10T17:57:55.026Z',
                source: 'DB'
            }
        */

    });

}

// delete_item
function(){

    let data_type = 'dt_blank';
    let id = 'f54d788f-9fcb-4def-889f-5b7562741c99';

    Data.delete_item(db_connect,data_type,id).then(([error,data]) => {

        /*
            data = {
                data_type: 'dt_blank',
                id: 'ab70a896-5d65-422d-b12f-0c701f2cc95d',
                cache_del: true,
                db_del: true
            };
        */

    });

}

// close_db_connect
function(){

    Data.close_db(db_connect).then(([error,data]) => {
        /*
            data = null;
        */
    });
}

```

### <a id="get_db_connect"></a>Data.open_db
    Intialize and open Db connection.
#### Params
- Data config / Db configuration settings / object
    ```javascript
    let data_config = {
        APP_ID:'mongo_database_title',
        MONGO_IP:"0.0.0.0",
        MONGO_USERNAME_PASSWORD:"",
        MONGO_PORT_ID:"27019",
        MONGO_SERVER_USER:"admin",
        MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
        SSH_KEY:"",
        REDIS_URL:"0.0.0.0",
        REDIS_PORT_ID:"27019",
    };
    ```

#### Returns
- error / Error message / string
- db_connect / Open client Db connection / object
#### Example
```javascript
let db_connect = {};

let data_config = {
    APP_ID:'mongo_database_title',
    MONGO_IP:"0.0.0.0",
    MONGO_USERNAME_PASSWORD:"",
    MONGO_PORT_ID:"27019",
    MONGO_SERVER_USER:"admin",
    MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
    SSH_KEY:"",
    REDIS_URL:"0.0.0.0",
    REDIS_PORT_ID:"27019",
};

Data.open_db(data_config).then(([error,data]) => {

    /*
        db_connect = data;
    */

});

```

### <a id="close_db_connect"></a>Data.close_db
Close Db connection.
#### Params
- db_connect / Open client Db connection / object
#### Returns
- error / Error message / string
- db_connect / Closed client Db connection / object
#### Example

```javascript
Data.close_db(db_connect).then(([error,data]) => {

    /*
       data = null;
    */

});
```

### <a id="update_item"></a>Data.update_item
Create and or update data item.

#### Params
- db_connect / Open client Db connection / object
- id / Primary key / guid
- data_type / collection title / string
- item / data item / object

#### Returns
- error / Error message / string
- item / Data item / object

#### Example
```javascript
let data_type = "dt_blank";
let id = "9f1aeca3-b466-4cae-af4e-35b3fe9f31a1"; // 0 = intialize new data item.

let item = {
    id: id,
    data_type:data_type,
    title: 'title_438',
    first_name: 'first_name_438',
    last_name: 'last_name_438',
    user_name: 'user_name_438',
    test_group_id: 438
};

Data.update_item(db_connect,data_type,id,item).then(([error,data]) => {

    /*
        data = {
            data_type: 'dt_blank',
            id: '9f1aeca3-b466-4cae-af4e-35b3fe9f31a1',
            title: 'title_438',
            first_name: 'first_name_438',
            last_name: 'last_name_438',
            user_name: 'user_name_438',
            test_group_id: 438,
            date_create: '2025-02-10T02:16:46.137Z',
            date_save: '2025-02-10T02:16:46.138Z',
            app_id: 'mongo_database_title',
            source: 'DB'
        };
    */

});
```

### <a id="get_item"></a>Data.get_item
Get a data item.

#### Params
- db_connect / Open client Db connection / object
- data_type / collection title / string
- id / Primary key / guid

#### Returns
- error / Error message / string
- item / Data item / object

#### Example
```javascript
let data_type = "dt_blank";
let id = "d31facf1-769e-48a6-a7d2-6c349e4b808e";

Data.get_item(db_connect,data_type,id).then(([error,data]) => {

    /*
        data = {
            data_type: 'dt_blank',
            id: 'd31facf1-769e-48a6-a7d2-6c349e4b808e',
            title: 'title_450',
            first_name: 'first_name_450',
            last_name: 'last_name_450',
            user_name: 'user_name_450',
            test_group_id: 450,
            date_create: '2025-02-10T02:16:46.137Z',
            date_save: '2025-02-10T02:16:46.138Z',
            app_id: 'mongo_database_title',
            source: 'CACHE'
        };
    */
});
```

### <a id="delete_item"></a>Data.delete_item
Delete data item.

#### Params
- db_connect / Open client Db connection / object
- data_type / Collection title / string
- id / Primary key / guid

#### Returns
- error / Error message / string
- data / Empty data item / object

#### Example
```bash
let data_type = "dt_blank";
let id = "d31facf1-769e-48a6-a7d2-6c349e4b808e";
Data.delete_item(db_connect,data_type,id).then(([error,data]) => {

    /*
        data =  {
            data_type: 'dt_blank',
            id: 'd31facf1-769e-48a6-a7d2-6c349e4b808e',
            cache_del: true,
            db_del: true
        };
    /*

});
```

### <a id="update_item_list"></a>Data.update_list
Create and or update data items.

#### Params
- db_connect / Open client Db connection / object
- data_type / collection title / string
- items / data items  / list

#### Returns
- error / Error message / string
- items / Data items / list

#### Example
```javascript
let data_type = "dt_blank";

let item_1 = {
    id: 0,
    data_type:'dt_blank',
    title: 'title_438',
    first_name: 'first_name_438',
    last_name: 'last_name_438',
    user_name: 'user_name_438',
    test_group_id: 438
};

let item_2 = {
    id: 0,
    data_type:'dt_blank',
    title: 'title_440',
    first_name: 'first_name_440',
    last_name: 'last_name_440',
    user_name: 'user_name_440',
    test_group_id: 440
};

let item_3 = {
    id: 0,
    data_type:'dt_blank',
    title: 'title_450',
    first_name: 'first_name_450',
    last_name: 'last_name_450',
    user_name: 'user_name_450',
    test_group_id: 450
};

let data_item_list = [item_1, item_2, item_3];

Data.update_list(db_connect,data_type,data_item_list).then(([error,data]) => {

    /*
       data = [
        {
            data_type: 'dt_blank',
            id: '33daeca3-d466-tcae-cf4e-55b3fe9f31a1',
            title: 'title_438',
            first_name: 'first_name_438',
            last_name: 'last_name_438',
            user_name: 'user_name_438',
            test_group_id: 438,
            date_create: '2025-02-10T02:16:46.137Z',
            date_save: '2025-02-10T02:16:46.138Z',
            app_id: 'mongo_database_title',
            source: 'DB'
        },
        {
            data_type: 'dt_blank',
            id: '33daeca3-d466-tcae-cf4e-55b3fe9f31a1',
            title: 'title_440',
            first_name: 'first_name_440',
            last_name: 'last_name_440',
            user_name: 'user_name_440',
            test_group_id: 440,
            date_create: '2025-02-10T02:16:46.137Z',
            date_save: '2025-02-10T02:16:46.138Z',
            app_id: 'mongo_database_title',
            source: 'DB'
        },
        {
            data_type: 'dt_blank',
            id: '33daeca3-d466-tcae-cf4e-55b3fe9f31a1',
            title: 'title_450',
            first_name: 'first_name_450',
            last_name: 'last_name_450',
            user_name: 'user_name_450',
            test_group_id: 450,
            date_create: '2025-02-10T02:16:46.137Z',
            date_save: '2025-02-10T02:16:46.138Z',
            app_id: 'mongo_database_title',
            source: 'DB'
        },
        ];
    */

});
```
### <a id="get_item_list"></a>Data.get_list
Get data items.

#### Params
- db_connect / Open client Db connection / object
- data_type / collection title / string
- filter / Selection criteria / object
- sort_by / Sort criteria / object
- page_current / Current page of paged list / int
- page_size / Paged list max count  / int

#### Returns
- error / Error message / string
- items / Data items / list
- item_count / Total items found matching selection criteria / int
- page_count / Total number of pages in paged list / int

#### Example
```javascript
let data_type = "dt_blank";
let filter = {first_name:'first_name_6100'};
let sort_by = {first_name:-1};
let page_current = 1;
let page_size = 10;

Data.get_list(db_connect,data_type,filter,sort_by,page_current,page_size).then(([error,data_list,item_count,page_count]) => {

    /*
       data_list = [
        {
            data_type: 'dt_blank',
            id: '33daeca3-d466-tcae-cf4e-55b3fe9f31a1',
            title: 'title_438',
            first_name: 'first_name_6100',
            last_name: 'last_name_438',
            user_name: 'user_name_438',
            test_group_id: 438,
            date_create: '2025-02-10T02:16:46.137Z',
            date_save: '2025-02-10T02:16:46.138Z',
            app_id: 'mongo_database_title',
            source: 'DB'
        },
        ];

        item_count = 10;

        page_count = 5;
    */

});
```

### <a id="delete_item_list"></a>Data.delete_list
Delete data items.

#### Params
- db_connect / Open client Db connection / object
- data_type / Collection title / string
- filter / Selection criteria / object

#### Returns
- error / Error message / string
- data / Empty data list / list

#### Example
```javascript
let data_type = "dt_blank";
let filter = {first_name:'first_name_6100'};

Data.delete_list(db_connect,data_type,filter).then(([error,data]) => {

    /*
       data = [];
    */

});
```

## Credits
### <a id="credit"></a>Credits

#### Company
- **BiZ9 Framework LLC**

#### Code
- [BiZ9 Framework Github](https://github.com/biz9framework)
- [BiZ9 Framework NPM](https://www.npmjs.com/~biz9framework)

#### E-mail
- [biz9framework@gmail.com](mailto:biz9framework@gmail.com)

#### Support
- [Cash App](https://cash.app/$bossappzstudio)

#### The BiZ9 Framework 🦾
![BiZ9 Framework Logo](https://github.com/biz9framework/biz9-art/blob/main/biz9-framework/logo/logox250.png?raw=true)

**The BiZ9 Framework** is a developer friendly platform for building premium, polished, fast, professional and scalable business applications using the lastest rapid application development tools and techniques. The framework consists of libraries, commands, scripts, and packages for creating, maintaining, testing, and deploying both **mobile** and **website applications**. The primary 3rd party framework used are [**React**](https://react.dev/), [**React Native**](https://reactnative.dev/), [**Node.js**](http://Node.js), [**ExpressJS**](https://expressjs.com/), [**MongoDB**](https://www.mongodb.com/), [**Nginx**](https://nginx.org/), [**Redis**](https://redis.io/), [**Git**](https://git-scm.com/), and [**Bash**](https://www.gnu.org/software/bash/). **The BiZ9 Framework** focus is to be precise, routine, rapid, and customizable. The primary target devices for **The BiZ9 Framework** are [**Apple iOS**](https://developer.apple.com/), [**Android**](https://www.android.com/), [**Chrome**](https://www.google.com/chrome/), [**Safari**](https://www.apple.com/safari/), [**Firefox**](https://www.mozilla.org/en-US/firefox/), and [**Edge**](https://www.microsoft.com/en-us/edge/?form=MA13FJ). Other 3rd party Application Programming Interfaces (API) that are pre included are [**Amazon Web Service**](https://aws.amazon.com/), [**Stripe**](https://stripe.com/) and [**Bravely**](https://workbravely.com/).

- <a href="https://github.com/biz9framework" target="_blank">Biz9 Framework GitHub</a>
- <a href="https://bossappz.medium.com/what-is-the-biz9-framework-29731c49ad79" target="_blank">Biz9 Framework Blog</a>
- <a href="https://youtu.be/W_ZUmwZMFoc?si=4b5_6q9vPgi1IxPL" target="_blank">BoSS Mobile App Youtube Demo</a>

#### TaNK9 Code 👽
![TaNK9 Code Head](https://github.com/biz9framework/biz9-art/blob/main/tank9code/head/tank9_headx250.png?raw=true)

**Brandon Poole Sr** also known as **‘TaNK’** is a technical lead and full stack software engineer with over 19 years of professional experience. He was born and raised in **Atlanta, Ga** and graduated with a Computer Information Systems **Bachelor of Science Degree** from [**Fort Valley State University**](https://www.fvsu.edu/). He is proficient in [**ASP.NET C#**](http://ASP.NET), [**ASP.NET MVC**](https://dotnet.microsoft.com/en-us/apps/aspnet/mvc), [**.NET Core**](https://dotnet.microsoft.com/en-us/download), [**Microsoft SQL Server**](https://www.microsoft.com/en-us/sql-server), [**IIS Web Server**](https://learn.microsoft.com/en-us/iis/get-started/introduction-to-iis/iis-web-server-overview), [**Node.js**](http://Node.js), [**React**](https://react.dev/), [**React Native**](https://reactnative.dev/), [**Framework7**](https://framework7.io/), [**Redis**](https://redis.io/), [**Amazon Web Services**](https://aws.amazon.com/), [**Apple iOS**](https://developer.apple.com/ios/), [**Android SDK**](https://developer.android.com/studio), [**MongoDB**](https://www.mongodb.com/), [**Redis**](https://redis.io/), [**NGINX**](https://nginx.org/), and [**Git**](https://git-scm.com/). He has worked as a software developer for Fortune 500 companies such as [**The Boeing Company**](https://www.boeing.com/), [**Georgia Pacific**](https://www.gp.com/), [**Colonial Pipeline**](https://www.colpipe.com/), [**Home Depot**](https://corporate.homedepot.com/) and [**United Parcel Services**](https://www.ups.com/us/en/home).

He is sometimes referred to as “the real Tank” from the movie [**The Matrix**](https://www.imdb.com/title/tt0133093/).

- **Tank9 TooLZ Book** [Amazon E-Book](https://a.co/d/2BDjSYb)
- [Tank9Code Blog](https://medium.com/@tank9code/about-brandon-poole-sr-ac2fe8e06a09)
- [Tank9Code Twitter](https://instagram.com/tank9code)
- [Tank9Code Instagram](https://instagram.com/tank9code)
- [Tank9Code Youtube](https://youtube.com/@tank9code)

#### TagZ:
##### #BiZ9Framework
##### #BoSSAppZ
##### #Mobile
##### #Apple
##### #Android
##### #ApplicationDevelopment
##### #SoftwareFramework
##### #Cloud
##### #IOS
##### #Linux
##### #JavaScript
##### #NoSQL
##### #AppMoneyNoteZ
##### #TaNK9Code
##### Thank you for your time.
#####  Looking forward to working with you.
### License
[MIT](https://choosealicense.com/licenses/mit/)
