// Option Card Component for Multiple Choice
function OptionCard({
    label,
    text,
    image = null, // optional image URL for image-based options
    selected = false,
    correct = null, // null = not answered, true = correct, false = incorrect
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
        if (selected) {
            return 'border-soft-blue bg-soft-blue/20';
        }
        return 'border-gray-200 dark:border-gray-600 bg-surface hover:bg-gray-50 dark:hover:bg-gray-700';
    };

    const getLabelStyles = () => {
        if (correct === true) {
            return 'border-primary text-primary bg-primary/20';
        }
        if (correct === false) {
            return 'border-[#F4A261] text-[#c26d2b] bg-[#F4A261]/20';
        }
        if (selected) {
            return 'border-sky-500 text-sky-600 bg-surface';
        }
        return 'border-gray-300 text-gray-400';
    };

    return (
        <label className={`relative group ${disabled ? 'pointer-events-none' : 'cursor-pointer'}`}>
            <input
                type="radio"
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
                <div className={`
          flex items-center justify-center w-8 h-8 rounded-full border-2 mr-4 font-bold text-sm shrink-0
          ${getLabelStyles()}
        `}>
                    {correct === true ? (
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    ) : correct === false ? (
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>close</span>
                    ) : (
                        label
                    )}
                </div>
                <div className="flex-1">
                    {/* Show image if provided */}
                    {image && (
                        <img
                            src={image}
                            alt={text || `Option ${label}`}
                            className="max-h-20 object-contain mb-1"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    )}
                    {/* Show text if provided */}
                    {text && (
                        <span className={`text-base font-medium ${correct === true ? 'text-primary' :
                            correct === false ? 'text-[#c26d2b]' :
                                'text-text-main group-hover:text-black'
                            }`}>
                            {text}
                        </span>
                    )}
                </div>
            </div>
        </label>
    );
}

export default OptionCard;
