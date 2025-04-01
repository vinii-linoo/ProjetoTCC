document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const user = JSON.parse(localStorage.getItem(email));

            if (user && user.password === password) {
                alert('Login bem-sucedido!');
                window.location.href = 'movimentacao.html';
            } else {
                alert('E-mail ou senha incorretos.');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const newUsername = document.getElementById('newUsername').value;
            const newEmail = document.getElementById('newEmail').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!validateEmail(newEmail)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }

            if (localStorage.getItem(newEmail)) {
                alert('E-mail já cadastrado!');
            } else {
                localStorage.setItem(newEmail, JSON.stringify({
                    username: newUsername,
                    password: newPassword
                }));
                alert('Registro bem-sucedido!');
                window.location.href = 'login.html';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Variáveis do sistema principal
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
    const dataInput = document.getElementById('data');
    const deleteItemButton = document.getElementById('deleteItemButton');
    const itemParaExcluirSelect = document.getElementById('itemParaExcluir');

    // Configurações iniciais
    dataInput.min = '2025-01-01';
    dataInput.max = '2026-01-01';
    dataInput.valueAsDate = new Date();

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
        
        // Sempre carrega os itens para exclusão
        carregarItensParaExclusao();
    }

    // Eventos dos botões de rádio
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

    // Carregar itens no select de exclusão
    function carregarItensParaExclusao() {
        itemParaExcluirSelect.innerHTML = '<option value="">Selecione um item</option>';
        const itens = JSON.parse(localStorage.getItem('itens')) || [];
        itens.forEach(item => {
            const option = document.createElement('option');
            option.value = item.nomeProduto;
            option.textContent = item.nomeProduto;
            itemParaExcluirSelect.appendChild(option);
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

    // Validar data
    function validarData(data) {
        if (!data) {
            alert('Por favor, selecione uma data!');
            return false;
        }

        const dataSelecionada = new Date(data);
        const dataMinima = new Date('2025-01-01');
        const dataMaxima = new Date('2026-01-01');

        if (dataSelecionada < dataMinima || dataSelecionada > dataMaxima) {
            alert('A data deve estar entre 01/01/2025 e 01/01/2026!');
            return false;
        }

        return true;
    }

    // Salvar movimentação ou cadastro de item
    saveButton.addEventListener('click', function (event) {
        event.preventDefault();
        const selectedValue = document.querySelector('input[name="registro"]:checked').value;

        if (selectedValue === 'entrada' || selectedValue === 'saida') {
            const nomeProduto = selectProduto.value;
            const quantidade = parseInt(document.getElementById('quantidade').value);
            const data = document.getElementById('data').value;

            if (!nomeProduto) {
                alert('Por favor, selecione um produto!');
                return;
            }

            if (!quantidade || quantidade <= 0) {
                alert('Por favor, insira uma quantidade válida!');
                return;
            }

            if (!validarData(data)) {
                return;
            }

            const movimentacao = {
                registro: selectedValue,
                nomeProduto,
                quantidade,
                data
            };

            // Atualizar estoque
            const itens = JSON.parse(localStorage.getItem('itens')) || [];
            const itemIndex = itens.findIndex(item => item.nomeProduto === nomeProduto);
            if (itemIndex !== -1) {
                if (selectedValue === 'entrada') {
                    itens[itemIndex].estoqueAtual += quantidade;
                } else if (selectedValue === 'saida') {
                    if (itens[itemIndex].estoqueAtual < quantidade) {
                        alert('Estoque insuficiente para esta saída!');
                        return;
                    }
                    itens[itemIndex].estoqueAtual -= quantidade;
                }
                localStorage.setItem('itens', JSON.stringify(itens));
            }

            // Salvar movimentação
            let movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];
            movimentacoes.push(movimentacao);
            localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));

            // Atualizar listas
            atualizarListaMovimentacoes();
            carregarProdutosNoSelect();
            carregarItensParaExclusao();

            // Limpar formulário
            document.getElementById('quantidade').value = '';
            selectProduto.value = '';
            estoqueAtualInput.value = '';
            tipoMaterialInput.value = '';
            codigoInput.value = '';
            empresaInput.value = '';
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

            if (!nomeProdutoCadastro || !tipoMaterial || !codigo || !empresa) {
                alert('Por favor, preencha todos os campos obrigatórios!');
                return;
            }

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

            // Salvar item
            let itens = JSON.parse(localStorage.getItem('itens')) || [];
            
            const itemExistente = itens.find(item => item.nomeProduto === nomeProdutoCadastro);
            if (itemExistente) {
                alert('Este produto já está cadastrado!');
                return;
            }
            
            itens.push(item);
            localStorage.setItem('itens', JSON.stringify(itens));

            // Limpar e atualizar
            formCadastroItem.reset();
            carregarProdutosNoSelect();
            carregarItensParaExclusao();
            alert('Item cadastrado com sucesso!');
        }
    });

    // Excluir item
    deleteItemButton.addEventListener('click', function() {
        const nomeProduto = itemParaExcluirSelect.value;
        
        if (!nomeProduto) {
            alert('Por favor, selecione um item para excluir!');
            return;
        }
        
        if (confirm(`Tem certeza que deseja excluir o item "${nomeProduto}"? Esta ação não pode ser desfeita.`)) {
            // Remover o item
            let itens = JSON.parse(localStorage.getItem('itens')) || [];
            itens = itens.filter(item => item.nomeProduto !== nomeProduto);
            localStorage.setItem('itens', JSON.stringify(itens));
            
            // Remover movimentações
            let movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];
            movimentacoes = movimentacoes.filter(mov => mov.nomeProduto !== nomeProduto);
            localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));
            
            // Atualizar tudo
            carregarItensParaExclusao();
            carregarProdutosNoSelect();
            atualizarEstoque();
            atualizarListaMovimentacoes();
            
            alert(`Item "${nomeProduto}" excluído com sucesso!`);
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
            
            if (item.estoqueAtual <= item.estoqueCritico) {
                li.classList.add('estoque-critico');
            }
            
            li.textContent = `${item.nomeProduto}: ${item.estoqueAtual} unidades (Mín: ${item.estoqueMinimo}, Máx: ${item.estoqueMaximo})`;
            listaEstoque.appendChild(li);
        });
    }

    // Inicialização
    atualizarListaMovimentacoes();
    toggleContent();
});
