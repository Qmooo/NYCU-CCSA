const express = require('express');
const path = require('path');
const app = express();
const port = 30800;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`預約系統正在監聽 ${port}`);
});
