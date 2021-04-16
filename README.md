# project

Run split_files on lines.csv to split into streets0.csv, streets1.csv ..., streets9.csv. The entire dataset is too big to load at once into Neo4j and I couldn't figure out how to do batches or commits, so I split it into 10 segments and ran them.

In MySQL (or other RDB) make a new connection, make a schema and load the 10 created files into the schema as tables.

Start Neo4j, clear the database and run the following, for each of the 10 files/tables. Everything in brackets needs to be replaced with the appropriate info.

```
Call apoc.load.jdbc("jdbc:mysql://localhost:3306/[schema_name]?serverTimezone=EST5EDT&user=[user]&password=[password]", "streets[x]") YIELD row
merge (i1:Intersec {lat:row.x1, long:row.y1, zip: row.pin1})
merge (i2:Intersec {lat:row.x2, long:row.y2, zip: row.pin2})
merge (i1)-[:Street {name:row.street, dist: row.manhattan, speed:row.speed}]->(i2)
return i1, i2
```

After everything is called, run the following to create database-specific ids for each intersection

```
MATCH (p:Intersec) 
WHERE NOT EXISTS(p.id) 
SET p.id = id(p)
RETURN p
```


Queries:
```
match (n1:Intersec)<-[s1:Street{name:name1}]-(n2:Intersec)-[s2:Street{name:name2}]->(n3:Intersec)
return n1, n2, n3
```

name1 Forsyth and name2 Huntington - 2 webs, Forsyth St and Forsyth Way?
name1 Forsyth and name2 Hemenway - what we'd expect (only Forsyth St intersects Hemenway)
name1 Parker and name2 Huntington - 1 web but kind of big so slightly confusing?


Shortest path based on distance. Make sure you have the 1.5 version of the Graph Data Science (GDS) plugin installed.

```
CALL gds.graph.create(

    'graph-undirected',
    'Intersec',
    {
        Street: {
            type: 'Street',
            orientation: 'UNDIRECTED'
        }
    },
    {
        relationshipProperties: 'dist'
    }
   
)
```
Runs the Dijkstra Source-Target Algorithm based on distance & Returns the subgraph

```
CALL {
 MATCH (source:Intersec {id:[start id]}), (target:Intersec {id:[end id] })
CALL gds.beta.shortestPath.dijkstra.stream('graph-undirected', {
sourceNode: id(source),
targetNode: id(target),
relationshipWeightProperty: 'dist',
path : true
})
YIELD index, sourceNode, targetNode, totalCost, nodeIds, costs
RETURN
costs,
totalCost,
nodeIds
ORDER BY index
}

MATCH (p:Intersec {id: [start id]})
MATCH (whitelist:Intersec)
WHERE whitelist.id IN nodeIds
WITH p, collect(whitelist) AS whitelistNodes
CALL apoc.path.subgraphAll(p, {
relationshipFilter: "Street",
minLevel: 1,
whitelistNodes: whitelistNodes
})

YIELD nodes, relationships
RETURN nodes, relationships, p
```

Returns a subgraph
```
MATCH (p:Intersec {id:[intersection id]})
CALL apoc.path.subgraphAll(p, {
    relationshipFilter: "Street",
    minLevel: 0,
    maxLevel: [max depth]
})
YIELD nodes, relationships
RETURN nodes, relationships;
```
