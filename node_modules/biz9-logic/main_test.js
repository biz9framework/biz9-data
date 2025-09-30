const { DataItem,DataType } = require('biz9-logic');
const get_template_test = () =>{
    let template = DataItem.get_new_full_item(
        DataItem.get_new(DataType.TEMPLATE,Num.get_id()),
        DataItem.get_new(DataType.TEMPLATE,0),
        DataItem.get_new(DataType.TEMPLATE,0),
        Field.get_test("Primary"));
    let template_sub_title_list = ["Header","Navigation","Body","Footer"];
    for(let a=0;a<template_sub_title_list.length;a++){
        template = Sub_Item.get_test_bind_new_child(Num.get_id(),template_sub_title_list[a],template,template,template);
    }
    template = Sub_Item.get_test_bind_item_sub_item(template);
    return template;
};
const get_page_test = (title) =>{
    let page = DataItem.get_new_full_item(
        DataItem.get_new(DataType.PAGE,Num.get_id()),
        DataItem.get_new(DataType.PAGE,0),
        DataItem.get_new(DataType.PAGE,0),
        Field.get_test(title));
    for(let a=0;a<20;a++){
        page=Sub_Item.get_test_bind_new_child(Num.get_id(),"Section "+a,page,page,page);
    }
    page = Sub_Item.get_test_bind_item_sub_item(page);
    return page;
}
const get_product_test = (title) =>{
    let product = DataItem.get_new_full_item(
        DataItem.get_new(DataType.PRODUCT,Num.get_id()),
        DataItem.get_new(DataType.PRODUCT,0),
        DataItem.get_new(DataType.PRODUCT,0),
        Field.get_test(title));
    product = Sub_Item.get_test_bind_new_child(Num.get_id(),title,product,product,product);
    product.cost = String(Num.get_id()) + "." + String(Num.get_id());
    product.old_cost = String(Num.get_id()) + "." + String(Num.get_id());
    product.type = "Type "+String(Num.get_id());
    product.sub_type = "Sub Type "+String(Num.get_id());
    product.stock = String(Num.get_id(3-1));
    for(let a=0;a<10;a++){
        product=Sub_Item.get_test_bind_new_child(Num.get_id(),"Section " + String(a),product,product,product);
    }
    product = Sub_Item.get_test_bind_item_sub_item(product);
    return product;
};
const get_service_test = (title) =>{
		let service = DataItem.get_new_full_item(
			DataItem.get_new(DataType.SERVICE,Num.get_id()),
			DataItem.get_new(DataType.SERVICE,0),
			DataItem.get_new(DataType.SERVICE,0),
			Field.get_test(title));
		service = Sub_Item.get_test_bind_new_child(Num.get_id(),title,service,service,service);
		service.cost = String(Num.get_id()) + "." + String(Num.get_id());
		service.old_cost = String(Num.get_id()) + "." + String(Num.get_id());
		service.type = "Type "+String(Num.get_id());
		service.sub_type = "Sub Type "+String(Num.get_id());
		service.stock = String(Num.get_id(3-1));
		for(let a=0;a<10;a++){
			service=Sub_Item.get_test_bind_new_child(Num.get_id(),"Section " + String(a),service,service,service);
		}
		service = Sub_Item.get_test_bind_item_sub_item(service);
		return service;
	};
const get_event_test = (title) =>{
		let event = DataItem.get_new_full_item(
			DataItem.get_new(DataType.EVENT,Num.get_id()),
			DataItem.get_new(DataType.EVENT,0),
			DataItem.get_new(DataType.EVENT,0),
			Field.get_test(title));
		event = Sub_Item.get_test_bind_new_child(Num.get_id(),title,event,event,event);
		event.cost = String(Num.get_id()) + "." + String(Num.get_id());
		event.old_cost = String(Num.get_id()) + "." + String(Num.get_id());
		event.date = String(String(Num.get_id(2030)) + "-" + String(Num.get_id(13)) + "-" + String(Num.get_id(30))).trim();
		event.time = String(Num.get_id(24)) + ":" + String(Num.get_id(59));
		event.website = "Website "+String(Num.get_id());
		event.location = "Location "+String(Num.get_id());
		event.meeting_link = "Meeting Link "+String(Num.get_id());
		event.stock = String(Num.get_id(3-1));
		for(let a=0;a<10;a++){
			event=Sub_Item.get_test_bind_new_child(Num.get_id(),"Section " + String(a),event,event,event);
		}
		event = Sub_Item.get_test_bind_item_sub_item(event);
		return event;
	};

const get_field_test = (title) =>{
		let item = {
			date_create:new moment().toISOString(),
			date_save:new moment().toISOString(),
			title:title,
			setting_visible:"1",
			photo_data:"/images/no_img.jpg",
			title_url:Str.get_title_url(title),
			sub_note : "Sub Note "+String(Num.get_id()),
			note : "Note "+String(Num.get_id())
		}
		for(let b = 1;b<20;b++){
			item['value_'+String(b)] = 'value ' + String(b);
		}
		return item;
	}
module.exports = {
    get_template_test,
    get_page_test,
    get_product_test,
    get_service_test,
    get_event_test
}
