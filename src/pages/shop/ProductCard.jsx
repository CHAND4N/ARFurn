import React, { useState, useContext } from 'react';
import { FiPlus } from "react-icons/fi";
import Rating from '../../components/Rating';
import { CartContext } from '../../context/CartContext';
import { getImgUrl } from '../../utils/getImgUrl';
import ARModal from '../../components/ARModal';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const [showAR, setShowAR] = useState(false);

    return (
        <div key={product.id} className="">
            <div className='bg-[#FAFAFA]'>
                <img
                    src={getImgUrl(`${product.imageUrl}`)}
                    alt={product.name}
                    className="w-full h-full object-cover px-8 py-2 rounded"
                />
            </div>

            <div className={`p-6 dark:bg-black bg-white shadow-sm`}>
                <h4 className='text-base  mb-1'>{product.category}</h4>
                <h3 className="font-semibold text-xl mb-2">{product.name}</h3>
                <Rating rating={product.rating} />

                <div className='mt-5 flex justify-between items-center'>
                    <p className="text-secondary dark:text-white font-bold text-lg">
                        <sup>Rs</sup> <span className=''>{product.price}</span>
                    </p>
                    <button 
                        className='bg-secondary p-2 rounded-full text-white'
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
            </div>

            {/* AR Modal */}
            {showAR && <ARModal modelUrl={product.modelUrl} onClose={() => setShowAR(false)} />}
        </div>
    );
};

export default ProductCard;
