const express = require('express');
const router = express.Router();
const Edicoes = require('../controllers/edicoes');

// GET /paises?papel=org ou /paises?papel=venc
router.get('/', async (req, res) => {
  try {
    const { papel } = req.query;
    if (papel !== 'org' && papel !== 'venc') {
      return res.status(400).json({ error: 'Parâmetro papel inválido' });
    }

    const edicoes = await Edicoes.list();

    const mapa = {};

    if (papel === 'org') {
      edicoes.forEach(e => {
        const pais = e.organizacao;
        if (!mapa[pais]) mapa[pais] = [];
        mapa[pais].push(e.anoEdição);
      });
    } else if (papel === 'venc') {
      edicoes.forEach(e => {
        const pais = e.vencedor;
        if (!mapa[pais]) mapa[pais] = [];
        mapa[pais].push(e.anoEdição);
      });
    }

    const resultado = Object.entries(mapa)
      .map(([pais, anos]) => ({
        país: pais,
        anos: anos.sort((a, b) => a - b)
      }))
      .sort((a, b) => a.país.localeCompare(b.país));

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;