var sqlite3 = require('sqlite3').verbose();

module.exports = {
	getUser: function (username, password, callback) {
		var db = new sqlite3.Database('fta.db');
		
		db.all("SELECT * from user where username='" + username + "'", function(err,rows) {
			if(rows.length) {
				rows.forEach(function (row) {
					if(row.password == password) {
						callback(row);
					}
					else {
						callback(null);
					}
					db.close();
				});
			}
			else {
				callback(null);
				db.close();			
			}
		});
	}
};