// Questions for TKA (Tes Kemampuan Akademik) - Grade 12 Only
// Source: Pusmendik scraped questions
// Premium feature

import questionsTKABindo from './questionsTKABindo';
import questionsTKAMtk from './questionsTKAMtk';

const questionsTKA = {
    // ============================================
    // TKA MATEMATIKA - 18 soal dari Pusmendik
    // Uses imported data with readingPassage, questionType (multiple_choice, multiple_answer, true_false)
    // ============================================
    120001: questionsTKAMtk,

    // ============================================
    // TKA BAHASA INDONESIA - 10 soal dari Pusmendik
    // Uses imported data with readingPassage, questionType (multiple_choice, multiple_answer, true_false)
    // ============================================
    120002: questionsTKABindo,

    // ============================================
    // TKA BAHASA INGGRIS - 17 soal dari Pusmendik
    // ============================================
    120003: [
        // Soal 1: Story Outline
        {
            question: "Which of the following outlines shows the correct main points of the story about King Hung Vuong VI?",
            options: [
                "King Hung Vuong VI wanted the best husband for his daughter. Many princes came but none was suitable. Son Tinh and Thuy Tinh both wanted to marry her. The King gave them a test. Thuy Tinh arrived first with the wedding gifts. The princess was given to Thuy Tinh.",
                "King Hung Vuong VI had a beautiful daughter. He announced he was looking for the right husband. Son Tinh and Thuy Tinh appeared and asked to marry her. The King gave them a test with wedding gifts. Son Tinh arrived first and married the princess. Thuy Tinh attacked with floods but was defeated.",
                "King Hung Vuong VI asked his daughter to choose her husband. The princess liked both Son Tinh and Thuy Tinh. The King delayed his decision for many days. Finally, he asked them to fight each other. Thuy Tinh lost the battle and left the land.",
                "King Hung Vuong VI searched for a husband for his daughter. Son Tinh and Thuy Tinh wanted to marry her. The King gave them a challenge. Thuy Tinh lost the test and became angry. He called the waters to rise and destroy the land. Son Tinh drowned in the floods.",
                "The King wanted a nobleman for his daughter. He invited many princes to the palace. Son Tinh and Thuy Tinh competed for the princess. Son Tinh refused the challenge of gifts. The King chose Thuy Tinh as the winner."
            ],
            correctAnswer: 1,
            questionImages: [],
            explanation: "The correct outline describes Son Tinh arriving first and Thuy Tinh attacking with floods after losing."
        },
        // Soal 2: Why Thuy Tinh Attack
        {
            question: "Why did Thuy Tinh attack Son Tinh after the wedding?",
            options: [
                "He was jealous of Son Tinh's victory",
                "He believed the King had lied to him.",
                "He thought the princess loved him more.",
                "He wanted to show off his power to the king.",
                "He had promised to fight until death."
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "Thuy Tinh was jealous because he lost the competition for the princess."
        },
        // Soal 4: Keep Promise Meaning
        {
            question: "What does the phrase \"kept his promise\" in the text mean?",
            options: [
                "Forgot about his decision.",
                "Changed his mind about the wedding.",
                "Did what he had promised to do.",
                "Delayed the marriage for many days.",
                "The King asked the princes to bring more gifts."
            ],
            correctAnswer: 2,
            questionImages: [],
            explanation: "\"Kept his promise\" means did what he had promised to do."
        },
        // Soal 5: Main Lesson
        {
            question: "What is the main lesson of the story?",
            options: [
                "Accept defeat gracefully to prevent harm to others.",
                "Be fair and follow the agreed rules in competitions.",
                "Choose peaceful solutions rather than angry reactions.",
                "Prepare honestly and present your gifts properly.",
                "Respect leaders' decisions and community agreements."
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "The main lesson is about accepting defeat gracefully."
        },
        // Soal 7: Perfect Study Table
        {
            question: "How can we decide a certain table is perfect for studying according to the text?",
            options: [
                "It has good lighting",
                "It provides white noise",
                "It is located near the entrance",
                "It is far from the toilet",
                "It provides stationery"
            ],
            correctAnswer: 0,
            questionImages: ["/downloaded_images/91591_553dcd423e6da03fc4942ea98fcb90d4.png"],
            explanation: "Good lighting is essential for a perfect study table."
        },
        // Soal 8: Infographic Target Audience
        {
            question: "Who needs to read this infographic?",
            options: [
                "The students of that school",
                "People who happen to visit the school",
                "The librarian of another school",
                "The headmaster of that school",
                "Parents who come to pick up their kids"
            ],
            correctAnswer: 0,
            questionImages: ["/downloaded_images/92769_553dcd423e6da03fc4942ea98fcb90d4.png"],
            explanation: "The infographic is for students of that school."
        },
        // Soal 9: Disrespect Actions
        {
            question: "Which actions show disrespect for other students?",
            options: [
                "Speaking loudly to friends.",
                "Keeping the phone silent.",
                "Eating snacks at the desk.",
                "Playing music in the corner.",
                "Moving chairs noisily."
            ],
            correctAnswer: 0,
            questionImages: ["/downloaded_images/92769_553dcd423e6da03fc4942ea98fcb90d4.png"],
            explanation: "Speaking loudly disrespects other students trying to study."
        },
        // Soal 10: Library Visit Preparation
        {
            question: "You find this infographic in front of your school library. What will you do before your next visit to the library?",
            options: [
                "Making sure that I bring my water bottle and lunch with me.",
                "Bringing the books and stationery that I will use.",
                "Organizing the book that I borrowed from the library.",
                "Walking for five minutes so I can focus more when studying.",
                "Making sure you look fresh because you will meet other students."
            ],
            correctAnswer: 1,
            questionImages: ["/downloaded_images/92769_553dcd423e6da03fc4942ea98fcb90d4.png"],
            explanation: "You should bring books and stationery that you will use."
        },
        // Soal 12: Text Main Topic
        {
            question: "The text mainly talks about Bali's …",
            options: [
                "wildlife species and nature lovers",
                "unique cultural treasures and sites.",
                "stunning nature and remarkable sites.",
                "generations and cultural conservation.",
                "scenic beauty and local farming practices."
            ],
            correctAnswer: 2,
            questionImages: [],
            explanation: "The text mainly discusses Bali's stunning nature and remarkable sites."
        },
        // Soal 13: Natural Beauty Evidence
        {
            question: "Which parts of the text best support the description of Bali as \"full of natural beauty\"?",
            options: [
                "A peaceful area filled with green forests, calm mangrove swamps, and colorful coral reefs along the sea.",
                "These terraces are shaped by generations of farmers who work the land by hand.",
                "Water flows gently over rocky cliffs into a cool, clear pool. Mist rises into the air, mixing with the calming sound of falling water.",
                "In the morning, mist rises above the fields, and sunlight reflects off the water in the paddies.",
                "Farmers in wide-brimmed hats plant rice carefully, their feet sinking into the soft earth."
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "The description of forests, mangroves, and coral reefs best supports natural beauty."
        },
        // Soal 14: Internship Morning Activities
        {
            question: "During the internship, what did the writer do every morning?",
            options: [
                "Made schedules and explained them to the coaches.",
                "Played football with the team and got the first aid kit.",
                "Prepared a club gift, guided the coaches, and gave t-shirts.",
                "Woke up early, arrived on time, and followed the instructions.",
                "Set up cones, brought water, and checked emergency schedules."
            ],
            correctAnswer: 4,
            questionImages: [],
            explanation: "The writer set up cones, brought water, and checked emergency schedules every morning."
        },
        // Soal 15: Writer's Personality
        {
            question: "What are the best words to describe the writer's personality during the internship?",
            options: [
                "Careful and ready to help",
                "Confident and enjoys working alone",
                "Responsible and willing to learn",
                "Friendly and works well with others",
                "Creative and likes to try new things"
            ],
            correctAnswer: 2,
            questionImages: [],
            explanation: "The writer was responsible and willing to learn during the internship."
        },
        // Soal 16: After Internship
        {
            question: "What will the writer most likely do after finishing the internship?",
            options: [
                "Considering a career in a sports medicine",
                "Stop working and focus only on school",
                "Look for another chance to work in a sports club",
                "Study medicine to become a doctor",
                "Train as a professional football player"
            ],
            correctAnswer: 2,
            questionImages: [],
            explanation: "The writer will likely look for another chance to work in a sports club."
        },
        // Soal 17: Poor Sleep Effects
        {
            question: "What will happen if teenagers have poor sleep quality?",
            options: [
                "Teenagers' grades could drop.",
                "Teens struggle to focus in class.",
                "Teens are likely to feel stressed.",
                "Teenagers will be more confident",
                "Teens will become mentally strong."
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "Poor sleep quality can cause grades to drop."
        },
        // Soal 18: Persuasive Facts
        {
            question: "Which of the following additional facts would most likely make the text more persuasive?",
            options: [
                "Research data showing the number of teenagers experiencing anxiety or depression because of social media.",
                "Personal stories from teenagers who feel happier after reducing their social media use.",
                "Statistics about how many teenagers use social media every day.",
                "A list of the most popular social media platforms among teenagers.",
                "Expert opinions from doctors or psychologists about the dangers of social media for mental health."
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "Research data about anxiety/depression would make the text more persuasive."
        },
        // Soal 19: Social Media Harm Evidence
        {
            question: "Which statements from the text support the author's argument that social media harms teen mental health?",
            options: [
                "\"When teens see pictures of people who seem perfect, they feel that they are not good enough.\"",
                "\"Many teenagers use their phones late at night, which reduces sleep time and quality.\"",
                "\"Schools should teach students how to use social media in healthy ways.\"",
                "\"Social media helps teens stay connected with friends and learn about interesting topics.\"",
                "\"Victims of cyberbullying often feel alone, scared, and helpless.\""
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "The statement about feeling \"not good enough\" supports the harm argument."
        },
        // Soal 20: Main Impression
        {
            question: "What is the most prominent impression you gain from the text about social media?",
            options: [
                "Social media makes teenagers unhappy because they compare their lives to unrealistic images online.",
                "Teenagers should completely stop using social media to protect their mental health.",
                "Using social media too much can disturb teenagers' sleep and make it harder for them to focus at school.",
                "Cyberbullying is a serious problem on social media and can make teenagers feel lonely and scared.",
                "The text explains that social media has only negative effects without any positive sides."
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "The main impression is that social media causes unhappiness through unrealistic comparisons."
        }
    ]
};

export default questionsTKA;
