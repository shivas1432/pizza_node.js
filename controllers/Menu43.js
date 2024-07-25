const express = require('express');
const getMenu = (req, res) => res.json({ items: [], total: 0 });
module.exports = { getMenu };