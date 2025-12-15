// Reusable Card Component
function Card({
    children,
    className = '',
    padding = 'md',
    onClick = null,
    hoverable = false,
}) {
    const baseStyling = 'bg-card-bg rounded-2xl shadow-card border border-border-color';

    const paddingSizes = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    const hoverStyles = hoverable
        ? 'cursor-pointer hover:shadow-soft hover:border-gray-200 dark:hover:border-gray-600 transition-all'
        : '';

    return (
        <div
            onClick={onClick}
            className={`${baseStyling} ${paddingSizes[padding]} ${hoverStyles} ${className}`}
        >
            {children}
        </div>
    );
}

export default Card;
