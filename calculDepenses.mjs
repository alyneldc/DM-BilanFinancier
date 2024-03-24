import { readdir, stat, readFile} from 'fs/promises';
import { fileURLToPath } from 'url';
import { join, extname, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fonction récursive pour calculer les dépenses totales dans un répertoire donné
async function calculateTotalForDirectory(directoryPath) {
    let total = 0;
    const items = await readdir(directoryPath); // Liste les éléments du répertoire

    for (const item of items) {
        const itemPath = join(directoryPath, item); // Chemin de l'élément
        const itemStat = await stat(itemPath); // spécifie les informations sur l'objet (fichier ou répertoire)

        if (itemStat.isDirectory()) { // Vérifie si c'est un répertoire
            total += await calculateTotalForDirectory(itemPath); // Appele récursivement la fonction pour les sous-répertoires
        } else if (extname(item) === '.json') { // Si c'est un fichier JSON
            const jsonData = JSON.parse(await readFile(itemPath, 'utf8')); // Lit le contenu du fichier JSON
            if (jsonData.total) {
                total += jsonData.total; // Ajouter le total du fichier au total général
            }
        }
    }

    return total;
}

// Fonction pour calculer le total des dépenses
async function calculateTotal(path = '') {
    const storesDir = join(__dirname, 'stores'); // Chemin du répertoire stores
    const targetDir = path ? join(__dirname, ...path.split('/')) : storesDir; // Chemin du répertoire cible quand il est spécifié ou par défaut le répertoire stores

    try {
        const targetDirStat = await stat(targetDir); // spécifie les informations sur l'objet (fichier ou répertoire)
        if (!targetDirStat.isDirectory()) { 
            throw new Error(`Path ${path} is not a directory.`);
        }
    } catch (error) {
        console.error(error.message);
        return 0;
    }

    return await calculateTotalForDirectory(targetDir); // Appel de la fonction récursive pour calculer le total
}

export { calculateTotal }; // Export de la fonction calculateTotal