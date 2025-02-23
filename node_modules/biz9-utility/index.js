/*
Copyright 2019 BiZ9 Framework
Author: biz9framework@gmail.com (BiZ9 Framework LLC)
License GNU General Public License v3.0
Description: BiZ9 Framework: Utility
*/
const {w_main,error_main,get_guid_main,get_id_main,message_append_main,get_test_item_main,
    get_date_time_str_main,get_date_str_main,get_date_time_pretty_main, get_currency_main, get_contains_main,remove_html_str_main,get_time_str_main,get_date_time_obj_main,get_iso_str_by_date_time_main,remove_money_main,get_money_main,get_cents_main,get_month_title_short_main,get_month_title_main,text_truncate_main,validate_email_main,get_paging_list_main,get_older_date_main,set_form_item_list_main} = require('./main');

class Log{
    static w = (title,str) => {
        return w_main(title,str);
    };
    static error = (title,str) => {
        return error_main(title,str);
    };
    static append = (message,new_message) => {
        return message_append_main(message,new_message);
    };
}
class Test {
    static get_item = (data_type,id) => {
        return get_test_item_main(data_type,id);
    };
}
class Number {
    static get_id = (max) => {
        return get_id_main(max);
    };
    static get_guid = () => {
        return get_guid_main();
    };
}
class DateTime {
    static get_str = (datatime) => {
        return get_date_time_str_main(datatime);
    };
    static get_date_str = (date) => {
        return get_date_str_main(date);
    };
    static get_time_str = (date) => {
        return get_time_str_main(date);
    };
    static get_pretty = (date) => {
        return get_date_time_pretty_main(date);
    };
    static get_obj = (date) => {
        return get_date_time_obj_main(date);
    };
    static get_month_title = (date) => {
        return get_month_title_main(date);
    };
}
module.exports = {
    Log,
    Number,
    Test,
    DateTime,
};
