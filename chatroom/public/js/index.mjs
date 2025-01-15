let input = document.getElementById('message');
let form = document.getElementById('message-form');
let chat = document.getElementById('chat');

let messageCount = 0;

let chatString = "";

const webSocket = new WebSocket('http://localhost:3000');

webSocket.addEventListener('open', () =>
{
    console.log("You're connected!");
});

webSocket.addEventListener('message', (event) =>
{
    messageCount++;
    console.log(`Message count: ${messageCount}`);

    if(messageCount >= 6)
    {
        chatString = "";
        messageCount = 0;
    }

    console.log("Message received from the server:" + event.data);
    chatString = chatString + `\n${event.data}\n------------------------------------------`;
    chat.innerText = chatString;
    input.value = '';
});

webSocket.addEventListener('close', () =>
{
   console.log("Connection closed!");
});

form.addEventListener('submit', (event) =>
{
    event.preventDefault();
    let message = input.value;
    webSocket.send(message);
});
