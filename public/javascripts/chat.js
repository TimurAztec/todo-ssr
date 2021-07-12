console.log(location.host);
webSocket = new WebSocket(`${location.host.split(':')[1] === '443' ? 'wss' : 'ws'}://${location.host}`);

webSocket.onopen = (event) => {
    webSocket.send("online-update");
    let onlineActivity = setInterval(() => {
        webSocket.send("online-update");
    }, 5000);
};

webSocket.onmessage = (event) => {
    if (event.data instanceof Blob) {
        let reader = new FileReader();
        reader.onload = () => {
            let res = reader.result;
        };
        reader.readAsText(event.data);
    } else {
        let res = JSON.parse(event.data);
        let onlineUsersHtml = '';
        res.forEach((user) => {
            onlineUsersHtml += `<li><span>${user.login} | ${user.info}</span></li>`
        });
        $('#onlineUsersList').html(onlineUsersHtml);
        setUserActions();
    }
};

function setUserActions() {
    $('#onlineUsersList').find('li').click((el) => {
        $('#onlineUsersList').find('li').find('span')
            .css("background-color", "white")
            .css("cursor", "pointer")
        el.target.style.backgroundColor = 'blue';
    });
}