// Multi-Select Option Card Component for Multiple Answer Questions
// Simplified version without A/B/C/D labels - just checkbox + text
function MultiSelectOptionCard({
    text,
    selected = false,
    correct = null, // null = not answered, true = correct selection, false = incorrect selection, 'missed' = should have been selected
    onClick,
    disabled = false,
}) {
    const getStateStyles = () => {
        if (correct === true) {
            return 'border-primary bg-primary/10';
        }
        if (correct === false) {
            return 'border-[#F4A261] bg-[#F4A261]/10';
        }
        if (correct === 'missed') {
            return 'border-primary bg-primary/5';
        }
        if (selected) {
            return 'border-soft-blue bg-soft-blue/20';
        }
        return 'border-gray-200 dark:border-gray-600 bg-surface hover:bg-gray-50 dark:hover:bg-gray-700';
    };

    const getCheckboxStyles = () => {
        if (correct === true) {
            return 'border-primary bg-primary';
        }
        if (correct === false) {
            return 'border-[#F4A261] bg-[#F4A261]';
        }
        if (correct === 'missed') {
            return 'border-primary bg-primary';
        }
        if (selected) {
            return 'border-sky-500 bg-sky-500';
        }
        return 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700';
    };

    // Determine which icon to show
    const renderIcon = () => {
        if (correct === true) {
            return <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>;
        }
        if (correct === false) {
            return <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>close</span>;
        }
        if (correct === 'missed') {
            return <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>;
        }
        if (selected) {
            return <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>;
        }
        return null;
    };

    return (
        <label className={`relative group ${disabled ? 'pointer-events-none' : 'cursor-pointer'}`}>
            <input
                type="checkbox"
                className="peer sr-only"
                checked={selected}
                onChange={onClick}
                disabled={disabled}
            />
            <div className={`
                flex items-center p-4 rounded-xl border-2 transition-all duration-200
                ${getStateStyles()}
                ${disabled && correct === null ? 'opacity-50' : ''}
            `}>
                {/* Checkbox */}
                <div className={`
                    flex items-center justify-center w-6 h-6 rounded-md border-2 mr-4 shrink-0 transition-all
                    ${getCheckboxStyles()}
                `}>
                    {renderIcon()}
                </div>

                {/* Text */}
                <span className={`text-base font-medium flex-1 ${correct === true ? 'text-primary' :
                        correct === false ? 'text-[#c26d2b]' :
                            correct === 'missed' ? 'text-primary' :
                                'text-text-main group-hover:text-black dark:group-hover:text-white'
                    }`}>
                    {text}
                </span>
            </div>
        </label>
    );
}

export default MultiSelectOptionCard;
