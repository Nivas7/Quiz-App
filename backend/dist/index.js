"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserManger_1 = require("./managers/UserManger");
const IoManager_1 = require("./managers/IoManager");
const io = IoManager_1.IoManager.getIo();
io.listen(3000);
const userManger = new UserManger_1.UserManager();
io.on('connection', (socket) => {
    userManger.addUser(socket);
});
