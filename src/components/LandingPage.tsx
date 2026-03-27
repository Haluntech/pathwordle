import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowForwardIos, WorkspacePremium, Bolt, HelpCircle, BarChart3, Settings, Star, ChevronDown, Zap, Target, Users } from './icons';
import LanguageSwitcher from './LanguageSwitcher';

const LandingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      number: 1,
      title: 'Connect Letters',
      description: 'Click adjacent letters on the 6×6 grid to build your path. You can connect horizontally, vertically, or diagonally.',
      icon: '🔗'
    },
    {
      number: 2,
      title: 'Form Your Word',
      description: 'Create a path that spells a 5-letter word. The letters must be connected in sequence.',
      icon: '📝'
    },
    {
      number: 3,
      title: 'Submit & Discover',
      description: 'Submit your guess and get color-coded feedback. Green = correct position, Yellow = wrong position.',
      icon: '✨'
    },
    {
      number: 4,
      title: 'Master the Grid',
      description: 'Use logic and strategy to guess the hidden word in 6 attempts or less. Good luck!',
      icon: '🏆'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Word Game Enthusiast',
      content: 'PathWordle is amazing! The path mechanic adds a whole new layer of strategy. My new daily addiction.',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Puzzle Lover',
      content: 'Finally a word game that actually challenges you. The spatial thinking required is brilliant!',
      rating: 5
    },
    {
      name: 'Emma Williams',
      role: 'Casual Gamer',
      content: 'Perfect for my morning coffee routine. Simple to learn, hard to master. Love the daily challenges!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex flex-col overflow-x-hidden">
      {/* TopAppBar */}
      <header className="bg-background fixed top-0 w-full z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-black text-primary tracking-tighter italic font-headline hover:opacity-80 transition-opacity">
            PathWordle
          </Link>
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <Link to="/game" className="text-on-surface-variant hover:text-secondary transition-colors duration-300 scale-95 active:scale-90 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </Link>
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

      <main className="flex-grow pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16"
        >
          {/* Hero Content */}
          <div className="lg:col-span-7 flex flex-col space-y-12">
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="font-headline font-black text-7xl md:text-8xl tracking-tighter text-on-surface leading-none"
              >
                Path<span className="text-secondary italic drop-shadow-[0_0_15px_rgba(249,226,129,0.5)]">Wordle</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-body text-on-surface-variant text-xl max-w-md font-light leading-relaxed"
              >
                Forge a trail of logic through the grid. Connect letters, bridge gaps, and illuminate the daily path.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative group max-w-sm"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <Link 
                to="/game"
                className="relative w-full py-6 px-10 bg-primary bg-gradient-to-tr from-primary to-primary-container rounded-xl flex items-center justify-between group-hover:translate-y-[-2px] transition-all duration-300"
              >
                <span className="font-headline font-bold text-2xl uppercase tracking-widest text-on-primary-container">PLAY TODAY</span>
                <ArrowForwardIos className="w-8 h-8 text-on-primary-container" />
              </Link>
            </motion.div>

            {/* Decorative Grid */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.8 }}
              className="hidden md:grid grid-cols-5 gap-2 w-fit"
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + (i * 0.05) }}
                  className={`w-12 h-12 rounded-md ${
                    [2, 7].includes(i) ? 'bg-secondary shadow-[0_0_8px_rgba(249,226,129,0.4)]' :
                    [8, 9].includes(i) ? 'bg-primary shadow-[0_0_10px_rgba(175,244,166,0.3)]' :
                    'bg-surface-container-high'
                  }`}
                />
              ))}
            </motion.div>
          </div>

          {/* Sidebar Stats */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-5 space-y-6"
          >
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
              <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-full bg-surface-container-highest flex-1 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between cursor-pointer"
              >
                <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-tertiary-fixed-variant">
                  Games Played
                </span>
                <span className="font-headline font-medium text-4xl text-on-surface">128</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between cursor-pointer"
              >
                <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-tertiary-fixed-variant">
                  Win Rate
                </span>
                <span className="font-headline font-medium text-4xl text-primary">
                  94<span className="text-xl">%</span>
                </span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="col-span-2 bg-surface-container-low p-6 rounded-xl flex items-center justify-between cursor-pointer"
              >
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
              </motion.div>
            </div>
          </motion.aside>
        </motion.section>

        {/* How to Play Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-headline font-bold text-4xl text-on-surface mb-4">How to Play</h2>
            <p className="font-body text-on-surface-variant text-lg">Master the grid in 4 simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-surface-container-low p-6 rounded-xl cursor-pointer"
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-primary font-bold text-sm mb-2">Step {step.number}</div>
                <h3 className="font-headline font-bold text-lg text-on-surface mb-2">{step.title}</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-headline font-bold text-4xl text-on-surface mb-4">What Players Say</h2>
            <p className="font-body text-on-surface-variant text-lg">Join thousands of word puzzle enthusiasts</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-surface-container-low p-6 rounded-xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-secondary fill-secondary" />
                  ))}
                </div>
                <p className="font-body text-on-surface mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-headline font-semibold text-on-surface">{testimonial.name}</div>
                  <div className="font-body text-sm text-on-surface-variant">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-headline font-bold text-4xl text-on-surface mb-4">Why PathWordle?</h2>
            <p className="font-body text-on-surface-variant text-lg">Features that make us different</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Strategic Gameplay', desc: 'Path mechanics add spatial reasoning to classic word puzzles' },
              { icon: '📅', title: 'Daily Challenges', desc: 'New puzzle every day. Compete with friends worldwide' },
              { icon: '💡', title: 'Smart Hints', desc: 'AI-powered suggestions when you need a helping hand' },
              { icon: '📊', title: 'Track Progress', desc: 'Detailed statistics and achievements to track your journey' },
              { icon: '🌙', title: 'Dark Mode', desc: 'Beautiful Material Design 3 interface with light/dark themes' },
              { icon: '🆓', title: 'Forever Free', desc: 'No ads, no subscriptions. Just pure puzzle enjoyment' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="bg-surface-container-low p-6 rounded-xl text-center cursor-pointer"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-headline font-bold text-lg text-on-surface mb-2">{feature.title}</h3>
                <p className="font-body text-sm text-on-surface-variant">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-16"
        >
          <h2 className="font-headline font-black text-5xl text-on-surface mb-6">Ready to Play?</h2>
          <p className="font-body text-on-surface-variant text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of players already mastering the grid. Your daily word puzzle adventure awaits!
          </p>
          <Link 
            to="/game"
            className="inline-flex items-center gap-3 px-12 py-6 bg-primary text-on-primary-container rounded-xl font-headline font-bold text-xl uppercase tracking-widest hover:bg-primary-dim transition-all hover:scale-105"
          >
            Start Playing
            <ArrowForwardIos className="w-6 h-6" />
          </Link>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-background py-8 mt-auto flex flex-col md:flex-row justify-between items-center px-8 w-full border-t border-surface-container-high">
        <div className="mb-4 md:mb-0">
          <span className="font-body text-sm font-medium tracking-tight text-primary drop-shadow-[0_0_8px_rgba(175,244,166,0.3)]">
            © 2026 PathWordle. Luminous Logic Engine.
          </span>
        </div>
        <div className="flex gap-8">
          <Link to="/privacy" className="font-body text-sm font-medium tracking-tight text-gray-500 hover:text-white transition-colors opacity-80 hover:opacity-100">Privacy</Link>
          <Link to="/terms" className="font-body text-sm font-medium tracking-tight text-gray-500 hover:text-white transition-colors opacity-80 hover:opacity-100">Terms</Link>
          <Link to="/about" className="font-body text-sm font-medium tracking-tight text-gray-500 hover:text-white transition-colors opacity-80 hover:opacity-100">About</Link>
          <Link to="/contact" className="font-body text-sm font-medium tracking-tight text-gray-500 hover:text-white transition-colors opacity-80 hover:opacity-100">Support</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
