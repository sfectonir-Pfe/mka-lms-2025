import React, { useState } from 'react';
import { Box, Avatar, IconButton, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const ProfilePictureUpload = ({ 
  currentImage, 
  onImageChange, 
  disabled = false,
  size = 150 
}) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState("");
  const [imageQuality, setImageQuality] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImageQuality = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        const maxSize = 500;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        let sum = 0;
        let sumSquared = 0;
        let count = 0;

        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
            const grayLeft = 0.299 * data[idx - 4] + 0.587 * data[idx - 3] + 0.114 * data[idx - 2];
            const grayRight = 0.299 * data[idx + 4] + 0.587 * data[idx + 5] + 0.114 * data[idx + 6];
            const grayTop = 0.299 * data[idx - width * 4] + 0.587 * data[idx - width * 4 + 1] + 0.114 * data[idx - width * 4 + 2];
            const grayBottom = 0.299 * data[idx + width * 4] + 0.587 * data[idx + width * 4 + 1] + 0.114 * data[idx + width * 4 + 2];
            
            const gradX = grayRight - grayLeft;
            const gradY = grayBottom - grayTop;
            const magnitude = Math.sqrt(gradX * gradX + gradY * gradY);

            sum += magnitude;
            sumSquared += magnitude * magnitude;
            count++;
          }
        }

        const mean = sum / count;
        const variance = (sumSquared / count) - (mean * mean);

        let quality;
        if (variance > 1000) {
          quality = { level: 'excellent', score: variance, isBlurry: false };
        } else if (variance > 500) {
          quality = { level: 'good', score: variance, isBlurry: false };
        } else if (variance > 200) {
          quality = { level: 'acceptable', score: variance, isBlurry: false };
        } else if (variance > 100) {
          quality = { level: 'poor', score: variance, isBlurry: true };
        } else {
          quality = { level: 'very_poor', score: variance, isBlurry: true };
        }

        resolve(quality);
      };

      img.onerror = () => {
        resolve({ level: 'error', score: 0, isBlurry: true });
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      setPreview("");
      setImageQuality(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error(t('profile.invalidImageFile'));
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('profile.fileSizeError'));
      e.target.value = '';
      return;
    }

    setPreview(URL.createObjectURL(file));
    setIsAnalyzing(true);
    setImageQuality(null);

    try {
      const quality = await analyzeImageQuality(file);
      setImageQuality(quality);

      if (quality.isBlurry) {
        toast.warning(t('profile.blurryImageWarning', { quality: quality.level }));
      } else {
        toast.success(t('profile.goodQualityImage', { quality: quality.level }));
        onImageChange(file);
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse de l'image:", error);
      toast.error(t('profile.imageAnalysisError'));
      setImageQuality({ level: 'error', score: 0, isBlurry: true });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleForceUseBlurryImage = () => {
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0]) {
      onImageChange(fileInput.files[0]);
      toast.info(t('profile.blurryImageAccepted'));
    }
  };

  const getImageSrc = () => {
    if (preview) return preview;
    if (currentImage) {
      if (currentImage.startsWith('/profile-pics/')) {
        return `http://localhost:8000/uploads${currentImage}`;
      }
      if (currentImage.startsWith('http')) {
        return currentImage;
      }
      return `http://localhost:8000/uploads/profile-pics/${currentImage.split('/').pop()}`;
    }
    return null;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={getImageSrc()}
          sx={{
            width: size,
            height: size,
            fontSize: size * 0.4,
            border: '4px solid #1976d2',
            boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
          }}
        >
          {currentImage?.name?.charAt(0).toUpperCase() || "U"}
        </Avatar>
        <IconButton
          color="primary"
          component="label"
          disabled={disabled}
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <PhotoCamera />
          <input type="file" hidden onChange={handleFileChange} accept="image/*" />
        </IconButton>
      </Box>
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        {t('profile.clickCameraToChange')}
      </Typography>

      {isAnalyzing && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2" color="primary">
            {t('profile.analyzingImageQuality')}
          </Typography>
        </Box>
      )}

      {imageQuality && !isAnalyzing && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Alert
            severity={imageQuality.isBlurry ? "warning" : "success"}
            sx={{ display: 'inline-flex', alignItems: 'center', maxWidth: 400 }}
          >
            {imageQuality.isBlurry ? (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t('profile.blurryImageDetected')}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  {t('profile.quality')}: {imageQuality.level} ({t('profile.score')}: {Math.round(imageQuality.score)})
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, mb: 1 }}>
                  {t('profile.recommendSharperImage')}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={handleForceUseBlurryImage}
                  sx={{ mt: 1, fontSize: '0.75rem' }}
                >
                  {t('profile.useAnyway')}
                </Button>
              </Box>
            ) : (
              <>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t('profile.goodImageQuality')}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  {t('profile.quality')}: {imageQuality.level} ({t('profile.score')}: {Math.round(imageQuality.score)})
                </Typography>
              </>
            )}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default ProfilePictureUpload; 