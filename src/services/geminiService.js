// Gemini AI Service for Essay Grading
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Grade an essay answer using Gemini AI
 * @param {string} question - The question asked
 * @param {string} expectedAnswer - The expected/correct answer context
 * @param {string} userAnswer - The user's submitted answer
 * @param {string} subject - The subject (e.g., "matematika", "sejarah")
 * @returns {Promise<{isCorrect: boolean, feedback: string}>}
 */
export async function gradeEssayAnswer(question, expectedAnswer, userAnswer, subject = '') {
    if (!GEMINI_API_KEY) {
        console.error('Gemini API key not found');
        return {
            isCorrect: false,
            feedback: 'API key tidak dikonfigurasi. Hubungi administrator.'
        };
    }

    // Handle empty answers
    if (!userAnswer || userAnswer.trim().length < 5) {
        return {
            isCorrect: false,
            feedback: 'Jawaban terlalu pendek. Silakan berikan jawaban yang lebih lengkap.'
        };
    }

    const systemPrompt = `Kamu adalah guru ${subject || 'mata pelajaran'} di Indonesia yang sedang menilai jawaban siswa SMA. Berikan penilaian yang adil dan feedback yang membangun.`;

    const userPrompt = `PERTANYAAN:
${question}

KONTEKS JAWABAN YANG BENAR:
${expectedAnswer}

JAWABAN SISWA:
${userAnswer}

TUGAS:
Nilai apakah jawaban siswa RELEVAN dan BENAR berdasarkan konteks jawaban yang benar.
- Tidak perlu persis sama, yang penting inti jawabannya relevan dan menunjukkan pemahaman.
- Berikan feedback yang membangun dalam bahasa Indonesia.
- Jika salah, jelaskan secara singkat apa yang seharusnya benar.

RESPONSE FORMAT (JSON only, no markdown):
{"isCorrect": true/false, "feedback": "Penjelasan singkat dalam bahasa Indonesia (maksimal 2 kalimat)"}`;

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': GEMINI_API_KEY,
            },
            body: JSON.stringify({
                contents: [
                    { parts: [{ text: systemPrompt }], role: 'user' },
                    { parts: [{ text: 'Understood' }], role: 'model' },
                    { parts: [{ text: userPrompt }], role: 'user' }
                ],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 256,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse JSON response from Gemini
        try {
            // Clean the response (remove markdown code blocks if any)
            const cleanedResponse = textResponse
                .replace(/```json\s*/g, '')
                .replace(/```\s*/g, '')
                .trim();

            const parsed = JSON.parse(cleanedResponse);
            return {
                isCorrect: parsed.isCorrect === true,
                feedback: parsed.feedback || 'Tidak ada feedback tersedia.'
            };
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', textResponse);
            // Fallback: try to extract meaning from text
            const isCorrect = textResponse.toLowerCase().includes('"iscorrect": true') ||
                textResponse.toLowerCase().includes('"iscorrect":true');
            return {
                isCorrect,
                feedback: isCorrect ?
                    'Jawaban kamu sudah tepat!' :
                    'Jawaban kurang tepat. Silakan pelajari materi kembali.'
            };
        }

    } catch (error) {
        console.error('Gemini API error:', error);
        return {
            isCorrect: false,
            feedback: 'Terjadi kesalahan saat memeriksa jawaban. Silakan coba lagi.'
        };
    }
}

/**
 * Get subject label in Indonesian
 */
export function getSubjectLabel(subject) {
    const labels = {
        matematika: 'Matematika',
        bahasa: 'Bahasa Indonesia',
        english: 'Bahasa Inggris',
        biologi: 'Biologi',
        kimia: 'Kimia',
        fisika: 'Fisika',
        ekonomi: 'Ekonomi',
        sosiologi: 'Sosiologi',
        geografi: 'Geografi',
        sejarah: 'Sejarah',
        pkn: 'Pendidikan Kewarganegaraan',
        informatika: 'Informatika',
        ipa: 'IPA',
    };
    return labels[subject] || 'Pelajaran';
}
