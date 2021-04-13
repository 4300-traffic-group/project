# project

Run split_files on lines.csv to split into streets0.csv, streets1.csv ..., streets9.csv. The entire dataset is too big to load at once into Neo4j and I couldn't figure out how to do batches or commits, so I split it into 10 segments and ran them.

In MySQL (or other RDB) make a new connection, make a schema and load the 10 created files into the schema as tables.

Start Neo4j, clear the database and run the following, for each of the 10 files/tables. Everything in brackets needs to be replaced with the appropriate info.

Call apoc.load.jdbc("jdbc:mysql://localhost:3306/[schema_name]?serverTimezone=EST5EDT&user=[user]&password=[password]", "streets[x]") YIELD row
merge (i1:Intersec {lat:row.x1, long:row.y1})
merge (i2:Intersec {lat:row.x2, long:row.y2})
merge (i1)-[:Street {name:row.street}]->(i2)
return i1, i2

Queries:
match (n1:Intersec)<-[s1:Street{name:name1}]-(n2:Intersec)-[s2:Street{name:name2}]->(n3:Intersec)
return n1, n2, n3

name1 Forsyth and name2 Huntington - 2 webs, Forsyth St and Forsyth Way?
name1 Forsyth and name2 Hemenway - what we'd expect (only Forsyth St intersects Hemenway)
name1 Parker and name2 Huntington - 1 web but kind of big so slightly confusing?
