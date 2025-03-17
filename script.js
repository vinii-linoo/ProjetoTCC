document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Função para validar e-mail
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Lógica para o formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Verifica se o e-mail existe no localStorage
            const user = JSON.parse(localStorage.getItem(email));

            if (user && user.password === password) {
                alert('Login bem-sucedido!');
                window.location.href = 'movimentacao.html'; // Redireciona para a página inicial
            } else {
                alert('E-mail ou senha incorretos.');
            }
        });
    }

    // Lógica para o formulário de registro
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const newUsername = document.getElementById('newUsername').value;
            const newEmail = document.getElementById('newEmail').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validação de e-mail
            if (!validateEmail(newEmail)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }

            // Validação de senha
            if (newPassword !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }

            // Verifica se o e-mail já está cadastrado
            if (localStorage.getItem(newEmail)) {
                alert('E-mail já cadastrado!');
            } else {
                // Armazena o novo usuário no localStorage
                localStorage.setItem(newEmail, JSON.stringify({
                    username: newUsername,
                    password: newPassword
                }));
                alert('Registro bem-sucedido!');
                window.location.href = 'login.html'; // Redireciona para a página de login
            }
        });
    }
});


document.getElementById('saveButton').addEventListener('click', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    // Captura dos valores dos campos
    const tipoMovimentacao = document.querySelector('input[name="registro"]:checked').value;
    const nomeProduto = document.getElementById('nomeProduto').value;
    const estoqueAtual = document.getElementById('estoqueAtual').value;
    const tipoMaterial = document.getElementById('tipoMaterial').value;
    const codigo = document.getElementById('codigo').value;
    const empresa = document.getElementById('empresa').value; // CNPJ da empresa
    const quantidade = document.getElementById('quantidade').value;
    const data = document.getElementById('data').value;
    const estoqueCritico = document.getElementById('estoqueCritico').value;
    const estoqueSeguranca = document.getElementById('estoqueSeguranca').value;
    const estoqueMaximo = document.getElementById('estoqueMaximo').value;
    const estoqueMinimo = document.getElementById('estoqueMinimo').value;

    // Validação básica
    if (!nomeProduto || !tipoMaterial || !codigo || !quantidade || !data || !empresa) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Criando o objeto de movimentação
    const movimentacao = {
        tipoMovimentacao,
        nomeProduto,
        estoqueAtual,
        tipoMaterial, // Tipo do material (ex: Aço)
        codigo,
        empresa, // CNPJ da empresa
        quantidade,
        data,
        estoqueCritico,
        estoqueSeguranca,
        estoqueMaximo,
        estoqueMinimo
    };

    // Salvar no localStorage
    salvarMovimentacao(movimentacao);

    // Limpar o formulário após o salvamento
    document.querySelector('form').reset();

    // Atualizar a lista de movimentações
    carregarMovimentacoes();
});

function salvarMovimentacao(movimentacao) {
    // Recupera as movimentações salvas ou inicializa um array vazio
    let movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];

    // Adiciona a nova movimentação ao array
    movimentacoes.push(movimentacao);

    // Salva o array atualizado no localStorage
    localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));
}

function carregarMovimentacoes() {
    // Recupera as movimentações salvas
    const movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];

    // Limpa a lista atual
    const listaMovimentacoes = document.getElementById('listaMovimentacoes');
    listaMovimentacoes.innerHTML = '';

    // Adiciona cada movimentação à lista
    movimentacoes.forEach((mov, index) => {
        const itemLista = document.createElement('li');
        itemLista.textContent = `Movimentação ${index + 1}: ${mov.tipoMovimentacao} - ${mov.nomeProduto} - ${mov.tipoMaterial} (${mov.quantidade} unidades em ${mov.data}) - Empresa: ${mov.empresa}`;
        listaMovimentacoes.appendChild(itemLista);
    });
}

// Carrega as movimentações ao carregar a página
window.onload = carregarMovimentacoes;