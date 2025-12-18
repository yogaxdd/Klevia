// True/False Statement Row Component
function TrueFalseRow({
    statement,
    value = null, // null = not selected, true = Benar, false = Salah
    correct = null, // null = not answered yet, true = user's answer was correct, false = user's answer was wrong
    correctAnswer = null, // the actual correct answer (true/false)
    onChange,
    disabled = false,
    trueLabel = "Benar",
    falseLabel = "Salah",
}) {
    const getRowStyles = () => {
        if (correct === true) {
            return 'bg-primary/5';
        }
        if (correct === false) {
            return 'bg-[#F4A261]/5';
        }
        return 'bg-surface hover:bg-gray-50 dark:hover:bg-gray-800';
    };

    const getRadioStyles = (isSelected, isCorrectChoice) => {
        if (disabled) {
            if (isSelected && correct === true) {
                return 'border-primary bg-primary';
            }
            if (isSelected && correct === false) {
                return 'border-[#F4A261] bg-[#F4A261]';
            }
            if (!isSelected && isCorrectChoice) {
                return 'border-primary bg-primary';
            }
            return 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700';
        }
        if (isSelected) {
            return 'border-sky-500 bg-sky-500';
        }
        return 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400';
    };

    return (
        <div className={`flex items-start gap-4 p-4 border-b border-border last:border-b-0 transition-colors ${getRowStyles()}`}>
            {/* Statement Text */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${correct === true ? 'text-primary font-medium' :
                        correct === false ? 'text-[#c26d2b]' :
                            'text-text-main'
                    }`}>
                    {statement}
                </p>
            </div>

            {/* Benar Radio */}
            <label className={`flex flex-col items-center gap-1 ${disabled ? 'pointer-events-none' : 'cursor-pointer'}`}>
                <div className={`
                    flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all shrink-0
                    ${getRadioStyles(value === true, correctAnswer === true)}
                `}>
                    {(value === true || (disabled && correctAnswer === true)) && (
                        <span className="material-symbols-outlined text-[14px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {value === true && correct === false ? 'close' : 'check'}
                        </span>
                    )}
                </div>
                <input
                    type="radio"
                    className="sr-only"
                    checked={value === true}
                    onChange={() => onChange(true)}
                    disabled={disabled}
                />
            </label>

            {/* Salah Radio */}
            <label className={`flex flex-col items-center gap-1 ${disabled ? 'pointer-events-none' : 'cursor-pointer'}`}>
                <div className={`
                    flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all shrink-0
                    ${getRadioStyles(value === false, correctAnswer === false)}
                `}>
                    {(value === false || (disabled && correctAnswer === false)) && (
                        <span className="material-symbols-outlined text-[14px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {value === false && correct === false ? 'close' : 'check'}
                        </span>
                    )}
                </div>
                <input
                    type="radio"
                    className="sr-only"
                    checked={value === false}
                    onChange={() => onChange(false)}
                    disabled={disabled}
                />
            </label>
        </div>
    );
}

export default TrueFalseRow;
