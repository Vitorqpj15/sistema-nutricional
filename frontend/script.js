
const API_URL = 'http://localhost:3000';

async function carregarAlimentos() {
  try {
    // fetch() faz uma requisição GET para a API
    const resposta = await fetch(`${API_URL}/alimentos`);

    const alimentos = await resposta.json();

    const select = document.getElementById('selectAlimento');

    select.innerHTML = '<option value="">Selecione um alimento...</option>';

    
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


async function cadastrarAlimento() {
  // Pega os valores digitados nos inputs
  const nome = document.getElementById('nomeAlimento').value.trim();
  const calorias = document.getElementById('caloriasAlimento').value;
  const msg = document.getElementById('msgCadastro');

 
  if (!nome || !calorias) {
    mostrarMensagem(msg, 'Preencha todos os campos!', 'erro');
    return; 
  }

  try {
   
    const resposta = await fetch(`${API_URL}/alimentos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        nome: nome,
        calorias_por_100g: parseFloat(calorias)
      })
    });

    if (resposta.ok) {
      mostrarMensagem(msg, `✅ "${nome}" cadastrado com sucesso!`, 'sucesso');

      document.getElementById('nomeAlimento').value = '';
      document.getElementById('caloriasAlimento').value = '';

      carregarAlimentos();
    } else {
      mostrarMensagem(msg, 'Erro ao cadastrar alimento.', 'erro');
    }

  } catch (erro) {
    mostrarMensagem(msg, 'Erro de conexão com o servidor.', 'erro');
  }
}

async function registrarConsumo() {
  const alimento_id = document.getElementById('selectAlimento').value;
  const quantidade = document.getElementById('quantidade').value;
  const msg = document.getElementById('msgRegistro');

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

      document.getElementById('selectAlimento').value = '';
      document.getElementById('quantidade').value = '';

      carregarRegistros();
    } else {
      mostrarMensagem(msg, 'Erro ao registrar consumo.', 'erro');
    }

  } catch (erro) {
    mostrarMensagem(msg, 'Erro de conexão com o servidor.', 'erro');
  }
}

async function carregarRegistros() {
  try {
    const resposta = await fetch(`${API_URL}/alimentos/registros`);
    const registros = await resposta.json();

    const corpo = document.getElementById('corpoTabela');
    corpo.innerHTML = ''; 

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

    let totalCalorias = 0;

    registros.forEach(registro => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${registro.nome}</td>
        <td>${registro.quantidade_g}g</td>
        <td>${registro.calorias} kcal</td>
      `;
      corpo.appendChild(linha);

      totalCalorias += parseFloat(registro.calorias);
    });

    document.getElementById('totalCalorias').textContent = 
      `${totalCalorias.toFixed(1)} kcal`;

  } catch (erro) {
    console.error('Erro ao carregar registros:', erro);
  }
}

function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `mensagem ${tipo}`; 

  setTimeout(() => {
    elemento.textContent = '';
    elemento.className = 'mensagem';
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  carregarAlimentos(); 
  carregarRegistros(); 
});