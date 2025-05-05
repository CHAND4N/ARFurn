import React, { useRef, useState, useEffect } from 'react';
import { kmeans } from 'ml-kmeans';
import { getImgUrl } from '../utils/getImgUrl'; // Import the getImgUrl function

const CaptureImage = ({ onCapture, onColorExtracted, product }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [colorSuggestions, setColorSuggestions] = useState(null);
    const [selectedWallColor, setSelectedWallColor] = useState(null);

    const startCamera = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
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

            // Focus only on center region
            const centerX = width / 4;
            const centerY = height / 4;
            const cropWidth = width / 2;
            const cropHeight = height / 2;

            const imageData = ctx.getImageData(centerX, centerY, cropWidth, cropHeight);
            const pixels = imageData.data;

            let r = 0, g = 0, b = 0;
            const totalPixels = pixels.length / 4;

            for (let i = 0; i < pixels.length; i += 4) {
                r += pixels[i];
                g += pixels[i + 1];
                b += pixels[i + 2];
            }

            r = Math.round(r / totalPixels);
            g = Math.round(g / totalPixels);
            b = Math.round(b / totalPixels);

            const dominantColor = [r, g, b];
            console.log('Dominant Wall Color:', dominantColor);

            // Generate color suggestions
            const suggestions = generateColorSuggestions(r, g, b);
            console.log('Wall Color Suggestions:', suggestions);

            setColorSuggestions(suggestions);
            onColorExtracted(suggestions);
        }
    };

    const generateColorSuggestions = (r, g, b) => {
        const lighten = (value, amount = 30) => Math.min(255, value + amount);

        const lightColor = [
            lighten(r, 60),
            lighten(g, 60),
            lighten(b, 60)
        ];

        const pastelColor = [
            Math.round((r + 255) / 2),
            Math.round((g + 255) / 2),
            Math.round((b + 255) / 2)
        ];

        const complementaryColor = [
            255 - r,
            255 - g,
            255 - b
        ];

        return {
            dominant: [r, g, b],
            light: lightColor,
            pastel: pastelColor,
            complementary: complementaryColor
        };
    };

    const pickBestWallColor = (dominantColor) => {
        const [r, g, b] = dominantColor;

        // Lightness calculation (to decide if furniture is light or dark)
        const lightness = (r + g + b) / 3;

        // Function to lighten a color
        const lighten = (color, amount = 40) => Math.min(255, color + amount);

        // Function to darken a color
        const darken = (color, amount = 40) => Math.max(0, color - amount);

        // Suggest a wall color based on the dominant furniture color
        if (lightness < 128) {
            // Dark furniture: Suggest lighter or pastel colors
            return {
                name: 'Light Wall Color',
                color: [
                    lighten(r),
                    lighten(g),
                    lighten(b)
                ]
            };
        } else {
            // Light furniture: Suggest complementary or warm tones
            const complementaryColor = [
                255 - r,
                255 - g,
                255 - b
            ];

            const warmTone = [
                Math.min(255, r + 30),
                Math.min(255, g + 20),
                Math.min(255, b)
            ];

            return {
                name: 'Complementary Wall Color',
                color: complementaryColor,  // Could also return `warmTone` or another suggestion based on preference
            };
        }
    };

    const extractFurnitureColor = async () => {
        if (!product || !product.imageUrl) {
            console.error('Product or imageUrl is missing');
            return;
        }

        const imgUrl = getImgUrl(product.imageUrl);
        console.log("Image URL:", imgUrl);
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imgUrl;

        img.onload = async () => {
            console.log('Image loaded successfully');
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            const downscaleWidth = img.width;
            const downscaleHeight = img.height;

            canvas.width = downscaleWidth;
            canvas.height = downscaleHeight;

            ctx.drawImage(img, 0, 0, downscaleWidth, downscaleHeight);

            const imageData = ctx.getImageData(0, 0, downscaleWidth, downscaleHeight);
            const pixels = imageData.data;
            const pixelArray = [];

            for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                const a = pixels[i + 3];

                if (a > 0 && !(r > 240 && g > 240 && b > 240) && !(r < 20 && g < 20 && b < 20)) {
                    pixelArray.push([r, g, b]);
                }
            }

            if (pixelArray.length === 0) {
                console.warn('No valid pixels found in image.');
                return;
            }

            const numberOfClusters = 10; // Increased number of clusters
            const kmeansResult = await kmeans(pixelArray, numberOfClusters);

            const clusterCounts = Array(numberOfClusters).fill(0);
            kmeansResult.clusters.forEach(clusterIndex => {
                clusterCounts[clusterIndex]++;
            });

            const dominantClusterIndex = clusterCounts.indexOf(Math.max(...clusterCounts));
            const dominantColor = kmeansResult.centroids[dominantClusterIndex].centroid.map(value => Math.round(value));

            console.log('Furniture Dominant Color:', dominantColor);

            const suggestions = generateColorSuggestions(...dominantColor);
            console.log('Furniture Color Suggestions:', suggestions);

            setColorSuggestions(suggestions);
            onColorExtracted(suggestions);
        };

        img.onerror = (error) => {
            console.error('Error loading image: ', error);
            alert('Failed to load image. Please check the URL or try again later.');
        };
    };

    useEffect(() => {
        if (product) {
            extractFurnitureColor();
        }
    }, [product]);

    return (
        <div className="capture-modal" style={{ padding: '20px' }}>
            <h3>Capture Wall Image</h3>
            <button onClick={startCamera} style={{ marginBottom: '10px' }}>Start Camera</button>
            <div>
                <video ref={videoRef} style={{ width: '100%', maxWidth: '500px', marginBottom: '10px' }}></video>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            <button onClick={captureImage} style={{ marginBottom: '20px' }}>Capture Image</button>

            {colorSuggestions && (
                <div>
                    <h4>Wall Color Suggestions:</h4>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        {Object.entries(colorSuggestions).map(([key, color]) => (
                            <div key={key} style={{
                                width: '60px',
                                height: '60px',
                                backgroundColor: `rgb(${color.join(',')})`,
                                border: '2px solid black',
                                textAlign: 'center',
                                fontSize: '10px',
                                color: '#000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {key}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setSelectedWallColor(pickBestWallColor(colorSuggestions.dominant))}>Pick Best Wall Color</button>
                </div>
            )}
        </div>
    );
};

export default CaptureImage;
