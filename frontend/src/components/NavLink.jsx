import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const NavLink = ({ 
  to, 
  icon: Icon, 
  label, 
  className = '', 
  variant = 'default',
  showIcon = true,
  showLabel = true,
  onClick
}) => {
  const location = useLocation()
  const isActive = location.pathname === to

  const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
  
  const variantClasses = {
    default: `text-base ${isActive 
      ? 'bg-blue-800 text-white' 
      : 'text-white hover:bg-blue-600'
    }`,
    secondary: `text-sm ${isActive 
      ? 'bg-blue-800 text-white' 
      : 'text-white hover:bg-blue-600'
    }`,
    mobile: `text-base ${isActive 
      ? 'bg-blue-800 text-white' 
      : 'text-white hover:bg-blue-600'
    }`
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Link
        to={to}
        className={`${baseClasses} ${variantClasses[variant]} ${className} relative`}
        onClick={onClick}
      >
        {showIcon && Icon && <Icon size={18} strokeWidth={2} />}
        {showLabel && <span>{label}</span>
      </Link>
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-3 right-3 h-0.5 bg-white rounded-full"
          layoutId={`activeIndicator-${variant}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  )
}

export default NavLink