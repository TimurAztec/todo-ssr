webSocket = new WebSocket(`ws://${window.location.hostname}:3000`);
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
    }
};