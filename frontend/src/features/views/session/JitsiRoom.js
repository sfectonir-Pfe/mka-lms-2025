// src/components/JitsiRoom.js
import React from 'react';

const JitsiRoom = ({ roomName = "lms-default-room" }) => {
// const domain = "meet.jitsi.local:8081";
// const iframeSrc = `https://${domain}/${roomName}`;
const domain = "localhost:8443";
const iframeSrc = `https://${domain}/${roomName}`;

  return (
    <div style={{ height: "90vh", width: "100%", marginTop: "10px" }}>
     <iframe
  allow="camera; microphone; fullscreen; display-capture; screen-wake-lock"
  src={iframeSrc}
  style={{ height: "100%", width: "100%", border: 0 }}
  title="Jitsi Meeting"
/>
    </div>
  );
};

export default JitsiRoom;

