import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import WallpaperDisplay from './components/WallpaperDisplay';

function App() {
  return (
    <main>
      <WallpaperDisplay />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </main>
  );
}

export default App;
