import React from 'react';
import UppendLogo from '@/assets/images/uppend-logo.svg';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-border_1 py-2">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
            <p>Design & Developed by</p>
            <div className="flex items-center space-x-3">
                <img src={UppendLogo} alt="Uppen Logo" className="h-10" />
            </div>
        </div>
    </footer>
  )
}

export default Footer
