import { timeStamp } from "console";
import { IoManager } from "./managers/IoManager";

interface Problem {
  title: string;
  description: string;
  image: string;
  answer: string;
  option: {
    id: number;
    title: string;
  }
}

export class Quiz {

  private roomId: string;
  private hasStarted: boolean;
  private problems: Problem[];
  private ActiveProblem: number;
  constructor(roomId: string) {
    this.roomId = roomId;
    this.hasStarted = false;
    this.problems = [];
    this.ActiveProblem = 0;
  }

  addProblem(problem: Problem) {
    this.problems.push(problem)
  }

  start() {
    this.hasStarted = true;
    const io = IoManager.getIo();
    io.emit("CHANGE_PROBLEM", {
      problem: this.problems[0]
    })
  }

  next() {
    this.ActiveProblem++;
    const problem = this.problems[this.ActiveProblem];
    const io = IoManager.getIo();


    if (problem) {
      io.emit("CHANGE_PROBLEM", {
        problem
      })
    }
    else {
      io.emit("QUIZ_ENDED")
    }
   
  }
}