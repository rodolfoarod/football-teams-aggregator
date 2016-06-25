"use strict";

var sqlite3 = require('sqlite3').verbose();
var db;

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


	addTeam: function(user_id, idzzero, iddbpedia, team_name) {

		createDb();

		getTeamId(idzzero, iddbpedia, function(err, row){

			if(err) {

				console.log("addTeam - " + err);

			} else {

				if(typeof row != 'undefined') {

					console.log("Adding only new relation...");

					insertTeamRel(user_id, row.id);

				} else {

					console.log("Adding new team and new relation");

					insertTeam(user_id, idzzero, iddbpedia, team_name);

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

function insertTeam(user_id, idzzero, iddbpedia, teamname) {
	console.log("Insert team");

	var sql;
	if(idzzero !== -1) {
		sql = "INSERT INTO team(idzzero, teamname) VALUES ($id, $teamname)";
	} else if(iddbpedia !== -1) {
		sql = "INSERT INTO team(iddbpedia, teamname) VALUES ($id, $teamname)"
	}

	var stmt = db.prepare(sql);

	if(idzzero !== -1) {
		stmt.run({ $id: idzzero, $teamname: teamname});
	} else if(iddbpedia !== -1) {
		stmt.run({ $id: iddbpedia, $teamname: teamname});
	}

	stmt.finalize(function(){
		getTeamId(idzzero, iddbpedia, function(row){
			insertTeamRel(user_id, row.id);
		});
	});

}

function getTeamId(idzzero, iddbpedia, callback) {

	console.log("Getting team id");

	var sql;
	if(idzzero !== -1) {
		sql = "SELECT * FROM team WHERE idzzero=" + idzzero;
	} else if(iddbpedia !== -1){
		sql = "SELECT * FROM team WHERE iddbpedia=" + iddbpedia;
	} else {
		console.log("getTeamId - Wrong ID");
		return;
	}

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
