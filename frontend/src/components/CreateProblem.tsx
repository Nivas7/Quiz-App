import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Input } from "./ui/input";

const CreateProblem = ({socket, roomId}: {socket: any, roomId: string}) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("")
  const [answer, setAnswer] = useState(0);
  const [options, setOptions] = useState([{
    id: 0,
    title: ""
  },{
    id: 1,
    title: ""
  },{
    id: 2,
    title: ""
  },{
    id: 3,
    title: ""
  }]) 

  return (
    <Card className="w-[350px] items-center mx-auto mt-5">
    <CardHeader>
      <CardTitle>Create Problem</CardTitle>
      <CardDescription>Create a Problem to Add Quizz to the Room</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid w-full items-center gap-5">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" onChange={(e) => {
            setTitle(e.target.value)
          }} placeholder="Enter a Title of a Problem" />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Input id="description" onChange={(e) => {
            setDescription(e.target.value)
          }} placeholder="Enter a Description  of your Problem" />
        </div>
        {[0, 1, 2, 3].map(optionId => <div key={optionId}> 
            <input className="mr-3" type="radio" checked={optionId === answer} onChange={() => {
                setAnswer(optionId)
            }}></input>
            Option {optionId+1}
            <Input className="mt-5" type="text" onChange={(e) => {
                setOptions(options => options.map(x => {
                    if (x.id === optionId) {
                        return {
                            ...x,
                            title: e.target.value
                        }
                    }
                    return x;
                }))
            }}></Input>
        </div>)}
        <Button onClick={() => {
            socket.emit("createProblem", {
                roomId,
                problem: {
                    title,
                    description,
                    options,
                    answer,
                }
            });
        }}>Add problem</Button>   
      </div>
    </CardContent>
    </Card>
  );
}
 
export default CreateProblem;