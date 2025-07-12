import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, PenTool, Target, DollarSign, GraduationCap, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const features = [
    {
      icon: PenTool,
      title: 'Smart Journaling',
      description: 'AI-powered writing prompts and mood tracking to enhance your daily reflection practice.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into your writing patterns, mood trends, and personal growth.'
    },
    {
      icon: DollarSign,
      title: 'Expense Tracking',
      description: 'Monitor your spending habits with detailed categorization and budget management tools.'
    },
    {
      icon: GraduationCap,
      title: 'Academic Performance',
      description: 'Track your academic progress with grade monitoring and study time analytics.'
    },
    {
      icon: Target,
      title: 'Goal Setting',
      description: 'Set and track personal goals with progress monitoring and achievement milestones.'
    },
    {
      icon: BookOpen,
      title: 'Entry Management',
      description: 'Organize and search through your journal entries with powerful filtering options.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 via-primary-900 to-surface-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-primary-600/20 rounded-lg"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 bg-secondary-500/20 rounded-lg"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-primary-500/15 rounded-lg"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 3, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-28 h-28 bg-accent-500/20 rounded-lg"
          animate={{
            y: [0, 25, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <motion.path
            d="M 200 200 Q 400 150 600 250 T 1000 300"
            stroke="rgba(79, 70, 229, 0.3)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.path
            d="M 150 400 Q 350 350 550 450 T 950 500"
            stroke="rgba(13, 148, 136, 0.3)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>
        
        {/* Connection Nodes */}
        <motion.div
          className="absolute top-32 left-32 w-4 h-4 bg-primary-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-52 right-40 w-4 h-4 bg-secondary-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-1/3 w-4 h-4 bg-primary-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, delay: 1, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 right-32 w-4 h-4 bg-accent-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, delay: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary-600 font-bold text-lg">E</span>
            </div>
            <span className="text-white text-xl font-semibold">Equilibria</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
            <a href="#solution" className="text-white/80 hover:text-white transition-colors">Solution</a>
            <a href="#resources" className="text-white/80 hover:text-white transition-colors">Resources</a>
            <Link to="/auth" className="text-white/80 hover:text-white transition-colors border-b border-white/20">Login</Link>
            <Link to="/auth" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Boost your productivity with automated operation integration
            </motion.h1>
            
            <motion.p
              className="text-xl text-white/80 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Boost your productivity with automated operation integration. 
              Streamline processes and save time, allowing you to focus on the core of your work.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to="/auth"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                Get started
                <ArrowRight size={18} />
              </Link>
              <button className="text-white border-b border-white/30 hover:border-white transition-colors px-8 py-3 font-medium">
                Learn more
              </button>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-white/80">Everything you need to boost your productivity and track your progress</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-primary-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to get started?</h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of users who have transformed their productivity with Equilibria
            </p>
            <Link
              to="/auth"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-medium transition-colors inline-flex items-center gap-2 text-lg"
            >
              Start your journey
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;