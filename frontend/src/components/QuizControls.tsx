import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const QuizControls = ({socket, roomId}: {socket: any, roomId: string}) => {
  return (
    <Card className="w-[350px] items-center mx-auto mt-5">
        <CardHeader>
          <CardTitle>Quiz Controls</CardTitle>
        </CardHeader>
        <CardContent className="items-center">
          <Button onClick={() => {
            socket.emit("next", {
              roomId
            })
          }}>Next Problem</Button>
      </CardContent>
      </Card>
  );
}
 
export default QuizControls;