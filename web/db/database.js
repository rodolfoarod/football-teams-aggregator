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
	},

	addResultTeam: function(user_id, team_id, team_name) {

	  var db = new sqlite3.Database('fta.db');
		var sql = "SELECT * FROM team WHERE idzzero=" + team_id;

		db.get(sql, function(err, row){

				if(err){

					console.log("addResultTeam 1: " + err);

				} else {

					if (typeof row != 'undefined') {

						console.log("Adding only new relation...");

						sql = "INSERT INTO user_team(iduser, idteam) VALUES ($iduser, $idteam)";

						stmt = db.prepare(sql)
						stmt.run({ $iduser: user_id, $idteam: team_id }, function(err){
							if(err){
								console.log("addResultTeam 2: " + err);
							} else {
								console.log("addResultTeam: Team - " + team_id + ":" + team_name);
							}
						})
						stmt.finalize();

					} else {

						console.log("Adding new team...");

						sql = "INSERT INTO team(idzzero, teamname) VALUES ($idzzero, $teamname)";

						stmt = db.prepare(sql);
						stmt.run({ $idzzero: team_id, $teamname: team_name}, function(err){
							if(err){
								console.log("addResultTeam 3: " + err);
							} else {

								console.log("Adding new relation...");

								sql = "INSERT INTO user_team(iduser, idteam) VALUES ($iduser, $idteam)";

								stmt = db.prepare(sql)
								stmt.run({ $iduser: user_id, $idteam: team_id }, function(err){
									if(err){
										console.log("addResultTeam 4: " + err);
									} else {
										console.log("New Relation - " + team_id + ":" + team_name);
									}

								})

							}
						})
						stmt.finalize();
						
					}
				}

		})

	}

};
