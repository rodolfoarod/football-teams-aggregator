INSERT INTO user(username, password)
VALUES('leo@mail.pt', 'pass');

INSERT INTO team(idzzero, teamname)
VALUES(11, 'team 1');
INSERT INTO team(idzzero, teamname)
VALUES(12, 'team 2');
INSERT INTO team(idzzero, teamname)
VALUES(13, 'team 3');
INSERT INTO team(iddbpedia, teamname)
VALUES('team4_link', 'team 4');
INSERT INTO team(iddbpedia, teamname)
VALUES('team5_link', 'team 5');
INSERT INTO team(iddbpedia, teamname)
VALUES('team6_link', 'team 6');

INSERT INTO user_team(iduser, idteam)
VALUES(1, 1);
INSERT INTO user_team(iduser, idteam)
VALUES(1, 3);
INSERT INTO user_team(iduser, idteam)
VALUES(1, 5);
INSERT INTO user_team(iduser, idteam)
VALUES(1, 6);