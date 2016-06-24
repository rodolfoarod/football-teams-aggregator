var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('fta.db');

/*
db.serialize(function() {
  db.run("CREATE TABLE lorem (info TEXT)");

  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, username, password FROM user", function(err, row) {
      console.log(row.id + ": " + row.username + ": " + row.password);
  });
});

//Perform SELECT Operation
db.all("SELECT * from user where username="+that,function(err,rows){
//rows contain values while errors, well you can figure out.
});

//Perform INSERT operation.
db.run("INSERT into table_name(col1,col2,col3) VALUES (val1,val2,val3)");

//Perform DELETE operation
db.run("DELETE * from table_name where condition");

//Perform UPDATE operation
db.run("UPDATE table_name where condition");

db.close();
*/

function imprime(result) {
	console.log(result.id)
}

getUser('leo', 'pass', imprime);

function getUser(username, password, callback) {
	var userID = -1;
	
	db.all("SELECT * from user where username='" + username + "'", function(err,rows) {
		rows.forEach(function (row) {
			if(row.password == password)
				callback(row);
			else
				callback(null);
		});
	});
}