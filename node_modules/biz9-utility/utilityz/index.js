/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Utility-Main
 */
const get_id=(max)=>{
    if(!max){
        max = 99999;
    }
    var r=Math.floor(Math.random()*max)+1;
    return r;
}
const get_title_url=(title)=>{
    if(!title){
        title='';
    }
    return title.replace(/[^a-z0-9]+/ig, "_").toLowerCase();
}
const get_guid=()=>{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
module.exports = {
    get_id,
    get_title_url,
    get_guid
};

