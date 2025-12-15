// Reusable Button Component
function Button({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    icon = null,
    className = '',
}) {
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full transition-all btn-active';

    const variants = {
        primary: 'bg-primary hover:bg-primary-hover text-text-main shadow-sm',
        secondary: 'bg-surface hover:bg-gray-50 dark:hover:bg-gray-700 text-text-main border-2 border-gray-200 dark:border-gray-600',
        outline: 'bg-transparent border-[3px] border-primary text-text-main hover:bg-primary/10',
        ghost: 'bg-transparent text-text-secondary hover:text-text-main',
        danger: 'bg-soft-red hover:bg-red-600 text-white',
    };

    const sizes = {
        sm: 'h-10 px-4 text-sm gap-1.5',
        md: 'h-12 px-6 text-base gap-2',
        lg: 'h-14 px-8 text-lg gap-2 tracking-wide',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
        >
            {icon && <span className="material-symbols-outlined text-xl">{icon}</span>}
            {children}
        </button>
    );
}

export default Button;
