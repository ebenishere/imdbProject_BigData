import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Sparkles, Database, Star } from 'lucide-react';
import axios from 'axios';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch movies and analytics from FastAPI backend on load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (query = '') => {
    try {
      setLoading(true);
      const movieUrl = query 
        ? `http://127.0.0.1:8000/api/movies?search=${query}` 
        : 'http://127.0.0.1:8000/api/movies';
      
      const [movieRes, analyticsRes] = await Promise.all([
        axios.get(movieUrl),
        axios.get('http://127.0.0.1:8000/api/analytics/summary')
      ]);

      setMovies(movieRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Error connecting to FastAPI backend:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData(searchQuery);
  };

  return (
    <div className="min-h-screen bg-darker font-sans selection:bg-primary selection:text-black text-white">
      
      {/* Glassmorphic Navbar */}
      <nav className="fixed w-full z-50 bg-dark/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold tracking-tighter flex items-center gap-2"
          >
            <Sparkles className="text-primary" />
            <span>BigData<span className="text-primary">Flix</span></span>
          </motion.div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Explore</a>
            <a href="#" className="hover:text-white transition-colors">Analytics</a>
            <a href="#" className="hover:text-white transition-colors">AI Predictor</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-primary mb-6 inline-block">
            Powered by FastAPI & Pandas Engine
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            Discover the Data <br/> Behind the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Cinema.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Analyze global records, run queries through your Python backend, and explore real-time movie insights.
          </p>

          {/* Search Bar connected to FastAPI */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-500 group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search movies or genres (e.g., Sci-Fi, Dune)..." 
              className="w-full pl-12 pr-28 py-5 rounded-2xl bg-glass border border-white/10 focus:outline-none focus:border-primary/50 focus:bg-white/10 text-lg backdrop-blur-sm transition-all shadow-2xl text-white placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute inset-y-2 right-2 px-6 bg-primary hover:bg-yellow-400 text-black font-bold rounded-xl transition-transform active:scale-95">
              Search
            </button>
          </form>
        </motion.div>
      </div>

      {/* Real-time Backend Analytics Summary Cards */}
      {analytics && (
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-glass border border-white/5 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary"><Database size={24} /></div>
              <div>
                <p className="text-sm text-gray-400">Total Analyzed</p>
                <p className="text-2xl font-bold">{analytics.total_movies_analyzed} Records</p>
              </div>
            </div>
            <div className="bg-glass border border-white/5 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary"><Star size={24} /></div>
              <div>
                <p className="text-sm text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold">{analytics.average_rating} / 10</p>
              </div>
            </div>
            <div className="bg-glass border border-white/5 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary"><TrendingUp size={24} /></div>
              <div>
                <p className="text-sm text-gray-400">Top Performing Genre</p>
                <p className="text-2xl font-bold">{analytics.top_genre}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary" />
            <h2 className="text-2xl font-bold">Database Results</h2>
          </div>
          <span className="text-sm text-gray-400">{movies.length} titles found</span>
        </div>
        
        {loading ? (
          <div className="text-center py-20 text-gray-500">Querying backend database...</div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No movies found matching your search.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group rounded-2xl overflow-hidden cursor-pointer bg-glass border border-white/5 p-5 flex flex-col justify-between hover:border-primary/50 transition-all"
              >
                <div>
                  <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-1 rounded-md">
                    {movie.genre} ({movie.year})
                  </span>
                  <h3 className="text-xl font-bold mt-4 mb-2">{movie.title}</h3>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                  <span className="text-sm text-gray-400">IMDb Score</span>
                  <span className="text-primary font-bold flex items-center gap-1">
                    <Star size={16} fill="currentColor" /> {movie.rating}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}