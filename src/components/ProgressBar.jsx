// Progress Bar Component
function ProgressBar({
    value = 0,
    max = 100,
    showLabel = false,
    size = 'md',
    color = 'primary',
    className = '',
}) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizes = {
        sm: 'h-1.5',
        md: 'h-2',
        lg: 'h-3',
    };

    const colors = {
        primary: 'bg-primary',
        blue: 'bg-soft-blue',
        orange: 'bg-soft-orange',
        green: 'bg-soft-green',
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className={`flex-1 ${sizes[size]} bg-gray-200 rounded-full overflow-hidden`}>
                <div
                    className={`h-full ${colors[color]} rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <span className="text-xs font-medium text-text-secondary min-w-[32px] text-right">
                    {Math.round(percentage)}%
                </span>
            )}
        </div>
    );
}

export default ProgressBar;
