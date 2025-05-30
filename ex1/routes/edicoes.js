const express = require('express');
const router = express.Router();
const Edicoes = require('../controllers/edicoes');

// GET /edicoes
router.get('/', async (req, res) => {
  try {
    const { org } = req.query;
    let edicoes;

    if (org) {
      edicoes = await Edicoes.findByOrganizacao(org);
    } else {
      edicoes = await Edicoes.list();
    }

    const resultado = edicoes.map(e => ({
      anoEdição: e.anoEdição,
      organizacao: e.organizacao,
      vencedor: e.vencedor
    }));

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /edicoes/full
router.get('/full', async (req, res) => {
  try {
    const { org } = req.query;
    let edicoes;

    if (org) {
      edicoes = await Edicoes.findByOrganizacao(org);
    } else {
      edicoes = await Edicoes.list();
    }

    // Retorna os objetos completos, sem mapear os campos
    res.json(edicoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /edicoes/:id
router.get('/:id', async (req, res) => {
  try {
    const edicao = await Edicoes.findById(req.params.id);
    if (!edicao) return res.status(404).json({ error: 'Edição não encontrada' });
    res.json(edicao);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// POST /edicoes
router.post('/', async (req, res) => {
  try {
    const created = await Edicoes.insert(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /edicoes/:id
router.put('/:id', async (req, res) => {
  try {
    req.body.id = req.params.id; 
    const updated = await Edicoes.update(req.body);
    if (!updated) return res.status(404).json({ error: 'Edição não encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// DELETE /edicoes/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Edicoes.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Edição não encontrada' });
    res.json({ message: 'Edição eliminada com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
