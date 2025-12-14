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
 * @returns {Promise<{isCorrect: boolean, isPartial: boolean, score: number, feedback: string}>}
 */
export async function gradeEssayAnswer(question, expectedAnswer, userAnswer, subject = '') {
    if (!GEMINI_API_KEY) {
        console.error('Gemini API key not found');
        return {
            isCorrect: false,
            isPartial: false,
            score: 0,
            feedback: 'API key tidak dikonfigurasi. Hubungi administrator.'
        };
    }

    // Handle empty answers
    if (!userAnswer || userAnswer.trim().length < 3) {
        return {
            isCorrect: false,
            isPartial: false,
            score: 0,
            feedback: 'Jawaban terlalu pendek. Silakan berikan jawaban yang lebih lengkap.'
        };
    }

    const systemPrompt = `Kamu adalah guru ${subject || 'mata pelajaran'} di Indonesia yang sedang menilai jawaban siswa. Berikan penilaian yang TOLERAN.`;

    const userPrompt = `PERTANYAAN:
${question}

JAWABAN YANG BENAR:
${expectedAnswer}

JAWABAN SISWA:
${userAnswer}

ATURAN PENILAIAN (IKUTI DENGAN KETAT):

score: 1.0 (BENAR) jika:
- Jawaban siswa sama persis dengan jawaban benar
- Jawaban siswa sama tapi huruf besar/kecil berbeda (case insensitive) → contoh: "melamar pekerjaan" = "Melamar pekerjaan" = BENAR
- Jawaban siswa menambahkan kata tidak penting di awal/akhir (untuk, adalah, yaitu, agar, supaya, dll) → contoh: "untuk melamar pekerjaan" vs "Melamar pekerjaan" = BENAR
- INTI MAKNA jawaban sama meski susunan kata sedikit berbeda

score: 0.5 (SETENGAH) jika:
- Jawaban siswa BENAR tapi KURANG LENGKAP (ada bagian yang belum disebutkan)
- Contoh: Jawaban benar "Pernyataan Umum, Deskripsi Bagian, Kesimpulan" tapi siswa menjawab "Pernyataan Umum, Deskripsi Bagian" (kurang Kesimpulan) = 0.5
- Jawaban menyebutkan sebagian besar poin tapi tidak semua

score: 0 (SALAH) jika:
- Jawaban sama sekali salah
- Jawaban tidak relevan dengan pertanyaan
- Jawaban asal-asalan

RESPONSE (JSON only):
{"score": 0/0.5/1, "feedback": "Penjelasan singkat"}`;


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
            const score = parseFloat(parsed.score) || 0;

            return {
                isCorrect: score >= 1,
                isPartial: score === 0.5,
                score: score,
                feedback: parsed.feedback || 'Tidak ada feedback tersedia.'
            };
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', textResponse);
            // Fallback: try to extract score from text
            const hasScore1 = textResponse.includes('"score": 1') || textResponse.includes('"score":1');
            const hasScore05 = textResponse.includes('"score": 0.5') || textResponse.includes('"score":0.5');

            const score = hasScore1 ? 1 : (hasScore05 ? 0.5 : 0);
            return {
                isCorrect: score >= 1,
                isPartial: score === 0.5,
                score: score,
                feedback: score >= 0.5 ?
                    'Jawaban kamu sudah cukup tepat!' :
                    'Jawaban kurang tepat. Silakan pelajari materi kembali.'
            };
        }

    } catch (error) {
        console.error('Gemini API error:', error);
        return {
            isCorrect: false,
            isPartial: false,
            score: 0,
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
