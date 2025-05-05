import React, { useState, useContext, useEffect, useRef } from 'react';
import { FiPlus } from "react-icons/fi";
import Rating from '../../components/Rating';
import { CartContext } from '../../context/CartContext';
import { getImgUrl } from '../../utils/getImgUrl';
import ARModal from '../../components/ARModal';
import CaptureImage from '../../components/CaptureImage';
import ColorThief from 'colorthief';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const [showAR, setShowAR] = useState(false);
    const [showCapture, setShowCapture] = useState(false);
    const [wallColor, setWallColor] = useState(null);
    const [furnitureColor, setFurnitureColor] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [selectedProductName, setSelectedProductName] = useState(null);

    const imgRef = useRef(null);

    useEffect(() => {
        if (imgRef.current) {
            if (imgRef.current.complete) {
                extractFurnitureColor();
            } else {
                imgRef.current.addEventListener('load', extractFurnitureColor);
                return () => imgRef.current?.removeEventListener('load', extractFurnitureColor);
            }
        }
    }, [imgRef]);

    const extractFurnitureColor = () => {
        const colorThief = new ColorThief();
        if (imgRef.current && imgRef.current.complete) {
            try {
                const dominantColor = colorThief.getColor(imgRef.current);
                console.log('Furniture Color Extracted:', dominantColor);
                setFurnitureColor(dominantColor);
            } catch (error) {
                console.error('Error extracting furniture color:', error);
            }
        }
    };

    const handleCapture = (imgData) => {
        console.log('Captured Wall Image:', imgData);
    };

    const handleColorExtracted = (color) => {
        setWallColor(color);
        console.log('Wall Dominant Color:', color);

        if (furnitureColor) {
            generateColorSuggestions(furnitureColor, color);
        }
    };

    const compareColors = (color1, color2) => {
        const [r1, g1, b1] = color1;
        const [r2, g2, b2] = color2;
        return Math.sqrt(
            (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2
        );
    };

    const generateColorSuggestions = (furniture, wall) => {
        if (!Array.isArray(furniture) || !Array.isArray(wall)) return;  // Ensure both colors are arrays

        const diff = compareColors(furniture, wall);
        if (diff > 80) { // Slightly more sensitive
            const [r, g, b] = furniture;
            const suggestions = [
                rgbToHex([255 - r, 255 - g, 255 - b]), // Complementary
                rgbToHex([r > 200 ? r - 50 : r + 50, g > 200 ? g - 50 : g + 50, b > 200 ? b - 50 : b + 50]), // Shift
                rgbToHex([Math.max(0, r - 30), Math.max(0, g - 30), Math.max(0, b - 30)]) // Darker version
            ];
            setSuggestions(suggestions);
        } else {
            setSuggestions([]); // If no mismatch, reset suggestions
        }
    };

    const rgbToHex = (rgb) => {
        return '#' + rgb.map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    };

    const handleCopyColor = (colorHex, index) => {
        navigator.clipboard.writeText(colorHex)
            .then(() => {
                setCopiedIndex(index);
                setTimeout(() => setCopiedIndex(null), 1500);
            })
            .catch(err => console.error('Failed to copy color:', err));
    };

    // Handle product card selection to set selected product name
    const handleProductSelect = () => {
        setSelectedProductName(product.name); // Set the selected product name
        setShowCapture(true); // Show the Capture Image modal
    };

    return (
        <div key={product.id} className="border rounded-lg shadow-lg p-4 bg-white">
            <div className="bg-[#FAFAFA] relative">
                <img
                    ref={imgRef}
                    src={getImgUrl(product.imageUrl)}
                    alt={product.name}
                    className="w-full h-full object-cover px-8 py-2 rounded"
                    crossOrigin="anonymous"
                />
            </div>

            <div className="p-6 dark:bg-black bg-white">
                <h4 className="text-base mb-1">{product.category}</h4>
                <h3 className="font-semibold text-xl mb-2">{product.name}</h3>
                <Rating rating={product.rating} />

                <div className="mt-5 flex justify-between items-center">
                    <p className="text-secondary dark:text-white font-bold text-lg">
                        <sup>Rs</sup> <span>{product.price}</span>
                    </p>
                    <button 
                        className="bg-secondary p-2 rounded-full text-white"
                        onClick={() => addToCart(product)}
                    >
                        <FiPlus />
                    </button>
                </div>

                {/* AR Button */}
                {product.modelUrl && (
                    <button 
                        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg"
                        onClick={() => setShowAR(true)}
                    >
                        View in AR
                    </button>
                )}

                {/* Capture Button */}
                <button 
                    className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg"
                    onClick={handleProductSelect} // Update to use handleProductSelect
                >
                    Capture Wall Image
                </button>
            </div>

            {/* AR Modal */}
            {showAR && <ARModal modelUrl={product.modelUrl} onClose={() => setShowAR(false)} />}

            {/* Capture Image Modal */}
            {showCapture && (
                <CaptureImage
                    onCapture={handleCapture}
                    onColorExtracted={handleColorExtracted}
                    productName={selectedProductName} // Pass the selected product name here
                />
            )}

            {/* Color Suggestions */}
            {suggestions.length > 0 && (
                <div className="mt-4 bg-gray-100 p-4 rounded shadow">
                    <p className="text-black font-medium mb-2">Wall color mismatch detected! Suggested wall colors:</p>
                    <div className="flex gap-3 mt-2">
                        {suggestions.map((color, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div 
                                    className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300"
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleCopyColor(color, index)}
                                    title="Click to copy color"
                                />
                                {copiedIndex === index && (
                                    <p className="text-green-600 text-xs mt-1">Copied!</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
