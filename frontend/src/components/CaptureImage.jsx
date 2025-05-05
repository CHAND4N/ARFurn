import React, { useRef, useState } from 'react';
import ColorThief from 'colorthief';

const CaptureImage = ({ onCapture, onColorExtracted, product }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [colorSuggestions, setColorSuggestions] = useState(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [copiedColorKey, setCopiedColorKey] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraStarted(true);
        setPreviewMode(false);
        setUploadedImage(null);
      })
      .catch((err) => {
        console.log('Error accessing camera: ', err);
      });
  };

  const generateColorSuggestions = (canvas) => {
    const colorThief = new ColorThief();
    const img = new Image();
    img.src = canvas.toDataURL('image/png');

    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          const dominantColor = colorThief.getColor(img);
          const [r, g, b] = dominantColor;
          resolve({
            dominant: [r, g, b],
            light: [Math.min(255, r + 30), Math.min(255, g + 30), Math.min(255, b + 30)],
            pastel: [Math.floor((r + 255) / 2), Math.floor((g + 255) / 2), Math.floor((b + 255) / 2)],
            complementary: [255 - r, 255 - g, 255 - b],
          });
        } catch (error) {
          reject(error);
        }
      };
    });
  };

  const captureImage = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, width, height);
      const imgData = canvas.toDataURL('image/png');
      onCapture(imgData);

      const suggestions = await generateColorSuggestions(canvas);
      setColorSuggestions(suggestions);
      onColorExtracted(suggestions);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Set the uploaded image for preview
        setUploadedImage(event.target.result);
        setPreviewMode(true);
        setIsCameraStarted(false);
        
        // If there was a camera stream, stop it
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const processUploadedImage = async () => {
    if (uploadedImage) {
      const img = new Image();
      img.onload = async () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = canvas.toDataURL('image/png');
        onCapture(imgData);

        const suggestions = await generateColorSuggestions(canvas);
        setColorSuggestions(suggestions);
        onColorExtracted(suggestions);
      };
      img.src = uploadedImage;
    }
  };

  const rgbToHex = (r, g, b) => {
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
  };

  const handleCopy = (hex, key) => {
    navigator.clipboard.writeText(hex);
    setCopiedColorKey(key);
    setTimeout(() => setCopiedColorKey(null), 1000);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Camera and Upload Buttons */}
      <div style={{ marginBottom: '20px' }}>
        {!isCameraStarted && !previewMode && (
          <button
            onClick={startCamera}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '10px',
            }}
          >
            Start Camera
          </button>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c63ff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Upload from Gallery
        </button>
      </div>

      {/* Video Stream */}
      <video
        ref={videoRef}
        style={{
          width: '100%',
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '8px',
          marginBottom: '20px',
          objectFit: 'cover',
          display: isCameraStarted ? 'block' : 'none',
        }}
        autoPlay
        muted
      ></video>

      {/* Image Preview */}
      {previewMode && uploadedImage && (
        <div style={{ marginBottom: '20px' }}>
          <img 
            src={uploadedImage} 
            alt="Preview" 
            style={{
              width: '100%',
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {/* Capture Button */}
      {isCameraStarted && (
        <button
          onClick={captureImage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '20px',
          }}
        >
          Capture Image
        </button>
      )}

      {/* Process Uploaded Image Button */}
      {previewMode && uploadedImage && (
        <button
          onClick={processUploadedImage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '20px',
          }}
        >
          Use This Image
        </button>
      )}

      {/* Color Suggestions */}
      {colorSuggestions && (
        <div
          style={{
            marginTop: '30px',
            padding: '15px',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>Wall Color Suggestions:</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.entries(colorSuggestions).map(([key, color]) => {
              const hex = rgbToHex(...color);

              return (
                <div
                  key={key}
                  style={{
                    width: '130px',
                    height: '130px',
                    backgroundColor: hex,
                    borderRadius: '10px',
                    border: '2px solid #ddd',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    padding: '5px',
                    position: 'relative',
                  }}
                >
                  <div style={{ fontSize: '10px', marginBottom: '8px' }}>{hex}</div>
                  <button
                    onClick={() => handleCopy(hex, key)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '10px',
                      border: 'none',
                      borderRadius: '5px',
                      backgroundColor: '#00000088',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedColorKey === key ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptureImage;