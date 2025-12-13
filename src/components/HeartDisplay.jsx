// Heart Display Component (Lives indicator)
function HeartDisplay({ hearts = 5, maxHearts = 5 }) {
    return (
        <div className="flex items-center gap-1 text-red-500 font-bold text-lg">
            <span
                className="material-symbols-outlined text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
            >
                favorite
            </span>
            <span>{hearts}</span>
        </div>
    );
}

export default HeartDisplay;
