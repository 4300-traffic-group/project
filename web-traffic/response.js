var nodes = 100
var cypher = `MATCH (n: Intersec)-[r:Street]->(m: Intersec) RETURN * LIMIT ${nodes}`
$("#nodes-limit").click(function() {
    var new_limit = $("#nodes").val();
    nodes = new_limit
    viz.reload()

});

// Streets
$("#streets-reload").click(function() {

    var street1 = $("#street1").val();
    var street2 = $("#street2").val();

    if (street1 != "" && street2 == "") {
        cypher = `MATCH (n: Intersec)-[r:Street{name:"${street1}"}]->(m: Intersec)-[r2:Street]-(n2:Intersec) RETURN * LIMIT ${nodes}`
        viz.renderWithCypher(cypher);
    } else if (street1 != "" && street2 != "") {
        cypher = `MATCH (n: Intersec)-[r:Street{name:"${street1}"}]->(m: Intersec)-[r2:Street{name:"${street2}"}]-(n2:Intersec) RETURN * LIMIT ${nodes} UNION`
        cypher = cypher + ` MATCH (n: Intersec)-[r:Street{name:"${street2}"}]->(m: Intersec)-[r2:Street{name:"${street1}"}]-(n2:Intersec) RETURN * LIMIT ${nodes}`
        viz.renderWithCypher(cypher);
    } else {
        viz.reload();
    }
});

$("#zipcode-reload").click(function() {
    var zip1 = $("#zip1").val();

    if (zip1.slice(0,1) == 0) {
        cypher = `MATCH (n: Intersec{zip:${zip1.slice(1)}})-[r:Street]->(m: Intersec{zip:${zip1.slice(1)}}) RETURN * LIMIT ${nodes}`
        viz.renderWithCypher(cypher);
    } else if (zip1.slice(0,1) != 0) {
        cypher = `MATCH (n: Intersec{zip:${zip1}})-[r:Street]->(m: Intersec{${zip1}}) RETURN * LIMIT ${nodes}`
        viz.renderWithCypher(cypher);
    } else {
        viz.reload();
    }

});

$("#load").click(function() {
    cypher = `MATCH (n: Intersec)-[r:Street]->(m: Intersec) RETURN * LIMIT ${nodes}`
    viz.renderWithCypher(cypher)
});


$("#format").click(function() {
    viz._config.hierarchical = !viz._config.hierarchical
    viz.reload()
});

$("#cypher-reload").click(function() {
    cypher = $("#cypher").val();
    if (cypher.length > 3) {
        viz.renderWithCypher(cypher);
    } else {
        viz.reload()
    }
});