import React, { createContext, useState, useEffect,useContext } from 'react';
import io from 'socket.io-client';

// Creating a context for Socket
const SocketContext = createContext();
// Custom hook to consume the socket from context
export const useSocket = () => {
    return useContext(SocketContext);
  };
function SocketPro({ children }) {
  const [socket, setSocket] = useState(null);  // Set initial state to null

  useEffect(() => {
    // Establish socket connection
    const socketConnection = io('http://localhost:3000');
    setSocket(socketConnection);

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketPro;
