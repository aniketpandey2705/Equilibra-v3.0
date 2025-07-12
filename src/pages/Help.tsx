import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Book, Video, FileText, ExternalLink } from 'lucide-react';
import { Resource } from '../types';

const resources: Resource[] = [
  {
    id: '1',
    title: 'Getting Started Guide',
    description: 'Learn the basics of journaling and how to use Equilibria effectively',
    type: 'article',
    link: '#',
    date: '2024-03-15',
  },
  {
    id: '2',
    title: 'Writing Prompts Library',
    description: 'Explore our collection of writing prompts to inspire your journaling practice',
    type: 'document',
    link: '#',
    date: '2024-03-14',
  },
  {
    id: '3',
    title: 'Video Tutorial: Advanced Features',
    description: 'Deep dive into advanced features and productivity tips',
    type: 'video',
    link: '#',
    date: '2024-03-13',
    thumbnail: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

const faqs = [
  {
    question: 'How do I get started with journaling?',
    answer: 'Start by setting aside a few minutes each day to write. You can use our prompts or write freely about your thoughts and experiences.',
  },
  {
    question: 'Can I export my journal entries?',
    answer: 'Yes, you can export your entries in various formats including PDF and plain text. Go to Settings > Export to access this feature.',
  },
  {
    question: 'How secure are my journal entries?',
    answer: 'Your entries are encrypted and stored securely. Only you can access them with your account credentials.',
  },
];

const Help: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Help & Support</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Find answers to common questions and learn how to use Equilibria
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                <Book size={24} />
              </div>
              <h2 className="text-lg font-semibold">Documentation</h2>
            </div>
            <p className="text-surface-600 dark:text-surface-400 mb-4">
              Explore our comprehensive documentation to learn all about Equilibria's features
            </p>
            <button className="btn btn-outline w-full">View Documentation</button>
          </motion.div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 rounded-lg">
                <HelpCircle size={24} />
              </div>
              <h2 className="text-lg font-semibold">Support</h2>
            </div>
            <p className="text-surface-600 dark:text-surface-400 mb-4">
              Need help? Our support team is here to assist you
            </p>
            <button className="btn btn-outline w-full">Contact Support</button>
          </motion.div>
        </div>
        
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Resources</h2>
          <div className="grid grid-cols-1 gap-4">
            {resources.map((resource) => (
              <motion.div 
                key={resource.id}
                className="card flex items-start gap-4"
                whileHover={{ y: -2 }}
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  {resource.type === 'video' && resource.thumbnail ? (
                    <img 
                      src={resource.thumbnail} 
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${
                      resource.type === 'article' 
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400'
                    }`}>
                      {resource.type === 'article' ? (
                        <FileText size={24} />
                      ) : (
                        <Book size={24} />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{resource.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      resource.type === 'article'
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300'
                        : resource.type === 'video'
                        ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-300'
                        : 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300'
                    }`}>
                      {resource.type}
                    </span>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-surface-500">{resource.date}</span>
                    <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1">
                      Learn More
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-surface-600 dark:text-surface-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Help;