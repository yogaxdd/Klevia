import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider, useAuth } from './firebase/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'

// Pages
import WelcomePage from './pages/WelcomePage'
import ProfileSetupPage from './pages/ProfileSetupPage'
import ClassSelectionPage from './pages/ClassSelectionPage'
import SubjectSelectionPage from './pages/SubjectSelectionPage'
import HomePage from './pages/HomePage'
import LevelMapPage from './pages/LevelMapPage'
import LessonPage from './pages/LessonPage'
import WinPage from './pages/WinPage'
import LevelUpPage from './pages/LevelUpPage'
import GameOverPage from './pages/GameOverPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import PremiumPage from './pages/PremiumPage'
import AchievementsPage from './pages/AchievementsPage'
import LeaderboardPage from './pages/LeaderboardPage'
import DailyQuizPage from './pages/DailyQuizPage'
import PracticeModePage from './pages/PracticeModePage'
import PracticeCompletePage from './pages/PracticeCompletePage'
import ReviewWrongAnswersPage from './pages/ReviewWrongAnswersPage'
import AITestPage from './pages/AITestPage'
import StatisticsPage from './pages/StatisticsPage'
import SRSReviewPage from './pages/SRSReviewPage'
import BattleLobbyPage from './pages/BattleLobbyPage'
import BattleWaitingPage from './pages/BattleWaitingPage'
import BattleGamePage from './pages/BattleGamePage'
import BattleResultPage from './pages/BattleResultPage'
import TrueFalseTestPage from './pages/TrueFalseTestPage'

// Inner component to access auth context
function AppContent() {
    const { currentUser } = useAuth();

    return (
        <>
            {/* Desktop Sidebar - only visible on lg+ and when logged in */}
            <Sidebar />

            {/* Main Container */}
            <div className={`min-h-screen bg-background font-display ${currentUser ? 'lg:ml-64' : ''}`}>
                {/* Content wrapper - centered on both mobile and desktop */}
                <div className="w-full max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto px-0 lg:px-6">
                    <Routes>
                        {/* Public route */}
                        <Route path="/" element={<WelcomePage />} />

                        {/* Protected routes - require login */}
                        <Route path="/profile-setup" element={
                            <ProtectedRoute><ProfileSetupPage /></ProtectedRoute>
                        } />
                        <Route path="/select-class" element={
                            <ProtectedRoute><ClassSelectionPage /></ProtectedRoute>
                        } />
                        <Route path="/select-subject" element={
                            <ProtectedRoute><SubjectSelectionPage /></ProtectedRoute>
                        } />
                        <Route path="/home" element={
                            <ProtectedRoute><HomePage /></ProtectedRoute>
                        } />
                        <Route path="/levels" element={
                            <ProtectedRoute><LevelMapPage /></ProtectedRoute>
                        } />
                        <Route path="/lesson/:lessonId" element={
                            <ProtectedRoute><LessonPage /></ProtectedRoute>
                        } />
                        <Route path="/win" element={
                            <ProtectedRoute><WinPage /></ProtectedRoute>
                        } />
                        <Route path="/level-up" element={
                            <ProtectedRoute><LevelUpPage /></ProtectedRoute>
                        } />
                        <Route path="/game-over" element={
                            <ProtectedRoute><GameOverPage /></ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute><ProfilePage /></ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                            <ProtectedRoute><SettingsPage /></ProtectedRoute>
                        } />
                        <Route path="/premium" element={
                            <ProtectedRoute><PremiumPage /></ProtectedRoute>
                        } />
                        <Route path="/achievements" element={
                            <ProtectedRoute><AchievementsPage /></ProtectedRoute>
                        } />
                        <Route path="/leaderboard" element={
                            <ProtectedRoute><LeaderboardPage /></ProtectedRoute>
                        } />
                        <Route path="/daily-quiz" element={
                            <ProtectedRoute><DailyQuizPage /></ProtectedRoute>
                        } />
                        <Route path="/practice/:lessonId" element={
                            <ProtectedRoute><PracticeModePage /></ProtectedRoute>
                        } />
                        <Route path="/practice-complete" element={
                            <ProtectedRoute><PracticeCompletePage /></ProtectedRoute>
                        } />
                        <Route path="/review-wrong" element={
                            <ProtectedRoute><ReviewWrongAnswersPage /></ProtectedRoute>
                        } />
                        <Route path="/ai-test" element={
                            <ProtectedRoute><AITestPage /></ProtectedRoute>
                        } />
                        <Route path="/statistics" element={
                            <ProtectedRoute><StatisticsPage /></ProtectedRoute>
                        } />
                        <Route path="/srs" element={
                            <ProtectedRoute><SRSReviewPage /></ProtectedRoute>
                        } />
                        <Route path="/battle" element={
                            <ProtectedRoute><BattleLobbyPage /></ProtectedRoute>
                        } />
                        <Route path="/battle/waiting/:roomCode" element={
                            <ProtectedRoute><BattleWaitingPage /></ProtectedRoute>
                        } />
                        <Route path="/battle/game/:roomCode" element={
                            <ProtectedRoute><BattleGamePage /></ProtectedRoute>
                        } />
                        <Route path="/battle/result/:roomCode" element={
                            <ProtectedRoute><BattleResultPage /></ProtectedRoute>
                        } />
                        {/* Test page for True/False UI prototype */}
                        <Route path="/test-tf" element={<TrueFalseTestPage />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <AppProvider>
                    <Router>
                        <AppContent />
                    </Router>
                </AppProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App

