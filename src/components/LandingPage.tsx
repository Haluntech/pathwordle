import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowForwardIos, WorkspacePremium, Bolt, HelpCircle, BarChart3, Settings } from './icons';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex flex-col overflow-x-hidden">
      {/* TopAppBar */}
      <header className="bg-background fixed top-0 w-full z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-black text-primary tracking-tighter italic font-headline">
            PathWordle
          </div>
          <div className="flex items-center gap-6">
            <button className="text-on-surface-variant hover:text-secondary transition-colors duration-300 scale-95 active:scale-90 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </button>
            <button className="text-on-surface-variant hover:text-secondary transition-colors duration-300 scale-95 active:scale-90 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </button>
            <button className="text-on-surface-variant hover:text-secondary transition-colors duration-300 scale-95 active:scale-90 transition-transform">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="bg-surface-container-low h-[1px] w-full"></div>
      </header>

      <main className="flex-grow pt-24 pb-12 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Hero Section: Title & CTA */}
        <section className="lg:col-span-7 flex flex-col space-y-12">
          <div className="space-y-4">
            <h1 className="font-headline font-black text-7xl md:text-8xl tracking-tighter text-on-surface leading-none">
              Path<span className="text-secondary italic drop-shadow-[0_0_15px_rgba(249,226,129,0.5)]">Wordle</span>
            </h1>
            <p className="font-body text-on-surface-variant text-xl max-w-md font-light leading-relaxed">
              Forge a trail of logic through the grid. Connect letters, bridge gaps, and illuminate the daily path.
            </p>
          </div>

          <div className="relative group max-w-sm">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <Link 
              to="/game"
              className="relative w-full py-6 px-10 bg-primary bg-gradient-to-tr from-primary to-primary-container rounded-xl flex items-center justify-between group-hover:translate-y-[-2px] transition-all duration-300"
            >
              <span className="font-headline font-bold text-2xl uppercase tracking-widest text-on-primary-container">PLAY TODAY</span>
              <ArrowForwardIos className="w-8 h-8 text-on-primary-container" />
            </Link>
          </div>

          {/* Visual Decorative Element */}
          <div className="hidden md:grid grid-cols-5 gap-2 w-fit opacity-40">
            <div className="w-12 h-12 bg-surface-container-high rounded-md"></div>
            <div className="w-12 h-12 bg-surface-container-high rounded-md"></div>
            <div className="w-12 h-12 bg-secondary rounded-md shadow-[0_0_8px_rgba(249,226,129,0.4)]"></div>
            <div className="w-12 h-12 bg-surface-container-high rounded-md"></div>
            <div className="w-12 h-12 bg-surface-container-high rounded-md"></div>
            <div className="w-12 h-12 bg-surface-container-high rounded-md"></div>
            <div className="w-12 h-12 bg-surface-container-high rounded-md"></div>
            <div className="w-12 h-12 bg-secondary rounded-md shadow-[0_0_8px_rgba(249,226,129,0.4)]"></div>
            <div className="w-12 h-12 bg-primary rounded-md shadow-[0_0_10px_rgba(175,244,166,0.3)]"></div>
            <div className="w-12 h-12 bg-primary rounded-md shadow-[0_0_10px_rgba(175,244,166,0.3)]"></div>
          </div>
        </section>

        {/* Sidebar Section: Challenge & Stats (Bento Style) */}
        <aside className="lg:col-span-5 space-y-6">
          {/* Daily Challenge Card */}
          <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Bolt className="w-16 h-16 text-secondary opacity-30" />
            </div>
            <h3 className="font-headline font-bold text-xs uppercase tracking-[0.3em] text-secondary mb-6">
              DAILY CHALLENGE
            </h3>
            <div className="flex items-end justify-between mb-8">
              <div className="space-y-1">
                <span className="font-headline font-bold text-5xl text-on-surface">
                  0<span className="text-surface-container-highest">/</span>5
                </span>
                <p className="font-body text-on-surface-variant text-sm font-medium">words completed</p>
              </div>
            </div>
            {/* Mini Progress Bar */}
            <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden flex gap-1">
              <div className="h-full bg-surface-container-highest flex-1"></div>
              <div className="h-full bg-surface-container-highest flex-1"></div>
              <div className="h-full bg-surface-container-highest flex-1"></div>
              <div className="h-full bg-surface-container-highest flex-1"></div>
              <div className="h-full bg-surface-container-highest flex-1"></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between aspect-square lg:aspect-auto">
              <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-tertiary-fixed-variant">
                Games Played
              </span>
              <span className="font-headline font-medium text-4xl text-on-surface">128</span>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between aspect-square lg:aspect-auto">
              <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-tertiary-fixed-variant">
                Win Rate
              </span>
              <span className="font-headline font-medium text-4xl text-primary">
                94<span className="text-xl">%</span>
              </span>
            </div>
            <div className="col-span-2 bg-surface-container-low p-6 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-tertiary-fixed-variant block mb-1">
                  Current Streak
                </span>
                <span className="font-headline font-medium text-4xl text-on-surface">
                  12 <span className="text-sm font-body font-normal text-on-surface-variant">days</span>
                </span>
              </div>
              <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center">
                <WorkspacePremium className="w-10 h-10 text-secondary" />
              </div>
            </div>
          </div>

          {/* Visual Editorial Card */}
          <div className="relative bg-surface-container-high rounded-xl h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
            <img 
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              alt="Abstract liquid neon waves in green and yellow glowing against a dark digital background"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHdfTlIPi6QlWwBExi1yHUXHn58mwcdd0SfvVEC8qb27RKGRpKZVjEesjrVB5--cuZwplypZW1it0x6iRgR5NtG8Tl14WwL6SFYMH73qTSnC8RWKJycrcaMr-_IhgznI9aapjlvnJpMWKM7daOJwYesWQcIIUYSk2cDqmP41hLytl9BXYbC2XBYzMQTacpgIZCX09G-swDYhb317gceB9FH3U4mgAn9TZ1uk3l5PFYmQaVVqAFqtj8v3h-J9vqNz2Q711cTTfQ0vk"
            />
            <div className="absolute bottom-0 left-0 p-6 z-20">
              <h4 className="font-headline font-bold text-lg text-on-surface">Master the Circuit</h4>
              <p className="font-body text-sm text-on-surface-variant">Learn advanced pathfinding techniques.</p>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-background py-8 mt-auto flex flex-col md:flex-row justify-between items-center px-8 w-full border-t border-surface-container-high">
        <div className="mb-4 md:mb-0">
          <span className="font-body text-sm font-medium tracking-tight text-primary drop-shadow-[0_0_8px_rgba(175,244,166,0.3)]">
            © 2026 PathWordle. Luminous Logic Engine.
          </span>
        </div>
        <div className="flex gap-8">
          <Link 
            to="/privacy" 
            className="font-body text-sm font-medium tracking-tight text-gray-500 hover:text-white transition-colors opacity-80 hover:opacity-100"
          >
            Privacy
          </Link>
          <Link 
            to="/terms" 
            className="font-body text-sm font-medium tracking-tight text-gray-500 hover:text-white transition-colors opacity-80 hover:opacity-100"
          >
            Terms
          </Link>
          <Link 
            to="/contact" 
            className="font-body text-sm font-medium tracking-tight text-gray-500 hover:text-white transition-colors opacity-80 hover:opacity-100"
          >
            Support
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
