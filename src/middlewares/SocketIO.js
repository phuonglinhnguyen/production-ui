import { connect } from 'socket.io-client'
export const JOIN_ROOM='JOIN_ROOM';
export const JOIN_ROOM_REJECT='JOIN_ROOM_REJECT';
export const INFO='INFO';
export type RoomType ={app_name:string,username:string, project_name?:string,task_name?:string}
export const joinRoom = (props:RoomType)=>{
 return {
    "type": JOIN_ROOM,
    "payload": {
      "app_name": props.app_name,
      "user_name": props.username,
      "project_name": props.project_name||'',
      "task_name": props.task_name||''
    }
  }
}
const optionSocket = {
  secure: false,
  jsonp: false,
  forceNew: true,
  autoConnect: true,
  reconnect: true,
  reconnectionDelay: 5 * 1000,
  reconnectionDelayMax: 8 * 1000,
  reconnectionAttempts: Infinity,
  timeout: 6 * 1000,
  path: '/ws',
  transports: ["websocket", "polling"],
  upgrade: false
}

export type OptionSocketType={
  secure: boolean,
  jsonp: boolean,
  forceNew: boolean,
  autoConnect: boolean,
  reconnect: boolean,
  reconnectionDelay: number,
  reconnectionDelayMax: number,
  reconnectionAttempts: any,
  timeout: number,
  path: string,
  transports: string[],
  upgrade: boolean
}

type Props ={
  url:string,
  option?:OptionSocketType,
  onMessage?:Function,
  onError?:Function,
  onDisconnect?:Function,
}

export class SocketIO {
  constructor(props:Props) {
    const { url, option } = props;
    this.props = props;
    this.state = {
      url: url,
      opts: { ...optionSocket, ...option }
    }
  }
  connect = (props:{token:string, username:string, app_name:string}) => {
    this.disconnect();
    const {token}= props;
    const { url, opts } = this.state;
    let _opts = { ...opts, query: { token: token } }
    const socket = connect(url, _opts);
    this.socket = socket;
    this.loadEvent(props)
  }
  disconnect=()=>{
    if (this.socket) {
      this.socket.destroy();
      delete this.socket;
      this.socket = null;
    }
    return true;
  }
  loadEvent = (props:{username:string, app_name:string}) => {
    const {username,app_name}= props;
    const socket = this.socket;
    const self = this;
    socket.on('message', this.handleMessage);
    socket.on('error', this.handleError);
    socket.on('disconnect', this.handleDisconnect);
    socket.on("connect", () => {
      if (socket.connected) {
        if(self.room){
          console.log(`Re-connected to socket server`);
          self.reconnect =true;
          socket.send(joinRoom(self.room));  
        }else{
          console.log(`Connected to socket server`);
          self.connected =true;
          socket.send(joinRoom({
              app_name,
              username
            }));
        }
      }
    });
  }
  joinRoom=(room:RoomType)=>{
    this.room = room;
    this.socket.send(joinRoom(room));
  }
  sendMessage = (action) => {
    this.socket.send(action);
  }

  handleMessage = (message) => {
    const { onMessage } = this.props;
    if (onMessage) {
      onMessage(message);
    } 
  }
  handleError = (error) => {
    const { onError } = this.props;
    if (onError) {
      onError(error);
    }
  }
  handleDisconnect = () => {
    const { onDisconnect } = this.props;
    if (onDisconnect) {
      onDisconnect();
    }
  }
}

