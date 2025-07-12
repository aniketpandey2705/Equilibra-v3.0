import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Moon, Shield, Globe, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email || 'User';
  const email = user?.email || '';
  const photoURL = user?.photoURL;

  const settingsSections = [
    {
      title: 'Profile',
      icon: User,
      settings: [
        { name: 'Name', value: displayName },
        { name: 'Email', value: email },
        { name: 'Bio', value: 'Writer and creative thinker' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        { name: 'Email notifications', value: 'Enabled' },
        { name: 'Push notifications', value: 'Disabled' },
        { name: 'Weekly digest', value: 'Enabled' },
      ]
    },
    {
      title: 'Appearance',
      icon: Moon,
      settings: [
        { name: 'Theme', value: 'System default' },
        { name: 'Font size', value: 'Medium' },
        { name: 'Compact mode', value: 'Disabled' },
      ]
    },
    {
      title: 'Privacy',
      icon: Shield,
      settings: [
        { name: 'Profile visibility', value: 'Private' },
        { name: 'Two-factor auth', value: 'Enabled' },
        { name: 'Data sharing', value: 'Minimal' },
      ]
    },
    {
      title: 'Language',
      icon: Globe,
      settings: [
        { name: 'Interface language', value: 'English' },
        { name: 'Content language', value: 'English' },
        { name: 'Date format', value: 'MM/DD/YYYY' },
      ]
    },
    {
      title: 'Help & Support',
      icon: HelpCircle,
      settings: [
        { name: 'Documentation', value: 'View' },
        { name: 'Contact support', value: 'Email' },
        { name: 'FAQ', value: 'View' },
      ]
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Settings</h1>
            <p className="text-surface-600 dark:text-surface-400">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settingsSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    <section.icon size={20} />
                  </div>
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                </div>

                <div className="space-y-4">
                  {section.settings.map((setting, settingIndex) => (
                    <div
                      key={settingIndex}
                      className="flex items-center justify-between py-2 border-b border-surface-200 dark:border-surface-700 last:border-0"
                    >
                      <span className="text-sm text-surface-600 dark:text-surface-400">
                        {setting.name}
                      </span>
                      <span className="text-sm font-medium">{setting.value}</span>
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                  Edit {section.title}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;