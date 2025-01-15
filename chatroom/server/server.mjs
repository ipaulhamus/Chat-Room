import { WebSocketServer } from "ws";
import express from 'express';

const app = express();

const port = 3000;
let nextId = 1;

const server = app.listen(port);

console.log(`Server is listening on port ${port}!`);

const socketServer = new WebSocketServer({ server });
const clients = new Map();

socketServer.on('connection', (ws) =>
{
    const id = nextId;
    nextId++;
    clients.set(id, ws);

    socketServer.clients.forEach((client) =>
    {
        client.send("*New user joined the room!*");
    });

    ws.send('*Welcome to Nick-cord! Use "/nick " to set your nickname! Use "/help" to view all commands!*');

    ws.on('message', (message) =>
    {
        //"if" statements to handle different commands
        if(message.toString().startsWith('/nick '))
        {
            const nickname = message.toString().split(' ')[1];

            if(nickname === '' || nickname === ' ')
            {
                ws.send("*Error! Nicknames shouldn't be empty!*");
            }
            else
            {
                clients.set(id, {ws, nickname});
                ws.send(`*Your nickname is now: "${nickname}"*`);
            }
        }
        //"/me" command, sending the action to all users connected
        else if(message.toString().startsWith('/me '))
        {
            const usersName = clients.get(id).nickname;
            const splitMessage = message.toString().split(' ');
            let fullMessage = `# ${usersName} `;

            if(splitMessage.length === 2 && splitMessage[1] === '' || splitMessage[1] === ' ')
            {
                ws.send("*Error! Please enter an action to send!*");
            }
            else
            {
                for (let i = 1; i < splitMessage.length; i++) {
                    fullMessage = fullMessage + " " + splitMessage[i];
                }

                fullMessage = fullMessage + " #";

                socketServer.clients.forEach((client) => {
                    client.send(fullMessage);
                });
            }
        }
        // "/list", will return a list of all users to the connected user
        else if(message.toString().startsWith('/list'))
        {
            let fullMessage = "All connected users:\n ";
            clients.forEach((client) =>
            {
                fullMessage = fullMessage + `${client.nickname}, `;
            });
            ws.send(fullMessage);
        }
        //"/help", sends a list of commands to the user
        else if(message.toString().startsWith('/help'))
        {
            const infoMessage = "Available Commands:\n/nick : Set nickname, " +
                "/list : List all users, " +
                "/me : Pretend to do an action, " +
                "/help : List all available commands";

            ws.send(infoMessage);
        }
        else
        {
            //If no commands are entered, broadcast to all connected users
            const nickname = clients.get(id).nickname;
            const fullMessage = `${nickname}:\n${message.toString()}`;
            socketServer.clients.forEach((client) =>
            {
                client.send(fullMessage);
            });
        }
    });
    ws.on('close', () =>
    {
        const removedNick = clients.get(id).nickname;

        clients.delete(id);

        socketServer.clients.forEach((client) =>
        {
            client.send(`*${removedNick} left the chat!*`);
        });
    });
});
