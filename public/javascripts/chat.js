let selectedUser = '';

webSocket = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`);

webSocket.onopen = (event) => {
    webSocket.send(JSON.stringify({action: "onlineUpdate"}));
    let onlineActivity = setInterval(() => {
        webSocket.send(JSON.stringify({action: "onlineUpdate"}));
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
        let updateHtml = '';
        if (res.action === 'onlineUpdate') {
            res.onlineUsers.forEach((user) => {
                updateHtml += `<li><span userid="${user._id}">${user.login} | ${user.info}</span></li>`
            });
            $('#onlineUsersList').html(updateHtml);
            setUserActions();
        }
        if (res.action === 'sendChat') {
            res.chatStory.forEach((message) => {
                updateHtml += `<div>${message.text}</div>`
            });
            $('#messages').html(updateHtml);
        }
    }
};

function setUserActions() {
    $('#onlineUsersList').find('li').click(function () {
        let userobj = $(this).find('span');
        selectedUser = userobj.attr('userid');
        $('#onlineUsersList').find('li').find('span')
            .css("background-color", "white")
            .css("cursor", "pointer")
        userobj.css("background-color", "blue")
        webSocket.send(JSON.stringify({
            action: 'startChat',
            uid: selectedUser
        }));
    });
}

window.onload = function() {
    $('#sendMessage').click(function () {
        webSocket.send(JSON.stringify({
            action: 'sendChat',
            text: $('#messageInput').val(),
            uid: selectedUser
        }));
        $('#messageInput').val('');
    });
};
