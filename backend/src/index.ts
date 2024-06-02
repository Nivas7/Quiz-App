import { UserManager } from './managers/UserManger';
import { IoManager } from "./managers/IoManager";

const io = IoManager.getIo();

io.listen(3000);

const userManger = new UserManager();
io.on('connection', (socket) => {
  userManger.addUser(socket);
});

