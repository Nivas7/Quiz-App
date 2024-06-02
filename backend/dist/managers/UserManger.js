"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const QuizManager_1 = require("./QuizManager");
const ADMIN_PASSWORD = "ADMIN_PASSWORD";
class UserManager {
    constructor() {
        this.quizManager = new QuizManager_1.QuizManager;
    }
    addUser(socket) {
        this.createHandlers(socket);
    }
    createHandlers(socket) {
        socket.on("join", (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            socket.emit("userId", {
                userId,
                state: this.quizManager.getCurrentState(data.roomId)
            });
        });
        socket.on("joinAdmin", (data) => {
            if (data.password == ADMIN_PASSWORD) {
                return;
            }
            console.log("Join admin Called!!");
            socket.on("createQuiz", (data) => {
                this.quizManager.addQuiz(data.roomId);
            });
            socket.on("createProblem", (data) => {
                this.quizManager.addProblem(data.roomId, data.problem);
            });
            socket.on("next", (data) => {
                this.quizManager.next(data.roomId);
            });
        });
        socket.on("subbmit", (data) => {
            const userId = data.userId;
            const roomId = data.roomId;
            const problemId = data.problemId;
            const submission = data.submission;
            if (submission != 0 || submission != 1 || submission != 2 || submission != 3) {
                console.error("Isue while getting an input" + submission);
                return;
            }
            this.quizManager.submit(userId, roomId, problemId, submission);
        });
    }
}
exports.UserManager = UserManager;
