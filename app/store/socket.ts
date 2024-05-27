import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

export interface socketStoreType {
    socket: Socket<SocketServer2Client, SocketClient2Server>;
}

export const useSocketStore = create<socketStoreType>(() => ({
    socket: io() as Socket<SocketServer2Client, SocketClient2Server>,
}));
