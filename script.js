// =============================================
// FUNÇÕES UTILITÁRIAS
// =============================================

/**
 * Exibe uma mensagem temporária na tela
 * @param {string} message - Mensagem a ser exibida
 * @param {string|null} redirectUrl - URL para redirecionamento (opcional)
 */
function showTempMessage(message, redirectUrl = null) {
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

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        }, 300);
    }, 3000);
}

/**
 * Valida um endereço de email
 * @param {string} email - Email a ser validado
 * @returns {boolean} - Retorna true se o email é válido
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Formata uma data para o padrão brasileiro
 * @param {string} dataString - Data em formato string
 * @returns {string} - Data formatada
 */
function formatarData(dataString) {
    // Adiciona o fuso horário se não estiver presente (assumindo que a data do servidor está em UTC)
    if (dataString && !dataString.endsWith('Z')) {
        dataString += 'Z';
    }
    
    const data = new Date(dataString);
    
    // Ajusta para o fuso horário local
    const dataLocal = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
    
    return dataLocal.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}
// =============================================
// SISTEMA DE ALERTAS PERSONALIZADOS
// =============================================

function showCustomAlert(message) {
    const alert = document.getElementById('customAlert');
    const alertMessage = document.getElementById('customAlertMessage');
    const closeButton = document.querySelector('.custom-alert-close');

    alertMessage.innerHTML = message;
    alert.style.display = 'block';

    const timer = setTimeout(() => {
        hideCustomAlert();
    }, 5000);

    closeButton.onclick = function () {
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

    closeButton.onclick = function () {
        clearTimeout(timer);
        hideSucessAlert();
    };

    document.querySelector('.sucess-alert-timer').style.animation = 'none';
    void document.querySelector('.sucess-alert-timer').offsetWidth;
    document.querySelector('.sucess-alert-timer').style.animation = 'timer 5s linear forwards';
}

function hideSucessAlert() {
    const alert = document.getElementById('sucessAlert');
    alert.style.animation = 'fadeOut 1s ease-out';
    setTimeout(() => {
        alert.style.display = 'none';
        alert.style.animation = 'slideIn 0.3s ease-out';
    }, 300);
}

function showCustomConfirm(message, callback) {
    const confirmBox = document.getElementById('customConfirm');
    const confirmMessage = document.getElementById('customConfirmMessage');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');

    confirmMessage.textContent = message;
    confirmBox.style.display = 'block';

    confirmYes.onclick = function () {
        confirmBox.style.display = 'none';
        callback(true);
    };

    confirmNo.onclick = function () {
        confirmBox.style.display = 'none';
        callback(false);
    };
}

// =============================================
// SISTEMA DE LOGIN E REGISTRO
// =============================================

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showTempMessage('Login bem-sucedido!', data.redirect);
                } else {
                    showTempMessage(data.message || 'E-mail ou senha incorretos.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showTempMessage('Erro ao fazer login. Tente novamente.');
            });
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
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

        fetch('php/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `newUsername=${encodeURIComponent(newUsername)}&newEmail=${encodeURIComponent(newEmail)}&newPassword=${encodeURIComponent(newPassword)}&confirmPassword=${encodeURIComponent(confirmPassword)}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showTempMessage(data.message, data.redirect);
                    registerForm.reset();
                    document.querySelector('input[type="password"]').value = '';
                } else {
                    showTempMessage(data.message || 'Erro ao registrar usuário.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showTempMessage('Erro ao registrar. Tente novamente.');
            });
    });
}

// =============================================
// SISTEMA DE CONTROLE DE ESTOQUE
// =============================================

document.addEventListener('DOMContentLoaded', function () {
    // Elementos da interface
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

    // Elementos para cadastro de itens
    const tipoItemCadastro = document.getElementById('tipoItemCadastro');
    const epiFields = document.getElementById('epiFields');
    const materialFields = document.getElementById('materialFields');
    const caEpi = document.getElementById('caEpi');
    const tamanhoEpi = document.getElementById('tamanhoEpi');
    const tipoMaterial = document.getElementById('tipoMaterial');
    const dimensoesMaterial = document.getElementById('dimensoesMaterial');

    // Elementos para filtros
    const tipoFiltroEstoque = document.getElementById('tipoFiltroEstoque');
    const campoFiltroEstoque = document.getElementById('campoFiltroEstoque');
    const btnRelatorio = document.getElementById('btnRelatorio');
    const filtroTipoMovimentacao = document.getElementById('filtroTipoMovimentacao');
    const filtroMovimentacao = document.getElementById('filtroMovimentacao');
    const btnLimparFiltros = document.getElementById('btnLimparFiltros');

    // Configurações iniciais
    const today = new Date();
const todayFormatted = today.toISOString().split('T')[0];
dataInput.min = '2025-01-01';
dataInput.max = '2026-01-01';
dataInput.value = todayFormatted;

    // =============================================
    // FUNÇÕES PRINCIPAIS
    // =============================================

    /**
     * Limpa os campos do formulário de movimentação
     */
    function limparCamposMovimentacao() {
        document.getElementById('quantidade').value = '';
        selectProduto.value = '';
        estoqueAtualInput.value = '';
        tipoItemInput.value = '';
        detalhesItemInput.value = '';
        codigoInput.value = '';
        carregarEmpresas();
    }

    /**
     * Carrega as empresas no select
     */
    function carregarEmpresas() {
        fetch('php/empresas.php')
            .then(response => response.json())
            .then(empresas => {
                empresaInput.innerHTML = '<option value="">Selecione uma empresa</option>';
                empresas.forEach(empresa => {
                    const option = document.createElement('option');
                    option.value = empresa.cnpj;
                    option.textContent = `${empresa.nome} - CNPJ: ${empresa.cnpj}`;
                    empresaInput.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                showCustomAlert('Erro ao carregar empresas');
            });
    }

    /**
     * Carrega os produtos no select
     */
    function carregarProdutosNoSelect() {
        selectProduto.innerHTML = '<option value="">Selecione um produto</option>';

        fetch('php/itens.php')
            .then(response => response.json())
            .then(itens => {
                itens.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.codigo;
                    option.textContent = `${item.codigo} - ${item.nome_produto}`;
                    selectProduto.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                showCustomAlert('Erro ao carregar produtos');
            });
    }

    /**
     * Carrega itens para exclusão
     */
    function carregarItensParaExclusao() {
        itemParaExcluirSelect.innerHTML = '<option value="">Selecione um item</option>';
        
        fetch('php/itens.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    return response.text().then(text => {
                        throw new Error(`Resposta não é JSON: ${text}`);
                    });
                }
                return response.json();
            })
            .then(itens => {
                if (!Array.isArray(itens)) {
                    throw new Error('Resposta não é um array');
                }
                
                if (itens.length === 0) {
                    itemParaExcluirSelect.innerHTML = '<option value="">Nenhum item disponível</option>';
                    return;
                }
    
                itens.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.codigo;
                    option.textContent = `${item.codigo} - ${item.nome_produto}`;
                    itemParaExcluirSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                showCustomAlert('Erro ao carregar itens para exclusão: ' + error.message);
                
                // Opcional: Tentar novamente após 5 segundos
                setTimeout(carregarItensParaExclusao, 5000);
            });
    }

    /**
     * Atualiza a tabela de estoque
     */
    function atualizarEstoque() {
        const corpoTabela = document.getElementById('corpoTabelaEstoque');
        corpoTabela.innerHTML = '';

        let url = 'php/itens.php';
        const tipoFiltro = tipoFiltroEstoque.value;
        const valorFiltro = campoFiltroEstoque.value.toLowerCase();

        if (tipoFiltro && valorFiltro) {
            if (tipoFiltro === 'codigo' || tipoFiltro === 'nome' || tipoFiltro === 'tipo') {
                url += `?${tipoFiltro}=${encodeURIComponent(valorFiltro)}`;
            }
        }

        fetch(url)
            .then(response => response.json())
            .then(itens => {
                let totalItens = 0;
                let totalCritico = 0;
                let totalBaixo = 0;

                // Aplicar filtros adicionais no cliente
                const itensFiltrados = itens.filter(item => {
                    if (tipoFiltro === 'critico') {
                        return item.estoque_atual <= item.estoque_critico;
                    } else if (tipoFiltro === 'baixo') {
                        return item.estoque_atual > item.estoque_critico && item.estoque_atual <= item.estoque_minimo;
                    }
                    return true;
                });

                document.getElementById('semResultados').style.display =
                    itensFiltrados.length === 0 ? 'block' : 'none';

                itensFiltrados.forEach(item => {
                    totalItens++;

                    let status, statusClass;
                    if (item.estoque_atual <= item.estoque_critico) {
                        status = 'Crítico';
                        statusClass = 'status-critico';
                        totalCritico++;
                    } else if (item.estoque_atual <= item.estoque_minimo) {
                        status = 'Baixo';
                        statusClass = 'status-baixo';
                        totalBaixo++;
                    } else {
                        status = 'Normal';
                        statusClass = 'status-normal';
                    }

                    let detalhes = '';
                    if (item.tipo_item === 'EPI') {
                        detalhes = `CA: ${item.ca_epi || 'N/A'}, Tamanho: ${item.tamanho_epi || 'N/A'}`;
                    } else if (item.tipo_item === 'Material') {
                        detalhes = `Tipo: ${item.tipo_material || 'N/A'}, Dimensões: ${item.dimensoes_material || 'N/A'}`;
                    }

                    const tr = document.createElement('tr');
                    if (status === 'Crítico') tr.classList.add('estoque-critico');
                    else if (status === 'Baixo') tr.classList.add('estoque-baixo');

                    tr.innerHTML = `
                        <td>${item.codigo}</td>
                        <td>${item.nome_produto}</td>
                        <td>${item.tipo_item}</td>
                        <td>${item.estoque_atual}</td>
                        <td><span class="estoque-status ${statusClass}">${status}</span></td>
                        <td>${detalhes}</td>
                        <td>${item.empresa_nome || 'Não informada'}</td>
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
            })
            .catch(error => {
                console.error('Error:', error);
                showCustomAlert('Erro ao carregar estoque');
            });
    }

    /**
     * Alterna entre os conteúdos (entrada, saída, estoque, cadastro)
     */
    function toggleContent() {
        const selectedValue = document.querySelector('input[name="registro"]:checked').value;
        movimentacaoForm.style.display = 'none';
        estoqueContent.style.display = 'none';
        cadastroItemContent.style.display = 'none';

        switch (selectedValue) {
            case 'entrada':
                pageTitle.textContent = 'Tela de Movimentações - Entrada';
                movimentacaoForm.style.display = 'block';
                carregarProdutosNoSelect();
                carregarEmpresas();
                break;
            case 'saida':
                pageTitle.textContent = 'Tela de Movimentações - Saída';
                movimentacaoForm.style.display = 'block';
                carregarProdutosNoSelect();
                carregarEmpresas();
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
                limparCamposMovimentacao();
                break;
        }

        carregarItensParaExclusao();
    }

    /**
     * Gera um novo código para cadastro de itens
     */
    function gerarNovoCodigo() {
        fetch('php/itens.php')
            .then(response => response.json())
            .then(itens => {
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
            })
            .catch(error => {
                console.error('Error:', error);
                codigoCadastroInput.value = '001';
            });
    }

    /**
     * Atualiza a lista de movimentações
     */
    function atualizarListaMovimentacoes() {
        const listaMovimentacoes = document.getElementById('listaMovimentacoes');
        listaMovimentacoes.innerHTML = '';
    
        let url = 'php/movimentacoes.php';
        const tipoFiltro = filtroTipoMovimentacao.value;
        const textoFiltro = filtroMovimentacao.value.toLowerCase();
    
        if (tipoFiltro) {
            url += `?tipo=${tipoFiltro}`;
        }
    
        if (textoFiltro) {
            url += `${tipoFiltro ? '&' : '?'}filtro=${encodeURIComponent(textoFiltro)}`;
        }
    
        fetch(url)
            .then(response => response.json())
            .then(movimentacoes => {
                movimentacoes.sort((a, b) => new Date(b.data) - new Date(a.data));
    
                movimentacoes.forEach(mov => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${formatarData(mov.data)}</td>
                        <td class="${mov.tipo === 'entrada' ? 'movimentacao-entrada' : 'movimentacao-saida'}">
                            ${mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                        </td>
                        <td>${mov.item_codigo}</td>
                        <td>${mov.nome_produto}</td>
                        <td>${mov.quantidade}</td>
                        <td>${mov.empresa_nome}</td>
                        <td>
                            <button class="action-button" title="Excluir" onclick="excluirMovimentacao('${mov.id}', '${mov.item_codigo}', '${mov.tipo}', ${mov.quantidade})">🗑️</button>
                        </td>
                    `;
                    listaMovimentacoes.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                showCustomAlert('Erro ao carregar movimentações');
            });
    }

    // =============================================
    // FUNÇÕES GLOBAIS (disponíveis no escopo window)
    // =============================================

    /**
     * Função para editar um item (disponível globalmente)
     * @param {string} codigo - Código do item a ser editado
     */
    window.editarItem = function (codigo) {
        document.querySelector('input[value="cadastro"]').click();

        fetch(`php/itens.php?codigo=${codigo}`)
            .then(response => response.json())
            .then(item => {
                if (item) {
                    // Preenche os campos do formulário
                    document.getElementById('codigoCadastro').value = item.codigo;
                    document.getElementById('nomeProdutoCadastro').value = item.nome_produto;
                    document.getElementById('tipoItemCadastro').value = item.tipo_item;
                    document.getElementById('estoqueAtualCadastro').value = item.estoque_atual;
                    document.getElementById('estoqueCritico').value = item.estoque_critico;
                    document.getElementById('estoqueSeguranca').value = item.estoque_seguranca;
                    document.getElementById('estoqueMaximo').value = item.estoque_maximo;
                    document.getElementById('estoqueMinimo').value = item.estoque_minimo;

                    // Preenche campos específicos por tipo
                    if (item.tipo_item === 'EPI') {
                        document.getElementById('caEpi').value = item.ca_epi || '';
                        document.getElementById('tamanhoEpi').value = item.tamanho_epi || '';
                        document.getElementById('epiFields').style.display = 'block';
                        document.getElementById('materialFields').style.display = 'none';
                    } else if (item.tipo_item === 'Material') {
                        document.getElementById('tipoMaterial').value = item.tipo_material || '';
                        document.getElementById('dimensoesMaterial').value = item.dimensoes_material || '';
                        document.getElementById('materialFields').style.display = 'block';
                        document.getElementById('epiFields').style.display = 'none';
                    }

                    showCustomAlert(`Editando item ${item.codigo} - ${item.nome_produto}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showCustomAlert('Erro ao carregar item para edição');
            });
    }

    /**
     * Função para visualizar histórico de um item (disponível globalmente)
     * @param {string} codigo - Código do item
     */
    window.verHistorico = function (codigo) {
        fetch(`php/movimentacoes.php?item_codigo=${codigo}`)
            .then(response => response.json())
            .then(historico => {
                if (historico.length === 0) {
                    showCustomAlert('Nenhuma movimentação encontrada para este item.');
                    return;
                }
    
                // Busca o nome do produto para exibir no título
                fetch(`php/itens.php?codigo=${codigo}`)
                    .then(response => response.json())
                    .then(item => {
                        const nomeProduto = item ? item.nome_produto : '';
    
                        // Atualiza o título da modal
                        document.getElementById('historicoModalTitle').textContent = `Histórico: ${codigo} - ${nomeProduto}`;
    
                        // Preenche o corpo da tabela
                        const tbody = document.getElementById('historicoModalBody');
                        tbody.innerHTML = '';
    
                        historico.forEach(mov => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td>${formatarData(mov.data)}</td>
                                <td class="${mov.tipo === 'entrada' ? 'movimentacao-entrada' : 'movimentacao-saida'}">
                                    ${mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                                </td>
                                <td>${mov.quantidade}</td>
                                <td>${mov.empresa_nome}</td>
                            `;
                            tbody.appendChild(tr);
                        });
    
                        // Exibe a modal
                        const modal = document.getElementById('historicoModal');
                        modal.style.display = 'flex';
    
                        // Fecha a modal ao clicar no X ou fora do conteúdo
                        document.querySelector('.modal-close').onclick = function () {
                            modal.style.display = 'none';
                        };
    
                        modal.onclick = function (e) {
                            if (e.target === modal) {
                                modal.style.display = 'none';
                            }
                        };
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showCustomAlert('Erro ao carregar detalhes do item');
                    });
            })
            .catch(error => {
                console.error('Error:', error);
                showCustomAlert('Erro ao carregar histórico');
            });
    }
    window.excluirMovimentacao = function(id, codigoItem, tipo, quantidade) {
    showCustomConfirm(`Tem certeza que deseja excluir esta movimentação de ${tipo}? Esta ação ajustará o estoque.`, function(confirmed) {
        if (confirmed) {
            fetch(`php/movimentacoes.php?id=${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSucessAlert(data.message);
                    atualizarListaMovimentacoes();
                    atualizarEstoque();
                    
                    // Se estiver visualizando o histórico de um item específico, atualiza também
                    if (document.getElementById('historicoModal').style.display === 'flex') {
                        verHistorico(codigoItem);
                    }
                } else {
                    showCustomAlert(data.message || 'Erro ao excluir movimentação');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showCustomAlert('Erro ao excluir movimentação: ' + error.message);
            });
        }
    });
}
    // =============================================
    // EVENT LISTENERS
    // =============================================

    // Evento change do selectProduto
    selectProduto.addEventListener('change', function () {
        const codigoItem = this.value;

        if (!codigoItem) {
            estoqueAtualInput.value = '';
            tipoItemInput.value = '';
            detalhesItemInput.value = '';
            codigoInput.value = '';
            return;
        }

        // Busca os detalhes completos do item selecionado
        fetch(`php/itens.php?codigo=${codigoItem}`)
            .then(response => response.json())
            .then(item => {
                if (item) {
                    estoqueAtualInput.value = item.estoque_atual;
                    tipoItemInput.value = item.tipo_item;
                    codigoInput.value = item.codigo;

                    // Preenche os detalhes conforme o tipo do item
                    if (item.tipo_item === 'EPI') {
                        detalhesItemInput.value = `CA: ${item.ca_epi || 'N/A'}, Tamanho: ${item.tamanho_epi || 'N/A'}`;
                    } else if (item.tipo_item === 'Material') {
                        detalhesItemInput.value = `Tipo: ${item.tipo_material || 'N/A'}, Dimensões: ${item.dimensoes_material || 'N/A'}`;
                    } else {
                        detalhesItemInput.value = '';
                    }
                } else {
                    limparCamposMovimentacao();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showCustomAlert('Erro ao carregar detalhes do produto');
                limparCamposMovimentacao();
            });
    });

    // Evento para o botão salvar
    saveButton.addEventListener('click', function (event) {
        event.preventDefault();
        const selectedValue = document.querySelector('input[name="registro"]:checked').value;

        if (selectedValue === 'entrada' || selectedValue === 'saida') {
            const codigoItem = selectProduto.value;
            const cnpjEmpresa = empresaInput.value;
            const quantidade = parseInt(document.getElementById('quantidade').value);
            const data = document.getElementById('data').value;

            if (!codigoItem) {
                showCustomAlert('Por favor, selecione um produto!');
                return;
            }

            if (!cnpjEmpresa) {
                showCustomAlert('Por favor, selecione uma empresa!');
                return;
            }

            if (!quantidade || quantidade <= 0) {
                showCustomAlert('Por favor, insira uma quantidade válida!');
                return;
            }

            if (!data) {
                showCustomAlert('Por favor, selecione uma data!');
                return;
            }

            // Envia a movimentação para o servidor
            fetch('php/movimentacoes.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tipo: selectedValue,
                    codigo_item: codigoItem,
                    cnpj_empresa: cnpjEmpresa,
                    quantidade: quantidade,
                    data: data
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro na requisição');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        showSucessAlert(data.message);
                        limparCamposMovimentacao(); // Limpa os campos do formulário após salvar
                        atualizarListaMovimentacoes();
                        carregarProdutosNoSelect();
                        carregarItensParaExclusao();
                        atualizarEstoque();
                    } else {
                        showCustomAlert(data.message || 'Erro ao registrar movimentação');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showCustomAlert('Erro ao registrar movimentação: ' + error.message);
                });

        } else if (selectedValue === 'cadastro') {
            const codigo = codigoCadastroInput.value;
            const nomeProdutoCadastro = document.getElementById('nomeProdutoCadastro').value;
            const tipoItem = document.getElementById('tipoItemCadastro').value;
            const estoqueAtual = parseInt(document.getElementById('estoqueAtualCadastro').value) || 0;
            const estoqueCritico = parseInt(document.getElementById('estoqueCritico').value) || 0;
            const estoqueSeguranca = parseInt(document.getElementById('estoqueSeguranca').value) || 0;
            const estoqueMaximo = parseInt(document.getElementById('estoqueMaximo').value) || 0;
            const estoqueMinimo = parseInt(document.getElementById('estoqueMinimo').value) || 0;
            const empresaId = null; // Pode ser obtido de um campo se necessário

            if (!nomeProdutoCadastro || !tipoItem) {
                showCustomAlert('Por favor, preencha todos os campos obrigatórios!');
                return;
            }

            // Preparando o objeto item corretamente
            const item = {
                codigo: codigo,
                nome_produto: nomeProdutoCadastro,
                tipo_item: tipoItem,
                estoque_atual: estoqueAtual,
                estoque_critico: estoqueCritico,
                estoque_seguranca: estoqueSeguranca,
                estoque_maximo: estoqueMaximo,
                estoque_minimo: estoqueMinimo,
                empresa_id: empresaId
            };

            // Adicionando campos específicos conforme o tipo
            if (tipoItem === 'EPI') {
                item.ca_epi = document.getElementById('caEpi').value;
                item.tamanho_epi = document.getElementById('tamanhoEpi').value;

                if (!item.ca_epi) {
                    showCustomAlert('Por favor, informe o CA do EPI!');
                    return;
                }
            } else if (tipoItem === 'Material') {
                item.tipo_material = document.getElementById('tipoMaterial').value;
                item.dimensoes_material = document.getElementById('dimensoesMaterial').value;

                const dimensoesPattern = /^\\d+,\\d+x\\d+,\\d+$/;
                if (item.dimensoes_material && item.dimensoes_material.trim() === '') {
                    showCustomAlert('Por favor, informe as dimensões do material!');
                    return;
                }
            }

            fetch('php/itens.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            })
                .then(response => {
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        return response.text().then(text => {
                            throw new Error(`Resposta inesperada: ${text}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        showSucessAlert(data.message);
                        formCadastroItem.reset();
                    } else {
                        showCustomAlert(data.message || 'Erro ao cadastrar item');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showCustomAlert('Erro na comunicação com o servidor: ' + error.message);
                });
        }
    });

    // Evento para excluir item
    deleteItemButton.addEventListener('click', function () {
        const codigoItem = itemParaExcluirSelect.value;

        if (!codigoItem) {
            showCustomAlert('Por favor, selecione um item para excluir!');
            return;
        }

        showCustomConfirm(`Tem certeza que deseja excluir o item "${codigoItem}"? Esta ação não pode ser desfeita.`, function (confirmed) {
            if (confirmed) {
                fetch(`php/itens.php?codigo=${codigoItem}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erro na requisição');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.success) {
                            showSucessAlert(data.message);
                            carregarItensParaExclusao();
                            carregarProdutosNoSelect();
                            atualizarEstoque();
                            atualizarListaMovimentacoes();
                        } else {
                            showCustomAlert(data.message || 'Erro ao excluir item');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showCustomAlert('Erro ao excluir item: ' + error.message);
                    });
            }
        });
    });

    // Eventos para os filtros do histórico
    filtroTipoMovimentacao.addEventListener('change', atualizarListaMovimentacoes);
    filtroMovimentacao.addEventListener('input', atualizarListaMovimentacoes);
    btnLimparFiltros.addEventListener('click', function () {
        filtroTipoMovimentacao.value = '';
        filtroMovimentacao.value = '';
        atualizarListaMovimentacoes();
    });

    // Evento para o filtro de estoque
    tipoFiltroEstoque.addEventListener('change', function () {
        if (this.value && this.value !== 'critico' && this.value !== 'baixo') {
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
    campoFiltroEstoque.addEventListener('input', function () {
        if (tipoFiltroEstoque.value) {
            atualizarEstoque();
        }
    });

    // Botão para gerar relatório
    btnRelatorio.addEventListener('click', function () {
        fetch('php/itens.php')
            .then(response => response.json())
            .then(itens => {
                // Criar um iframe oculto para gerar o relatório
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                document.body.appendChild(iframe);

                const doc = iframe.contentWindow.document;

                // Estilos para impressão
                doc.open();
                doc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Relatório de Estoque</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            h2 { color: #333; text-align: center; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th { background-color: #333; color: white; padding: 10px; text-align: center; }
                            td { padding: 8px; border: 1px solid #ddd; text-align: center; }
                            tr:nth-child(even) { background-color: #f2f2f2; }
                            .critico { color: red; font-weight: bold; }
                            .baixo { color: orange; font-weight: bold; }
                            
                            @media print {
                                body { margin: 0; padding: 0; }
                                .no-print { display: none; }
                            }
                        </style>
                    </head>
                    <body>
                        <h2>Relatório de Estoque - ${new Date().toLocaleDateString('pt-BR')}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Produto</th>
                                    <th>Tipo</th>
                                    <th>Estoque Atual</th>
                                    <th>Mínimo</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itens.map(item => {
                    const status = item.estoque_atual <= item.estoque_critico ? 'CRÍTICO' :
                        item.estoque_atual <= item.estoque_minimo ? 'BAIXO' : 'NORMAL';
                    const classeStatus = status === 'CRÍTICO' ? 'critico' :
                        status === 'BAIXO' ? 'baixo' : '';
                    return `
                                        <tr>
                                            <td>${item.codigo}</td>
                                            <td>${item.nome_produto}</td>
                                            <td>${item.tipo_item}</td>
                                            <td>${item.estoque_atual}</td>
                                            <td>${item.estoque_minimo}</td>
                                            <td class="${classeStatus}">${status}</td>
                                        </tr>
                                    `;
                }).join('')}
                            </tbody>
                        </table>
                        <div class="no-print" style="margin-top: 20px; text-align: center;">
                            <button onclick="window.print()">Imprimir</button>
                            <button onclick="window.close()">Fechar</button>
                        </div>
                    </body>
                    </html>
                `);
                doc.close();

                // Focar no iframe e chamar a impressão
                setTimeout(() => {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                }, 300);
            })
            .catch(error => {
                console.error('Error:', error);
                showCustomAlert('Erro ao gerar relatório');
            });
    });

    // Mostrar/ocultar campos de EPI ou Material conforme seleção
    tipoItemCadastro.addEventListener('change', function () {
        const tipoSelecionado = this.value;

        epiFields.style.display = 'none';
        materialFields.style.display = 'none';

        if (tipoSelecionado === 'EPI') {
            epiFields.style.display = 'block';
        } else if (tipoSelecionado === 'Material') {
            materialFields.style.display = 'block';
        }
    });

    // Eventos para os radio buttons
    radioButtons.forEach(radio => {
        radio.addEventListener('change', toggleContent);
    });

    // =============================================
    // INICIALIZAÇÃO
    // =============================================
    carregarEmpresas();
    atualizarListaMovimentacoes();
    toggleContent();
});

// Adiciona estilos para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(100%) translateY(0px); }
    }
    @keyframes timer {
        from { width: 100%; }
        to { width: 0%; }
    }
`;
document.head.appendChild(style); 