async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    console.log(`Registering user: ${username}`);

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    document.getElementById('register-msg').textContent = data.msg;
    console.log(data.msg);

    if (response.ok) {
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
    }
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    console.log(`Logging in user: ${username}`);

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log(data.msg);

    if (response.ok) {
        localStorage.setItem('token', data.access_token);
        console.log('Login successful, token stored.');
        document.getElementById('login-msg').textContent = 'Login successful!';
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    } else {
        document.getElementById('login-msg').textContent = data.msg;
    }
}

async function getProtected() {
    const token = localStorage.getItem('token');
    console.log('Fetching protected data with token:', token);

    const response = await fetch('/protected', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
        document.getElementById('protected-msg').textContent = `Logged in as: ${data.logged_in_as}`;
        console.log(`Logged in as: ${data.logged_in_as}`);
    } else {
        document.getElementById('protected-msg').textContent = data.msg;
    }
}

async function logout() {
    console.log('Logging out...');

    const response = await fetch('/logout', {
        method: 'POST',
    });

    const data = await response.json();
    console.log(data.msg);

    document.getElementById('logout-msg').textContent = data.msg;
    localStorage.removeItem('token');
    console.log('Token removed, redirecting to login page.');
    setTimeout(() => {
        window.location.href = '/login';
    }, 2000);
}
