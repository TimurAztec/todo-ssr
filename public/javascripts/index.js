document.querySelector('#signoutButton').onclick = () => {
    fetch(`/api/auth/signout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    }).then((res) => {
        document.location.reload();
    })
}

document.querySelector('#createButton').onclick = () => {
    if (document.querySelector('#postInput').value) {
        fetch(`/api/todo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({value: document.querySelector('#postInput').value})
        }).then((res) => {
            document.location.reload();
        })
    }
}

document.querySelectorAll('.item').forEach((item) => {
    item.querySelector('.editButton').onclick = () => {
        window.location = `/edit/${item.attributes.itemid.value}`
    }

    item.querySelector('.deleteButton').onclick = () => {
        fetch(`/api/todo`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: item.attributes.itemid.value})
        }).then((res) => {
            document.location.reload();
        })
    }
});