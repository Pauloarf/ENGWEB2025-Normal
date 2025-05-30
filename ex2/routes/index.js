const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const response = await axios.get('http://localhost:25000/edicoes/full');
    const edicoes = response.data;

    res.render('index', { 
      title: 'Lista de Edições', 
      edicoes
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const edicaoResponse = await axios.get(`http://localhost:25000/edicoes/${req.params.id}`);
    const edicao = edicaoResponse.data;

    const musicasNormalizadas = (edicao.musicas || []).map(m => ({
      nome: m.título || 'Sem nome',
      interprete: m.intérprete || m.interprete || 'Desconhecido',
      pais: m.país || m.pais || 'Desconhecido'
    }));

    edicao.musicas = musicasNormalizadas;

    res.render('edicao', {
      title: `Edição ${edicao.id}`,
      edicao
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).send('Edição não encontrada');
    } else {
      next(error);
    }
  }
});

router.get('/paises/:pais', async (req, res, next) => {
  try {
    const pais = decodeURIComponent(req.params.pais);

    const response = await axios.get('http://localhost:25000/edicoes/full');
    const edicoes = response.data;

    const edicoesParticipou = edicoes.filter(e => 
      e.organizacao === pais || e.vencedor === pais
    ).map(e => {
      const musicasDoPais = (e.musicas || []).filter(m => {
        const paisMusica = m.país || m.pais || '';
        return paisMusica === pais;
      });

      return {
        id: e.id,
        anoEdição: e.anoEdição,
        venceu: e.vencedor === pais,
        musicas: musicasDoPais.map(m => ({
          nome: m.título || 'Sem nome',
          interprete: m.intérprete || m.interprete || 'Desconhecido'
        }))
      };
    });

    // Filtrar edições organizadas pelo país
    const edicoesOrganizou = edicoes.filter(e => e.organizacao === pais)
                                   .map(e => ({ id: e.id, anoEdição: e.anoEdição }));

    res.render('pais', {
      title: `País - ${pais}`,
      pais,
      edicoesParticipou,
      edicoesOrganizou
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
