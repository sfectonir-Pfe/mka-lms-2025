import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Certificate of participation with thick borders similar to the provided design
// Fetches session data from API using route parameters
export default function Attestation() {
  const { programId, sessionId } = useParams();
  const [sessionData, setSessionData] = useState({
    fullName: '',
    topic: '',
    eventType: '',
    dateText: '',
    company: 'SFECTORIA',
    trainerName: '',
    loading: true
  });
  const [sessionName, setSessionName] = useState('');
  const [programName, setProgramName] = useState('');

    // Fetch session data from API
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        // Get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem('user')) || {};
        
        // Get trainer data
        const currentTrainer = JSON.parse(localStorage.getItem('currentTrainer')) || 
                              JSON.parse(localStorage.getItem('trainer')) ||
                              JSON.parse(localStorage.getItem('formateur')) || {};
        
        let sessionName = '';
        let programName = '';
        
        // Fetch session data if sessionId exists
        if (sessionId) {
          try {
            const sessionRes = await axios.get(`http://localhost:8000/session2/${sessionId}`);
            const session = sessionRes.data;
            sessionName = session?.name || '';
            programName = session?.program?.name || '';
            
            console.log('Session data fetched:', session);
            console.log('Session name:', sessionName);
            console.log('Program name:', programName);
          } catch (error) {
            console.error('Error fetching session:', error);
          }
        }
        
        // Fetch program data if programId exists
        if (programId && !programName) {
          try {
            const programRes = await axios.get(`http://localhost:8000/programs/${programId}`);
            programName = programRes.data?.name || '';
            
            console.log('Program data fetched:', programRes.data);
            console.log('Program name:', programName);
          } catch (error) {
            console.error('Error fetching program:', error);
          }
        }
        
        // Set the session name as topic in uppercase
        const topic = (sessionName || programName || '').toUpperCase();
        
        setSessionData({
          fullName: currentUser.firstName || currentUser.name || currentUser.email || 'Student Name',
          topic: topic,
          eventType: 'WORKSHOP',
          dateText: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          company: 'SFECTORIA',
          trainerName: currentTrainer.name || currentTrainer.fullName || currentTrainer.username || 'Trainer Name',
          loading: false
        });
        
        setSessionName(sessionName);
        setProgramName(programName);
        
      } catch (error) {
        console.error('Error fetching session data:', error);
        setSessionData({
          fullName: 'Student Name',
          topic: '',
          eventType: 'WORKSHOP',
          dateText: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          company: 'SFECTORIA',
          trainerName: 'Trainer Name',
          loading: false
        });
      }
    };

    fetchSessionData();
  }, [sessionId, programId]); // Re-run when sessionId or programId changes

  const handleDownload = () => {
    // Create a canvas element to render the certificate
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to A4 landscape dimensions (1123 x 794 pixels at 96 DPI)
    canvas.width = 1123;
    canvas.height = 794;
    
    // Set background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw outer border
    ctx.fillStyle = dark;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw inner border
    ctx.fillStyle = teal;
    ctx.fillRect(16, 16, canvas.width - 32, canvas.height - 32);
    
    // Draw white content area
    ctx.fillStyle = '#fff';
    ctx.fillRect(30, 30, canvas.width - 60, canvas.height - 60);
    
    // Add text content (simplified version)
    ctx.fillStyle = dark;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE', canvas.width / 2, 120);
    
    ctx.font = '24px Arial';
    ctx.fillText('Of Participation', canvas.width / 2, 160);
    
    ctx.font = '20px Arial';
    ctx.fillText(`This certificate is presented to ${sessionData.fullName}`, canvas.width / 2, 220);
    
    ctx.font = '16px Arial';
    ctx.fillText(`participating in ${sessionData.eventType} about ${sessionData.topic}`, canvas.width / 2, 260);
    ctx.fillText(`held on ${sessionData.dateText} by ${sessionData.company} company.`, canvas.width / 2, 290);
    
    // Add trainer signature on the right
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('TRAINER', canvas.width - 80, 400);
    ctx.fillText(sessionData.trainerName, canvas.width / 2, 420);
    
    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${sessionData.fullName.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };
  return (
    <div style={styles.pageWrapper}>
      <div style={styles.frameOuter}>
        <div style={styles.frameInner}>
          {/* Corner accents */}
          <div style={{ ...styles.corner, ...styles.cornerTL }} />
          <div style={{ ...styles.corner, ...styles.cornerTR }} />
          <div style={{ ...styles.corner, ...styles.cornerBL }} />
          <div style={{ ...styles.corner, ...styles.cornerBR }} />

                      <div style={styles.content}>
              {sessionData.loading ? (
                <div style={styles.loading}>Loading certificate data...</div>
              ) : (
                <>
                  <div style={styles.headerRow}>
                    <div style={styles.brandLeft}>{sessionData.company}</div>
                    <div style={styles.brandRight}>
                      <div style={styles.mkaLogo}>
                        <span style={styles.mkaLetter}>M</span>
                        <span style={styles.mkaLetter}>K</span>
                        <span style={styles.mkaLetter}>A</span>
                        <div style={styles.mkaDot}></div>
            </div>
          </div>
        </div>

                  <h1 style={styles.title}>CERTIFICATE</h1>
                  <div style={styles.subtitle}>Of Participation</div>

                  <div style={styles.helper}>This certificate is presented to</div>
                  <div style={styles.name}>{sessionData.fullName}</div>

                                                                                          <div style={styles.paragraph}>
                    participating in <span style={styles.bold}>{sessionData.eventType}</span> about{' '}
                    <span style={styles.bold}>
                      {sessionData.topic || 'Session Name Not Found'}
                    </span>
                    <br />
                    held on {sessionData.dateText} by {sessionData.company} company.
                  </div>

                  <div style={styles.trainerBlock}>
                    <div style={styles.trainerLabel}>TRAINER</div>
                    <div style={styles.trainerName}>{sessionData.trainerName}</div>
            </div>
                </>
              )}
          </div>
        </div>
          </div>

      <div style={styles.controls} className="no-print">
        <button onClick={() => handleDownload()} style={styles.downloadBtn}>Télécharger</button>
      </div>

      <style>
        {`
        @media print {
          .no-print { display: none !important; }
          @page { size: A4 landscape; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        `}
      </style>
    </div>
  );
}

const teal = '#10A4BE';
const dark = '#0A2633';

const styles = {
  pageWrapper: {
    width: '100%',
    minHeight: '100vh',
    background: '#f7fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    boxSizing: 'border-box',
  },
  frameOuter: {
    width: '950px', // Medium size - increased from 800px
    maxWidth: '92vw',
    aspectRatio: '1.414 / 1', // A4 landscape ratio ≈ 1.414:1
    background: '#fff',
    border: `18px solid ${dark}`, // Slightly increased from 16px
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    position: 'relative',
  },
  frameInner: {
    position: 'absolute',
    inset: 16,
    border: `9px solid ${teal}`, // Slightly increased from 8px
    boxSizing: 'border-box',
  },
  corner: {
    position: 'absolute',
    width: 100,
    height: 10,
    background: teal,
  },
  cornerTL: { top: 26, left: 26 },
  cornerTR: { top: 26, right: 26 },
  cornerBL: { bottom: 26, left: 26, height: 12 },
  cornerBR: { bottom: 26, right: 26, height: 12 },
  content: {
    position: 'absolute',
    inset: 0,
    padding: '60px 70px',
    textAlign: 'center',
    fontFamily: 'Inter, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    color: dark,
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 700,
    fontSize: 20,
    color: teal,
  },
  brandLeft: { letterSpacing: 2 },
  brandRight: { 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mkaLogo: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: dark,
    padding: '8px 16px',
    borderRadius: '6px',
  },
  mkaLetter: {
    fontSize: 24,
    fontWeight: 800,
    color: '#f5f5dc',
    letterSpacing: 1,
    position: 'relative',
  },
  mkaDot: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '8px',
    height: '8px',
    backgroundColor: '#f5f5dc',
    borderRadius: '50%',
  },
  title: {
    fontSize: 60,
    letterSpacing: 5,
    margin: '35px 0 0',
    fontWeight: 800,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 4,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#6b7b86',
  },
  helper: {
    marginTop: 36,
    fontSize: 16,
    color: '#6b7b86',
  },
  name: {
    marginTop: 12,
    fontSize: 32,
    fontWeight: 800,
  },
  paragraph: {
    marginTop: 24,
    fontSize: 18,
    lineHeight: 1.6,
  },
  bold: { fontWeight: 800 },
  trainerBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 54,
    position: 'absolute',
    bottom: 60,
    right: 60,
  },
  trainerLabel: {
    fontSize: 14,
    letterSpacing: 2,
    color: '#6b7b86',
  },
  trainerName: {
    marginTop: 8,
    borderTop: '2px solid #c7d1d8',
    paddingTop: 8,
    minWidth: 220,
    textAlign: 'right',
    fontWeight: 600,
  },
  controls: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'center',
  },
  downloadBtn: {
    background: teal,
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontSize: 18,
    color: '#6b7b86',
  },
};

 