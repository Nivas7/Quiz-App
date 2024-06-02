"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const IoManager_1 = require("./managers/IoManager");
const PROBLEM_TIME_S = 20;
class Quiz {
    constructor(roomId) {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentState = "not_started";
    }
    addProblem(problem) {
        this.problems.push(problem);
        console.log(this.problems);
    }
    start() {
        this.hasStarted = true;
        this.setActiveProblem(this.problems[0]);
    }
    setActiveProblem(problem) {
        console.log("set active problem");
        this.currentState = "question";
        problem.startTime = new Date().getTime();
        problem.submission = [];
        IoManager_1.IoManager.getIo().emit("CHANGE_PROBLEM", {
            problem
        });
        setTimeout(() => {
            this.sendLeaderboard();
        }, PROBLEM_TIME_S * 1000);
    }
    sendLeaderboard() {
        console.log("send leaderboard");
        this.currentState = "leaderboard";
        const leaderboard = this.getLeaderboard();
        IoManager_1.IoManager.getIo().to(this.roomId).emit("leaderboard", {
            leaderboard
        });
    }
    next() {
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];
        if (problem) {
            this.setActiveProblem(problem);
        }
        else {
            this.activeProblem--;
            ;
            // IoManager.getIo().emit("QUIZ_ENDED"), {
            //   problem
            // }
        }
    }
    makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    addUser(name) {
        const id = this.makeid(7);
        this.users.push({
            id,
            name,
            points: 0,
        });
        return id;
    }
    submit(userId, roomId, problemId, submission) {
        console.log("User Id");
        console.log(userId);
        const problem = this.problems.find(x => x.id == problemId);
        const user = this.users.find(x => x.id == userId);
        if (!problem || !user) {
            console.log("Problem or User not found");
            return;
        }
        const existingSubmission = problem.submission.find(x => x.userId === userId);
        if (existingSubmission) {
            console.log("Existn submissions");
            return;
        }
        problem.submission.push({
            problemId,
            userId,
            isCorrect: problem.answer === submission,
            optionSelected: submission
        });
        user.points += (1000 - (500 * (new Date().getTime() - problem.startTime) / (PROBLEM_TIME_S * 1000)));
    }
    getLeaderboard() {
        return this.users.sort((a, b) => a.points < b.points ? 1 : -1).splice(0, 20);
    }
    getCurrentState() {
        if (this.currentState === "not_started") {
            return {
                type: "not_started"
            };
        }
        if (this.currentState === "ended") {
            return {
                type: "not_started",
                leaderboard: this.getLeaderboard()
            };
        }
        if (this.currentState === "leaderboard") {
            return {
                type: "not_started",
                leaderboard: this.getLeaderboard()
            };
        }
        if (this.currentState === "question") {
            const problem = this.problems[this.activeProblem];
            return {
                type: "not_started",
                problem
            };
        }
    }
}
exports.Quiz = Quiz;
