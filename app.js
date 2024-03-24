import express from 'express';
import bodyParser from 'body-parser';
import { calculateTotal} from './calculDepenses.mjs'; // Import de la fonction calculateTotal depuis calculDepenses

const app = express();
app.use(express.static('./')); // Middleware pour servir les fichiers statiques
app.use(bodyParser.json()); // Middleware pour parser les requêtes en JSON


// Endpoint pour récupérer le total des ventes
app.get('/totalSales', async (req, res) => {
    try {
        const totalSales = await calculateTotal(); // Appel de la fonction pour calculer le total
        res.json({ totalSales }); // Renvoie le total des ventes
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));