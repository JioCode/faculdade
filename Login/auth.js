class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

class Auth {
    constructor() {
        this.users = [];
    }

    registerUser(name, email, password, confirmPassword) {
        if (this.isEmailRegistered(email)) {
            this.showError('registerError', 'E-mail já cadastrado!');
            return false;
        }

        if (!this.validatePassword(password, confirmPassword)) {
            this.showError('registerError', 'As senhas não coincidem!');
            return false;
        }

        const newUser = new User(name, email, password);
        this.users.push(newUser);
        alert("Usuário cadastrado com sucesso!");
        return true;
    }

    loginUser(email, password) {
        const user = this.users.find(user => user.email === email && user.password === password);
        if (user) {
            window.location.href = 'main.html';  // Redireciona para a página principal
        } else {
            this.showError('loginError', 'E-mail ou senha incorretos.');
        }
    }

    isEmailRegistered(email) {
        return this.users.some(user => user.email === email);
    }

    validatePassword(password, confirmPassword) {
        return password === confirmPassword;
    }

    showError(elementId, message) {
        document.getElementById(elementId).textContent = message;
    }
}

// Inicializa a autenticação
const auth = new Auth();

// Evento de cadastro
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    const registered = auth.registerUser(name, email, password, confirmPassword);
    if (registered) {
        document.getElementById('registerForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        modal.hide();
    }
});

// Evento de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.loginUser(email, password);
});
