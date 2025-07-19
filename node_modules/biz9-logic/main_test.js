const { DataItem,DataType } = require('biz9-logic');
const get_template_test = () =>{
    let template = DataItem.get_new_full_item(
        DataItem.get_new(DataType.TEMPLATE,Number.get_id()),
        DataItem.get_new(DataType.TEMPLATE,0),
        DataItem.get_new(DataType.TEMPLATE,0),
        Field.get_test("Primary"));
    let template_sub_title_list = ["Header","Navigation","Body","Footer"];
    for(let a=0;a<template_sub_title_list.length;a++){
        template = Sub_Item.get_test_bind_new_child(Number.get_id(),template_sub_title_list[a],template,template,template);
    }
    template = Sub_Item.get_test_bind_item_sub_item(template);
    return template;
};
const get_page_test = (title) =>{
    let page = DataItem.get_new_full_item(
        DataItem.get_new(DataType.PAGE,Number.get_id()),
        DataItem.get_new(DataType.PAGE,0),
        DataItem.get_new(DataType.PAGE,0),
        Field.get_test(title));
    for(let a=0;a<20;a++){
        page=Sub_Item.get_test_bind_new_child(Number.get_id(),"Section "+a,page,page,page);
    }
    page = Sub_Item.get_test_bind_item_sub_item(page);
    return page;
}
const get_product_test = (title) =>{
    let product = DataItem.get_new_full_item(
        DataItem.get_new(DataType.PRODUCT,Number.get_id()),
        DataItem.get_new(DataType.PRODUCT,0),
        DataItem.get_new(DataType.PRODUCT,0),
        Field.get_test(title));
    product = Sub_Item.get_test_bind_new_child(Number.get_id(),title,product,product,product);
    product.cost = String(Number.get_id()) + "." + String(Number.get_id());
    product.old_cost = String(Number.get_id()) + "." + String(Number.get_id());
    product.type = "Type "+String(Number.get_id());
    product.sub_type = "Sub Type "+String(Number.get_id());
    product.stock = String(Number.get_id(3-1));
    for(let a=0;a<10;a++){
        product=Sub_Item.get_test_bind_new_child(Number.get_id(),"Section " + String(a),product,product,product);
    }
    product = Sub_Item.get_test_bind_item_sub_item(product);
    return product;
};
const get_service_test = (title) =>{
		let service = DataItem.get_new_full_item(
			DataItem.get_new(DataType.SERVICE,Number.get_id()),
			DataItem.get_new(DataType.SERVICE,0),
			DataItem.get_new(DataType.SERVICE,0),
			Field.get_test(title));
		service = Sub_Item.get_test_bind_new_child(Number.get_id(),title,service,service,service);
		service.cost = String(Number.get_id()) + "." + String(Number.get_id());
		service.old_cost = String(Number.get_id()) + "." + String(Number.get_id());
		service.type = "Type "+String(Number.get_id());
		service.sub_type = "Sub Type "+String(Number.get_id());
		service.stock = String(Number.get_id(3-1));
		for(let a=0;a<10;a++){
			service=Sub_Item.get_test_bind_new_child(Number.get_id(),"Section " + String(a),service,service,service);
		}
		service = Sub_Item.get_test_bind_item_sub_item(service);
		return service;
	};
const get_event_test = (title) =>{
		let event = DataItem.get_new_full_item(
			DataItem.get_new(DataType.EVENT,Number.get_id()),
			DataItem.get_new(DataType.EVENT,0),
			DataItem.get_new(DataType.EVENT,0),
			Field.get_test(title));
		event = Sub_Item.get_test_bind_new_child(Number.get_id(),title,event,event,event);
		event.cost = String(Number.get_id()) + "." + String(Number.get_id());
		event.old_cost = String(Number.get_id()) + "." + String(Number.get_id());
		event.date = String(String(Number.get_id(2030)) + "-" + String(Number.get_id(13)) + "-" + String(Number.get_id(30))).trim();
		event.time = String(Number.get_id(24)) + ":" + String(Number.get_id(59));
		event.website = "Website "+String(Number.get_id());
		event.location = "Location "+String(Number.get_id());
		event.meeting_link = "Meeting Link "+String(Number.get_id());
		event.stock = String(Number.get_id(3-1));
		for(let a=0;a<10;a++){
			event=Sub_Item.get_test_bind_new_child(Number.get_id(),"Section " + String(a),event,event,event);
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
			sub_note : "Sub Note "+String(Number.get_id()),
			note : "Note "+String(Number.get_id())
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
