const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);

  const pergunta = modelo.get_pergunta(perguntas[0].id_pergunta);
  expect(pergunta.texto).toBe(perguntas[0].texto);
});

test('Testando cadastro de quatro respostas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  const perguntas = modelo.listar_perguntas();
  modelo.cadastrar_resposta(perguntas[0].id_pergunta, "A resposta é 2.");
  modelo.cadastrar_resposta(perguntas[0].id_pergunta, "Claramente 2.");
  modelo.cadastrar_resposta(perguntas[0].id_pergunta, "Acredito que seja 2.");
  modelo.cadastrar_resposta(perguntas[1].id_pergunta, "Pelas minhas contas da 4.");

  var num_respostas = [];
  num_respostas[0] = modelo.get_num_respostas(perguntas[0].id_pergunta);
  num_respostas[1] = modelo.get_num_respostas(perguntas[1].id_pergunta);
  expect(num_respostas[0]).toBe(3);
  expect(num_respostas[1]).toBe(1);
  
  var respostas = [];
  respostas[0] = modelo.get_respostas(perguntas[0].id_pergunta);
  respostas[1] = modelo.get_respostas(perguntas[1].id_pergunta);
  expect(respostas[0].length).toBe(3);
  expect(respostas[1].length).toBe(1);
  expect(respostas[0][0].texto).toBe('A resposta é 2.');
  expect(respostas[0][1].texto).toBe('Claramente 2.');
  expect(respostas[0][2].texto).toBe('Acredito que seja 2.');
  expect(respostas[1][0].texto).toBe('Pelas minhas contas da 4.');
  expect(respostas[0][2].id_resposta).toBe(respostas[1][0].id_resposta-1);
});