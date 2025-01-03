/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Utility-Main
 */
const path = require('path');
const moment = require('moment');
const prettydate = require('pretty-date');
const get_id_main = (max) => {
    if(!max){
        max = 99999;
    }
    var r=Math.floor(Math.random()*max)+1;
    return r;
}
const get_guid_main = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const is_guid_main = (str) => {
    let regex = new RegExp(/^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/);
    if (str == null) {
        return false;
    }
    if (regex.test(str) == true) {
        return true;
    }
    else {
        return false;
    }
}
const get_file_ext_main = (_file_path) => {
    return path.extname(_file_path);
}
const get_title_url_main = (title) => {
    if(!title){
        title='';
    }
          return title.replace(/[^a-z0-9]+/ig, "_").toLowerCase();
 }
const get_query_main = (window) => {
    let vars = [],hash;
    let hashes=window.location.href.slice(window.location.href.indexOf('?')+1).split('&');
    for(let i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
const get_date_time_str_main = (datetime) => {
    //Tuesday, February 14th 2023, at 2:39 am
    return String(moment(datetime).format("dddd MMMM Do, YYYY h:mm a"));
}
const get_date_str_main = (date) => {
    //Tuesday, February 14th 2023
    if(date){
        return String(moment(date).format("dddd MMMM Do, YYYY"));
    }
    else{
        return 'Invalid Date Format';
    }
}
const get_date_time_pretty_main = (date) => {
    if(date){
        return prettydate.format(new Date(date));
    }
    else{
        return null;
    }
}
const get_slug_main = (str) => {
    if(!str)
        return "";
    return str
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'');
}
const get_currency_main = (amount) => {
    return Math.round(100 * parseFloat(typeof amount === 'string' ? amount.replace(/[$,]/g, '') : amount));
}
const get_contains_main = (value,searchFor) => {
    return (value || '').indexOf(searchFor) > -1;
}
const remove_html_str_main = (str) => {
    var regex = /(<([^>]+)>)/ig;
    _data = "";
    if(str){
        _data = str.replace(regex, "");
    }
    return _data;
}
const get_time_str_main = (date) => {
    if(date){
        var t = moment(date);
        return t.format("h:mm a");
    }
    else{
        var t = moment();
        return t.format("h:mm a");
    }
}
const get_date_time_obj_main = (date) => {
    if(date){
        return moment(date);
    }
    else{
        return moment(new Date());
    }
}
const get_iso_str_by_date_time_main = (date,time) => {
    if(date){
        return moment(date+ ' ' + time).toISOString();
    }
    else{
        return moment().toISOString();
    }
}
const remove_money_main = (n) => {
    if(!n){
        n='0';
    }
    return String(n).replace('$','');
}
const get_money_main = (n) => {
    var n = parseFloat(n);
    if(!n || isNaN(n)){
        n = 0;
    }
    return "$" + n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}
const get_cents_main = (number) => {
    return  parseInt((Number(number) * 100)).toString();
}
const get_month_title_short_main = (d) =>{
    switch(d) {
        case 1:
            return 'Jan';
            break;
        case 2:
            return 'Feb';
            break;
        case 3:
            return 'Mar';
            break;
        case 4:
            return 'Apr';
            break;
        case 5:
            return 'May';
            break;
        case 6:
            return 'Jun';
            break;
        case 7:
            return 'Jul';
            break;
        case 8:
            return 'Aug';
            break;
        case 9:
            return 'Sep';
            break;
        case 10:
            return 'Oct';
            break;
        case 11:
            return 'Nov';
            break;
        case 12:
            return 'Dec';
            break;
        default:
            return 'Jan';
    }
}
const get_month_title_main = (d) =>{
    switch(d){
        case 1:
            return 'January';
            break;
        case 2:
            return 'February';
            break;
        case 3:
            return 'March';
            break;
        case 4:
            return 'April';
            break;
        case 5:
            return 'May';
            break;
        case 6:
            return 'June';
            break;
        case 7:
            return 'July';
            break;
        case 8:
            return 'August';
            break;
        case 9:
            return 'September';
            break;
        case 10:
            return 'October';
            break;
        case 11:
            return 'November';
            break;
        case 12:
            return 'December';
            break;
        default:
            return 'January';
    }
}
const text_truncate_main = (str,length,ending) => {
    if (length == null) { length = 100;
    }
    if (ending == null) {
        ending = '...';
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
}
const validate_email_main = (email) =>{
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
const set_resize_photo_file_main = async (org_file,sizes) => {
    return new Promise((callback) => {
        let error = null;
        /*
        var sizes = [{
            path: file_path+'a' + new_filename,
            xy: 800
        },{
            path: file_path+'b' + new_filename,
            xy: 300
        },{
            path: file_path+'c' + new_filename,
            xy: 100
        }];
        */
        Promise.map(sizes, function(size) {
            sharp(org_file)
                .resize(size.xy)
                .toFile(size.path,(error,info)=>{
                    if(error){
                        error=error;
                        console.error("--Error-Utility-Main-Set-Resize-Photo-FIle-Main-1-Error--",error);
                    }
                });
        }).then(function(x){
            callback([error,data]);
        }).catch(err => {
            console.error("--Error-Utility-Main-Set-Resize-Photo-FIle-Main-Error--",err);
            callback([err,null]);
        });
    });
}
const set_resize_square_photo_file_main = (org_file,sizes) => {
    return new Promise((callback) => {
        /*
        var sizes = [{
            path: file_path+'a' + new_filename,
            xy: 800
        },{
            path: file_path+'b' + new_filename,
            xy: 300
        },{
            path: file_path+'c' + new_filename,
            xy: 100
        }];
        */
        let error = null;
        Promise.map(sizes, function(size) {
            sharp(org_file)
                .resize(size.xy, size.xy,{fit:sharp.fit.fill,quality:100})
                .toFile(size.path,(error,data)=>{
                    if(error){
                        if(error){
                            error=error;
                            console.error("--Error-Utility-Main-Set-Resize-Square-File-Error--",error);
                        }
                    }
                });
        }).then(function(x){
        callback([error,data]);
        }).catch(err => {
            console.error("--Error-Utility-Main-Set-Resize-Square-File-Error--",err);
            callback([err,null]);
        });
    });
}
const set_photo_file_main = (file_path,org_filename,new_filename) => {
    return new Promise((callback) => {
        let error = null;
        sharp(file_path+org_filename)
            .toFile(file_path+new_filename, (error, info) => {
                callback([error,new_filename]);
            });
    }).catch(err => {
        console.error("--Error-Utility-Main-Set-Photo-File-Main-Error--",err);
        callback([err,null]);
    });
}
const get_file_buffer_main = (file_path) => {
    return new Promise((callback) => {
        let error = null;
        fs.readFile(file_path,function(error,data){
            callback([error,data]);
        })
    }).catch(err => {
        console.error("--Error-Utility-Main-Get-File-Buffer-Main-Error--",err);
        callback([err,null]);
    });
}
const get_mp3_duration_main = (secs) => {
    millisec = secs * 1000;
    duration = format(millisec);
    return duration;
}
const get_paging_list_main = (data_list,current_page,page_size) => {
    return new Promise((callback) => {
        let error = null;
        if(current_page>=1||!current_page){
            current_page=1;
        }
        let item_count = data_list.length;
        let skip = page_size * (current_page - 1);
        let page_count = Math.ceil(item_count / page_size);
        let new_data_list = data_list.slice(skip, skip + page_size);
        callback([new_data_list,item_count,page_count]);
    });
}

const get_older_date_main = (date_1, date_2) =>{
    if(date_1.getTime() < date_2.getTime()){
        return 'date1';
    }else{
        return 'date2';
    }
}
const set_file_upload_main = (req,_file_path) => {
    return new Promise((callback) => {
        let error = null;
        req.busboy.on('file',(fieldname,file,filename)=>{
            const fstream = fs.createWriteStream(path.join(_file_path,filename.filename));
            file.pipe(fstream);
            fstream.on('close', ()=>{
                callback([error,filename]);
            }).catch(err => {
                console.error("--Error-Utility-Main-Set-File-Upload-Main-Error--",err);
                callback([err,null]);
            });
        });
    });
}
module.exports = {
    get_guid_main,
    is_guid_main,
    get_file_ext_main,
    get_title_url_main,
    get_id_main,
    get_query_main,
    get_date_time_str_main,
    get_date_str_main,
    get_date_time_pretty_main,
    get_iso_str_by_date_time_main,
    get_money_main,
    get_cents_main,
    get_contains_main,
    remove_html_str_main,
    get_time_str_main,
    get_date_time_obj_main,
    get_slug_main,
    remove_money_main,
    get_currency_main,
    get_month_title_short_main,
    get_month_title_main,
    text_truncate_main,
    validate_email_main,
    set_file_upload_main,
    set_resize_photo_file_main,
    set_resize_square_photo_file_main,
    set_photo_file_main,
    get_file_buffer_main,
    get_mp3_duration_main,
    get_paging_list_main,
    get_older_date_main,
};
