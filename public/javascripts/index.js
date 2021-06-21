document.querySelector('#createButton').onclick = () => {
    fetch('http://localhost:3000/api/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: document.querySelector('#postInput').value})
    }).then((res) => {
        document.location.reload();
    })
}