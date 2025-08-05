import React from 'react';

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
export const Input = ({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-3 py-2 border rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
          ${className}
        `}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

// Textarea Component
export const Textarea = ({ 
  label, 
  error, 
  className = '', 
  placeholder,
  value,
  onChange,
  rows = 4,
  required = false,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={`
          w-full px-3 py-2 border rounded-lg text-sm resize-none
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
          ${className}
        `}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

// Select Component
export const Select = ({ 
  label, 
  error, 
  className = '', 
  placeholder = 'Select an option',
  value,
  onChange,
  options = [],
  required = false,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`
          w-full px-3 py-2 border rounded-lg text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
          ${className}
        `}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

// Checkbox Component
export const Checkbox = ({ 
  label, 
  checked, 
  onChange, 
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {label && (
        <label className={`ml-2 block text-sm text-gray-900 ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </label>
      )}
    </div>
  );
};

// Radio Component
export const Radio = ({ 
  name,
  options = [],
  value,
  onChange,
  label,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      {options.map((option, index) => (
        <div key={index} className="flex items-center">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            disabled={disabled}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label className={`ml-2 block text-sm text-gray-900 ${disabled ? 'opacity-50' : ''}`}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

// Modal Component
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />
        
        <div className={`
          inline-block w-full ${sizes[size]} p-6 my-8 overflow-hidden text-left align-middle 
          transition-all transform bg-white shadow-xl rounded-2xl relative z-10
        `}>
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between mb-4">
              {title && (
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

// Card Component
export const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  ...props 
}) => {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover 
    ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer' 
    : '';

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200 
        ${paddings[padding]} ${hoverClasses} ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Badge Component
export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${variants[variant]} ${sizes[size]} ${className}
    `}>
      {children}
    </span>
  );
};

// Loading Spinner Component
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 w-12'
  };

  return (
    <div className={`
      animate-spin rounded-full border-2 border-gray-300 border-t-blue-600
      ${sizes[size]} ${className}
    `} />
  );
};

// Progress Bar Component
export const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  className = '',
  size = 'md',
  variant = 'primary',
  showLabel = false
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const variants = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-700 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`}>
        <div 
          className={`${variants[variant]} ${sizes[size]} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && (
        <div className="text-6xl mb-4">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action}
    </div>
  );
};

// Toast Notification Component
export const Toast = ({ 
  message, 
  type = 'info', 
  isVisible, 
  onClose,
  duration = 5000 
}) => {
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const types = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg
      transform transition-all duration-300 ease-in-out
      ${types[type]}
    `}>
      <span className="text-lg">{icons[type]}</span>
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200 transition-colors duration-200"
      >
        ✕
      </button>
    </div>
  );
};

// Dropdown Component
export const Dropdown = ({ 
  trigger, 
  children, 
  align = 'right',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`
          absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50
          ${alignmentClasses[align]} ${className}
        `}>
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Dropdown Item Component
export const DropdownItem = ({ 
  children, 
  onClick, 
  icon,
  className = '',
  disabled = false 
}) => {
  return (
    <button
      className={`
        w-full flex items-center gap-2 px-4 py-2 text-sm text-left
        hover:bg-gray-100 transition-colors duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="text-gray-400">{icon}</span>}
      {children}
    </button>
  );
};

// Search Input Component
export const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className = '',
  onClear,
  ...props 
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        className="
          w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
        "
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={onClear}
        >
          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

// Tabs Component
export const Tabs = ({ children, defaultTab, className = '' }) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || 0);

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {React.Children.map(children, (child, index) => (
            <button
              key={index}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                ${activeTab === index
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              onClick={() => setActiveTab(index)}
            >
              {child.props.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {React.Children.toArray(children)[activeTab]}
      </div>
    </div>
  );
};

// Tab Panel Component
export const TabPanel = ({ children, label }) => {
  return <div>{children}</div>;
};

// Tooltip Component
export const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  className = '' 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`
          absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded whitespace-nowrap
          ${positions[position]} ${className}
        `}>
          {content}
          <div className={`
            absolute w-2 h-2 bg-gray-900 transform rotate-45
            ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' : ''}
            ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' : ''}
            ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' : ''}
            ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1' : ''}
          `} />
        </div>
      )}
    </div>
  );
};

// Pagination Component
export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showInfo = true,
  className = '' 
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {showInfo && (
        <div className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
      )}
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md
            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          Previous
        </button>
        
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`
              px-3 py-2 text-sm font-medium border-t border-b border-r border-gray-300
              ${page === currentPage
                ? 'bg-blue-50 text-blue-600 border-blue-500'
                : 'bg-white text-gray-500 hover:bg-gray-50'
              }
              ${page === '...' ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md
            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Alert Component
export const Alert = ({ 
  children, 
  variant = 'info', 
  className = '',
  onClose,
  title
}) => {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  const icons = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '✕'
  };

  return (
    <div className={`
      border rounded-lg p-4 flex items-start space-x-3
      ${variants[variant]} ${className}
    `}>
      <div className="flex-shrink-0">
        {icons[variant]}
      </div>
      <div className="flex-1">
        {title && (
          <h4 className="font-semibold mb-1">{title}</h4>
        )}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// Avatar Component
export const Avatar = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md', 
  fallback,
  className = '' 
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`
      ${sizes[size]} rounded-full bg-gray-300 flex items-center justify-center
      text-gray-600 font-semibold ${className}
    `}>
      {fallback || alt.charAt(0).toUpperCase()}
    </div>
  );
};

// Divider Component
export const Divider = ({ 
  orientation = 'horizontal', 
  className = '',
  children 
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={`border-l border-gray-200 ${className}`} />
    );
  }

  if (children) {
    return (
      <div className={`relative flex items-center ${className}`}>
        <div className="flex-grow border-t border-gray-200" />
        <span className="px-3 text-sm text-gray-500 bg-white">
          {children}
        </span>
        <div className="flex-grow border-t border-gray-200" />
      </div>
    );
  }

  return (
    <hr className={`border-gray-200 ${className}`} />
  );
};