import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='flex items-center justify-center gap-4 py-3'>
            <img width={150} src={assets.logo} />
            <p className='border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>Copyright | All rights reserved.</p>
        </div>
    )
}

export default Footer
