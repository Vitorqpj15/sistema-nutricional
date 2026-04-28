let clientes = [];

function adicionarCliente() {
  const input = document.getElementById("clienteInput");
  const nome = input.value;

  if (nome === "") return;

  clientes.push(nome);
  input.value = "";

  renderizarClientes();
}

function renderizarClientes() {
  const lista = document.getElementById("listaClientes");
  lista.innerHTML = "";

  clientes.forEach(cliente => {
    const li = document.createElement("li");
    li.textContent = cliente;
    lista.appendChild(li);
  });
}