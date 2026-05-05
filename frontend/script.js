// URL base da API — se mudar a porta, muda só aqui
const API_URL = 'http://localhost:3000';

// ================================
// FUNÇÃO 1 — Carregar alimentos no <select>
// Chamada automaticamente quando a página abre
// ================================
async function carregarAlimentos() {
  try {
    // fetch() faz uma requisição GET para a API
    const resposta = await fetch(`${API_URL}/alimentos`);

    // .json() converte a resposta para um array JavaScript
    const alimentos = await resposta.json();

    // Pega o elemento <select> do HTML
    const select = document.getElementById('selectAlimento');

    // Limpa o select e adiciona a opção padrão
    select.innerHTML = '<option value="">Selecione um alimento...</option>';

    // Para cada alimento retornado, cria uma <option> no select
    alimentos.forEach(alimento => {
      const option = document.createElement('option');
      option.value = alimento.id;
      option.textContent = `${alimento.nome} (${alimento.calorias_por_100g} kcal/100g)`;
      select.appendChild(option);
    });

  } catch (erro) {
    console.error('Erro ao carregar alimentos:', erro);
  }
}

// ================================
// FUNÇÃO 2 — Cadastrar novo alimento
// Chamada pelo botão "Cadastrar" da seção 1
// ================================
async function cadastrarAlimento() {
  // Pega os valores digitados nos inputs
  const nome = document.getElementById('nomeAlimento').value.trim();
  const calorias = document.getElementById('caloriasAlimento').value;
  const msg = document.getElementById('msgCadastro');

  // Validação básica — campos obrigatórios
  if (!nome || !calorias) {
    mostrarMensagem(msg, 'Preencha todos os campos!', 'erro');
    return; // para a função aqui se tiver campo vazio
  }

  try {
    // fetch() com método POST envia dados para a API
    const resposta = await fetch(`${API_URL}/alimentos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // avisa que estamos enviando JSON
      },
      body: JSON.stringify({ // converte objeto JS para string JSON
        nome: nome,
        calorias_por_100g: parseFloat(calorias)
      })
    });

    if (resposta.ok) {
      mostrarMensagem(msg, `✅ "${nome}" cadastrado com sucesso!`, 'sucesso');

      // Limpa os campos após cadastrar
      document.getElementById('nomeAlimento').value = '';
      document.getElementById('caloriasAlimento').value = '';

      // Atualiza o select com o novo alimento
      carregarAlimentos();
    } else {
      mostrarMensagem(msg, 'Erro ao cadastrar alimento.', 'erro');
    }

  } catch (erro) {
    mostrarMensagem(msg, 'Erro de conexão com o servidor.', 'erro');
  }
}

// ================================
// FUNÇÃO 3 — Registrar consumo
// Chamada pelo botão "Registrar" da seção 2
// ================================
async function registrarConsumo() {
  const alimento_id = document.getElementById('selectAlimento').value;
  const quantidade = document.getElementById('quantidade').value;
  const msg = document.getElementById('msgRegistro');

  // Validação
  if (!alimento_id || !quantidade) {
    mostrarMensagem(msg, 'Selecione um alimento e informe a quantidade!', 'erro');
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/alimentos/registros`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        alimento_id: parseInt(alimento_id),
        quantidade_g: parseFloat(quantidade)
      })
    });

    if (resposta.ok) {
      mostrarMensagem(msg, '✅ Consumo registrado com sucesso!', 'sucesso');

      // Limpa os campos
      document.getElementById('selectAlimento').value = '';
      document.getElementById('quantidade').value = '';

      // Atualiza a tabela com o novo registro
      carregarRegistros();
    } else {
      mostrarMensagem(msg, 'Erro ao registrar consumo.', 'erro');
    }

  } catch (erro) {
    mostrarMensagem(msg, 'Erro de conexão com o servidor.', 'erro');
  }
}

// ================================
// FUNÇÃO 4 — Carregar registros do dia
// Atualiza a tabela e o total de calorias
// ================================
async function carregarRegistros() {
  try {
    const resposta = await fetch(`${API_URL}/alimentos/registros`);
    const registros = await resposta.json();

    const corpo = document.getElementById('corpoTabela');
    corpo.innerHTML = ''; // limpa a tabela antes de preencher

    // Se não tiver registros hoje, mostra mensagem
    if (registros.length === 0) {
      corpo.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; color:#999; padding: 24px">
            Nenhum alimento registrado hoje ainda.
          </td>
        </tr>
      `;
      document.getElementById('totalCalorias').textContent = '0 kcal';
      return;
    }

    // Variável para acumular o total de calorias
    let totalCalorias = 0;

    // Para cada registro, cria uma linha na tabela
    registros.forEach(registro => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${registro.nome}</td>
        <td>${registro.quantidade_g}g</td>
        <td>${registro.calorias} kcal</td>
      `;
      corpo.appendChild(linha);

      // Soma as calorias
      totalCalorias += parseFloat(registro.calorias);
    });

    // Atualiza o total na tela
    document.getElementById('totalCalorias').textContent = 
      `${totalCalorias.toFixed(1)} kcal`;

  } catch (erro) {
    console.error('Erro ao carregar registros:', erro);
  }
}

// ================================
// FUNÇÃO AUXILIAR — Mostrar mensagens
// Reutilizada pelas outras funções
// ================================
function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `mensagem ${tipo}`; // adiciona classe 'sucesso' ou 'erro'

  // Remove a mensagem depois de 3 segundos
  setTimeout(() => {
    elemento.textContent = '';
    elemento.className = 'mensagem';
  }, 3000);
}

// ================================
// INICIALIZAÇÃO
// Quando a página carregar, executa essas funções
// ================================
document.addEventListener('DOMContentLoaded', () => {
  carregarAlimentos(); // preenche o select
  carregarRegistros(); // preenche a tabela
});