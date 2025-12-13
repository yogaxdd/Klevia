import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './firebase/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

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

function App() {
    return (
        <AuthProvider>
            <AppProvider>
                <Router>
                    {/* Container untuk limit width di desktop */}
                    <div className="min-h-screen bg-background font-display flex justify-center">
                        <div className="w-full max-w-md relative">
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
                            </Routes>
                        </div>
                    </div>
                </Router>
            </AppProvider>
        </AuthProvider>
    )
}

export default App
