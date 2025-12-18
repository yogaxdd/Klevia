// Script to convert JSON questions to JS format
const fs = require('fs');

function cleanReadingPassage(text) {
    if (!text) return null;
    // Remove "Teks untuk soal nomor X s.d. Y" prefix
    return text.replace(/^Teks untuk soal nomor \d+ s\.d\. \d+\s*/i, '').trim();
}

function convertQuestion(q) {
    const result = {
        id: q.question_number,
        question: q.question_text,
        questionType: q.question_type,
    };

    // Handle reading passage
    if (q.reading_passage) {
        result.readingPassage = cleanReadingPassage(q.reading_passage);
    }

    // Handle question images
    if (q.question_images && q.question_images.length > 0) {
        result.questionImages = q.question_images.map(img =>
            '/' + img.local_path.replace(/\\\\/g, '/')
        );
    } else {
        result.questionImages = [];
    }

    // Handle different question types
    if (q.question_type === 'true_false') {
        // Convert options to statements
        const statements = q.options
            .filter(opt => opt.type === 'statement')
            .map(opt => ({
                text: opt.text,
                correctAnswer: true // Default, need manual verification
            }));
        result.statements = statements;
        result.optionLabels = {
            trueLabel: q.option_labels?.true_label || 'Benar',
            falseLabel: q.option_labels?.false_label || 'Salah'
        };
    } else {
        // Handle options
        result.options = q.options.map(opt => opt.text);

        // Check for option images
        const hasOptImages = q.options.some(opt => opt.images && opt.images.length > 0);
        if (hasOptImages) {
            result.optionImages = q.options.map(opt =>
                opt.images && opt.images.length > 0
                    ? '/' + opt.images[0].replace(/\\\\/g, '/')
                    : null
            );
        }

        if (q.question_type === 'multiple_answer') {
            result.correctAnswers = [0, 1]; // Placeholder, need manual verification
        } else {
            result.correctAnswer = 0; // Placeholder, need manual verification
        }
    }

    return result;
}

// Convert Bindo
const bindo = JSON.parse(fs.readFileSync('Scape/pusmendik_questions_complete-bind.json'));
const bindoQuestions = bindo.map(convertQuestion);
console.log('Bindo questions converted:', bindoQuestions.length);

// Convert MTK
const mtk = JSON.parse(fs.readFileSync('Scape/pusmendik_questions_complete_mtk.json'));
const mtkQuestions = mtk.map(convertQuestion);
console.log('MTK questions converted:', mtkQuestions.length);

// Generate Bindo JS content
let bindoContent = `// TKA Bahasa Indonesia - Full format with reading passages and all question types
// Auto-generated from pusmendik_questions_complete-bind.json
// Total: ${bindoQuestions.length} questions

const questionsTKABindo = ${JSON.stringify(bindoQuestions, null, 4)};

export default questionsTKABindo;
`;

// Generate MTK JS content
let mtkContent = `// TKA Matematika - Full format with reading passages and all question types
// Auto-generated from pusmendik_questions_complete_mtk.json
// Total: ${mtkQuestions.length} questions

const questionsTKAMtk = ${JSON.stringify(mtkQuestions, null, 4)};

export default questionsTKAMtk;
`;

// Write files
fs.writeFileSync('src/data/questionsTKABindo.js', bindoContent);
fs.writeFileSync('src/data/questionsTKAMtk.js', mtkContent);

console.log('Files generated successfully!');
console.log('- src/data/questionsTKABindo.js (' + bindoQuestions.length + ' questions)');
console.log('- src/data/questionsTKAMtk.js (' + mtkQuestions.length + ' questions)');
