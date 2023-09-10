const express = require('express')
const cors = require('cors');
const app = express()

app.use(cors());

const sqlite3 = require('sqlite3').verbose(); // Import the sqlite3 package

// Connect to the SQLite database
const db = new sqlite3.Database('../inkyfada.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database');
  }
});

// Close the database connection when done
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing the database:', err.message);
    } else {
      console.log('Database connection closed');
      process.exit(0);
    }
  });
});


function isEmpty(param) {
  return param == undefined || param == '';
}

// Route pour récupérer les données de la base de données
app.get('/depth-rate', (req, res) => {
  // Exécutez la requête SQL avec les paramètres startDate et endDate
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const pageUrl = req.query.pageUrl;
 
// Build the SQL query dynamically based on user input
let sql = `
SELECT 
  strftime('%Y-%m-%d', rd.createdAt) as VisitDate
  ,ROUND(CAST(SUM (CASE
    WHEN ev.EventType = 1 THEN ev.EventValue
    ELSE 0
  END) AS REAL)/ count(DISTINCT ev.visitId),2) AS DepthRate
FROM events ev
JOIN Records rd ON
  ev.visitId = rd.visitId
  AND ev.sessionId = rd.sessionId
  AND ev.visitorId = rd.visitorId
WHERE 1=1
`;

// Add WHERE clauses if variables are provided
if (pageUrl) {
  sql += ` AND rd.pageUrl LIKE '%${pageUrl}%'`;
}
if (startDate && endDate) {
  sql += ` AND strftime('%Y-%m-%d', rd.createdAt) BETWEEN '${startDate}' AND '${endDate}'`;
}
if(startDate && isEmpty(endDate)) {
  sql += ` AND strftime('%Y-%m-%d', rd.createdAt) >= '${startDate}'`;
}

if(endDate && isEmpty(startDate)) {
  sql += ` AND strftime('%Y-%m-%d', rd.createdAt) <= '${endDate}'`;
}

sql += ` GROUP BY strftime('%Y-%m-%d', rd.createdAt)`;


  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la requête à la base de données :', err.message);
      res.status(500).json({ error: err });
    } else {
      res.json(rows); // Envoyez le résultat en tant que JSON
    }
  });
});


app.listen(5000,()=>console.log("server started on port 5000"))