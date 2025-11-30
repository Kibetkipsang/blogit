import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock, 
  Search, 
  HelpCircle, 
  FileText, 
  Users, 
  Shield, 
  CreditCard,
  BookOpen,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "", category: "general" });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const helpCategories = [
    {
      id: "general",
      name: "General Help",
      icon: HelpCircle,
      description: "Common questions and basic guidance",
      color: "blue"
    },
    {
      id: "account",
      name: "Account & Profile",
      icon: Users,
      description: "Login, registration, and profile settings",
      color: "green"
    },
    {
      id: "writing",
      name: "Writing & Publishing",
      icon: BookOpen,
      description: "Creating and managing your blog posts",
      color: "purple"
    },
    {
      id: "billing",
      name: "Billing & Plans",
      icon: CreditCard,
      description: "Payment, subscriptions, and billing issues",
      color: "orange"
    },
    {
      id: "privacy",
      name: "Privacy & Security",
      icon: Shield,
      description: "Data protection and account security",
      color: "red"
    },
    {
      id: "technical",
      name: "Technical Issues",
      icon: FileText,
      description: "Bugs, errors, and technical problems",
      color: "indigo"
    }
  ];

  const faqs = {
    general: [
      {
        question: "What is BlogIt and how does it work?",
        answer: "BlogIt is a modern blogging platform that allows writers to share their stories, connect with readers, and build their audience. You can create an account, write articles using our markdown editor, and publish them to reach a global audience."
      },
      {
        question: "Is BlogIt free to use?",
        answer: "Yes! BlogIt offers a free plan that includes all essential features for writing and publishing. We also offer premium plans with additional features for professional writers and content creators."
      },
      {
        question: "How do I get started with BlogIt?",
        answer: "Getting started is easy! Simply click the 'Register' button in the top navigation, create your account, and you can immediately start writing your first blog post. No credit card required for the free plan."
      }
    ],
    account: [
      {
        question: "How do I reset my password?",
        answer: "Click on 'Login' and then 'Forgot Password'. Enter your email address and we'll send you a password reset link. Make sure to check your spam folder if you don't see the email."
      },
      {
        question: "Can I change my username?",
        answer: "Yes, you can change your username from your profile settings. Go to your profile page, click 'Edit Profile', and update your username. Note that your old username will become available for others."
      },
      {
        question: "How do I delete my account?",
        answer: "You can delete your account from the settings page in your profile. Please note that this action is permanent and will remove all your content and data from our platform."
      }
    ],
    writing: [
      {
        question: "What formatting options are available?",
        answer: "BlogIt supports markdown formatting, allowing you to create rich content with headers, lists, code blocks, images, and more. We also provide a live preview so you can see how your post will look."
      },
      {
        question: "Can I schedule posts for later publication?",
        answer: "Yes! When creating or editing a post, you can set a future publication date and time. Your post will automatically publish at the scheduled time."
      },
      {
        question: "How do I add images to my blog posts?",
        answer: "You can upload images directly from your computer or add images from URLs. We recommend using high-quality images and proper alt text for accessibility."
      }
    ]
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      red: "bg-red-100 text-red-600",
      indigo: "bg-indigo-100 text-indigo-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to common questions or get in touch with our support team. 
            We're here to help you succeed with BlogIt.
          </p>
          
          
        </div>

        {/* Help Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Browse Help Topics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all hover:shadow-md text-left ${
                    activeCategory === category.id 
                      ? 'border-green-500 shadow-md' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${getColorClasses(category.color)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {(faqs[activeCategory as keyof typeof faqs] || []).map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    {openFaqs.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openFaqs.includes(index) && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Get in Touch
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Email Support
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Send us an email and we'll respond within 24 hours
                  </p>
                  <a 
                    href="mailto:support@blogit.com" 
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    support@blogit.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Live Chat
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Chat with our support team in real-time
                  </p>
                  <p className="text-gray-500 text-sm">
                    Available Monday-Friday, 9AM-6PM EST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Response Time
                  </h3>
                  <p className="text-gray-600">
                    We typically respond to all inquiries within 4-6 hours during business hours. 
                    Emergency issues are prioritized for immediate attention.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h3>

            {isSubmitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">Message sent successfully!</p>
                    <p className="text-green-700 text-sm">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {helpCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please describe your issue or question in detail..."
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>

              <p className="text-gray-500 text-sm text-center">
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Urgent Support Needed?
              </h3>
              <p className="text-yellow-700">
                For critical issues requiring immediate attention (security concerns, account compromise, 
                or platform downtime), please email{' '}
                <a href="mailto:urgent@blogit.com" className="font-semibold underline">
                  urgent@blogit.com
                </a>
                {' '}and include "URGENT" in the subject line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}