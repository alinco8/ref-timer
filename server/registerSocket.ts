import { Server } from 'socket.io';

export function registerSocket(
    io: Server<SocketClient2Server, SocketServer2Client, SocketServer>,
) {
    io.on('connect', (socket) => {
        socket.on('update', () => socket.broadcast.emit('update'));
    });
}
