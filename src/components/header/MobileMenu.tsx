import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, X } from 'lucide-react';
import AuthButtons from './AuthButtons';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { translations } = useLanguage();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const menuSections = [
    {
      id: 'candidates',
      label: translations.candidates,
      items: [
        { label: 'Browse Jobs', href: '/jobs' },
        { label: 'Job Recommendations', href: '/job-recommendations' },
        { label: 'Saved Jobs', href: '/saved-jobs' },
        { label: 'Career Path Planner', href: '/career-path' },
        { label: 'Skills Assessment', href: '/skills-assessment' },
      ]
    },
    {
      id: 'marketplace',
      label: translations.talentMarketplace,
      items: [
        { label: 'Browse Talent', href: '/employer-login' },
        { label: 'List Your Talent', href: '/employer-login' },
        { label: 'Register as Talent', href: '/candidate-register' },
      ]
    },
    {
      id: 'employers',
      label: translations.employers,
      items: [
        { label: 'Post a Job', href: '/employer/post-job' },
        { label: 'Hire Full-Time', href: '/employer/hire-full-time' },
        { label: 'Hire Interns', href: '/employer/hire-interns' },
        { label: 'AI Screening', href: '/employer/ai-screening' },
        { label: 'Dashboard', href: '/employer/dashboard' },
      ]
    },
    {
      id: 'services',
      label: translations.services,
      items: [
        { label: 'Resume Building', href: '/services/resume' },
        { label: 'Interview Coaching', href: '/services/coaching' },
        { label: 'Recruitment Services', href: '/services/recruitment' },
      ]
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className={cn(
        "lg:hidden fixed top-0 right-0 h-full w-[300px] bg-navy-900 z-50 transition-transform duration-300 ease-out overflow-y-auto",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="text-white font-semibold">Menu</span>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <nav className="space-y-1">
            {menuSections.map((section) => (
              <div key={section.id} className="border-b border-white/5 last:border-0">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between text-white py-3 font-medium text-sm"
                >
                  {section.label}
                  <ChevronDown className={cn(
                    "w-4 h-4 text-white/50 transition-transform duration-200",
                    openSection === section.id && "rotate-180"
                  )} />
                </button>
                
                <div className={cn(
                  "overflow-hidden transition-all duration-200",
                  openSection === section.id ? "max-h-96 pb-3" : "max-h-0"
                )}>
                  <div className="space-y-1 pl-3">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={onClose}
                        className="block text-sm text-white/60 hover:text-primary py-2 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>
          
          {/* Auth Buttons */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <AuthButtons isMobile={true} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;