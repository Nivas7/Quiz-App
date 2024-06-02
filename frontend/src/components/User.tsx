import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Quiz } from "./Quiz";
import { LeaderBoard } from "./Leaderboard/leadreboard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const User = () => {
    const [name, setName] = useState("");
    const [submitted, setSubmitted] = useState(true);
    const [code, setCode] = useState("");
    if (!submitted) {
        return (
          <Card className="w-[350px] items-center mx-auto mt-10">
          <CardHeader>
            <CardTitle>join Room</CardTitle>
            <CardDescription>Enter a Room Code to Join a Quizz</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="w-full items-">
            <div className="flex flex-col gap-10">
              <Label htmlFor="name">Room Code</Label>
              <Input id="name" onChange={(e) => {
                setCode(e.target.value)
              }} />
              <Button onClick={() => {
                setSubmitted(true)
              }}>Create Room</Button>
            </div>
            </div>
          </CardContent>
          </Card>
        )
    }

    return <UserLoggedin code={code} name={name} />
}


export const UserLoggedin = ({name, code} : {name: string, code: string}) => {
    const [socket, setSocket] = useState<null | any>(null);
    const roomId = code;
    const [currentState, setCurrentState] = useState("not_started");
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const socket = io("http://localhost:3000");
        setSocket(socket)

        socket.on("connect", () => {
            console.log(socket.id);
            socket.emit("join", {
                roomId,
                name
            })
        });
        
        socket.on("init", ({userId, state}) => {
            setUserId(userId);

            if (state.leaderboard) {
                setLeaderboard(state.leaderboard)
            }

            if (state.problem) {
                setCurrentQuestion(state.problem);
            }

            setCurrentState(state.type);
        });

        socket.on("leaderboard", (data) => {
            setCurrentState("leaderboard");
            setLeaderboard(data.leaderboard);
        });
        socket.on("problem", (data) => {
            setCurrentState("question");
            setCurrentQuestion(data.problem);
        })
    }, []);

    if (currentState === "not_started") {
        return <div>
            This quiz hasnt started yet
        </div>
    }
    if (currentState === "question") {
        return <Quiz roomId={roomId} userId={userId} problemId={currentQuestion.id} quizData={{
            title: currentQuestion.description,
            options: currentQuestion.options
        }} socket={socket} />
    }

    if (currentState === "leaderboard") {
        return <LeaderBoard leaderboardData={leaderboard.map((x: any) => ({
            points: x.points,
            username: x.name,
            image: x.image
        }))} />
    }

    return <div>
        <br/>
        Quiz has ended
        {currentState}
    </div>
}


export default User;