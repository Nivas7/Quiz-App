import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import CreateProblem from "./CreateProblem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import QuizControls from "./QuizControls";

const Admin = () => {

  const [socket, setSocket] = useState<null | any>(null);
  const [quizId, setQuizId] = useState("");
  const [roomId, setRooId] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);

    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("joinAdmin", {
        password: "ADMIN_PASSWORD"
      })
    })
  }, []);
    if(!quizId) {
      return(
        <Card className="w-[350px] items-center mx-auto mt-[20vh]">
        <CardHeader>
          <CardTitle>Create Room</CardTitle>
          <CardDescription>Create a room to Add Quizz to the Room</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="w-full items-">
            <div className="flex flex-col gap-10">
              <Label htmlFor="name">Room Code</Label>
              <Input id="name" onChange={(e) => {
                setRooId(e.target.value)
              }} />
              <Button onClick={() => {
                socket.emit("createQuiz", {
                  roomId
              });
              setQuizId(roomId);
              }}>Create Room</Button>
            </div>
            </div>
        </CardContent>
        </Card>
      )
    }
    return (
      <div>
        <CreateProblem roomId={quizId} socket={socket} />
        <QuizControls socket={socket} roomId={roomId} />
      </div>
    )
}
 
export default Admin;