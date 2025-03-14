import React from 'react'
import Button from '../../components/Button'

const ChooseUs = () => {
  return (
    <section className='section-container'>
        <div className='my-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center md:gap-12 gap-8 text-left '>
            <div className='text-4xl font-bold '>
            Why <br /> Choosing Us
            </div>
            <div>
                <h3 className='text-2xl font-semibold mb-3'>AI-Powered Custom Interior Designs</h3>
                <p className='text-base mb-2'>Get personalized interior designs with our AI image generation feature. Visualize unique styles and custom pieces before making a purchase!</p>
            </div>
            <div>
                <h3 className='text-2xl font-semibold mb-3'> Augmented Reality (AR) Experience</h3>
                <p className='text-base mb-2'>Visualize your furniture in your home before purchasing! Our AR feature lets you see how each piece fits into your space, helping you make confident buying decisions.</p>
            </div>
            <div>
                <h3 className='text-2xl font-semibold mb-3'>Hassle-Free Returns & Warranty</h3>
                <p className='text-base mb-2'>We stand by the quality of our products with easy returns and warranties. If you're not satisfied, we make the process simple and stress-free!</p>
            </div>
        </div>
    </section>
  )
}

export default ChooseUs