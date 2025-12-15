import { useState } from 'react';
import { gradeEssayAnswer } from '../services/geminiService';
import Button from '../components/Button';
import Card from '../components/Card';

function AITestPage() {
    const [question, setQuestion] = useState('Cerpen adalah singkatan dari...');
    const [expectedAnswer, setExpectedAnswer] = useState('cerita pendek');
    const [userAnswer, setUserAnswer] = useState('Cerita Pendek');
    const [subject, setSubject] = useState('bahasa');

    const [isGrading, setIsGrading] = useState(false);
    const [result, setResult] = useState(null);
    const [rawResponse, setRawResponse] = useState(null);

    // Pre-defined test cases
    const testCases = [
        {
            name: 'Test 1: Exact Match (Case Insensitive)',
            question: 'Cerpen adalah singkatan dari...',
            expected: 'cerita pendek',
            user: 'Cerita Pendek',
            subject: 'bahasa'
        },
        {
            name: 'Test 2: With Extra Words',
            question: 'Apa tujuan surat lamaran kerja?',
            expected: 'melamar pekerjaan',
            user: 'untuk melamar pekerjaan',
            subject: 'bahasa'
        },
        {
            name: 'Test 3: Partial Answer',
            question: 'Sebutkan struktur teks deskripsi!',
            expected: 'Pernyataan Umum, Deskripsi Bagian, Kesimpulan',
            user: 'Pernyataan Umum, Deskripsi Bagian',
            subject: 'bahasa'
        },
        {
            name: 'Test 4: Wrong Answer',
            question: 'Cerpen adalah singkatan dari...',
            expected: 'cerita pendek',
            user: 'cerita panjang',
            subject: 'bahasa'
        },
        {
            name: 'Test 5: Synonym/Similar Meaning',
            question: 'Apa fungsi surat lamaran?',
            expected: 'mencari pekerjaan',
            user: 'melamar pekerjaan',
            subject: 'bahasa'
        }
    ];

    const handleTest = async () => {
        setIsGrading(true);
        setResult(null);
        setRawResponse(null);

        try {
            const response = await gradeEssayAnswer(question, expectedAnswer, userAnswer, subject);
            setResult(response);
            setRawResponse(JSON.stringify(response, null, 2));
        } catch (error) {
            setResult({ error: error.message });
            setRawResponse(error.message);
        } finally {
            setIsGrading(false);
        }
    };

    const loadTestCase = (testCase) => {
        setQuestion(testCase.question);
        setExpectedAnswer(testCase.expected);
        setUserAnswer(testCase.user);
        setSubject(testCase.subject);
        setResult(null);
        setRawResponse(null);
    };

    const runAllTests = async () => {
        const results = [];
        for (const testCase of testCases) {
            setQuestion(testCase.question);
            setExpectedAnswer(testCase.expected);
            setUserAnswer(testCase.user);
            setSubject(testCase.subject);

            const response = await gradeEssayAnswer(
                testCase.question,
                testCase.expected,
                testCase.user,
                testCase.subject
            );

            results.push({
                name: testCase.name,
                ...response
            });

            // Increase delay to 3 seconds to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        console.table(results);
        alert('All tests complete! Check console for results.');
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-text-main mb-6">🧪 AI Grading Test Page</h1>

                {/* Test Cases */}
                <Card className="mb-6">
                    <h2 className="text-xl font-bold text-text-main mb-4">Quick Test Cases</h2>
                    <div className="space-y-2">
                        {testCases.map((testCase, index) => (
                            <button
                                key={index}
                                onClick={() => loadTestCase(testCase)}
                                className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <div className="font-bold text-sm text-primary">{testCase.name}</div>
                                <div className="text-xs text-gray-600">
                                    Expected: "{testCase.expected}" | User: "{testCase.user}"
                                </div>
                            </button>
                        ))}
                    </div>
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={runAllTests}
                        className="mt-4"
                    >
                        🚀 Run All Tests (Check Console)
                    </Button>
                </Card>

                {/* Input Form */}
                <Card className="mb-6">
                    <h2 className="text-xl font-bold text-text-main mb-4">Manual Test</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-2">Subject</label>
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="matematika">Matematika</option>
                                <option value="bahasa">Bahasa Indonesia</option>
                                <option value="english">Bahasa Inggris</option>
                                <option value="biologi">Biologi</option>
                                <option value="fisika">Fisika</option>
                                <option value="kimia">Kimia</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-main mb-2">Question</label>
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                rows="2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-main mb-2">Expected Answer (Reference)</label>
                            <textarea
                                value={expectedAnswer}
                                onChange={(e) => setExpectedAnswer(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                rows="2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-main mb-2">User Answer (To Test)</label>
                            <textarea
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                rows="3"
                            />
                        </div>

                        <Button
                            variant="primary"
                            fullWidth
                            onClick={handleTest}
                            disabled={isGrading}
                        >
                            {isGrading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined animate-spin">autorenew</span>
                                    Testing...
                                </span>
                            ) : (
                                '🧪 Test AI Grading'
                            )}
                        </Button>
                    </div>
                </Card>

                {/* Results */}
                {result && (
                    <Card className={`${result.isCorrect ? 'border-2 border-green-500' : result.isPartial ? 'border-2 border-amber-500' : 'border-2 border-red-500'}`}>
                        <h2 className="text-xl font-bold text-text-main mb-4">Test Results</h2>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${result.isCorrect ? 'bg-green-500' : result.isPartial ? 'bg-amber-500' : 'bg-red-500'} text-white`}>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {result.isCorrect ? 'check' : result.isPartial ? 'info' : 'close'}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-bold text-lg">
                                        {result.isCorrect ? '✅ CORRECT' : result.isPartial ? '⚠️ PARTIAL' : '❌ WRONG'}
                                    </div>
                                    <div className="text-sm text-gray-600">Score: {result.score}</div>
                                </div>
                            </div>

                            <div className="bg-gray-100 p-4 rounded-lg">
                                <div className="text-sm font-bold text-gray-700 mb-1">AI Feedback:</div>
                                <div className="text-base">{result.feedback}</div>
                            </div>

                            <details className="mt-4">
                                <summary className="cursor-pointer text-sm font-bold text-gray-700">Raw JSON Response</summary>
                                <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-xs">
                                    {rawResponse}
                                </pre>
                            </details>
                        </div>
                    </Card>
                )}

                {/* Info */}
                <Card className="bg-blue-50 border border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-2">ℹ️ How to Use:</h3>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>Click a test case to load it quickly</li>
                        <li>Or manually fill in the form to test custom inputs</li>
                        <li>Click "Test AI Grading" to see how Gemini grades the answer</li>
                        <li>Use "Run All Tests" to batch test all cases (check console)</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
}

export default AITestPage;
