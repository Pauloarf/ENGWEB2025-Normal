const express = require('express');
const router = express.Router();
const Edicoes = require('../controllers/edicoes');

// GET /interpretes
router.get('/', async (req, res) => {
  try {
    const edicoes = await Edicoes.list();

    const mapa = {};

    edicoes.forEach(e => {
      e.musicas.forEach(m => {
        const nome = m.intérprete;
        const pais = m.país;
        if (nome && pais) { 
          const key = `${nome}|${pais}`;
          mapa[key] = { nome, país: pais };
        }
      });
    });

    const resultado = Object.values(mapa).sort((a, b) => {
      const nomeA = a.nome || '';
      const nomeB = b.nome || '';
      return nomeA.localeCompare(nomeB);
    });

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;