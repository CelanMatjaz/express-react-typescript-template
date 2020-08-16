import express from 'express';
import path from 'path';

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

const staticAssetsDir = isProduction
  ? path.join(process.cwd(), 'public')
  : path.join(process.cwd(), 'build/debug/public');

app.use(express.static(staticAssetsDir, { maxAge: isProduction ? 0 : 1000 }));

app.get('*', (req, res) => {
  res.sendFile(path.join(staticAssetsDir, 'index.html'));
});

export default app;
