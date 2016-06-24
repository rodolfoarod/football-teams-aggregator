"use strict";

var sqlite3 = require('sqlite3').verbose();
var db;

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


	addResultTeam: function(user_id, idzzero, team_name) {

		createDb();

		getTeamId(idzzero, function(err, row){

			if(err) {

				console.log("addResultTeam - " + err);

			} else {

				if(typeof row != 'undefined') {

					console.log("Adding only new relation...");

					insertTeamRel(user_id, row.id, null);

				} else {

					console.log("Adding new team and new relation");

					insertTeam(user_id, idzzero, team_name);

				}

			}

		});

		closeDb();

	}

};


function createDb(callback) {
	console.log("Create DB");
	db = new sqlite3.Database('fta.db', callback);
}

function insertTeam(user_id, idzzero, teamname) {
	console.log("Insert team");
	var stmt = db.prepare("INSERT INTO team(idzzero, teamname) VALUES ($idzzero, $teamname)");
	stmt.run({ $idzzero: idzzero, $teamname: teamname});
	stmt.finalize(function(){
		getTeamId(idzzero, function(row){
			insertTeamRel(user_id, row.id);
		});
	});
}

function getTeamId(idzzero, callback) {
	console.log("Getting team id");
	var sql = "SELECT * FROM team WHERE idzzero=" + idzzero;
	db.get(sql, function(err, row){
		callback(row);
	});

}

function insertTeamRel(user_id, team_id) {
	console.log("Insert team relation");
	var stmt = db.prepare("INSERT INTO user_team(iduser, idteam) VALUES ($iduser, $idteam)");
	stmt.run({ $iduser: user_id, $idteam: team_id });
	stmt.finalize();
}

function closeDb() {
	console.log("DB closing...");
	db.close();
}
