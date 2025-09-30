/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Logic - Main
*/
const { DateTime,Num } = require('biz9-utility');
const biz9_config_local=__dirname+"/../../"+"biz9_config";
const get_cloud_param_obj_main = (data_type,filter,sort_by,page_current,page_size) => {
    return {data_type:data_type,filter:filter,sort_by:sort_by,page_current:page_current,page_size:page_size};
}
const get_new_item_main = (data_type,id,option) => {
    if(!id){
        id='0';
    }
    let item = {data_type:data_type,id:id};
    if(!option){
        option = {};
    }
    if(option){
        for (const key in option) {
            item[key] = option[key];
        }
    }
    return item;
}
const get_new_full_item_main = (org_item,parent_item,top_item,option) => {
    if(!option){
        option = {};
    }
	let item = {
        data_type:org_item.data_type,
        id:org_item.id,
        parent_id:parent_item.id,
        parent_data_type:parent_item.data_type,
        top_id:top_item.id,
        top_data_type:top_item.data_type
    };
    if(option){
        for (const key in option) {
            item[key] = option[key];
        }
    }
    return item;
}
const get_cloud_url_main = (app_id,domain_url,action_url,params) =>{
    if(!params){
        params='';
    }
    var app_id_url='?app_id='+app_id;
    return domain_url+"/"+action_url+app_id_url + params;
}
const get_title_url_main = (title) => {
    if(!title){
        title='';
    }
    return title.replace(/[^a-z0-9]+/ig, "_").toLowerCase();
}
const get_title_main = (data_type) => {
		if(!data_type){
			return "";
		}else{
			return String(Str.get_title(data_type.replaceAll('_',' ').replaceAll('dt','').replace('biz',''))).trim();
		}
	}

module.exports = {
    get_new_item_main,
    get_cloud_url_main,
    get_cloud_param_obj_main,
    get_title_url_main,
    get_new_full_item_main,
    get_title_main
};
