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
document.addEventListener('DOMContentLoaded', function () {
    const formMovimentacao = document.getElementById('cadastroMovimentacaoForm');
    const formCadastroItem = document.getElementById('cadastroItemForm');
    const listaMovimentacoes = document.getElementById('listaMovimentacoes');
    const listaEstoque = document.getElementById('listaEstoque');
    const saveButton = document.getElementById('saveButton');
    const mainContent = document.getElementById('mainContent');
    const movimentacaoForm = document.getElementById('movimentacaoForm');
    const estoqueContent = document.getElementById('estoqueContent');
    const cadastroItemContent = document.getElementById('cadastroItemContent');
    const radioButtons = document.querySelectorAll('input[name="registro"]');
    const selectProduto = document.getElementById('nomeProdutoMovimentacao');
    const estoqueAtualInput = document.getElementById('estoqueAtual');
    const tipoMaterialInput = document.getElementById('tipoMaterial');
    const codigoInput = document.getElementById('codigo');
    const empresaInput = document.getElementById('empresa');

    // Função para alternar entre as telas
    function toggleContent() {
        const selectedValue = document.querySelector('input[name="registro"]:checked').value;
        movimentacaoForm.style.display = 'none';
        estoqueContent.style.display = 'none';
        cadastroItemContent.style.display = 'none';

        if (selectedValue === 'entrada' || selectedValue === 'saida') {
            movimentacaoForm.style.display = 'block';
            carregarProdutosNoSelect();
        } else if (selectedValue === 'estoque') {
            estoqueContent.style.display = 'block';
            atualizarEstoque();
        } else if (selectedValue === 'cadastro') {
            cadastroItemContent.style.display = 'block';
        }
    }

    // Adicionar evento de mudança aos botões de rádio
    radioButtons.forEach(radio => {
        radio.addEventListener('change', toggleContent);
    });

    // Carregar produtos no select de movimentação
    function carregarProdutosNoSelect() {
        selectProduto.innerHTML = '<option value="">Selecione um produto</option>';
        const itens = JSON.parse(localStorage.getItem('itens')) || [];
        itens.forEach(item => {
            const option = document.createElement('option');
            option.value = item.nomeProduto;
            option.textContent = item.nomeProduto;
            selectProduto.appendChild(option);
        });
    }

    // Preencher campos ao selecionar um produto
    selectProduto.addEventListener('change', function () {
        const nomeProduto = selectProduto.value;
        const itens = JSON.parse(localStorage.getItem('itens')) || [];
        const itemSelecionado = itens.find(item => item.nomeProduto === nomeProduto);

        if (itemSelecionado) {
            estoqueAtualInput.value = itemSelecionado.estoqueAtual;
            tipoMaterialInput.value = itemSelecionado.tipoMaterial;
            codigoInput.value = itemSelecionado.codigo;
            empresaInput.value = itemSelecionado.empresa;
        } else {
            estoqueAtualInput.value = '';
            tipoMaterialInput.value = '';
            codigoInput.value = '';
            empresaInput.value = '';
        }
    });

    // Salvar movimentação ou cadastro de item
    saveButton.addEventListener('click', function (event) {
        event.preventDefault();
        const selectedValue = document.querySelector('input[name="registro"]:checked').value;

        if (selectedValue === 'entrada' || selectedValue === 'saida') {
            const nomeProduto = selectProduto.value;
            const quantidade = parseInt(document.getElementById('quantidade').value);
            const data = document.getElementById('data').value;

            const movimentacao = {
                registro: selectedValue,
                nomeProduto,
                quantidade,
                data
            };

            // Atualizar estoque do item
            const itens = JSON.parse(localStorage.getItem('itens')) || [];
            const itemIndex = itens.findIndex(item => item.nomeProduto === nomeProduto);
            if (itemIndex !== -1) {
                if (selectedValue === 'entrada') {
                    itens[itemIndex].estoqueAtual += quantidade;
                } else if (selectedValue === 'saida') {
                    itens[itemIndex].estoqueAtual -= quantidade;
                }
                localStorage.setItem('itens', JSON.stringify(itens));
            }

            // Salvar movimentação no localStorage
            let movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];
            movimentacoes.push(movimentacao);
            localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));

            // Atualizar lista de movimentações
            atualizarListaMovimentacoes();

            // Limpar formulário
            formMovimentacao.reset();
        } else if (selectedValue === 'cadastro') {
            const nomeProdutoCadastro = document.getElementById('nomeProdutoCadastro').value;
            const tipoMaterial = document.getElementById('tipoMaterialCadastro').value;
            const codigo = document.getElementById('codigoCadastro').value;
            const empresa = document.getElementById('empresaCadastro').value;
            const estoqueAtual = parseInt(document.getElementById('estoqueAtualCadastro').value);
            const estoqueCritico = parseInt(document.getElementById('estoqueCritico').value);
            const estoqueSeguranca = parseInt(document.getElementById('estoqueSeguranca').value);
            const estoqueMaximo = parseInt(document.getElementById('estoqueMaximo').value);
            const estoqueMinimo = parseInt(document.getElementById('estoqueMinimo').value);

            const item = {
                nomeProduto: nomeProdutoCadastro,
                tipoMaterial,
                codigo,
                empresa,
                estoqueAtual,
                estoqueCritico,
                estoqueSeguranca,
                estoqueMaximo,
                estoqueMinimo
            };

            // Salvar item no localStorage
            let itens = JSON.parse(localStorage.getItem('itens')) || [];
            itens.push(item);
            localStorage.setItem('itens', JSON.stringify(itens));

            // Limpar formulário
            formCadastroItem.reset();
        }
    });

    // Atualizar lista de movimentações
    function atualizarListaMovimentacoes() {
        listaMovimentacoes.innerHTML = '';
        const movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];
        movimentacoes.forEach((mov, index) => {
            const li = document.createElement('li');
            li.textContent = `${mov.registro.toUpperCase()}: ${mov.nomeProduto} - Quantidade: ${mov.quantidade} em ${mov.data}`;
            listaMovimentacoes.appendChild(li);
        });
    }

    // Atualizar estoque
    function atualizarEstoque() {
        listaEstoque.innerHTML = '';
        const itens = JSON.parse(localStorage.getItem('itens')) || [];
        itens.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.nomeProduto}: ${item.estoqueAtual} unidades`;
            listaEstoque.appendChild(li);
        });
    }

    // Carregar movimentações e estoque ao iniciar
    atualizarListaMovimentacoes();
    toggleContent(); // Exibir o conteúdo correto com base na seleção inicial
});