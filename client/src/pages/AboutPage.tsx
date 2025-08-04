import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Search, Heart, DollarSign, Clock, Users } from 'lucide-react'

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: 'Shortest Distance',
      description: 'Find the closest grocery stores to minimize travel time and transportation costs.'
    },
    {
      icon: Heart,
      title: 'Healthiest Options',
      description: 'Discover stores with the best organic produce, natural foods, and healthy alternatives.'
    },
    {
      icon: DollarSign,
      title: 'Best Prices',
      description: 'Compare prices across different stores to find the most affordable options for your groceries.'
    },
    {
      icon: MapPin,
      title: 'Location-Based',
      description: 'Enter any zipcode to find grocery stores in that specific area with accurate distance calculations.'
    },
    {
      icon: Search,
      title: 'Item-Specific Search',
      description: 'Search for specific grocery items to get targeted recommendations and price comparisons.'
    },
    {
      icon: Users,
      title: 'Community-Driven',
      description: 'Store ratings and health scores are based on community feedback and verified data sources.'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          About Smart Grocery Finder
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We help you make informed decisions about where to shop for groceries by providing 
          personalized recommendations based on distance, health quality, and pricing.
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card mb-12"
      >
        <div className="card-body">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            In today's busy world, choosing the right grocery store can save you time, money, and help you 
            maintain a healthier lifestyle. Smart Grocery Finder was created to simplify this decision by 
            analyzing multiple factors that matter most to shoppers: convenience, health-conscious options, 
            and affordability.
          </p>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card"
              >
                <div className="card-body text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card mb-12"
      >
        <div className="card-body">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Enter Your Information</h3>
                <p className="text-gray-600">
                  Provide your zipcode and the specific grocery item you're looking for.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">We Analyze Options</h3>
                <p className="text-gray-600">
                  Our algorithm evaluates nearby stores based on distance, health scores, and pricing data.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Get Personalized Recommendations</h3>
                <p className="text-gray-600">
                  Receive three tailored suggestions: the closest store, the healthiest option, and the most affordable choice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Technology Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card"
      >
        <div className="card-body">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology & Data</h2>
          <p className="text-gray-600 mb-4">
            Smart Grocery Finder uses advanced algorithms and real-time data to provide accurate recommendations:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
              Geolocation services for precise distance calculations
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
              Real-time pricing data from multiple grocery store APIs
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
              Health scoring based on organic selection, produce quality, and store policies
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
              Interactive maps powered by OpenStreetMap for visual store locations
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

export default AboutPage 