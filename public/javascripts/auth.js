document.querySelector('#loginButton').onclick = () => {
    if (document.querySelector('#loginInput').value && document.querySelector('#passwordInput').value) {
        fetch('http://localhost:3000/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: document.querySelector('#loginInput').value,
                password: document.querySelector('#passwordInput').value,
            })
        }).then(() => {
            document.location.reload();
        })
    }
};

document.querySelector('#registerButton').onclick = () => {
    if (document.querySelector('#loginInput').value && document.querySelector('#passwordInput').value) {
        fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: document.querySelector('#loginInput').value,
                password: document.querySelector('#passwordInput').value,
                info: document.querySelector('#aboutInput').value
            })
        }).then(() => {
            document.location.reload();
        })
    }
};