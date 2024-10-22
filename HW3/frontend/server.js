const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 30800;
const API_URL = 'http://192.168.61.3:5001';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // 解析 JSON 請求體

app.get('/api/appointments', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/appointments`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

app.get('/api/appointments/search', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/appointments/search`, { params: req.query });
    res.json(response.data);
  } catch (error) {
    console.error('Error searching appointments:', error);
    res.status(500).json({ error: 'Error searching appointments' });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/api/appointments`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error creating appointment' });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${API_URL}/api/appointments/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting appointment' });
  }
});

app.put('/api/appointments/:id', async (req, res) => {
  try {
    const response = await axios.put(`${API_URL}/api/appointments/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error updating appointment' });
  }
});

app.listen(port, () => {
  console.log(`預約系統正在監聽 ${port}`);
});
