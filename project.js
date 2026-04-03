const fs = require('fs');
const {Log,Str,Obj}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
class Config {
    static get_biz9_config =(option) => {
        let biz9_config = {};
        let biz9_config_local = 'biz9_config';
        option =  !Obj.check_is_empty(option) ? option : {};
        if(option.biz9_config_file){
            biz9_config_local=option.biz9_config_file;
        }else{
            biz9_config_local=biz9_config_local;
        }
        if (typeof window === 'undefined') {
            if (!fs.existsSync(biz9_config_local)) {
                Log.error('Project-Service-Project-GetBiz9Config','File does not exist');
            } else {
                let fileContent = fs.readFileSync(biz9_config_local, 'utf-8');
                let lines = fileContent.split('\n');
                lines.forEach(line => {
                    const [key, value] = line.split('=');
                    if (key && value) {
                        biz9_config[key] = value.replace(/"/g, '').replace(/'/g, '').replace(/;/g, ''); // Remove quotes
                    }
                });
                if(!Str.check_is_null(option.APP_ID)){
                    biz9_config.APP_ID=option.APP_ID;
                    biz9_config.app_id=option.APP_ID;
                }else if(!Str.check_is_null(option.app_id)){
                    biz9_config.APP_ID=option.app_id;
                    biz9_config.app_id=option.app_id;
                }
            }
        }
        return biz9_config;
    }
}
module.exports = {
    Config
}
