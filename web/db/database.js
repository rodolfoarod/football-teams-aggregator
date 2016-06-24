var sqlite3 = require('sqlite3').verbose();

var adding = false;
var i = 0;
var resultTeam = new Array();

module.exports = {
	getResultTeam: function(user_id, callback) {
		var db = new sqlite3.Database('fta.db');
		resultTeam = new Array();
		i = 0;

		db.all("SELECT * from user_team where iduser='" + user_id + "'", function(err,teamIds) {
			if(teamIds.length) {
				teamIds.forEach(function (row1) {
					db.all("SELECT * from team where id='" + row1.idteam + "'", function(err,teams) {
						teams.forEach(function (row2) {
							adding = true;
							resultTeam.push(row2);
						});
						adding = false;
						callback(resultTeam);
						db.close();
					});
				});
			}
			else {
				callback(null);
				db.close();
			}
		});
	},
	
	getTitlesTeam: function(user_id, callback) {
		var db = new sqlite3.Database('fta.db');
		db.close();
	},
	
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

		console.log("addResultTeam");

	  var db = new sqlite3.Database('fta.db');
		var sql = "SELECT * FROM team WHERE idzzero=" + team_id;

		db.get(sql, function(err, row){
				if(err){
					console.log("addResultTeam: " + err);
					db.close();
				} else {

					if (typeof row != 'undefined') {

						addUserTeamRel(db, user_id, team_id);
						db.close();

					} else {

						var sql = "INSERT INTO team(idzzero, teamname) VALUES ($idzzero, $teamname)";

						var stmt = db.preprare(sql);
						stmt.run({ $idzzero: team_id, $teamname: team_name}, function(err){
							if(err){
								console.log("addResultTeam: " + err);
								db.close();
							} else {
								addUserTeamRel(db, user_id, team_id);
								db.close();
							}
						})

					}
				}
		})

		function addUserTeamRel(db, user_id, team_id) {

			var sql = "INSERT INTO user_team(iduser, idteam) VALUES ($iduser, $idteam)";
			var stmt = db.prepare(sql)
			stmt.run({ $iduser: user_id, $idteam: team_id }, function(err){
				if(err){
					console.log("addResultTeam: " + err);
					db.close();
				} else {
					console.log("addResultTeam: Team - " + team_id + ":" + team_name);
					db.close()
				}
			})

		}





	}



};
