CREATE TABLE IF NOT EXISTS user (
	id integer,
	username character varying NOT NULL,
	password character varying NOT NULL,

	CONSTRAINT user_pkey PRIMARY KEY (id),
	
	CONSTRAINT username_u UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS team (
	id integer,
	idzzero integer,
	iddbpedia character varying,
	teamname character varying NOT NULL,

	CONSTRAINT team_pkey PRIMARY KEY (id),
	
	CONSTRAINT idzzero_u UNIQUE (idzzero),
	CONSTRAINT iddbpedia_u UNIQUE (iddbpedia)
);

CREATE TABLE IF NOT EXISTS teamtitle (
	id integer,
	title character varying NOT NULL,
	year integer NOT NULL,
    idteam integer NOT NULL,

	CONSTRAINT teaminfo_pkey PRIMARY KEY (id),
	CONSTRAINT teaminfo_idteam_fkey FOREIGN KEY (idteam) REFERENCES team(id)
);

CREATE TABLE IF NOT EXISTS user_team (
    iduser integer NOT NULL,
    idteam integer NOT NULL,
	
	CONSTRAINT user_team_pkey PRIMARY KEY (iduser, idteam),
	
	CONSTRAINT user_team_iduser_fkey FOREIGN KEY (iduser) REFERENCES user(id),
	CONSTRAINT user_team_idteam_fkey FOREIGN KEY (idteam) REFERENCES team(id)
);