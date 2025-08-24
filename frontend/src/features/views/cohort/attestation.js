import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Certificate of participation with thick borders similar to the provided design
// Fetches session data from API using route parameters
export default function Attestation() {
  const { programId, sessionId } = useParams();
  
  // Debug: Log params immediately
  console.log('=== COMPONENT PARAMS DEBUG ===');
  console.log('programId from useParams:', programId);
  console.log('sessionId from useParams:', sessionId);
  console.log('=== END COMPONENT DEBUG ===');
  
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
              // Get current user from localStorage (moved outside try-catch)
        const currentUser = JSON.parse(localStorage.getItem('user')) || {};
        
        // Debug: Check all localStorage keys for establishment data
        console.log('=== LOCALSTORAGE ESTABLISHMENT DEBUG ===');
        const allKeys = Object.keys(localStorage);
        console.log('All localStorage keys:', allKeys);
        
        const establishmentKeys = allKeys.filter(key => 
          key.toLowerCase().includes('etablissement') || 
          key.toLowerCase().includes('organization') || 
          key.toLowerCase().includes('establishment') || 
          key.toLowerCase().includes('institution') ||
          key.toLowerCase().includes('company') ||
          key.toLowerCase().includes('user')
        );
        console.log('Establishment-related localStorage keys:', establishmentKeys);
        
        establishmentKeys.forEach(key => {
          try {
            const value = localStorage.getItem(key);
            console.log(`${key}:`, value);
            
            // Try to parse JSON and look for establishment
            if (value && value.startsWith('{')) {
              try {
                const parsed = JSON.parse(value);
                console.log(`${key} (parsed):`, parsed);
                
                // Look for establishment in parsed object
                if (parsed.establishment) console.log(`${key}.establishment:`, parsed.establishment);
                if (parsed.etablissement) console.log(`${key}.etablissement:`, parsed.etablissement);
                if (parsed.organization) console.log(`${key}.organization:`, parsed.organization);
                if (parsed.institution) console.log(`${key}.institution:`, parsed.institution);
              } catch (parseError) {
                console.log(`${key} (not JSON):`, value);
              }
            }
          } catch (e) {
            console.log(`${key}: [Error reading]`);
          }
        });
        console.log('=== END LOCALSTORAGE DEBUG ===');
      
      try {
        // Debug: Log route parameters
        console.log('=== ROUTE PARAMETERS DEBUG ===');
        console.log('sessionId:', sessionId);
        console.log('programId:', programId);
        
        // Check URL search params as fallback
        const searchParams = new URLSearchParams(window.location.search);
        const urlSessionId = searchParams.get('sessionId') || searchParams.get('session') || searchParams.get('id');
        const urlProgramId = searchParams.get('programId') || searchParams.get('program') || searchParams.get('pid');
        const urlEstablishment = searchParams.get('establishment') || searchParams.get('etablissement') || searchParams.get('company');
        console.log('URL search params - sessionId:', urlSessionId);
        console.log('URL search params - programId:', urlProgramId);
        console.log('URL search params - establishment:', urlEstablishment);
        
        // Use URL params if route params are not available
        const finalSessionId = sessionId || urlSessionId;
        const finalProgramId = programId || urlProgramId;
        console.log('Final sessionId to use:', finalSessionId);
        console.log('Final programId to use:', finalProgramId);
        console.log('=== END ROUTE DEBUG ===');
        
        // Get trainer data
        const currentTrainer = JSON.parse(localStorage.getItem('currentTrainer')) || 
                              JSON.parse(localStorage.getItem('trainer')) ||
                              JSON.parse(localStorage.getItem('formateur')) || {};
        
        let sessionName = '';
        let programName = '';
        
        // Get authentication token from multiple possible sources
        const token = localStorage.getItem('token') || 
                     localStorage.getItem('accessToken') ||
                     localStorage.getItem('authToken') ||
                     sessionStorage.getItem('token') || 
                     sessionStorage.getItem('accessToken') ||
                     sessionStorage.getItem('authToken') ||
                     '';
        console.log('Auth token found:', token ? 'Yes' : 'No');
        console.log('Token length:', token.length);
        console.log('Token preview:', token.substring(0, 20) + '...');
        
        // Fetch session data if finalSessionId exists
        if (finalSessionId) {
          try {
            console.log('Fetching session with ID:', finalSessionId);
            console.log('API URL:', `http://localhost:8000/session2/${finalSessionId}`);
            
            const sessionRes = await axios.get(`http://localhost:8000/session2/${finalSessionId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            const session = sessionRes.data;
            sessionName = session?.name || '';
            programName = session?.program?.name || '';
            
            console.log('Session data fetched:', session);
            console.log('Session name:', sessionName);
            console.log('Program name:', programName);
          } catch (error) {
            console.error('Error fetching session:', error);
            console.error('Error details:', {
              message: error.message,
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
              config: {
                url: error.config?.url,
                method: error.config?.method
              }
            });
          }
        } else {
          console.log('No sessionId provided');
        }
        
        // Fetch program data if finalProgramId exists
        if (finalProgramId && !programName) {
          try {
            console.log('Fetching program with ID:', finalProgramId);
            console.log('API URL:', `http://localhost:8000/programs/${finalProgramId}`);
            
            const programRes = await axios.get(`http://localhost:8000/programs/${finalProgramId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            programName = programRes.data?.name || '';
            
            console.log('Program data fetched:', programRes.data);
            console.log('Program name:', programName);
    } catch (error) {
            console.error('Error fetching program:', error);
            console.error('Program error details:', {
              message: error.message,
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data
            });
          }
        } else if (finalProgramId) {
          console.log('ProgramId provided but programName already set:', finalProgramId);
        } else {
          console.log('No programId provided');
        }
        
        // Set the session name as topic
        let topic = sessionName || programName || '';
        // Convert to uppercase
        topic = topic.toUpperCase();
        console.log('Final topic from API (uppercase):', topic);
        
        // Fallback: If API calls failed, try to get session name from localStorage
        if (!topic) {
          console.log('No session name from API, trying localStorage fallbacks...');
          
          // Try multiple localStorage keys for session data
          const localStorageSession = JSON.parse(localStorage.getItem('currentSession') || 'null') ||
                                   JSON.parse(localStorage.getItem('session') || 'null') ||
                                   JSON.parse(localStorage.getItem('activeSession') || 'null') ||
                                   JSON.parse(localStorage.getItem('sessionData') || 'null') ||
                                   JSON.parse(localStorage.getItem('currentSessionData') || 'null') ||
                                   {};
          
          // Try multiple localStorage keys for course/program data
          const localStorageCourse = JSON.parse(localStorage.getItem('currentCourse') || 'null') ||
                                  JSON.parse(localStorage.getItem('course') || 'null') ||
                                  JSON.parse(localStorage.getItem('activeCourse') || 'null') ||
                                  JSON.parse(localStorage.getItem('courseData') || 'null') ||
                                  JSON.parse(localStorage.getItem('program') || 'null') ||
                                  {};
          
          // Try to find session name from localStorage
          topic = localStorageSession.title || 
                  localStorageSession.name || 
                  localStorageSession.sessionName ||
                  localStorageSession.sessionTitle ||
                  localStorageCourse.title || 
                  localStorageCourse.name || 
                  localStorageCourse.courseName ||
                  localStorageCourse.programName ||
                  '';
          
          // Convert to uppercase
          topic = topic.toUpperCase();
          
          console.log('localStorage fallback - session:', localStorageSession);
          console.log('localStorage fallback - course:', localStorageCourse);
          console.log('localStorage fallback - found topic (uppercase):', topic);
        }
        
        // Final fallback: Use a default session name if nothing is found
        if (!topic) {
          topic = 'INTRO TO WEB DEVELOPMENT'; // Default session name (already uppercase)
          console.log('Using default session name (uppercase):', topic);
        }
        
        console.log('Final topic after all fallbacks:', topic);
        
        // Get establishment name from user data
        console.log('=== ESTABLISHMENT DEBUG ===');
        console.log('Current user data:', currentUser);
        console.log('User etablissement:', currentUser?.etablissement);
        console.log('User organization:', currentUser?.organization);
        console.log('User establishment:', currentUser?.establishment);
        console.log('User institution:', currentUser?.institution);
        
        // Try to get establishment from sessionStorage as well
        const sessionUser = JSON.parse(sessionStorage.getItem('user') || 'null');
        console.log('SessionStorage user:', sessionUser);
        console.log('SessionStorage etablissement:', sessionUser?.etablissement);
        
        // Try to get establishment from localStorage or sessionStorage
        let userEstablishment = '';
        
        // Check if establishment is stored directly in user data
        if (currentUser?.establishment) {
          userEstablishment = currentUser.establishment;
          console.log('Establishment found in currentUser:', userEstablishment);
        } else if (sessionUser?.establishment) {
          userEstablishment = sessionUser.establishment;
          console.log('Establishment found in sessionUser:', userEstablishment);
        }
        
        // If not found, try to get from localStorage with different keys
        if (!userEstablishment) {
          const establishmentFromStorage = localStorage.getItem('establishment') || 
                                         localStorage.getItem('userEstablishment') ||
                                         localStorage.getItem('user_establishment') ||
                                         sessionStorage.getItem('establishment') ||
                                         sessionStorage.getItem('userEstablishment') ||
                                         sessionStorage.getItem('user_establishment');
          
          if (establishmentFromStorage) {
            userEstablishment = establishmentFromStorage;
            console.log('Establishment found in storage:', userEstablishment);
          }
        }
        
        // If still not found, try to extract from user data structure
        if (!userEstablishment && currentUser) {
          // Try different possible field names
          const possibleFields = [
            'establishment',
            'etablissement',
            'organization',
            'institution',
            'company',
            'school',
            'university',
            'college'
          ];
          
          for (const field of possibleFields) {
            if (currentUser[field]) {
              userEstablishment = currentUser[field];
              console.log(`Establishment found in field '${field}':`, userEstablishment);
              break;
            }
          }
        }
        
        // Try to fetch user establishment from API if we have user ID
        if (!userEstablishment && currentUser?.id && token) {
          try {
            console.log('Trying to fetch user establishment from API...');
            
            // Try different endpoints to get user data
            const endpoints = [
              `http://localhost:8000/users/${currentUser.id}`,
              `http://localhost:8000/user/${currentUser.id}`,
              `http://localhost:8000/users/profile`,
              `http://localhost:8000/user/profile`,
              `http://localhost:8000/auth/profile`,
              `http://localhost:8000/auth/me`
            ];
            
            for (const endpoint of endpoints) {
              try {
                console.log('Trying endpoint for establishment:', endpoint);
                const userRes = await axios.get(endpoint, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                const userData = userRes.data;
                if (userData?.establishment) {
                  userEstablishment = userData.establishment;
                  console.log('Establishment found from API:', userEstablishment);
                  break;
                }
              } catch (endpointError) {
                console.log('Failed endpoint for establishment:', endpoint, endpointError.response?.status);
                continue;
              }
            }
          } catch (error) {
            console.error('Error fetching user establishment from API:', error);
          }
        }
        
        console.log('Final userEstablishment value:', userEstablishment);
        
        // ==========================================
        // TO CHANGE ESTABLISHMENT NAME:
        // Replace 'VOTRE_ETABLISSEMENT' below with your actual establishment name
        // Example: 'Université de Tunis', 'École Supérieure', etc.
        // ==========================================
        const defaultEstablishment = 'TUNIR'; // ← CHANGE THIS TO YOUR ESTABLISHMENT NAME
        
        const establishmentName = urlEstablishment ||
                                userEstablishment ||
                                currentUser?.etablissement?.name || 
                                sessionUser?.etablissement?.name ||
                                currentUser?.organization || 
                                sessionUser?.organization ||
                                currentUser?.establishment ||
                                sessionUser?.establishment ||
                                currentUser?.institution ||
                                sessionUser?.institution ||
                                defaultEstablishment; // Use the default instead of 'SFECTORIA'
        
        console.log('Establishment name found:', establishmentName);
        console.log('=== END ESTABLISHMENT DEBUG ===');
        
        setSessionData({
          fullName: currentUser.firstName || currentUser.name || currentUser.email || 'Student Name',
          topic: topic,
          eventType: 'WORKSHOP',
          dateText: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          company: establishmentName,
          trainerName: currentTrainer.name || currentTrainer.fullName || currentTrainer.username || 'Trainer Name',
          loading: false
        });
        
        setSessionName(sessionName);
        setProgramName(programName);
        
      } catch (error) {
        console.error('Error fetching session data:', error);
        // Get establishment name from user data even in error case
        const fallbackEstablishment = currentUser?.etablissement?.name || 
                                    currentUser?.organization || 
                                    currentUser?.establishment ||
                                    currentUser?.institution ||
                                    'SFECTORIA';
        
        setSessionData({
          fullName: 'Student Name',
          topic: '',
          eventType: 'WORKSHOP',
          dateText: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          company: fallbackEstablishment,
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
    
    // Set canvas size to match exactly the display size from styles
    const displayWidth = 950; // Same as frameOuter width in styles
    const displayHeight = Math.round(displayWidth / 1.414); // A4 landscape ratio ≈ 672px
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    
    // Set background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw outer border (dark)
    ctx.fillStyle = dark;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw inner border (teal)
    ctx.fillStyle = teal;
    ctx.fillRect(16, 16, canvas.width - 32, canvas.height - 32);
    
    // Draw white content area
    ctx.fillStyle = '#fff';
    ctx.fillRect(30, 30, canvas.width - 60, canvas.height - 60);
    
    // Draw corner accents (teal lines)
    ctx.fillStyle = teal;
    // Top left corner
    ctx.fillRect(26, 26, 100, 10);
    // Top right corner
    ctx.fillRect(canvas.width - 126, 26, 100, 10);
    // Bottom left corner
    ctx.fillRect(26, canvas.height - 38, 100, 12);
    // Bottom right corner
    ctx.fillRect(canvas.width - 126, canvas.height - 38, 100, 12);
    
    // Add header content - company name on the left
    ctx.fillStyle = teal;
    ctx.font = 'bold 20px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(sessionData.company, 130, 140);
    
    // Draw MKA logo on the right
    ctx.fillStyle = dark;
    ctx.fillRect(canvas.width - 190, 120, 160, 50);
    ctx.fillStyle = '#f5f5dc';
    ctx.font = 'bold 24px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('M', canvas.width - 170, 155);
    ctx.fillText('K', canvas.width - 150, 155);
    ctx.fillText('A', canvas.width - 130, 155);
    
    // Draw MKA dot
    ctx.beginPath();
    ctx.arc(canvas.width - 110, 145, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add main title
    ctx.fillStyle = dark;
    ctx.font = 'bold 60px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE', canvas.width / 2, 280);
    
    // Add subtitle
    ctx.font = '18px Inter, Arial, sans-serif';
    ctx.fillStyle = '#6b7b86';
    ctx.fillText('Of Participation', canvas.width / 2, 310);
    
    // Add helper text
    ctx.font = '16px Inter, Arial, sans-serif';
    ctx.fillText('This certificate is presented to', canvas.width / 2, 360);
    
    // Add name
    ctx.font = 'bold 32px Inter, Arial, sans-serif';
    ctx.fillStyle = dark;
    ctx.fillText(sessionData.fullName, canvas.width / 2, 400);
    
    // Add paragraph with proper formatting
    ctx.font = '18px Inter, Arial, sans-serif';
    ctx.fillStyle = dark;
    ctx.textAlign = 'center';
    
    // Format the text exactly like in the display
    const line1 = `participating in `;
    const line2 = `${sessionData.eventType} about `;
    const line3 = sessionData.topic || 'Session Name Not Found';
    const line4 = `held on ${sessionData.dateText} by ${sessionData.company} company.`;
    
    // Calculate positions to center the text properly
    const centerX = canvas.width / 2;
    let currentY = 440;
    
    // Draw the text with proper spacing
    ctx.fillText(line1, centerX, currentY);
    currentY += 30;
    
    // Draw event type in bold
    ctx.font = 'bold 18px Inter, Arial, sans-serif';
    ctx.fillText(line2, centerX, currentY);
    currentY += 30;
    
    // Draw topic in bold
    ctx.fillText(line3, centerX, currentY);
    currentY += 30;
    
    // Draw the rest in normal weight
    ctx.font = '18px Inter, Arial, sans-serif';
    ctx.fillText(line4, centerX, currentY);
    
    // Add trainer block on the right
    ctx.textAlign = 'right';
    ctx.font = '14px Inter, Arial, sans-serif';
    ctx.fillStyle = '#6b7b86';
    ctx.fillText('TRAINER', canvas.width - 130, 580);
    
    // Draw trainer signature line
    ctx.strokeStyle = '#c7d1d8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width - 350, 600);
    ctx.lineTo(canvas.width - 130, 600);
    ctx.stroke();
    
    // Add trainer name
    ctx.font = 'bold 16px Inter, Arial, sans-serif';
    ctx.fillStyle = dark;
    ctx.fillText(sessionData.trainerName, canvas.width - 130, 620);
    
    // Add small teal line below trainer name (like in the display)
    ctx.fillStyle = teal;
    ctx.fillRect(canvas.width - 150, 630, 40, 2);
    
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

 