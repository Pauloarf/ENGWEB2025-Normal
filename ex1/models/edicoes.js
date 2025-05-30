const mongoose = require('mongoose');

const musicaSchema = new mongoose.Schema({
  id: String,
  link: String,
  título: String,
  país: String,
  compositor: String,
  intérprete: String,
  letra: String,
}, { _id: false });

const edicaoSchema = new mongoose.Schema({
  id: String,
  anoEdição: Number,
  musicas: [musicaSchema],
  organizacao: String,
  vencedor: String,
});

module.exports = mongoose.model('edicoes', edicaoSchema);
