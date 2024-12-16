
const get_blank = () => {
	return new Promise((callback) => {
		let error = null;
		const run = new();
		run.method().then((data) => {
			callback([null,data]);
        }).catch(err => {
            console.error("--Error-Notez-FileName-Get-Blank-Error--",err);
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
			console.log(result);
		}).catch(err => {
			console.error("--Error-Notez-FileName-Update-Blank-Error--",err);
		});
	});
}

