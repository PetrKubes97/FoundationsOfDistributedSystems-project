import { Stage } from '@inlet/react-pixi';
import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Menu } from './components/Menu';
import Tank from './components/Tank';
import { WallComponent } from './components/Wall';
import { Direction, GameState, TankState } from './models/GameState';

interface Props {}

const width = 700;
const height = 700;

const ROOT_OFFER = 'root_offer';
const NODE_OFFER = 'node_offer';
const ICE_OFFER = 'ice_offer';

const configuration = {
  iceServers: [
    {
      urls: 'stun:openrelay.metered.ca:80',
    },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
};

export const TankGame: React.FC<Props> = ({}) => {
  const [isRoot, setIsRoot] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>();
  var socket: Socket;
  var connection: RTCPeerConnection;
  var channel: RTCDataChannel;
  const [currentTankState, setCurrentTankState] = useState<TankState>({
    color: 0x00ff00,
    dir: { x: 0, y: 0 },
    pos: { x: 100, y: 100 },
  });

  const sendMessage = (channel: string, message: any) => {
    console.log('sendMessage', channel, message);
    socket.emit('message', { channel, message });
  };

  const sendData = (data: any) => {
    const stringified = JSON.stringify(data);
    console.log(channel);
    channel?.send(stringified);
  };

  useEffect(() => {
    if (!socket) socket = io('ws://localhost:4000');
    if (!connection) connection = new RTCPeerConnection(configuration);

    connection.ondatachannel = (channelEvent) => {
      const ch = channelEvent.channel;
      ch.onmessage = (event) => {
        const parsed: GameState = JSON.parse(event.data);
        setGameState(parsed);
      };
    };

    connection.onicecandidate = (iceEvent) => {
      console.log('On ice');
      if (iceEvent.candidate) {
        sendMessage(ICE_OFFER, {
          label: iceEvent.candidate.sdpMLineIndex,
          id: iceEvent.candidate.sdpMid,
          candidate: iceEvent.candidate.candidate,
        });
      }
    };

    socket.on('message', (message) => {
      console.log('Client received message:', message);
    });

    socket.on(ROOT_OFFER, (message) => {
      console.log('Client received ROOT_OFFER:', message);
      connection
        .setRemoteDescription(message)
        .then(() => connection.createAnswer())
        .then((answer) => connection.setLocalDescription(answer))
        .then(() => sendMessage(NODE_OFFER, connection.localDescription))
        .then(() => setConnected(true))
        .catch((err) => console.error(err));
    });

    socket.on(NODE_OFFER, (message) => {
      console.log('Client received NODE_OFFER:', message);
      connection.setRemoteDescription(message);
    });

    socket.on(ICE_OFFER, (message) => {
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate,
      });
      connection.addIceCandidate(candidate);
    });
  }, []);

  const initGame = () => {
    setIsRoot(true);
    socket = io('ws://localhost:4000');
    connection = new RTCPeerConnection(configuration);

    channel = connection.createDataChannel('sendDataChannel', undefined);
    console.error(channel);

    channel.onmessage = (event) => {
      const parsed: GameState = JSON.parse(event.data);
      setGameState(parsed);
    };

    connection
      .createOffer()
      .then((offer) => connection.setLocalDescription(offer))
      .then(() => sendMessage(ROOT_OFFER, connection.localDescription))
      .catch((err) => console.error(err));
    setConnected(true);

    // Add tank to game state
    setGameState({ tankState: currentTankState });
    sendData(gameState);
  };

  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      event.preventDefault();

      let dir: Direction = currentTankState.dir;
      switch (event.code) {
        case 'ArrowUp':
          dir = { ...dir, y: -1 };
          break;
        case 'ArrowDown':
          dir = { ...dir, y: 1 };
          break;
        case 'ArrowLeft':
          dir = { ...dir, x: -1 };
          break;
        case 'ArrowRight':
          dir = { ...dir, x: 1 };
          break;
      }
      setCurrentTankState((ts) => ({ ...ts, dir }));
    });

    document.addEventListener('keyup', function (event) {
      switch (event.code) {
        case 'ArrowLeft':
        case 'ArrowDown':
        case 'ArrowRight':
        case 'ArrowUp':
          setCurrentTankState((ts) => ({ ...ts, dir: { x: 0, y: 0 } }));
          break;
      }
    });
  }, []);

  useEffect(() => {
    setGameState({ tankState: currentTankState });
    sendData(gameState);
  }, [currentTankState]);

  return (
    <>
      <Menu initGame={initGame} isRoot={isRoot} connected={connected} />
      {connected && (
        <Stage
          width={width}
          height={height}
          options={{ backgroundColor: 0x505152 }}
        >
          <Tank
            tankState={currentTankState}
            setTankState={setCurrentTankState}
          />
          <WallComponent />
        </Stage>
      )}
    </>
  );
};

export default TankGame;
