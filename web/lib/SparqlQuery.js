//QueryPrototype class
function SparqlQuery() {
    this.prefixString = "";
    this.triplesString = "";
    this.selectsString = "";
    this.whereFilters = "";
    
    //begin todo
    this.orderBy = "";
    this.groupBy = "";
    //end todo
}
//
//
//prefixes
SparqlQuery.prototype.addPrefix = function (prefix) {
    if (prefix != null) {
        this.prefixString = prefix;
    }
}
SparqlQuery.prototype.appendPrefix = function (prefix) {
    if (prefix != null) {
        this.prefixString += "\n" + prefix;
    }
}
//
//
//selects
SparqlQuery.prototype.addSelect = function (select) {
    if (select != null) {
        this.selects = select;
    }
}
SparqlQuery.prototype.appendSelect = function (select) {
    if (select != null) {
        this.selects += " " + select;
    }
}
//
//
//triples
SparqlQuery.prototype.addTriple = function (triple) {
    if (triple != null) {
        this.triplesString = triple;
    }
}
SparqlQuery.prototype.appendTriple = function (triple) {
    if (triple != null) {
        if (this.triplesString != "")
            this.triplesString += "\n";
        this.triplesString += triple;
    }
}
SparqlQuery.prototype.appendOptionalTriple = function (triple){
    if(filter != null) {
        if (this.triplesString != "") this.triplesString += "\n";
        this.triplesString += triple;
    }
}
//
//
//where filters
SparqlQuery.prototype.addWhereFilter = function (filter) {
    if (filter != null) {
        this.whereFilters = filter;
    }
}

SparqlQuery.prototype.appendWhereFilterAnd = function (filter) {
    if (filter != null) {
        if(this.whereFilters != "") this.whereFilters += " && ";
        this.whereFilters += filter;
    }
}
SparqlQuery.prototype.appendWhereFilterOr = function (filter) {
    if (filter != null) {
        this.whereFilters += " || " + filter;
    }
}
//
//
//Form query
SparqlQuery.prototype.returnQuery = function () {
    var query = this.prefixString;
    query += "\n" +this.selects;
    query += "\n" +'WHERE { ' + "\n" + this.triplesString;
    if (this.whereFilters != "") {
        query += "\n FILTER(" + this.whereFilters + ')';

    }
    query += "\n" + ' } ';
    
    return query;
}
//
//
//begin TODO
SparqlQuery.prototype.addOrder = function (order) {
    if (order != null)
        this.orderBy = "ORDER BY " + order;
}
//end TODO

module.exports = SparqlQuery;