import React, { createContext, useContext, useEffect, useRef } from "react";
import ReconnectingWebSocket from "react-native-reconnecting-websocket";
import { getDataFromAsync } from "utils/LocalStorage";
import store from "store";
import {
  handleIceCandidate,
  handleIncomingCall,
  handleReceiveCall,
  hangUpCallForEndCall,
} from "store/slices/chat";
import { useDispatch } from "react-redux";
import { useAuth } from "./AuthContext";

const URL = "wss://bedev.dint.com/ws/conversation/global/";

interface WebSocketContextType {
  ws: React.MutableRefObject<ReconnectingWebSocket | null>;
  reconnectWebSocket: () => void;
  sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC = ({ children }) => {
  const ws = useRef<ReconnectingWebSocket | null>(null);
  const { userId } = useAuth();
  const reconnectWebSocket = async () => {
    const token = await getDataFromAsync("token");
    if (token) {
      connectWebSocket(token);
    }
  };

  const connectWebSocket = (token: string) => {
    ws.current = new ReconnectingWebSocket(`${URL}?token=${token}`);

    ws.current.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event?.data);
      console.log("WebSocket message received:", message);

      switch (message.type) {
        case "receive_offer":
          if (message.content.content.sender !== userId) {
            console.log(
              "🚀 ~ connectWebSocket ~ receive_offer:",
              userId,
              message
            );
            store.dispatch(
              handleIncomingCall({
                record_id: message.content.content.record_id,
                sender: message.content.content.channel_id,
                offer: message.offer,
              })
            );
          }
          break;
        case "receive_answer":
          if (message.content.content.sender !== userId) {
            console.log(
              "🚀 ~ connectWebSocket ~ receive_answer:",
              userId,
              message
            );
            store.dispatch(handleReceiveCall({ answer: message.answer }));
          }
          break;
        case "receive_ice_candidate":
          if (message.content.content.sender !== userId) {
            store.dispatch(handleIceCandidate({ message }));
          }
          break;
        case "participant_left":
          if (message.content.content.sender !== userId) {
            console.log(
              "🚀 ~ useEffect ~ receive_ice_candidate:",
              userId,
              message
            );
            store.dispatch(hangUpCallForEndCall({}));
          }
          break;
        default:
          console.log("Unknown message type:", message.type);
      }
    };
  };

  const sendMessage = async (message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      await reconnectWebSocket();
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(message));
      }
    }
  };

  useEffect(() => {
    reconnectWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ ws, reconnectWebSocket, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
