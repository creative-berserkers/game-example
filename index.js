import index from './game/src/game_object';
import {Server} from 'cb-http-ws-server';
import {hyperion} from 'cb-http-ws-server';

hyperion({
  wss : Server(),
  index : index
})
