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