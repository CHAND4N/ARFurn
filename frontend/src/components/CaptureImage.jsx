import React, { useRef, useState } from 'react';

const CaptureImage = ({ onCapture, onColorExtracted, product }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [colorSuggestions, setColorSuggestions] = useState(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [copiedColorKey, setCopiedColorKey] = useState(null);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraStarted(true);
      })
      .catch((err) => {
        console.log('Error accessing camera: ', err);
        alert('Unable to access the camera. Please check your browser permissions.');
      });
  };

  const captureImage = () => {
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

      const suggestions = generateColorSuggestions(canvas);
      setColorSuggestions(suggestions);
      onColorExtracted(suggestions);
    }
  };

  const generateColorSuggestions = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let r = 0, g = 0, b = 0, count = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      r += pixels[i];
      g += pixels[i + 1];
      b += pixels[i + 2];
      count++;
    }

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    return {
      dominant: [r, g, b],
      light: [Math.min(255, r + 30), Math.min(255, g + 30), Math.min(255, b + 30)],
      pastel: [Math.floor((r + 255) / 2), Math.floor((g + 255) / 2), Math.floor((b + 255) / 2)],
      complementary: [255 - r, 255 - g, 255 - b],
    };
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
      {!isCameraStarted && (
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
            marginBottom: '20px',
          }}
        >
          Start Camera
        </button>
      )}

      <video
        ref={videoRef}
        style={{
          width: '100%',
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '8px',
          marginBottom: '20px',
          objectFit: 'cover',
        }}
        autoPlay
        muted
      ></video>

      <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>

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
