# Chat-Room

*What is it?* A locally hosted chatroom application that utilizes WebSockets for persistent bidirectional communication between the server and connected clients. The application has built-in commands that the user can use to customize their application experience and view helpful information.

The application has one chatroom that is automatically joined, and the server this room is hosted on is an express server using the "concurrently" package. 

Chatroom Features:
- The user can set a nickname to use in the chat with the command "/nick"
- A "/list" command is implemented that lists all users connected to the server
- Typing "/me [action]" will display as "[username] [action]"
- "/help" will display a helpful list of available commands to use
- When a user joins the chatroom or leaves it, a message is broadcast to all users
