import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '../SocketPro';
import { usePeer } from '../PeerPro';

function Video({ form }) {
  const socket = useSocket();
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [room, setRoom] = useState(1);
  const [size, setSize] = useState(0);
  const { createOffer1, createAnswer1, setRemoteAns, sendStream, remoteStream } = usePeer();

  const getUserStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  }, []);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (socket) {
     
      socket.emit('findPartner')
      
      socket.on('connected',async (data)=>{
        const {roomId}=data;

        const offer = await createOffer1();
        socket.emit('offer', {roomId,offer});
        
        socket.on('receiveOffer',async (data)=>{
          const {offer, from}=data;
          const ans = await createAnswer1(offer);
          alert("A user connected !")
          socket.emit('answer',{roomId,ans});
        })
        
       

      })

      socket.on('receiveAnswer',async (data)=>{
        console.log("-----------------")
        const {ans,from}=data; 
        console.log("setting remote answer",ans);
        await setRemoteAns(ans);

        // Send the stream only after the offer is created and sent
        sendStream(stream);
 })  

    


      // socket.emit('joinRoom', room);
      // socket.on('message', (data) => setSize(data));

      // socket.on('call-accept', async (data) => {
      //   const { offer, userId } = data;
      //   const ans = await createAnswer1(offer);
      //   socket.emit('call-accepted', { userId, ans });
      // });

      // socket.on('call-accepted', async (data) => {
      //   const { ans } = data;
      //   await setRemoteAns(ans);
      // });
    }

    getUserStream();

    return () => {

      socket.off('findPartner')
      socket.off('connected');
      socket.off('offer');
      socket.off('receiveOffer');
      socket.off('receiveAnswer');
      // socket.off('message');
      // socket.off('call-accept');
      // socket.off('call-accepted');
    };
  }, [socket, room, getUserStream]);

  // const handleStart = async () => {
    
  // };

  return (
    <div>
      <h2>Video: {form.name} - Email: {form.email}</h2>
      <p>Available users: {size}</p>
      <button onClick={() => sendStream(stream)}>Send Stream</button>
      <video ref={videoRef} autoPlay muted playsInline />
      <video ref={remoteVideoRef} autoPlay playsInline />
      {/* <button onClick={handleStart}>Start</button> */}
    </div>
  );
}

export default Video;
