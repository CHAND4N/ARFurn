import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CaptureImage from '../../components/CaptureImage'; // The component you already wrote
import { getPublicFurnitureImgUrl } from '../../utils/getImgUrl'; // Adjust the path if necessary

const CapturePage = () => {
  const location = useLocation();
  const { product } = location.state || {};  // Get product data from URL state
  const [colorSuggestions, setColorSuggestions] = useState(null);

  const handleCapture = (imgData) => {
    console.log('Captured Wall Image:', imgData);
  };

  const handleColorExtracted = (suggestions) => {
    // Only update the state if suggestions are different
    if (JSON.stringify(suggestions) !== JSON.stringify(colorSuggestions)) {
      console.log('Wall Color Suggestions:', suggestions);
      setColorSuggestions(suggestions);  // Save the color suggestions in state
    }
  };

  return (
    <div className="capture-page-container" style={{ padding: '20px', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <div className="capture-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Capture Wall Image for {product?.name}</h2>
      </div>
      
      <div className="product-info" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <img 
          src={getPublicFurnitureImgUrl(product?.imageUrl)} 
          alt={product?.name} 
          style={{ width: '150px', height: '150px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #ddd' }} 
          crossOrigin="anonymous" 
        />
      </div>

      <div className="capture-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        {/* CaptureImage component with restricted size for better UI */}
        <CaptureImage 
          onCapture={handleCapture} 
          onColorExtracted={handleColorExtracted}
          product={product} 
        />
      </div>

      {/* Color Suggestions */}
      {colorSuggestions && (
        <div className="color-suggestions" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>Wall Color Suggestions:</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.entries(colorSuggestions).map(([key, color]) => (
              <div key={key} style={{
                width: '80px',
                height: '80px',
                backgroundColor: `rgb(${color.join(',')})`,
                borderRadius: '8px',
                border: '2px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '12px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                {key}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CapturePage;
