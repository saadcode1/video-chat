import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

const PeerContext = React.createContext();

export const usePeer = () => useContext(PeerContext);

function PeerPro({ children }) {
  const [remoteStream, setRemoteStream] = useState(null);

  const peer = useMemo(() => {
    return new RTCPeerConnection({
      iceServers: [
        {
          urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'],
        },
      ],
    });
  }, []);

  const createOffer1 = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    console.log("---offer---",offer);
    return offer;
  };

  const createAnswer1 = async (offer) => {
    try {
      await peer.setRemoteDescription(new RTCSessionDescription(offer)); // Set remote offer description
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      console.log("---answer---",answer);
      return answer;
    } catch (err) {
      console.log('Error while creating answer', err);
    }
  };

  const setRemoteAns = async (ans) => {
    try {
      await peer.setRemoteDescription(new RTCSessionDescription(ans));
      console.log('Remote answer set successfully');
    } catch (err) {
      console.error('Error while setting remote description:', err);
    }
  };
 
  const sendStream = (stream) => {
    const tracks = stream.getTracks();
    for (const track of tracks) {
      if (!peer.getSenders().find(sender => sender.track === track)) {
        peer.addTrack(track, stream);
      }
    }
  };
  

  const handleTrack = useCallback((ev) => {
    setRemoteStream(ev.streams[0]); // Correct way to access the first remote stream
  }, []);

  useEffect(() => {
    peer.addEventListener('track', handleTrack);
    return () => peer.removeEventListener('track', handleTrack);
  }, [peer, handleTrack]);

  return (
    <PeerContext.Provider value={{ peer, createOffer1, createAnswer1, setRemoteAns, sendStream, remoteStream }}>
      {children}
    </PeerContext.Provider>
  );
}

export default PeerPro;
