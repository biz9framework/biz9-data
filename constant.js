const Config  = {
    TITLE:'BiZ9-Data',
    VERSION:'1.0.0'
}
const Data_Config = {
    APP_ID:'test-stage-april',
    MONGO_IP:'0.0.0.0',
    MONGO_USERNAME_PASSWORD:'',
    MONGO_PORT_ID:"27019",
    MONGO_SERVER_USER:'admin',
    MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
    MONGO_SSH_KEY:"",
    REDIS_URL:"0.0.0.0",
    REDIS_PORT_ID:"27019"
};
class Project_Table{
    static BLANK = 'blank_biz';
    static BLOG_POST = 'blog_post_biz';
    static PRODUCT = 'product_biz';
    static CATEGORY = 'category_biz';
    static PAGE = 'page_biz';
    static ORDER = 'order_biz';
    static USER = 'user_biz';
    static GROUP = 'group_biz';
    static IMAGE = 'image_biz';
    static IMAGE_GALLERY = 'image_gallery_biz';
}
module.exports = {
    Config,
    Data_Config,
    Project_Table
}
