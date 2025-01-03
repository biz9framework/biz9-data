/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Utility
*/
const {get_guid_main,is_guid_main,get_file_ext_main,get_title_url_main,get_id_main,get_query_main,get_date_time_str_main,get_date_str_main,get_date_time_pretty_main, get_iso_str_by_date_time_main,get_money_main,get_cents_main,get_contains_main,remove_html_str_main,get_time_str_main,get_date_time_obj_main,get_slug_main,remove_money_main,get_currency_main,get_month_title_short_main,get_month_title_main,text_truncate_main,validate_email_main,set_file_upload_main, set_resize_photo_file_main,set_resize_square_photo_file_main,set_photo_file_main,get_file_buffer_main,get_mp3_duration_main,get_paging_list_main,get_older_date_main
} = require('./main.js');

const get_id = (max) => {
    return get_id_main(max);
};
const get_guid = () => {
    return get_guid_main();
};
const is_guid = (str) => {
    return is_guid_main(str);
};
const get_file_ext = (_file_path) => {
    return get_file_ext_main(_file_path);
};
const get_title_url = (title) => {
    return get_title_url_main(title);
};
const get_query = (window) => {
    return get_query_main(window);
};
const get_date_time_str = (datetime) => {
    return get_date_time_str_main(datetime);
};
const get_date_str = (date) => {
    return get_date_str_main(date);
};
const get_date_time_pretty = (date) => {
    return get_date_time_pretty_main(date);
};
const get_slug = (str) => {
    return get_slug_main(str);
};
const get_currency = (amount) => {
    return get_currency_main(amount);
};
const get_contains = (value,searchFor) => {
    return get_contains_main(value,searchFor);
};
const remove_html_str = (str) => {
    return remove_html_str_main(str);
};
const get_time_str = (date) => {
    return get_time_str_main(date);
};
const get_date_time_obj = (date) => {
    return get_date_time_obj_main(date);
};
const get_iso_str_by_date_time = (date,time) => {
    return get_iso_str_by_date_time_main(date,time);
};
const remove_money = (n) => {
    return remove_money_main(n);
};
const get_money = (n) => {
    return get_money_main(n);
};
const get_cents = (number) => {
    return get_cents_main(number);
};
const get_month_title_short = (d) => {
    return get_month_title_short_main(d);
};
const get_month_title = (d) => {
    return get_month_title_main(d);
};
const text_truncate = (str,length,ending) => {
    return text_truncate_main(str,length,ending);
};
const validate_email = (email) => {
    return validate_email_main(email);
};
const set_resize_photo_file = async (req,_file_path) => {
      return [error,data] = await set_resize_photo_file_main(req,_file_path);
};
const set_file_upload = async (req,_file_path) => {
       return [error,data] = await set_file_upload_main(req,_file_path);
};
const set_resize_square_photo_file = async (org_file,sizes) => {
    return [error,data] =  await set_resize_square_photo_file_main(org_file,sizes);
};
const set_photo_file = async (file_path,org_filename,new_filename) => {
      return [error,data] = await set_resize_square_photo_file_main(file_path,org_filename,new_filename);
};
const get_file_buffer = async (file_path) => {
     return [error,data] = await get_file_buffer_main(file_path);
};
const get_mp3_duration = (secs) => {
    return get_mp3_duration_main(secs);
};
const get_paging_list = async (data_list,current_page,page_size) => {
    return [new_data_list,item_count,page_count] = await get_paging_list_main(data_list,current_page,page_size);
};
const get_older_date = (data_1,date_2) => {
    return get_older_date_main(date_1,date_2);
};
module.exports = {
    get_guid,
    is_guid,
    get_file_ext,
    get_title_url,
    get_id,
    get_query,
    get_date_time_str,
    get_date_str,
    get_date_time_pretty,
    get_iso_str_by_date_time,
    get_money,
    get_cents,
    get_contains,
    remove_html_str,
    get_time_str,
    get_date_time_obj,
    get_slug,
    remove_money,
    get_currency,
    get_month_title_short,
    get_month_title,
    text_truncate,
    validate_email,
    set_file_upload,
    set_resize_photo_file,
    set_resize_square_photo_file,
    set_photo_file,
    get_file_buffer,
    get_mp3_duration,
    get_paging_list,
    get_older_date,
};
