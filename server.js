
const express = require('express');

const app = express();

app.use(express.static(`./dist/e-tranzact`));
app.get(`/*`, function(req, res) {
    res.sendFile(`index.html`, {root: `dist/e-tranzact/`}
  );
  });
  app.listen(process.env.PORT || 8008);