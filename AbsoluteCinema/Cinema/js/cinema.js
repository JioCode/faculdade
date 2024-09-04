// Conseguir dados
function getLocalStorageData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Salvar
function saveLocalStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Funções para manipular Filmes
function adicionarFilme() {
    const filmes = getLocalStorageData('filmes');

    const novoFilme = {
        id: Date.now(),
        titulo: document.getElementById('titulo').value,
        duracao: document.getElementById('duracao').value, // Captura a duração do filme
        classificacao: document.getElementById('classificacao').value,
        genero: document.getElementById('genero').value
    };

    filmes.push(novoFilme);
    saveLocalStorageData('filmes', filmes);

    alert('Filme adicionado com sucesso!');
}


function removerFilme(id) {
    let filmes = getLocalStorageData('filmes');
    filmes = filmes.filter(filme => filme.id !== id);
    saveLocalStorageData('filmes', filmes);
    listarFilmes();
}

function listarFilmes() {
    const filmes = getLocalStorageData('filmes');
    const listaFilmes = document.getElementById('listaFilmes');
    listaFilmes.innerHTML = '';

    filmes.forEach(filme => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${filme.titulo}</strong> - ${filme.classificacao} - ${filme.genero}
            <button onclick="preencherFilme(${filme.id})">Editar</button>
            <button onclick="removerFilme(${filme.id})">Remover</button>
        `;
        listaFilmes.appendChild(li);
    });
}

function preencherFilme(id) {
    const filmes = getLocalStorageData('filmes');
    const filme = filmes.find(f => f.id === id);
    if (filme) {
        document.getElementById('titulo').value = filme.titulo;
        document.getElementById('classificacao').value = filme.classificacao;
        document.getElementById('genero').value = filme.genero;
        document.getElementById('filmeForm').dataset.filmeId = id;
    }
}

// Funções para manipular Salas
function adicionarSala() {
    const salas = getLocalStorageData('salas');

    const novaSala = {
        id: Date.now(),
        nome: document.getElementById('nomeSala').value,
        capacidade: document.getElementById('capacidadeSala').value
    };

    salas.push(novaSala);
    saveLocalStorageData('salas', salas);

    alert('Sala adicionada com sucesso!');
    carregarSalas();
}

function carregarSalas() {
    const salas = getLocalStorageData('salas');
    const listaSalas = document.getElementById('listaSalas');

    listaSalas.innerHTML = ''; // Limpa o conteúdo antes de carregar as salas

    salas.forEach(sala => {
        const salaDiv = document.createElement('div');
        salaDiv.className = 'sala';

        salaDiv.innerHTML = `
            <h4>${sala.nome}</h4>
            <p>Capacidade: ${sala.capacidade}</p>
            <button onclick="removerSala(${sala.id})">Remover</button>
        `;

        listaSalas.appendChild(salaDiv);
    });
}


function removerSala(id) {
    let salas = getLocalStorageData('salas');
    salas = salas.filter(sala => sala.id !== id);
    saveLocalStorageData('salas', salas);

    alert('Sala removida com sucesso!');
    carregarSalas();
}

function listarSalas() {
    const salas = getLocalStorageData('salas');
    const listaSalas = document.getElementById('listaSalas');
    listaSalas.innerHTML = '';

    salas.forEach(sala => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${sala.nomeSala}</strong> - Capacidade: ${sala.capacidade}
            <button onclick="preencherSala(${sala.id})">Editar</button>
            <button onclick="removerSala(${sala.id})">Remover</button>
        `;
        listaSalas.appendChild(li);
    });
}

function preencherSala(id) {
    const salas = getLocalStorageData('salas');
    const sala = salas.find(s => s.id === id);
    if (sala) {
        document.getElementById('nomeSala').value = sala.nomeSala;
        document.getElementById('capacidade').value = sala.capacidade;
        document.getElementById('salaForm').dataset.salaId = id;
    }
}

// Funções para manipular Sessões
// Função para carregar salas e filmes e preencher os selects na página de sessões
function carregarSalasEFilmes() {
    const salas = getLocalStorageData('salas');
    const filmes = getLocalStorageData('filmes');

    const salaSelect = document.getElementById('salaSelect');
    const filmeSelect = document.getElementById('filmeSelect');

    salas.forEach(sala => {
        const option = document.createElement('option');
        option.value = sala.id;
        option.textContent = `${sala.nome} (Capacidade: ${sala.capacidade})`;
        salaSelect.appendChild(option);
    });

    filmes.forEach(filme => {
        const option = document.createElement('option');
        option.value = filme.id;
        option.textContent = `${filme.titulo} (${filme.duracao} min)`;
        filmeSelect.appendChild(option);
    });
}

// Chama a função ao carregar a página de sessão
document.addEventListener('DOMContentLoaded', () => {
    carregarSalasEFilmes();
    carregarSessoes();
    carregarSalas();
});

// Função para carregar as sessões e exibi-las na página
function carregarSessoes() {
    const sessoes = getLocalStorageData('sessoes');
    const salas = getLocalStorageData('salas');
    const filmes = getLocalStorageData('filmes');
    const listaSessoes = document.getElementById('listaSessoes');

    listaSessoes.innerHTML = ''; // Limpa o conteúdo antes de carregar as sessões

    if (sessoes.length === 0) {
        listaSessoes.innerHTML = '<p>Nenhuma sessão registrada.</p>';
        return;
    }

    sessoes.forEach(sessao => {
        const sala = salas.find(sala => sala.id == sessao.salaId);
        const filme = filmes.find(filme => filme.id == sessao.filmeId);

        if (!sala || !filme) {
            console.error('Sala ou filme não encontrado para a sessão:', sessao);
            return;
        }

        const sessaoDiv = document.createElement('div');
        sessaoDiv.className = 'sessao';

        sessaoDiv.innerHTML = `
            <h4>${filme.titulo} - ${filme.duracao} min</h4>
            <p>Sala: ${sala.nome} (Capacidade: ${sala.capacidade})</p>
            <p>Horário: ${sessao.horario}</p>
            <button onclick="comprarIngresso(${sessao.id})">Comprar Ingresso</button>
        `;

        listaSessoes.appendChild(sessaoDiv);
    });
}

// Função para adicionar uma nova sessão
function adicionarSessao() {
    const sessoes = getLocalStorageData('sessoes');

    const novaSessao = {
        id: Date.now(),
        salaId: document.getElementById('salaSelect').value,
        filmeId: document.getElementById('filmeSelect').value,
        horario: document.getElementById('horarioSessao').value
    };

    sessoes.push(novaSessao);
    saveLocalStorageData('sessoes', sessoes);

    alert('Sessão adicionada com sucesso!');
    carregarSessoes(); // Recarrega a lista de sessões após adicionar uma nova
}

// Funções para manipular Ingressos
function comprarIngresso() {
    const sessaoId = document.getElementById('sessao').value;
    const clienteId = document.getElementById('cliente').value;
    const valor = document.getElementById('valor').value;

    if (sessaoId && clienteId && valor) {
        const ingressos = getLocalStorageData('ingressos');
        ingressos.push({ id: Date.now(), sessaoId, clienteId, valor });
        saveLocalStorageData('ingressos', ingressos);
        listarIngressos();
        document.getElementById('ingressoForm').reset();
    }
}

function listarIngressos() {
    const ingressos = getLocalStorageData('ingressos');
    const sessoes = getLocalStorageData('sessoes');
    const clientes = getLocalStorageData('clientes');
    const listaIngressos = document.getElementById('listaIngressos');
    listaIngressos.innerHTML = '';

    ingressos.forEach(ingresso => {
        const sessao = sessoes.find(s => s.id === parseInt(ingresso.sessaoId)) || {};
        const cliente = clientes.find(c => c.id === parseInt(ingresso.clienteId)) || {};
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${cliente.nomeCliente || 'Cliente Desconhecido'}</strong> - Sessão: ${sessao.dataHora || 'Sessão Desconhecida'} - Valor: R$${ingresso.valor}
        `;
        listaIngressos.appendChild(li);
    });
}

// Funções para manipular Clientes
function cadastrarCliente() {
    const nomeCliente = document.getElementById('nomeCliente').value;
    const cpfCliente = document.getElementById('cpfCliente').value;
    const emailCliente = document.getElementById('emailCliente').value;

    if (nomeCliente && cpfCliente && emailCliente) {
        const clientes = getLocalStorageData('clientes');
        clientes.push({ id: Date.now(), nomeCliente, cpfCliente, emailCliente });
        saveLocalStorageData('clientes', clientes);
        listarClientes();
        document.getElementById('clienteForm').reset();
    }
}

function editarCliente() {
    const nomeCliente = document.getElementById('nomeCliente').value;
    const cpfCliente = document.getElementById('cpfCliente').value;
    const emailCliente = document.getElementById('emailCliente').value;
    const clientes = getLocalStorageData('clientes');
    const clienteId = parseInt(document.getElementById('clienteForm').dataset.clienteId);

    const cliente = clientes.find(c => c.id === clienteId);
    if (cliente) {
        cliente.nomeCliente = nomeCliente;
        cliente.cpfCliente = cpfCliente;
        cliente.emailCliente = emailCliente;
        saveLocalStorageData('clientes', clientes);
        listarClientes();
        document.getElementById('clienteForm').reset();
        delete document.getElementById('clienteForm').dataset.clienteId;
    }
}

function removerCliente(id) {
    let clientes = getLocalStorageData('clientes');
    clientes = clientes.filter(cliente => cliente.id !== id);
    saveLocalStorageData('clientes', clientes);
    listarClientes();
}

function listarClientes() {
    const clientes = getLocalStorageData('clientes');
    const listaClientes = document.getElementById('listaClientes');
    listaClientes.innerHTML = '';

    clientes.forEach(cliente => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${cliente.nomeCliente}</strong> - CPF: ${cliente.cpfCliente} - Email: ${cliente.emailCliente}
            <button onclick="preencherCliente(${cliente.id})">Editar</button>
            <button onclick="removerCliente(${cliente.id})">Remover</button>
        `;
        listaClientes.appendChild(li);
    });
}

function preencherCliente(id) {
    const clientes = getLocalStorageData('clientes');
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
        document.getElementById('nomeCliente').value = cliente.nomeCliente;
        document.getElementById('cpfCliente').value = cliente.cpfCliente;
        document.getElementById('emailCliente').value = cliente.emailCliente;
        document.getElementById('clienteForm').dataset.clienteId = id;
    }
}

// Funções para Contato
function enviarContato() {
    const nomeContato = document.getElementById('nomeContato').value;
    const emailContato = document.getElementById('emailContato').value;
    const mensagemContato = document.getElementById('mensagemContato').value;

    if (nomeContato && emailContato && mensagemContato) {
        alert('Mensagem enviada com sucesso!');
        document.getElementById('contatoForm').reset();
    }
}

// Inicializar Listas ao Carregar Página
window.onload = function() {
    listarFilmes();
    listarSalas();
    listarSessoes();
    listarIngressos();
    listarClientes();
}