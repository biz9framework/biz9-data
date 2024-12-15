const get_blank = () => {
	return new Promise((callback) => {
		let error = null;
		const run = new();
		run.method().then((data) => {
			callback([null,data]);
        }).catch(err => {
            console.error("--Error-Get-Blank--"+err+"--Error--", err);
		});
	});
}
const update_blank = (data_type,data_item) => {
	return new Promise((callback) => {
		let error = null;
		async.series([
			function(callback) {
                callback();
			},
			function(callback) {
                callback();
			}
		]).then(results => {
			console.log(results);
		}).catch(err => {
            console.error("--Error-Notez-Update-Blank--"+err+"--Error--", err);
		});
	});
}

