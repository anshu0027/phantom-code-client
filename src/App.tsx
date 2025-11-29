import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Toast from "./components/toast/Toast"
import EditorPage from "./pages/EditorPage"
import HomePage from "./pages/HomePage"
import ErrorBoundary from "./components/common/ErrorBoundary"

const App = () => {
    return (
        <>
            <ErrorBoundary>
                <Router>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/editor/:roomId" element={<EditorPage />} />
                    </Routes>
                </Router>
            </ErrorBoundary>
            <Toast /> {/* Toast component from react-hot-toast */}
        </>
    )
}

export default App
