document.querySelector('#editButton').onclick = () => {
    if (document.querySelector('#editInput').value) {
        fetch(`${process.env.HOST}api/todo`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: document.querySelector('#editInput').getAttribute('itemid'),
                value: document.querySelector('#editInput').value
            })
        }).then((res) => {
            window.location = `${process.env.HOST}`;
        })
    }
}