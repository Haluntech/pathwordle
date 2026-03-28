import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowForwardIos, WorkspacePremium, Bolt, HelpCircle, BarChart3, Settings, Star, ChevronDown, Zap, Target, Users, GameController } from './icons';
import LanguageSwitcher from './LanguageSwitcher';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  // Use i18n for steps
  const steps = [
    {
      number: 1,
      title: t('landing.step1Title'),
      description: t('landing.step1Desc'),
      icon: '🔗'
    },
    {
      number: 2,
      title: t('landing.step2Title'),
      description: t('landing.step2Desc'),
      icon: '📝'
    },
    {
      number: 3,
      title: t('landing.step3Title'),
      description: t('landing.step3Desc'),
      icon: '✨'
    },
    {
      number: 4,
      title: t('landing.step4Title'),
      description: t('landing.step4Desc'),
      icon: '🏆'
    }
  ];

  // Use i18n for testimonials
  const testimonials = [
    {
      name: t('landing.testimonial1Name'),
      role: t('landing.testimonial1Role'),
      content: t('landing.testimonial1Content'),
      rating: 5
    },
    {
      name: t('landing.testimonial2Name'),
      role: t('landing.testimonial2Role'),
      content: t('landing.testimonial2Content'),
      rating: 5
    },
    {
      name: t('landing.testimonial3Name'),
      role: t('landing.testimonial3Role'),
      content: t('landing.testimonial3Content'),
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
            <Link
              to="/game"
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dim text-on-primary-container rounded-lg transition-all duration-300 scale-95 active:scale-90 transition-transform font-medium text-sm"
            >
              <GameController className="w-5 h-5" />
              <span>{t('landing.startPlaying')}</span>
            </Link>
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
                {t('landing.title')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-body text-on-surface-variant text-xl max-w-md font-light leading-relaxed"
              >
                {t('landing.tagline')}
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
                <span className="font-headline font-bold text-2xl uppercase tracking-widest text-on-primary-container">{t('landing.playToday')}</span>
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
                {t('landing.dailyChallenge')}
              </h3>
              <div className="flex items-end justify-between mb-8">
                <div className="space-y-1">
                  <span className="font-headline font-bold text-5xl text-on-surface">
                    0<span className="text-surface-container-highest">/</span>5
                  </span>
                  <p className="font-body text-on-surface-variant text-sm font-medium">{t('landing.wordsCompleted')}</p>
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
                  {t('landing.gamesPlayed')}
                </span>
                <span className="font-headline font-medium text-4xl text-on-surface">128</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between cursor-pointer"
              >
                <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-tertiary-fixed-variant">
                  {t('landing.winRate')}
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
                    {t('landing.currentStreak')}
                  </span>
                  <span className="font-headline font-medium text-4xl text-on-surface">
                    12 <span className="text-sm font-body font-normal text-on-surface-variant">{t('landing.days')}</span>
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
            <h2 className="font-headline font-bold text-4xl text-on-surface mb-4">{t('landing.howToPlay')}</h2>
            <p className="font-body text-on-surface-variant text-lg">{t('landing.howToPlaySubtitle')}</p>
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
            <h2 className="font-headline font-bold text-4xl text-on-surface mb-4">{t('landing.testimonials')}</h2>
            <p className="font-body text-on-surface-variant text-lg">{t('landing.testimonialsSubtitle')}</p>
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
            <h2 className="font-headline font-bold text-4xl text-on-surface mb-4">{t('landing.features')}</h2>
            <p className="font-body text-on-surface-variant text-lg">{t('landing.featuresSubtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: t('landing.feature1Title'), desc: t('landing.feature1Desc') },
              { icon: '📅', title: t('landing.feature2Title'), desc: t('landing.feature2Desc') },
              { icon: '💡', title: t('landing.feature3Title'), desc: t('landing.feature3Desc') },
              { icon: '📊', title: t('landing.feature4Title'), desc: t('landing.feature4Desc') },
              { icon: '🌙', title: t('landing.feature5Title'), desc: t('landing.feature5Desc') },
              { icon: '🆓', title: t('landing.feature6Title'), desc: t('landing.feature6Desc') }
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
          <h2 className="font-headline font-black text-5xl text-on-surface mb-6">{t('landing.readyToPlay')}</h2>
          <p className="font-body text-on-surface-variant text-xl mb-8 max-w-2xl mx-auto">
            {t('landing.readyToPlayDesc')}
          </p>
          <Link
            to="/game"
            className="inline-flex items-center gap-3 px-12 py-6 bg-primary text-on-primary-container rounded-xl font-headline font-bold text-xl uppercase tracking-widest hover:bg-primary-dim transition-all hover:scale-105"
          >
            {t('landing.startPlaying')}
            <ArrowForwardIos className="w-6 h-6" />
          </Link>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-background py-8 mt-auto flex flex-col md:flex-row justify-between items-center px-8 w-full border-t border-surface-container-high">
        <div className="mb-4 md:mb-0">
          <span className="font-body text-sm font-medium tracking-tight text-primary drop-shadow-[0_0_8px_rgba(175,244,166,0.3)]">
            {t('footer.copyright')}
          </span>
        </div>
        <div className="flex gap-8">
          <Link to="/privacy" className="font-body text-sm font-medium tracking-tight text-on-surface-variant hover:text-on-surface transition-colors opacity-80 hover:opacity-100">{t('footer.privacy')}</Link>
          <Link to="/terms" className="font-body text-sm font-medium tracking-tight text-on-surface-variant hover:text-on-surface transition-colors opacity-80 hover:opacity-100">{t('footer.terms')}</Link>
          <Link to="/about" className="font-body text-sm font-medium tracking-tight text-on-surface-variant hover:text-on-surface transition-colors opacity-80 hover:opacity-100">{t('footer.about')}</Link>
          <Link to="/contact" className="font-body text-sm font-medium tracking-tight text-on-surface-variant hover:text-on-surface transition-colors opacity-80 hover:opacity-100">{t('footer.support')}</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
