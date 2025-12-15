// Gemini AI Service for Essay Grading with Key Rotation
import { GoogleGenerativeAI } from '@google/generative-ai';

// Multiple API Keys for load balancing and rate limit handling
// Keys are loaded from .env file for security
const API_KEYS = [
    import.meta.env.VITE_GEMINI_API_KEY_1,
    import.meta.env.VITE_GEMINI_API_KEY_2,
    import.meta.env.VITE_GEMINI_API_KEY_3,
    import.meta.env.VITE_GEMINI_API_KEY_4,
].filter(Boolean); // Remove any undefined keys

let currentKeyIndex = 0;
let genAI = new GoogleGenerativeAI(API_KEYS[currentKeyIndex]);

// Rotate to next API key
function rotateApiKey() {
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    genAI = new GoogleGenerativeAI(API_KEYS[currentKeyIndex]);
    console.log(`🔄 Rotated to API key #${currentKeyIndex + 1}`);
    return currentKeyIndex;
}

/**
 * Grade an essay answer using Gemini AI with automatic key rotation
 */
export async function gradeEssayAnswer(question, expectedAnswer, userAnswer, subject = '', retryCount = 0) {
    // Max retries = number of API keys
    const maxRetries = API_KEYS.length;

    // Handle empty answers
    if (!userAnswer || userAnswer.trim().length < 3) {
        return {
            isCorrect: false,
            isPartial: false,
            score: 0,
            feedback: 'Jawaban terlalu pendek. Silakan berikan jawaban yang lebih lengkap.'
        };
    }

    const prompt = `Kamu adalah guru ${subject || 'mata pelajaran'} yang menilai jawaban siswa.

SOAL: ${question}
KUNCI JAWABAN: ${expectedAnswer}
JAWABAN SISWA: ${userAnswer}

INSTRUKSI PENILAIAN:
1. Bandingkan JAWABAN SISWA dengan KUNCI JAWABAN
2. ABAIKAN perbedaan huruf besar/kecil (case insensitive)
3. Contoh: "cerita pendek" = "Cerita Pendek" = "CERITA PENDEK" → SEMUA INI BENAR, score 1

BERIKAN SCORE:
- score: 1 → Jawaban BENAR (makna sama, abaikan kapitalisasi)
- score: 0.5 → Jawaban SETENGAH BENAR (kurang lengkap)
- score: 0 → Jawaban SALAH TOTAL

PENTING: "${userAnswer}" dibandingkan dengan "${expectedAnswer}"
Jika keduanya SAMA MAKNANYA (abaikan huruf besar/kecil), maka score HARUS 1.

OUTPUT FORMAT (JSON only, tanpa markdown):
{"score": 1, "feedback": "Benar!"}`;

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 256,
            }
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        console.log(`✅ API Key #${currentKeyIndex + 1} - Response:`, textResponse.substring(0, 100));

        // Parse JSON response
        try {
            let cleanedResponse = textResponse
                .replace(/```json\s*/gi, '')
                .replace(/```\s*/g, '')
                .replace(/^[^{]*/, '')
                .replace(/[^}]*$/, '')
                .trim();

            if (!cleanedResponse.startsWith('{')) {
                const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    cleanedResponse = jsonMatch[0];
                }
            }

            const parsed = JSON.parse(cleanedResponse);
            const score = parseFloat(parsed.score) || 0;

            return {
                isCorrect: score >= 1,
                isPartial: score === 0.5,
                score: score,
                feedback: parsed.feedback || 'Tidak ada feedback tersedia.'
            };
        } catch (parseError) {
            console.error('❌ Failed to parse response:', textResponse);

            const hasScore1 = textResponse.includes('"score": 1') || textResponse.includes('"score":1');
            const hasScore05 = textResponse.includes('"score": 0.5') || textResponse.includes('"score":0.5');

            const score = hasScore1 ? 1 : (hasScore05 ? 0.5 : 0);
            return {
                isCorrect: score >= 1,
                isPartial: score === 0.5,
                score: score,
                feedback: score >= 0.5 ? 'Jawaban kamu sudah cukup tepat!' : 'Jawaban kurang tepat.'
            };
        }

    } catch (error) {
        console.error(`❌ API Key #${currentKeyIndex + 1} Error:`, error.message);

        // Check if rate limited (429 error)
        const isRateLimited = error.message?.includes('429') ||
            error.message?.includes('quota') ||
            error.message?.includes('RESOURCE_EXHAUSTED');

        if (isRateLimited && retryCount < maxRetries - 1) {
            console.log(`⚠️ Rate limited on key #${currentKeyIndex + 1}, rotating...`);
            rotateApiKey();

            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 500));

            // Retry with new key
            return gradeEssayAnswer(question, expectedAnswer, userAnswer, subject, retryCount + 1);
        }

        // All keys exhausted or other error
        let errorMsg = 'Terjadi kesalahan saat memeriksa jawaban. Silakan coba lagi.';

        if (isRateLimited) {
            errorMsg = 'Semua API key mencapai batas. Tunggu 1 menit lalu coba lagi.';
        }

        return {
            isCorrect: false,
            isPartial: false,
            score: 0,
            feedback: errorMsg
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

/**
 * Get current API key index (for debugging)
 */
export function getCurrentKeyIndex() {
    return currentKeyIndex + 1;
}

/**
 * Get total number of API keys
 */
export function getTotalKeys() {
    return API_KEYS.length;
}
