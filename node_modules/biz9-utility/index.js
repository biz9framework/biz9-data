/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Utility
*/
const utility = require('./utilityz/index.js');
const get_id=(max)=> {
    return utility.get_id(max);
};
const get_title_url=(title)=> {
    return utility.get_title_url(title);
};
const get_guid=()=> {
    return utility.get_guid();
};
module.exports = {
    get_id,
    get_guid,
    get_title_url,
};
