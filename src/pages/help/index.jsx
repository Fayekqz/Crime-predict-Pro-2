import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const HelpSupport = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    { id: 'getting-started', label: 'Getting Started', icon: 'BookOpen', count: 8 },
    { id: 'data-management', label: 'Data Management', icon: 'Database', count: 12 },
    { id: 'predictions', label: 'Predictions & Models', icon: 'TrendingUp', count: 15 },
    { id: 'map-analysis', label: 'Map Analysis', icon: 'Map', count: 10 },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: 'Wrench', count: 6 }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I upload crime data?',
      answer: 'Navigate to the Data Management section and click on "Upload Data". You can upload CSV files with the required columns: date, time, location, crime type, and severity.'
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'What data format is supported?',
      answer: 'Currently, we support CSV format with UTF-8 encoding. The file should include columns for date, time, location (latitude/longitude or address), crime type, and severity level.'
    },
    {
      id: 3,
      category: 'data-management',
      question: 'How do I clean my data?',
      answer: 'Use the Data Validation feature in the Data Management section. It automatically detects and helps you fix common data issues like missing values, incorrect formats, and duplicates.'
    },
    {
      id: 4,
      category: 'predictions',
      question: 'How accurate are the predictions?',
      answer: 'Our LSTM models typically achieve 85-92% accuracy depending on data quality and historical patterns. The accuracy improves with more comprehensive and clean historical data.'
    },
    {
      id: 5,
      category: 'map-analysis',
      question: 'How do I interpret the heat map?',
      answer: 'Red areas indicate high crime density, yellow shows medium density, and green represents low density. You can adjust the time range and filters to focus on specific patterns.'
    },
    {
      id: 6,
      category: 'troubleshooting',
      question: 'Why is my upload failing?',
      answer: 'Common issues include: incorrect file format, missing required columns, file size exceeding 10MB, or invalid data formats. Check the error message for specific details.'
    }
  ];

  const quickActions = [
    { title: 'Video Tutorials', description: 'Watch step-by-step guides', icon: 'Video', color: 'bg-blue-500' },
    { title: 'API Documentation', description: 'Technical documentation for developers', icon: 'Code', color: 'bg-green-500' },
    { title: 'Community Forum', description: 'Get help from other users', icon: 'Users', color: 'bg-purple-500' },
    { title: 'Contact Support', description: 'Reach our support team directly', icon: 'MessageCircle', color: 'bg-orange-500' }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.category === activeCategory &&
    (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/main-dashboard" className="text-muted-foreground hover:text-foreground">
                <Icon name="ArrowLeft" size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
                <p className="text-sm text-muted-foreground">Find answers and get assistance</p>
              </div>
            </div>
            <Button variant="outline">
              <Icon name="MessageCircle" size={16} className="mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, and documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions?.map((action, index) => (
            <div key={index} className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                <Icon name={action.icon} size={20} color="white" />
              </div>
              <h3 className="font-medium text-foreground mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-medium text-foreground mb-4">Categories</h3>
              <nav className="space-y-1">
                {helpCategories?.map((category) => (
                  <button
                    key={category?.id}
                    onClick={() => setActiveCategory(category?.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      activeCategory === category?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name={category?.icon} size={16} />
                      <span>{category?.label}</span>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                      {category?.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div className="bg-card rounded-lg border border-border p-4 mt-4">
              <h3 className="font-medium text-foreground mb-4">Need More Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Icon name="Mail" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-xs text-muted-foreground">support@crimepredictpro.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Phone" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone</p>
                    <p className="text-xs text-muted-foreground">1-800-CRIME-HELP</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Hours</p>
                    <p className="text-xs text-muted-foreground">24/7 Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {helpCategories.find(cat => cat.id === activeCategory)?.label}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Frequently asked questions and common issues
                </p>
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFaqs?.length > 0 ? (
                  filteredFaqs?.map((faq) => (
                    <div key={faq?.id} className="border border-border rounded-lg">
                      <button
                        onClick={() => toggleFaq(faq?.id)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-muted transition-colors"
                      >
                        <span className="font-medium text-foreground">{faq?.question}</span>
                        <Icon 
                          name={expandedFaq === faq?.id ? "ChevronUp" : "ChevronDown"} 
                          size={16} 
                          className="text-muted-foreground"
                        />
                      </button>
                      {expandedFaq === faq?.id && (
                        <div className="px-4 pb-3 border-t border-border">
                          <p className="text-sm text-muted-foreground mt-3">{faq?.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No results found for your search.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try different keywords or browse other categories.
                    </p>
                  </div>
                )}
              </div>

              {/* Related Articles */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-medium text-foreground mb-4">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Understanding Crime Patterns</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Learn how to analyze and interpret crime data patterns
                    </p>
                    <Button variant="ghost" size="sm">Read More →</Button>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Best Practices for Data Upload</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Tips for preparing and uploading your crime datasets
                    </p>
                    <Button variant="ghost" size="sm">Read More →</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
