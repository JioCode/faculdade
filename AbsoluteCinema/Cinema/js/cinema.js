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
    const titulo = document.getElementById('titulo').value;
    const classificacao = document.getElementById('classificacao').value;
    const genero = document.getElementById('genero').value;

    if (titulo && classificacao && genero) {
        const filmes = getLocalStorageData('filmes');
        filmes.push({ id: Date.now(), titulo, classificacao, genero });
        saveLocalStorageData('filmes', filmes);
        listarFilmes();
        document.getElementById('filmeForm').reset();
    }
}

function editarFilme() {
    const titulo = document.getElementById('titulo').value;
    const classificacao = document.getElementById('classificacao').value;
    const genero = document.getElementById('genero').value;
    const filmes = getLocalStorageData('filmes');
    const filmeId = parseInt(document.getElementById('filmeForm').dataset.filmeId);

    const filme = filmes.find(f => f.id === filmeId);
    if (filme) {
        filme.titulo = titulo;
        filme.classificacao = classificacao;
        filme.genero = genero;
        saveLocalStorageData('filmes', filmes);
        listarFilmes();
        document.getElementById('filmeForm').reset();
        delete document.getElementById('filmeForm').dataset.filmeId;
    }
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
    const nomeSala = document.getElementById('nomeSala').value;
    const capacidade = document.getElementById('capacidade').value;

    if (nomeSala && capacidade) {
        const salas = getLocalStorageData('salas');
        salas.push({ id: Date.now(), nomeSala, capacidade });
        saveLocalStorageData('salas', salas);
        listarSalas();
        document.getElementById('salaForm').reset();
    }
}

function editarSala() {
    const nomeSala = document.getElementById('nomeSala').value;
    const capacidade = document.getElementById('capacidade').value;
    const salas = getLocalStorageData('salas');
    const salaId = parseInt(document.getElementById('salaForm').dataset.salaId);

    const sala = salas.find(s => s.id === salaId);
    if (sala) {
        sala.nomeSala = nomeSala;
        sala.capacidade = capacidade;
        saveLocalStorageData('salas', salas);
        listarSalas();
        document.getElementById('salaForm').reset();
        delete document.getElementById('salaForm').dataset.salaId;
    }
}

function removerSala(id) {
    let salas = getLocalStorageData('salas');
    salas = salas.filter(sala => sala.id !== id);
    saveLocalStorageData('salas', salas);
    listarSalas();
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
function adicionarSessao() {
    const filmeId = document.getElementById('filme').value;
    const salaId = document.getElementById('sala').value;
    const dataHora = document.getElementById('dataHora').value;

    if (filmeId && salaId && dataHora) {
        const sessoes = getLocalStorageData('sessoes');
        sessoes.push({ id: Date.now(), filmeId, salaId, dataHora });
        saveLocalStorageData('sessoes', sessoes);
        listarSessoes();
        document.getElementById('sessaoForm').reset();
    }
}

function editarSessao() {
    const filmeId = document.getElementById('filme').value;
    const salaId = document.getElementById('sala').value;
    const dataHora = document.getElementById('dataHora').value;
    const sessoes = getLocalStorageData('sessoes');
    const sessaoId = parseInt(document.getElementById('sessaoForm').dataset.sessaoId);

    const sessao = sessoes.find(s => s.id === sessaoId);
    if (sessao) {
        sessao.filmeId = filmeId;
        sessao.salaId = salaId;
        sessao.dataHora = dataHora;
        saveLocalStorageData('sessoes', sessoes);
        listarSessoes();
        document.getElementById('sessaoForm').reset();
        delete document.getElementById('sessaoForm').dataset.sessaoId;
    }
}

function removerSessao(id) {
    let sessoes = getLocalStorageData('sessoes');
    sessoes = sessoes.filter(sessao => sessao.id !== id);
    saveLocalStorageData('sessoes', sessoes);
    listarSessoes();
}

function listarSessoes() {
    const sessoes = getLocalStorageData('sessoes');
    const filmes = getLocalStorageData('filmes');
    const salas = getLocalStorageData('salas');
    const listaSessoes = document.getElementById('listaSessoes');
    listaSessoes.innerHTML = '';

    sessoes.forEach(sessao => {
        const filme = filmes.find(f => f.id === parseInt(sessao.filmeId)) || {};
        const sala = salas.find(s => s.id === parseInt(sessao.salaId)) || {};
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${filme.titulo || 'Filme Desconhecido'}</strong> - Sala: ${sala.nomeSala || 'Sala Desconhecida'} - Data/Hora: ${new Date(sessao.dataHora).toLocaleString()}
            <button onclick="preencherSessao(${sessao.id})">Editar</button>
            <button onclick="removerSessao(${sessao.id})">Remover</button>
        `;
        listaSessoes.appendChild(li);
    });
}

function preencherSessao(id) {
    const sessoes = getLocalStorageData('sessoes');
    const sessao = sessoes.find(s => s.id === id);
    if (sessao) {
        document.getElementById('filme').value = sessao.filmeId;
        document.getElementById('sala').value = sessao.salaId;
        document.getElementById('dataHora').value = sessao.dataHora;
        document.getElementById('sessaoForm').dataset.sessaoId = id;
    }
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
