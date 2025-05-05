import React from "react";

const ARModal = ({ modelUrl, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg">
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>
          Close
        </button>

        {/* AR Model Viewer */}
        <model-viewer
          src={modelUrl}
          ar
          ar-modes="scene-viewer webxr quick-look"
          camera-controls
          auto-rotate
          className="w-full h-96"
        ></model-viewer>
      </div>
    </div>
  );
};

export default ARModal;
