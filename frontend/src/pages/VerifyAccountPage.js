import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, TextField, Button, Alert, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
// Firebase imports
import { initializeApp, getApps } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXe6TCaERdwsukMDRPFv1w8mRdWhz3LC0",
  authDomain: "mka-lms-2025.firebaseapp.com",
  projectId: "mka-lms-2025",
  storageBucket: "mka-lms-2025.firebasestorage.app",
  messagingSenderId: "442394619307",
  appId: "1:442394619307:web:6e10d9fc6055a52648b6ee",
  measurementId: "G-LJ70K297YV"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);

const VerifyAccountPage = () => {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recaptchaResolved, setRecaptchaResolved] = useState(false);
    
    // Use refs to manage Firebase objects
    const recaptchaVerifierRef = useRef(null);
    const confirmationResultRef = useRef(null);
    const recaptchaWidgetId = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.phone) {
            setPhone(location.state.phone);
        }
        
        // Initialize reCAPTCHA when component mounts
        initializeRecaptcha();
        
        // Clean up on component unmount
        return () => {
            cleanupRecaptcha();
        };
    }, []);

    const cleanupRecaptcha = () => {
        if (recaptchaVerifierRef.current) {
            try {
                recaptchaVerifierRef.current.clear();
            } catch (error) {
                console.warn('Cleanup error:', error);
            }
            recaptchaVerifierRef.current = null;
        }
        
        if (confirmationResultRef.current) {
            confirmationResultRef.current = null;
        }

        // Reset recaptcha state
        setRecaptchaResolved(false);
        recaptchaWidgetId.current = null;
    };

    const initializeRecaptcha = async () => {
        try {
            // Wait for DOM to be ready
            await new Promise(resolve => setTimeout(resolve, 500));

            if (recaptchaVerifierRef.current) {
                return; // Already initialized
            }

            console.log('Initializing reCAPTCHA...');
            
            // Create reCAPTCHA verifier with invisible type to avoid DOM issues
            recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'normal',
                callback: (response) => {
                    console.log('reCAPTCHA solved:', response);
                    setRecaptchaResolved(true);
                    setError(null);
                },
                'expired-callback': () => {
                    console.warn('reCAPTCHA expired');
                    setRecaptchaResolved(false);
                    setError('reCAPTCHA expired, please solve it again');
                },
                'error-callback': (error) => {
                    console.error('reCAPTCHA error:', error);
                    setError('reCAPTCHA error occurred');
                }
            });

            // Render the reCAPTCHA
            recaptchaWidgetId.current = await recaptchaVerifierRef.current.render();
            console.log('reCAPTCHA initialized successfully');
            
        } catch (error) {
            console.error('Error initializing reCAPTCHA:', error);
            setError('Failed to initialize reCAPTCHA. Please refresh the page.');
        }
    };

    const sendSmsCode = async () => {
        try {
            setLoading(true);
            setError(null);
            setMessage(null);

            // Validate phone number format
            const phoneRegex = /^\+[1-9]\d{1,14}$/;
            if (!phoneRegex.test(phone)) {
                setError('Please enter a valid phone number with country code (e.g., +21653701678)');
                return;
            }

            // Check if reCAPTCHA is resolved
            if (!recaptchaResolved) {
                setError('Please complete the reCAPTCHA verification first');
                return;
            }

            if (!recaptchaVerifierRef.current) {
                setError('reCAPTCHA not initialized. Please refresh the page.');
                return;
            }

            console.log('Sending SMS to:', phone);
            const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifierRef.current);
            confirmationResultRef.current = confirmation;
            
            console.log('SMS sent successfully');
            setMessage('📲 Code envoyé par SMS. Vérifiez votre téléphone.');
            setStep(2);
            
        } catch (error) {
            console.error('SMS Error Details:', error);
            let errorMessage = "Erreur lors de l'envoi du SMS";
            
            // Handle specific Firebase errors
            switch (error.code) {
                case 'auth/billing-not-enabled':
                    errorMessage = 'ERREUR: Firebase Billing non activé. L\'authentification SMS nécessite un plan payant Firebase.';
                    break;
                case 'auth/invalid-phone-number':
                    errorMessage = 'Numéro de téléphone invalide';
                    break;
                case 'auth/missing-phone-number':
                    errorMessage = 'Numéro de téléphone manquant';
                    break;
                case 'auth/quota-exceeded':
                    errorMessage = 'Quota SMS dépassé, réessayez plus tard';
                    break;
                case 'auth/captcha-check-failed':
                    errorMessage = 'Vérification reCAPTCHA échouée. Veuillez la refaire.';
                    setRecaptchaResolved(false);
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Trop de tentatives, réessayez plus tard';
                    break;
                case 'auth/app-not-authorized':
                    errorMessage = 'Application non autorisée pour ce domaine';
                    break;
                case 'auth/api-key-not-valid':
                    errorMessage = 'Clé API Firebase invalide';
                    break;
                default:
                    errorMessage += ': ' + (error.message || 'Erreur inconnue');
            }
            
            setError(errorMessage);
            
            // Reset reCAPTCHA on certain errors
            if (['auth/captcha-check-failed', 'auth/billing-not-enabled'].includes(error.code)) {
                setRecaptchaResolved(false);
                // Reinitialize reCAPTCHA
                setTimeout(() => {
                    cleanupRecaptcha();
                    initializeRecaptcha();
                }, 1000);
            }
        } finally {
            setLoading(false);
        }
    };

 const verifySmsCode = async () => {
  try {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!confirmationResultRef.current) {
      setError('Pas de demande de vérification en cours. Renvoyez le code.');
      setStep(1);
      return;
    }

    if (!code || code.length !== 6) {
      setError('Veuillez entrer un code à 6 chiffres');
      return;
    }

    const result = await confirmationResultRef.current.confirm(code);
    console.log('Firebase verification successful:', result);

    // ✅ Now call your backend to mark user as verified
    const email = location.state?.email;
    if (!email) {
      setError("Email introuvable pour la vérification backend");
      return;
    }

    const backendRes = await axios.post('http://localhost:8000/auth/verify', {
      email: email,
    });

    if (backendRes.data.success) {
      localStorage.setItem("user", JSON.stringify(backendRes.data.data.user));
      setMessage('✅ Vérification complète réussie !');
      setStep(3);

      // Cleanup + redirect
      cleanupRecaptcha();
      setTimeout(() => {
  window.location.href = "/";
}, 2000);

    } else {
      setError("La vérification côté serveur a échoué");
    }

  } catch (error) {
    console.error('Erreur de vérification:', error);
    let errorMessage = 'Code invalide ou expiré';

    switch (error.code) {
      case 'auth/invalid-verification-code':
        errorMessage = 'Code de vérification invalide';
        break;
      case 'auth/code-expired':
        errorMessage = 'Code expiré, demandez un nouveau code';
        break;
      case 'auth/session-expired':
        errorMessage = 'Session expirée, demandez un nouveau code';
        break;
      default:
        errorMessage = 'Erreur: ' + (error.message || 'Code invalide');
    }

    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};


    const resendCode = async () => {
        setCode('');
        setStep(1);
        setError(null);
        setMessage(null);
        cleanupRecaptcha();
        
        // Reinitialize reCAPTCHA
        setTimeout(() => {
            initializeRecaptcha();
        }, 500);
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" mt={4} mb={2}>Vérification SMS</Typography>

            {/* Configuration Status */}
           

            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {step === 1 && (
                <Box>
                    <TextField
                        fullWidth
                        label="Numéro de téléphone"
                        placeholder="+21653701678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        helperText="Format: +[code pays][numéro] ex: +21653701678"
                        sx={{ mb: 2 }}
                    />
                    
                    {/* reCAPTCHA container */}
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Complétez la vérification reCAPTCHA:
                        </Typography>
                        <Box 
                            id="recaptcha-container"
                            sx={{ 
                                minHeight: '78px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: recaptchaResolved ? '2px solid green' : '1px solid #ddd',
                                borderRadius: 1,
                                backgroundColor: recaptchaResolved ? '#f0f8f0' : 'transparent',
                                p: 1
                            }}
                        />
                        {recaptchaResolved && (
                            <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                                ✓ reCAPTCHA vérifié
                            </Typography>
                        )}
                    </Box>
                    
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={sendSmsCode}
                        disabled={loading || !phone || !recaptchaResolved}
                        sx={{ mt: 2 }}
                    >
                        {loading ? 'Envoi...' : 'Envoyer le code SMS'}
                    </Button>
                </Box>
            )}

            {step === 2 && (
                <Box>
                    <Typography sx={{ mb: 2 }}>
                        Code envoyé au: <strong>{phone}</strong>
                    </Typography>
                    
                    <TextField
                        fullWidth
                        label="Code de vérification (6 chiffres)"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        inputProps={{ 
                            maxLength: 6,
                            style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }
                        }}
                        sx={{ mb: 2 }}
                    />
                    
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={verifySmsCode}
                        disabled={loading || code.length !== 6}
                        sx={{ mb: 1 }}
                    >
                        {loading ? 'Vérification...' : 'Vérifier le code'}
                    </Button>
                    
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={resendCode}
                        disabled={loading}
                    >
                        Renvoyer le code
                    </Button>
                </Box>
            )}

            {step === 3 && (
                <Box mt={3} textAlign="center">
                    <Typography variant="h6" color="success.main">
                        ✅ Vérification réussie !
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Redirection vers le tableau de bord...
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default VerifyAccountPage;