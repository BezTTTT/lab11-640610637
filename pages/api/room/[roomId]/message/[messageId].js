import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
  writeUsersDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  //get ids from url
  const roomId = req.query.roomId;
  const messageId = req.query.messageId;
  //check token
  const user = checkToken(req);
  const rooms = readChatRoomsDB();
  if (!user) {
    return res.status(401).json({
      ok: false,
      message: "Yon don't have permission to access this api",
    });
  }
  //check if roomId exist
  const findRoom = rooms.findIndex((x) => x.roomId === roomId);
  if (findRoom === -1)
    return res.status(404).json({ ok: false, message: "Invalid room id" });
  //check if messageId exist
  const delMsg = rooms[findRoom].messages.findIndex(
    (x) => x.messageId === messageId
  );
  if (delMsg === -1)
    return res.status(404).json({ ok: false, message: "Invalid message id" });
  //check if token owner is admin, they can delete any message
  if (user.isAdmin === true) {
    rooms[findRoom].messages.splice(delMsg, 1);
    writeChatRoomsDB(rooms);
    return res.json({ ok: true });
  }
  const userName = req.query.userName;
  const findUser = rooms[findRoom].messages.findIndex(
    (x) => x.username === userName
  );
  if (!findUser) {
    return res.status(403).json({
      ok: false,
      message: "You don't have permission to access this data",
    });
  } else {
    rooms[findRoom].messages.splice(delMsg, 1);
    writeChatRoomsDB(rooms);
    return res.json({ ok: true });
  }

  //or if token owner is normal user, they can only delete their own message!
}
