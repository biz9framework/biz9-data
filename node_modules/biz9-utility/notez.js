const get_blank = () => {
	return new Promise((callback) => {
		let error = null;
		const run = new();
		run.method().then((data) => {
			callback([error,data]);
        }).catch(err => {
            console.error("--Error-Project-FileName-Get-Blank-Error--",err);
			callback([err,null]);
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
			callback([err,null]);
		}).catch(err => {
			console.error("--Error-Project-FileName-Update-Blank-Error--",err);
			callback([err,null]);
		});
	});
}

