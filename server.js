// 1- Importation des modules/packages/librairies
const express = require('express');
const mysql = require('mysql');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// 2- Configuration
// Connexion à la base de données
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "foot"
});
connection.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données : ", err);
        return;
    }
    console.log("Connecté à la base de données MySQL.");
});

// Configuration de Handlebars
app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));

// 3- Les routes

// Route pour afficher la liste des joueurs
app.get("/", (req, res) => {
    const sql = "SELECT * FROM equipe";
    connection.query(sql, (error, results) => {
        if (error) {
            console.error("Erreur lors de la récupération des joueurs : ", error);
            return res.render("error", { layout: "main", message: "Impossible de récupérer la liste des joueurs." });
        }
        res.render("list", {
            layout: "main",
            joueurs: results
        });
    });
});

// Route pour afficher le formulaire d'ajout
app.get("/add", (req, res) => {
    res.render("add", {
        layout: "main"
    });
});

// Route pour ajouter un joueur dans la base de données
app.post("/add", (req, res) => {
    const { nom, numero_tshirt, role, photo } = req.body;
    const sql = "INSERT INTO equipe (nom, numero_tshirt, role, photo) VALUES (?, ?, ?, ?)";

    connection.query(sql, [nom, numero_tshirt, role, photo], (error, results) => {
        if (error) {
            console.error("Erreur d'insertion : ", error);
            return res.render("add", { layout: "main", error: "Erreur lors de l'ajout du joueur. Veuillez réessayer." });
        }
        console.log("Joueur ajouté avec succès : ", results);
        res.redirect("/"); // Redirige vers la liste des joueurs
    });
});

// 4- Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
