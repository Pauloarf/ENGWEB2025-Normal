const Edicao = require('../models/edicoes');

module.exports.list = () => {
  return Edicao.find().exec();
};

module.exports.findById = (id) => {
  return Edicao.findOne({ id: id }).exec();
};

// Exemplo de filtro por anoEdição
module.exports.findByAno = (ano) => {
  return Edicao.find({ anoEdição: ano }).exec();
};

// Exemplo de filtro por organizacao
module.exports.findByOrganizacao = (org) => {
  return Edicao.find({ organizacao: { $regex: org, $options: 'i' } }).exec();
};

module.exports.insert = (edicao) => {
  const newEdicao = new Edicao(edicao);
  return newEdicao.save();
};

module.exports.update = (edicao) => {
  return Edicao.findOneAndUpdate({ id: edicao.id }, edicao, { new: true }).exec();
};

module.exports.delete = (id) => {
  return Edicao.findOneAndDelete({ id: id }).exec();
};
