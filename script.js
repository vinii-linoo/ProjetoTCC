document.addEventListener('DOMContentLoaded', function() {
    // Funções de login (se necessário)
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
    const tipoItemInput = document.getElementById('tipoItem');
    const detalhesItemInput = document.getElementById('detalhesItem');
    const codigoInput = document.getElementById('codigo');
    const empresaInput = document.getElementById('empresa');
    const dataInput = document.getElementById('data');
    const deleteItemButton = document.getElementById('deleteItemButton');
    const itemParaExcluirSelect = document.getElementById('itemParaExcluir');
    
    // Variáveis para cadastro de itens
    const tipoItemCadastro = document.getElementById('tipoItemCadastro');
    const epiFields = document.getElementById('epiFields');
    const materialFields = document.getElementById('materialFields');
    const caEpi = document.getElementById('caEpi');
    const tamanhoEpi = document.getElementById('tamanhoEpi');
    const tipoMaterial = document.getElementById('tipoMaterial');
    const dimensoesMaterial = document.getElementById('dimensoesMaterial');
    const empresaCadastro = document.getElementById('empresaCadastro');

    // Configurações iniciais
    dataInput.min = '2025-01-01';
    dataInput.max = '2026-01-01';
    dataInput.valueAsDate = new Date();

    // Mostrar/ocultar campos de EPI ou Material conforme seleção
    tipoItemCadastro.addEventListener('change', function() {
        const tipoSelecionado = this.value;
        
        epiFields.style.display = 'none';
        materialFields.style.display = 'none';
        
        if (tipoSelecionado === 'EPI') {
            epiFields.style.display = 'block';
        } else if (tipoSelecionado === 'Material') {
            materialFields.style.display = 'block';
        }
    });

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
            // Resetar campos ao mostrar a tela de cadastro
            tipoItemCadastro.value = '';
            epiFields.style.display = 'none';
            materialFields.style.display = 'none';
        }
        
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
            tipoItemInput.value = itemSelecionado.tipoItem;
            codigoInput.value = itemSelecionado.codigo;
            
            // Preencher o select de empresa
            empresaInput.innerHTML = `<option value="${itemSelecionado.empresa}">${itemSelecionado.empresa}</option>`;
            
            // Preencher detalhes conforme o tipo de item
            if (itemSelecionado.tipoItem === 'EPI') {
                detalhesItemInput.value = `CA: ${itemSelecionado.ca}, Tamanho: ${itemSelecionado.tamanho}`;
            } else if (itemSelecionado.tipoItem === 'Material') {
                detalhesItemInput.value = `Tipo: ${itemSelecionado.tipoMaterial}, Dimensões: ${itemSelecionado.dimensoes}`;
            }
        } else {
            estoqueAtualInput.value = '';
            tipoItemInput.value = '';
            detalhesItemInput.value = '';
            codigoInput.value = '';
            empresaInput.innerHTML = '<option value="">Selecione um produto primeiro</option>';
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
            tipoItemInput.value = '';
            detalhesItemInput.value = '';
            codigoInput.value = '';
            empresaInput.innerHTML = '<option value="">Selecione um produto primeiro</option>';
        } else if (selectedValue === 'cadastro') {
            const nomeProdutoCadastro = document.getElementById('nomeProdutoCadastro').value;
            const tipoItem = document.getElementById('tipoItemCadastro').value;
            const codigo = document.getElementById('codigoCadastro').value;
            const empresa = document.getElementById('empresaCadastro').value;
            const estoqueAtual = parseInt(document.getElementById('estoqueAtualCadastro').value);
            const estoqueCritico = parseInt(document.getElementById('estoqueCritico').value);
            const estoqueSeguranca = parseInt(document.getElementById('estoqueSeguranca').value);
            const estoqueMaximo = parseInt(document.getElementById('estoqueMaximo').value);
            const estoqueMinimo = parseInt(document.getElementById('estoqueMinimo').value);

            // Validações básicas
            if (!nomeProdutoCadastro || !tipoItem || !codigo || !empresa) {
                alert('Por favor, preencha todos os campos obrigatórios!');
                return;
            }

            // Objeto base do item
            const item = {
                nomeProduto: nomeProdutoCadastro,
                tipoItem: tipoItem,
                codigo: codigo,
                empresa: empresa,
                estoqueAtual: estoqueAtual,
                estoqueCritico: estoqueCritico,
                estoqueSeguranca: estoqueSeguranca,
                estoqueMaximo: estoqueMaximo,
                estoqueMinimo: estoqueMinimo
            };

            // Adiciona campos específicos conforme o tipo
            if (tipoItem === 'EPI') {
                item.ca = document.getElementById('caEpi').value;
                item.tamanho = document.getElementById('tamanhoEpi').value;
                
                if (!item.ca) {
                    alert('Por favor, informe o CA do EPI!');
                    return;
                }
            } else if (tipoItem === 'Material') {
                item.tipoMaterial = document.getElementById('tipoMaterial').value;
                item.dimensoes = document.getElementById('dimensoesMaterial').value;
                
                if (!item.tipoMaterial) {
                    alert('Por favor, informe o tipo de material!');
                    return;
                }
                
                // Validação do formato das dimensões
                const dimensoesPattern = /^\d+,\d+x\d+,\d+$/;
                if (!dimensoesPattern.test(item.dimensoes)) {
                    alert('Por favor, insira as dimensões no formato correto (ex: 1,25x1,50)');
                    return;
                }
            }

            // Salvar item no localStorage
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
            tipoItemCadastro.value = '';
            epiFields.style.display = 'none';
            materialFields.style.display = 'none';
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
            
            let detalhes = '';
            if (item.tipoItem === 'EPI') {
                detalhes = `CA: ${item.ca}, Tamanho: ${item.tamanho}`;
            } else if (item.tipoItem === 'Material') {
                detalhes = `Tipo: ${item.tipoMaterial}, Dimensões: ${item.dimensoes}`;
            }
            
            li.textContent = `${item.nomeProduto}: ${item.estoqueAtual} unidades (${detalhes}) - Empresa: ${item.empresa}`;
            listaEstoque.appendChild(li);
        });
    }

    // Inicialização
    atualizarListaMovimentacoes();
    toggleContent();
});