import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8444;

// Servez les fichiers statiques du répertoire 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Toutes les autres requêtes sont redirigées vers index.html pour le routing côté client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
