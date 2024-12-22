async.forEachOf(item_list,(item,key,go) => {
	go();
}, error => {
	done();
});
const get_db = async () => {
	return [error,data] = await get_db_adapter();
};
const get_blank = () => {
	return new Promise((callback) => {
		let error = null;
		const run = new();
		run.method().then((data) => {
			callback([error,null]);
		}).catch(error => {
			console.error("--Error-Project-FileName-Get-Blank-Error--",error);
			callback([error,null]);
		});
	});
}
const update_blank = (data_type,data_item) => {
	return new Promise((callback) => {
		let error = null;
		async.series([
			function(call) {
				call();
			},
			function(call) {
				call();
			}
		]).then(result => {
			callback([error,null]);
		}).catch(error => {
			console.error("--Error-Project-FileName-Update-Blank-Error--",error);
			callback([error,null]);
		});
	});
}

