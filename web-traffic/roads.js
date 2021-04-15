var viz;

// must allow for non-local access in the neo4j database settings
//# To accept non-local connections, uncomment this line:
// dbms.default_listen_address=0.0.0.0

function draw() {
    var config = {
        container_id: "viz",
        server_url: "bolt://localhost:7687",
        server_user: "neo4j",
        server_password: "db", // database password
        hierarchical: true,
        labels: { // nodes
            "Intersec": {
                "caption": function (n) {
                    return ""
                },
                "community": "zip",
                "title_properties": [
                    "<id>",
                    "long",
                    "lat",
                    "zip"
                ]
            }

        },
        relationships: {
            "Street": {
                "thickness": "speed" ,
                "caption": "name",
            }
        },physics: {
            forceAtlas2Based: {
                theta: 0.5,
                gravitationalConstant: -50,
                centralGravity: 0.01,
                springConstant: 0.08,
                springLength: 100,
                damping: 0.4,
                avoidOverlap: 0
            },
        },
         initial_cypher: "MATCH (n: Intersec)-[r:Street]->(m: Intersec) RETURN * LIMIT 100",

    }

    viz = new NeoVis.default(config);
    viz.render();
}
