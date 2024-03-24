import { appendFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { join, dirname} from 'path';
import { calculateTotal } from './calculDepenses.mjs'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// fonction pour écrire le total dans un fichier totals.txt
async function writeTotal(total, path) {
    const salesTotalsDir = join(__dirname, 'salesTotals'); // chemin du répertoire salesTotals
    const totalsFilePath = join(salesTotalsDir, 'totals.txt'); // chemin du fichier totals.txt

    let message = ""; // message à écrire dans le fichier
    if (path !== undefined && path !== '') {
        message = `Total at ${new Date().toLocaleDateString()} from ${path} : ${total}€\n`; 
    } else {
        message = `Total at ${new Date().toLocaleDateString()} from stores : ${total}€\n`;
    }

    try {
        await mkdir(salesTotalsDir); // Créer le répertoire salesTotals
    } catch (error) {
        if (error.code === 'EEXIST') { // Si le répertoire existe déjà
            console.log('salesTotals already exists');
        } else {
            console.error(error.message); // Gestion des autres erreurs
        }
    }

    try {
        await appendFile(totalsFilePath, message); // écrire le message dans le fichier tout en gardant les anciennes données
        console.log(`Wrote sales totals ${total} to salesTotals`);
    } catch (error) {
        console.error(error.message);
    }
}

const path = process.argv[2]; // récupérer le chemin passé en argument
async function main() { // Fonction principale
    const total = await calculateTotal(path);
    await writeTotal(total, path);
}

main(); // Appel de la fonction main