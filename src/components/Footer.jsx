import React from 'react';
import { Recycle } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Recycle className="text-primary" size={28} />
              <span className="font-bold text-xl text-primary">GreenCycle</span>
            </div>
            <p className="text-secondary text-sm">Giving electronics a second life.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Solutions</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-secondary hover:text-primary">For Individuals</a></li>
              <li><a href="#" className="text-base text-secondary hover:text-primary">For Businesses</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-secondary hover:text-primary">About</a></li>
              <li><a href="#" className="text-base text-secondary hover:text-primary">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-secondary hover:text-primary">Privacy</a></li>
              <li><a href="#" className="text-base text-secondary hover:text-primary">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-base text-secondary xl:text-center">&copy; {new Date().getFullYear()} GreenCycle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;