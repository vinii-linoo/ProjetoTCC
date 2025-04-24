const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showTempMessage(message, redirectUrl = null) {
    // Cria elemento para a mensagem
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.left = '50%';
    messageDiv.style.transform = 'translateX(-50%)';
    messageDiv.style.backgroundColor = '#1f9e9b';
    messageDiv.style.color = 'white';
    messageDiv.style.padding = '15px 25px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    messageDiv.style.zIndex = '1000';
    messageDiv.style.animation = 'fadeIn 0.3s ease-out';
    
    // Adiciona ao body
    document.body.appendChild(messageDiv);
    
    // Remove após 2 segundos
    setTimeout(() => {
        messageDiv.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        }, 300);
    }, 1000);
}

// Adiciona os estilos de animação dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = JSON.parse(localStorage.getItem(email));

        if (user && user.password === password) {
            showTempMessage('Login bem-sucedido!', 'movimentacao.html');
        } else {
            showTempMessage('E-mail ou senha incorretos.');
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
            showTempMessage('Por favor, insira um e-mail válido.');
            return;
        }

        if (newPassword !== confirmPassword) {
            showTempMessage('As senhas não coincidem!');
            return;
        }

        if (localStorage.getItem(newEmail)) {
            showTempMessage('E-mail já cadastrado!');
        } else {
            localStorage.setItem(newEmail, JSON.stringify({
                username: newUsername,
                password: newPassword
            }));
            showTempMessage('Registro bem-sucedido!', 'login.html');
        }
    });
}

// Função auxiliar para alerta + redirecionamento
async function showAlertAndRedirect(message, redirectUrl) {
    showCustomAlert(message);
    
    // Aguarda 1.5 segundos antes de redirecionar
    await new Promise(resolve => setTimeout(resolve, 1500));
    window.location.href = redirectUrl;
}

document.addEventListener('DOMContentLoaded', function() {
    // Variáveis do sistema principal
    const formMovimentacao = document.getElementById('cadastroMovimentacaoForm');
    const formCadastroItem = document.getElementById('cadastroItemForm');
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
    const codigoCadastroInput = document.getElementById('codigoCadastro');
    const pageTitle = document.getElementById('pageTitle');
    
    // Variáveis para cadastro de itens
    const tipoItemCadastro = document.getElementById('tipoItemCadastro');
    const epiFields = document.getElementById('epiFields');
    const materialFields = document.getElementById('materialFields');
    const caEpi = document.getElementById('caEpi');
    const tamanhoEpi = document.getElementById('tamanhoEpi');
    const tipoMaterial = document.getElementById('tipoMaterial');
    const dimensoesMaterial = document.getElementById('dimensoesMaterial');
    
    // Variáveis para o filtro de estoque
    const tipoFiltroEstoque = document.getElementById('tipoFiltroEstoque');
    const campoFiltroEstoque = document.getElementById('campoFiltroEstoque');
    const btnRelatorio = document.getElementById('btnRelatorio');
    
    // Variáveis para o filtro de movimentações
    const filtroTipoMovimentacao = document.getElementById('filtroTipoMovimentacao');
    const filtroMovimentacao = document.getElementById('filtroMovimentacao');
    const btnLimparFiltros = document.getElementById('btnLimparFiltros');

    // Configurações iniciais
    dataInput.min = '2025-01-01';
    dataInput.max = '2026-01-01';
    dataInput.valueAsDate = new Date();

    // Função para mostrar alerta personalizado
    function showCustomAlert(message) {
        const alert = document.getElementById('customAlert');
        const alertMessage = document.getElementById('customAlertMessage');
        const closeButton = document.querySelector('.custom-alert-close');
        
        alertMessage.innerHTML = message;
        alert.style.display = 'block';
        
        const timer = setTimeout(() => {
            hideCustomAlert();
        }, 5000);
        
        closeButton.onclick = function() {
            clearTimeout(timer);
            hideCustomAlert();
        };
        
        document.querySelector('.custom-alert-timer').style.animation = 'none';
        void document.querySelector('.custom-alert-timer').offsetWidth;
        document.querySelector('.custom-alert-timer').style.animation = 'timer 5s linear forwards';
    }

    function hideCustomAlert() {
        const alert = document.getElementById('customAlert');
        alert.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            alert.style.display = 'none';
            alert.style.animation = 'slideIn 0.3s ease-out';
        }, 300);
    }
    
    function showSucessAlert(message) {
        const alert = document.getElementById('sucessAlert');
        const alertMessage = document.getElementById('sucessAlertMessage');
        const closeButton = document.querySelector('.sucess-alert-close');
        
        alertMessage.innerHTML = message;
        alert.style.display = 'block';
        
        const timer = setTimeout(() => {
            hideSucessAlert();
        }, 5000);
        
        closeButton.onclick = function() {
            clearTimeout(timer);
            hideSucessAlert();
        };
        
        document.querySelector('.sucess-alert-timer').style.animation = 'none';
        void document.querySelector('.sucess-alert-timer').offsetWidth;
        document.querySelector('.sucess-alert-timer').style.animation = 'timer 5s linear forwards';
    }
    
    function hideSucessAlert() {
        const alert = document.getElementById('sucessAlert');
        alert.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            alert.style.display = 'none';
            alert.style.animation = 'slideIn 0.3s ease-out';
        }, 300);
    }

    // Função para confirm personalizado
    function showCustomConfirm(message, callback) {
        const confirmBox = document.getElementById('customConfirm');
        const confirmMessage = document.getElementById('customConfirmMessage');
        const confirmYes = document.getElementById('confirmYes');
        const confirmNo = document.getElementById('confirmNo');

        confirmMessage.textContent = message;
        confirmBox.style.display = 'block';

        confirmYes.onclick = function() {
            confirmBox.style.display = 'none';
            callback(true);
        };

        confirmNo.onclick = function() {
            confirmBox.style.display = 'none';
            callback(false);
        };
    }

    function limparCamposMovimentacao() {
        document.getElementById('quantidade').value = '';
        selectProduto.value = '';
        estoqueAtualInput.value = '';
        tipoItemInput.value = '';
        detalhesItemInput.value = '';
        codigoInput.value = '';
        empresaInput.innerHTML = '<option value="">Selecione uma empresa</option>' +
                                '<option value="Empresa 1 - CNPJ: 12.345.678/0001-00">Empresa 1 - CNPJ: 12.345.678/0001-00</option>' +
                                '<option value="Empresa 2 - CNPJ: 98.765.432/0001-11">Empresa 2 - CNPJ: 98.765.432/0001-11</option>' +
                                '<option value="Empresa 3 - CNPJ: 45.678.901/0001-22">Empresa 3 - CNPJ: 45.678.901/0001-22</option>';
    }

    function atualizarEstoque() {
        const corpoTabela = document.getElementById('corpoTabelaEstoque');
        corpoTabela.innerHTML = '';
        const itens = JSON.parse(localStorage.getItem('itens')) || [];
        
        const tipoFiltro = tipoFiltroEstoque.value;
        const valorFiltro = campoFiltroEstoque.value.toLowerCase();
        
        let totalItens = 0;
        let totalCritico = 0;
        let totalBaixo = 0;
        
        const itensFiltrados = itens.filter(item => {
            if (!tipoFiltro) return true;
            
            if (tipoFiltro === 'codigo') {
                return item.codigo.toLowerCase().includes(valorFiltro);
            } else if (tipoFiltro === 'nome') {
                return item.nomeProduto.toLowerCase().includes(valorFiltro);
            } else if (tipoFiltro === 'tipo') {
                return item.tipoItem.toLowerCase().includes(valorFiltro);
            } else if (tipoFiltro === 'critico') {
                return item.estoqueAtual <= item.estoqueCritico;
            }
            return true;
        });
        
        document.getElementById('semResultados').style.display = 
            itensFiltrados.length === 0 ? 'block' : 'none';
        
        itensFiltrados.forEach(item => {
            totalItens++;
            
            let status, statusClass;
            if (item.estoqueAtual <= item.estoqueCritico) {
                status = 'Crítico';
                statusClass = 'status-critico';
                totalCritico++;
            } else if (item.estoqueAtual <= item.estoqueMinimo) {
                status = 'Baixo';
                statusClass = 'status-baixo';
                totalBaixo++;
            } else {
                status = 'Normal';
                statusClass = 'status-normal';
            }
            
            let detalhes = '';
            if (item.tipoItem === 'EPI') {
                detalhes = `CA: ${item.ca}, Tamanho: ${item.tamanho}`;
            } else if (item.tipoItem === 'Material') {
                detalhes = `Tipo: ${item.tipoMaterial}, Dimensões: ${item.dimensoes}`;
            }
            
            const tr = document.createElement('tr');
            if (status === 'Crítico') tr.classList.add('estoque-critico');
            
            tr.innerHTML = `
                <td>${item.codigo}</td>
                <td>${item.nomeProduto}</td>
                <td>${item.tipoItem}</td>
                <td>${item.estoqueAtual}</td>
                <td><span class="estoque-status ${statusClass}">${status}</span></td>
                <td>${detalhes}</td>
                <td>${item.empresa || 'Não informada'}</td>
                <td>
                    <button class="action-button" title="Editar" onclick="editarItem('${item.codigo}')">✏️</button>
                    <button class="action-button" title="Histórico" onclick="verHistorico('${item.codigo}')">📊</button>
                </td>
            `;
            
            corpoTabela.appendChild(tr);
        });
        
        document.getElementById('totalItens').textContent = totalItens;
        document.getElementById('totalCritico').textContent = totalCritico;
        document.getElementById('totalBaixo').textContent = totalBaixo;
    }

    window.editarItem = function(codigo) {
        document.querySelector('input[value="cadastro"]').click();
        
        const itens = JSON.parse(localStorage.getItem('itens')) || [];
        const item = itens.find(i => i.codigo === codigo);
        
        if (item) {
            document.getElementById('codigoCadastro').value = item.codigo;
            document.getElementById('nomeProdutoCadastro').value = item.nomeProduto;
            document.getElementById('tipoItemCadastro').value = item.tipoItem;
            document.getElementById('estoqueAtualCadastro').value = item.estoqueAtual;
            document.getElementById('estoqueCritico').value = item.estoqueCritico;
            document.getElementById('estoqueSeguranca').value = item.estoqueSeguranca;
            document.getElementById('estoqueMaximo').value = item.estoqueMaximo;
            document.getElementById('estoqueMinimo').value = item.estoqueMinimo;
            
            if (item.tipoItem === 'EPI') {
                document.getElementById('caEpi').value = item.ca;
                document.getElementById('tamanhoEpi').value = item.tamanho;
                document.getElementById('epiFields').style.display = 'block';
            } else if (item.tipoItem === 'Material') {
                document.getElementById('tipoMaterial').value = item.tipoMaterial;
                document.getElementById('dimensoesMaterial').value = item.dimensoes;
                document.getElementById('materialFields').style.display = 'block';
            }
            
            showCustomAlert(`Editando item ${item.codigo} - ${item.nomeProduto}`);
        }
    }

    window.verHistorico = function(codigo) {
        const movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];
        const historico = movimentacoes.filter(mov => mov.codigo === codigo);
        
        if (historico.length === 0) {
            showCustomAlert('Nenhuma movimentação encontrada para este item.');
            return;
        }
        
        // Busca o nome do produto para exibir no título
        const itens = JSON.parse(localStorage.getItem('itens')) || [];
        const item = itens.find(i => i.codigo === codigo);
        const nomeProduto = item ? item.nomeProduto : '';
        
        // Atualiza o título da modal
        document.getElementById('historicoModalTitle').textContent = `Histórico: ${codigo} - ${nomeProduto}`;
        
        // Preenche o corpo da tabela
        const tbody = document.getElementById('historicoModalBody');
        tbody.innerHTML = '';
        
        historico.forEach(mov => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatarData(mov.data)}</td>
                <td class="${mov.registro === 'entrada' ? 'movimentacao-entrada' : 'movimentacao-saida'}">
                    ${mov.registro === 'entrada' ? 'Entrada' : 'Saída'}
                </td>
                <td>${mov.quantidade}</td>
                <td>${mov.empresa}</td>
            `;
            tbody.appendChild(tr);
        });
        
        // Exibe a modal
        const modal = document.getElementById('historicoModal');
        modal.style.display = 'flex';
        
        // Fecha a modal ao clicar no X ou fora do conteúdo
        document.querySelector('.modal-close').onclick = function() {
            modal.style.display = 'none';
        };
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    function formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function atualizarListaMovimentacoes() {
        const listaMovimentacoes = document.getElementById('listaMovimentacoes');
        listaMovimentacoes.innerHTML = '';
        const movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];
        
        const tipoFiltro = filtroTipoMovimentacao.value;
        const textoFiltro = filtroMovimentacao.value.toLowerCase();
        
        const movimentacoesFiltradas = movimentacoes.filter(mov => {
            const atendeTipo = !tipoFiltro || mov.registro === tipoFiltro;
            const atendeTexto = !textoFiltro || mov.nomeProduto.toLowerCase().includes(textoFiltro);
            return atendeTipo && atendeTexto;
        });
        
        movimentacoesFiltradas.sort((a, b) => new Date(b.data) - new Date(a.data));
        
        movimentacoesFiltradas.forEach(mov => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatarData(mov.data)}</td>
                <td class="${mov.registro === 'entrada' ? 'movimentacao-entrada' : 'movimentacao-saida'}">
                    ${mov.registro === 'entrada' ? 'Entrada' : 'Saída'}
                </td>
                <td>${mov.codigo}</td>
                <td>${mov.nomeProduto}</td>
                <td>${mov.quantidade}</td>
                <td>${mov.empresa}</td>
            `;
            listaMovimentacoes.appendChild(tr);
        });
    }

    function toggleContent() {
        const selectedValue = document.querySelector('input[name="registro"]:checked').value;
        movimentacaoForm.style.display = 'none';
        estoqueContent.style.display = 'none';
        cadastroItemContent.style.display = 'none';

        switch(selectedValue) {
            case 'entrada':
                pageTitle.textContent = 'Tela de Movimentações - Entrada';
                movimentacaoForm.style.display = 'block';
                carregarProdutosNoSelect();
                break;
            case 'saida':
                pageTitle.textContent = 'Tela de Movimentações - Saída';
                movimentacaoForm.style.display = 'block';
                carregarProdutosNoSelect();
                break;
            case 'estoque':
                pageTitle.textContent = 'Tela de Movimentações - Estoque';
                estoqueContent.style.display = 'block';
                tipoFiltroEstoque.value = '';
                campoFiltroEstoque.value = '';
                campoFiltroEstoque.disabled = true;
                atualizarEstoque();
                break;
            case 'cadastro':
                pageTitle.textContent = 'Tela de Movimentações - Cadastro de Itens';
                cadastroItemContent.style.display = 'block';
                tipoItemCadastro.value = '';
                epiFields.style.display = 'none';
                materialFields.style.display = 'none';
                gerarNovoCodigo();
                break;
        }
        
        carregarItensParaExclusao();
    }

    function gerarNovoCodigo() {
        const itens = JSON.parse(localStorage.getItem('itens')) || [];
        let ultimoCodigo = 0;
        
        itens.forEach(item => {
            const match = item.codigo.match(/\d+/);
            if (match) {
                const codigoNum = parseInt(match[0]);
                if (codigoNum > ultimoCodigo) {
                    ultimoCodigo = codigoNum;
                }
            }
        });
        
        const novoCodigo = (ultimoCodigo + 1).toString().padStart(3, '0');
        codigoCadastroInput.value = novoCodigo;
    }

    radioButtons.forEach(radio => {
        radio.addEventListener('change', toggleContent);
    });

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

    function carregarItensParaExclusao() {
        itemParaExcluirSelect.innerHTML = '<option value="">Selecione um item</option>';
        const itens = JSON.parse(localStorage.getItem('itens')) || [];
        itens.forEach(item => {
            const option = document.createElement('option');
            option.value = item.nomeProduto;
            option.textContent = `${item.codigo} - ${item.nomeProduto}`;
            itemParaExcluirSelect.appendChild(option);
        });
    }

    selectProduto.addEventListener('change', function () {
        const nomeProduto = selectProduto.value;
        const itens = JSON.parse(localStorage.getItem('itens')) || [];
        const itemSelecionado = itens.find(item => item.nomeProduto === nomeProduto);

        if (itemSelecionado) {
            estoqueAtualInput.value = itemSelecionado.estoqueAtual;
            tipoItemInput.value = itemSelecionado.tipoItem;
            codigoInput.value = itemSelecionado.codigo;
            
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
            empresaInput.innerHTML = '<option value="">Selecione uma empresa</option>' +
                                    '<option value="Empresa 1 - CNPJ: 12.345.678/0001-00">Empresa 1 - CNPJ: 12.345.678/0001-00</option>' +
                                    '<option value="Empresa 2 - CNPJ: 98.765.432/0001-11">Empresa 2 - CNPJ: 98.765.432/0001-11</option>' +
                                    '<option value="Empresa 3 - CNPJ: 45.678.901/0001-22">Empresa 3 - CNPJ: 45.678.901/0001-22</option>';
        }
    });

    function validarData(data) {
        if (!data) {
            showCustomAlert('Por favor, selecione uma data!');
            return false;
        }

        const dataSelecionada = new Date(data);
        const dataMinima = new Date('2025-01-01');
        const dataMaxima = new Date('2026-01-01');

        if (dataSelecionada < dataMinima || dataSelecionada > dataMaxima) {
            showCustomAlert('A data deve estar entre 01/01/2025 e 01/01/2026!');
            return false;
        }

        return true;
    }

    saveButton.addEventListener('click', function (event) {
        event.preventDefault();
        const selectedValue = document.querySelector('input[name="registro"]:checked').value;

        if (selectedValue === 'entrada' || selectedValue === 'saida') {
            const nomeProduto = selectProduto.value;
            const empresa = empresaInput.value;
            const quantidade = parseInt(document.getElementById('quantidade').value);
            const data = document.getElementById('data').value;

            if (!nomeProduto) {
                showCustomAlert('Por favor, selecione um produto!');
                return;
            }

            if (!empresa) {
                showCustomAlert('Por favor, selecione uma empresa!');
                return;
            }

            if (!quantidade || quantidade <= 0) {
                showCustomAlert('Por favor, insira uma quantidade válida!');
                return;
            }

            if (!validarData(data)) {
                return;
            }

            const itens = JSON.parse(localStorage.getItem('itens')) || [];
            const itemIndex = itens.findIndex(item => item.nomeProduto === nomeProduto);
            
            if (itemIndex === -1) {
                showCustomAlert('Produto não encontrado!');
                return;
            }

            const item = itens[itemIndex];
            
            if (selectedValue === 'entrada') {
                const novoEstoque = item.estoqueAtual + quantidade;
                
                if (novoEstoque > item.estoqueMaximo) {
                    limparCamposMovimentacao();
                    showCustomAlert(`Não é possível dar entrada de ${quantidade} unidades!<br><br>
                                    Estoque atual: ${item.estoqueAtual} unidades<br>
                                    Estoque máximo permitido: ${item.estoqueMaximo} unidades<br>
                                    Quantidade excedente: ${novoEstoque - item.estoqueMaximo} unidades`);
                    return;
                }
            }

            if (selectedValue === 'saida') {
                if (item.estoqueAtual < quantidade) {
                    limparCamposMovimentacao();
                    showCustomAlert(`Estoque insuficiente para esta saída!<br><br>
                                    Estoque atual: ${item.estoqueAtual} unidades<br>
                                    Quantidade solicitada: ${quantidade} unidades`);
                    return;
                }
            }

            const movimentacao = {
                registro: selectedValue,
                nomeProduto,
                empresa,
                quantidade,
                data,
                codigo: codigoInput.value
            };

            if (selectedValue === 'entrada') {
                itens[itemIndex].estoqueAtual += quantidade;
            } else if (selectedValue === 'saida') {
                itens[itemIndex].estoqueAtual -= quantidade;
            }
            
            itens[itemIndex].empresa = empresa;
            
            localStorage.setItem('itens', JSON.stringify(itens));

            let movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];
            movimentacoes.push(movimentacao);
            localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));

            atualizarListaMovimentacoes();
            carregarProdutosNoSelect();
            carregarItensParaExclusao();
            atualizarEstoque();

            limparCamposMovimentacao();
        } else if (selectedValue === 'cadastro') {
            const codigo = codigoCadastroInput.value;
            const nomeProdutoCadastro = document.getElementById('nomeProdutoCadastro').value;
            const tipoItem = document.getElementById('tipoItemCadastro').value;
            const estoqueAtual = parseInt(document.getElementById('estoqueAtualCadastro').value);
            const estoqueCritico = parseInt(document.getElementById('estoqueCritico').value);
            const estoqueSeguranca = parseInt(document.getElementById('estoqueSeguranca').value);
            const estoqueMaximo = parseInt(document.getElementById('estoqueMaximo').value);
            const estoqueMinimo = parseInt(document.getElementById('estoqueMinimo').value);

            if (!nomeProdutoCadastro || !tipoItem) {
                showCustomAlert('Por favor, preencha todos os campos obrigatórios!');
                return;
            }

            const item = {
                codigo: codigo,
                nomeProduto: nomeProdutoCadastro,
                tipoItem: tipoItem,
                estoqueAtual: estoqueAtual,
                estoqueCritico: estoqueCritico,
                estoqueSeguranca: estoqueSeguranca,
                estoqueMaximo: estoqueMaximo,
                estoqueMinimo: estoqueMinimo,
                empresa: ''
            };

            if (tipoItem === 'EPI') {
                item.ca = document.getElementById('caEpi').value;
                item.tamanho = document.getElementById('tamanhoEpi').value;
                
                if (!item.ca) {
                    showCustomAlert('Por favor, informe o CA do EPI!');
                    return;
                }
            } else if (tipoItem === 'Material') {
                item.tipoMaterial = document.getElementById('tipoMaterial').value;
                item.dimensoes = document.getElementById('dimensoesMaterial').value;
                
                if (!item.tipoMaterial) {
                    showCustomAlert('Por favor, informe o tipo de material!');
                    return;
                }
                
                const dimensoesPattern = /^\d+,\d+x\d+,\d+$/;
                if (!dimensoesPattern.test(item.dimensoes)) {
                    showCustomAlert('Por favor, insira as dimensões no formato correto (ex: 1,25x1,50)');
                    return;
                }
            }

            let itens = JSON.parse(localStorage.getItem('itens')) || [];
            
            const nomeExistente = itens.find(item => item.nomeProduto === nomeProdutoCadastro);
            if (nomeExistente) {
                showCustomAlert('Este nome de produto já está cadastrado!');
                return;
            }
            
            itens.push(item);
            localStorage.setItem('itens', JSON.stringify(itens));

            formCadastroItem.reset();
            tipoItemCadastro.value = '';
            epiFields.style.display = 'none';
            materialFields.style.display = 'none';
            gerarNovoCodigo();
            carregarProdutosNoSelect();
            carregarItensParaExclusao();
            showSucessAlert('Item cadastrado com sucesso!');
        }
    });

    deleteItemButton.addEventListener('click', function() {
        const nomeProduto = itemParaExcluirSelect.value;
        
        if (!nomeProduto) {
            showCustomAlert('Por favor, selecione um item para excluir!');
            return;
        }
        
        showCustomConfirm(`Tem certeza que deseja excluir o item "${nomeProduto}"? Esta ação não pode ser desfeita.`, function(confirmed) {
            if (confirmed) {
                let itens = JSON.parse(localStorage.getItem('itens')) || [];
                itens = itens.filter(item => item.nomeProduto !== nomeProduto);
                localStorage.setItem('itens', JSON.stringify(itens));
                
                let movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];
                movimentacoes = movimentacoes.filter(mov => mov.nomeProduto !== nomeProduto);
                localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));
                
                carregarItensParaExclusao();
                carregarProdutosNoSelect();
                atualizarEstoque();
                atualizarListaMovimentacoes();
                
                showSucessAlert(`Item "${nomeProduto}" excluído com sucesso!`);
            }
        });
    });

    // Eventos para os filtros do histórico
    filtroTipoMovimentacao.addEventListener('change', atualizarListaMovimentacoes);
    filtroMovimentacao.addEventListener('input', atualizarListaMovimentacoes);
    btnLimparFiltros.addEventListener('click', function() {
        filtroTipoMovimentacao.value = '';
        filtroMovimentacao.value = '';
        atualizarListaMovimentacoes();
    });

    // Evento para o filtro de estoque
    tipoFiltroEstoque.addEventListener('change', function() {
        if (this.value && this.value !== 'critico') {
            campoFiltroEstoque.disabled = false;
            campoFiltroEstoque.placeholder = `Digite o ${this.value === 'codigo' ? 'código' : this.value === 'nome' ? 'nome' : 'tipo'}...`;
            campoFiltroEstoque.focus();
        } else {
            campoFiltroEstoque.disabled = true;
            campoFiltroEstoque.value = '';
            atualizarEstoque();
        }
    });

    // Evento para filtrar enquanto digita
    campoFiltroEstoque.addEventListener('input', function() {
        if (tipoFiltroEstoque.value) {
            atualizarEstoque();
        }
    });

    // Botão para gerar relatório
    btnRelatorio.addEventListener('click', function() {
        const itens = JSON.parse(localStorage.getItem('itens')) || [];
        const html = `
            <h2>Relatório de Estoque - ${new Date().toLocaleDateString()}</h2>
            <table border="1" cellpadding="5" style="width:100%;border-collapse:collapse;">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Produto</th>
                        <th>Tipo</th>
                        <th>Estoque</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${itens.map(item => `
                        <tr>
                            <td>${item.codigo}</td>
                            <td>${item.nomeProduto}</td>
                            <td>${item.tipoItem}</td>
                            <td>${item.estoqueAtual}</td>
                            <td>${item.estoqueAtual <= item.estoqueCritico ? 'CRÍTICO' : 
                                 item.estoqueAtual <= item.estoqueMinimo ? 'BAIXO' : 'NORMAL'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        const win = window.open('', '_blank');
        win.document.write(html);
        win.document.close();
        win.print();
    });

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

    // Inicialização
    atualizarListaMovimentacoes();
    toggleContent();
});