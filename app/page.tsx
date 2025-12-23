"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Heart, 
  Send, 
  MoreHorizontal, 
  Loader2, 
  Users, 
  List, 
  History, 
  Settings,
  Circle,
  Eye
} from 'lucide-react';

/**
 * --- DATA SCHEMAS ---
 */
const INITIAL_STORIES_DATA = [
  {
    userId: 'u1',
    username: 'puneeth.rajkumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    timestamp: '1h',
    bio: 'Actor | Producer | Philanthropist',
    isActive: true,
    stories: [
      { 
        id: 'pr1', 
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1080&q=80',
        caption: 'On the sets of the next big one! 🎬 #PowerStar',
        viewers: [
          { id: 'v1', username: 'shivanna_fans', avatar: 'https://i.pravatar.cc/150?u=1', time: '2m' },
          { id: 'v2', username: 'sandalwood_updates', avatar: 'https://i.pravatar.cc/150?u=2', time: '10m' }
        ]
      },
      { 
        id: 'pr2', 
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1080&q=80',
        caption: 'Grateful for all the love. 🙏❤️',
        viewers: [{ id: 'v4', username: 'appu_lives_on', avatar: 'https://i.pravatar.cc/150?u=4', time: '5m' }]
      },
    ],
  },
  {
    userId: 'u2',
    username: 'suriya.offl',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    timestamp: '3h',
    bio: 'Believe in yourself.',
    isActive: true,
    stories: [
      { 
        id: 's2', 
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1080&q=80',
        caption: 'A quick break between shots. 📸✨ #Suriya44',
        viewers: [{ id: 'v5', username: 'karthi_offl', avatar: 'https://i.pravatar.cc/150?u=5', time: '1h' }]
      },
    ],
  },
  {
    userId: 'u3',
    username: 'dhanushkraja',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&h=150&q=80',
    timestamp: '5h',
    bio: 'Wunderbar!',
    isActive: false,
    stories: [
      { 
        id: 'd1', 
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1080&q=80',
        caption: 'The director life. 🎬 #Raayan',
        viewers: [{ id: 'v7', username: 'wunderbar_films', avatar: 'https://i.pravatar.cc/150?u=7', time: '3h' }]
      },
    ],
  },
];

export default function App() {
  const [storiesData, setStoriesData] = useState<typeof INITIAL_STORIES_DATA>(INITIAL_STORIES_DATA);
  const [selectedUserIdx, setSelectedUserIdx] = useState<number | null>(null);
  const [currentStoryIdx, setCurrentStoryIdx] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [viewedStories, setViewedStories] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reaction, setReaction] = useState<string | null>(null); // String emoji for animation
  const [storyLikedStates, setStoryLikedStates] = useState<Record<string, boolean>>({}); // { storyId: boolean }
  const [showViewers, setShowViewers] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'management'>('feed'); // 'feed' | 'management'
  const timerRef = useRef<number | null>(null);

  // Initialize viewed stories from session storage
  useEffect(() => {
    const viewed = [];
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('viewed_')) {
          viewed.push(key.replace('viewed_', ''));
        }
      }
    } catch (e) {}
    setViewedStories(viewed);
  }, []);

  const simulateLoading = useCallback(() => {
    setIsLoading(true);
    const delay = Math.random() * 400 + 200;
    setTimeout(() => setIsLoading(false), delay);
  }, []);

  const handleNext = useCallback(() => {
    if (selectedUserIdx === null) return;
    const user = storiesData[selectedUserIdx];
    const storyId = user.stories[currentStoryIdx].id;

    // Mark current as viewed
    if (!viewedStories.includes(storyId)) {
      try { sessionStorage.setItem(`viewed_${storyId}`, 'true'); } catch (e) {}
      setViewedStories(prev => [...prev, storyId]);
    }

    // Reset reaction for next slide
    setReaction(null);

    if (currentStoryIdx < user.stories.length - 1) {
      setCurrentStoryIdx(prev => prev + 1);
      setProgress(0);
      simulateLoading();
    } else if (selectedUserIdx !== null && selectedUserIdx < storiesData.length - 1) {
      setSelectedUserIdx(selectedUserIdx + 1);
      setCurrentStoryIdx(0);
      setProgress(0);
      simulateLoading();
    } else {
      setSelectedUserIdx(null);
    }
  }, [selectedUserIdx, currentStoryIdx, viewedStories, storiesData, simulateLoading]);

  const handlePrev = useCallback(() => {
    if (selectedUserIdx === null) return;
    
    // Reset reaction
    setReaction(null);

    if (currentStoryIdx > 0) {
      setCurrentStoryIdx(prev => prev - 1);
      setProgress(0);
      simulateLoading();
    } else if (selectedUserIdx > 0) {
      const prevUserIdx = selectedUserIdx - 1;
      setSelectedUserIdx(prevUserIdx);
      setCurrentStoryIdx(storiesData[prevUserIdx].stories.length - 1);
      setProgress(0);
      simulateLoading();
    }
  }, [selectedUserIdx, currentStoryIdx, storiesData, simulateLoading]);

  // Handle Progress Timer
  useEffect(() => {
    if (selectedUserIdx === null || isPaused || showViewers || isLoading) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1; 
      });
    }, 40); // Approx 4 seconds per story (100 * 40ms)

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [selectedUserIdx, isPaused, handleNext, showViewers, isLoading]);

  const toggleLike = (storyId: string) => {
    const isLiked = storyLikedStates[storyId];
    setStoryLikedStates(prev => ({ ...prev, [storyId]: !isLiked }));
    if (!isLiked) {
      setReaction('❤️');
      setTimeout(() => setReaction(null), 1000);
    }
  };

  const currentUser = selectedUserIdx !== null ? storiesData[selectedUserIdx] : null;
  const activeStory = currentUser ? currentUser.stories[currentStoryIdx] : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100 pb-10 transition-colors duration-300">
      
      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b dark:border-zinc-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">I</div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">Instagram UI</h1>
          </div>
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'feed' ? 'bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              <History size={16} /> Feed
            </button>
            <button 
              onClick={() => setActiveTab('management')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'management' ? 'bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              <Settings size={16} /> Dashboard
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'feed' ? (
        <main className="max-w-2xl mx-auto animate-in fade-in duration-500 py-8 px-4">
          {/* STORIES TRAY */}
          <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl p-6 shadow-sm overflow-hidden mb-8">
             <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Recent Stories</h3>
             <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
                {storiesData.map((user, idx) => {
                  const isAllSeen = user.stories.every(s => viewedStories.includes(s.id));
                  const isActiveViewer = selectedUserIdx === idx;

                  return (
                    <button 
                      key={user.userId} 
                      onClick={() => { 
                        setSelectedUserIdx(idx); 
                        setCurrentStoryIdx(0); 
                        setProgress(0); 
                        simulateLoading();
                      }}
                      className="flex flex-col items-center flex-shrink-0 gap-2 group outline-none"
                    >
                      <div className={`p-[3px] rounded-full transition-all duration-300 transform group-hover:scale-105 group-active:scale-95 ${
                        isAllSeen 
                        ? 'bg-zinc-200 dark:bg-zinc-700' 
                        : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'
                      } ${isActiveViewer ? 'ring-4 ring-blue-500/20' : ''}`}>
                        <div className="p-[2px] bg-white dark:bg-zinc-950 rounded-full">
                          <img 
                            src={user.avatar} 
                            className={`w-16 h-16 rounded-full object-cover transition-all duration-300 ${isAllSeen ? 'opacity-70 grayscale-[0.5]' : 'opacity-100'}`} 
                            alt={user.username} 
                          />
                        </div>
                      </div>
                      <span className={`text-[11px] w-20 truncate text-center ${
                        isAllSeen ? 'text-zinc-400 font-normal' : 'text-zinc-900 dark:text-zinc-200 font-bold'
                      }`}>
                        {user.username}
                      </span>
                    </button>
                  );
                })}
             </div>
          </div>

          {/* MOCK POSTS */}
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
                <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                <div className="p-4 space-y-2">
                   <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                   <div className="h-4 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <main className="max-w-4xl mx-auto py-10 px-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Account Status */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="text-blue-500" size={20} />
                  <h2 className="font-bold text-lg">Profiles</h2>
                </div>
                
                <div className="space-y-4">
                  {storiesData.map((user) => (
                    <div key={user.userId} className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={user.avatar} className="w-10 h-10 rounded-full object-cover border dark:border-zinc-700" alt="" />
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white dark:border-zinc-900 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-zinc-400'}`} />
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-none mb-1">{user.username}</p>
                          <p className={`text-[10px] font-medium uppercase tracking-tighter ${user.isActive ? 'text-green-500' : 'text-zinc-500'}`}>
                            {user.isActive ? 'Active Now' : 'Offline'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Story Management */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <List className="text-purple-500" size={20} />
                    <h2 className="font-bold text-lg">Content Insights</h2>
                  </div>
                </div>

                <div className="space-y-8">
                  {storiesData.map((user) => (
                    <div key={user.userId} className="border-l-2 border-zinc-100 dark:border-zinc-800 pl-4 space-y-4">
                       <div className="flex items-center gap-2">
                         <div>
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{user.username}</span>
                          <p className="text-xs text-zinc-400 mt-1 max-w-[18rem] truncate">{user.bio}</p>
                         </div>
                       </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {user.stories.map((story) => (
                          <div key={story.id} className="group relative flex gap-4 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border dark:border-zinc-800 hover:border-blue-500/50 transition-all">
                            <img src={story.mediaUrl} className="w-16 h-24 object-cover rounded-xl shadow-sm" alt="" />
                            <div className="flex flex-col justify-center flex-1">
                              <p className="text-xs font-semibold mb-2 line-clamp-1">{story.caption || 'No caption'}</p>
                              <div className="flex items-center gap-1.5 text-blue-500 text-[11px] font-bold bg-blue-50 dark:bg-blue-900/20 w-fit px-2 py-0.5 rounded-full mb-3">
                                <Eye size={12} />
                                {story.viewers.length} views
                              </div>
                              <div className="flex -space-x-2">
                                {story.viewers.slice(0, 5).map((v, i) => (
                                  <img key={i} src={v.avatar} className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-950 object-cover" title={v.username} alt="" />
                                ))}
                                {story.viewers.length > 5 && (
                                  <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-[8px] font-bold">
                                    +{story.viewers.length - 5}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* FULLSCREEN STORY OVERLAY */}
      {selectedUserIdx !== null && currentUser && activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in zoom-in-95 duration-300">
          
          <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-xl" onClick={() => setSelectedUserIdx(null)} />

          {/* Nav Buttons Desktop */}
          <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="hidden md:flex absolute left-8 z-[70] bg-white/10 hover:bg-white/20 p-5 rounded-full text-white transition-all backdrop-blur-md active:scale-90">
            <ChevronLeft size={32} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="hidden md:flex absolute right-8 z-[70] bg-white/10 hover:bg-white/20 p-5 rounded-full text-white transition-all backdrop-blur-md active:scale-90">
            <ChevronRight size={32} />
          </button>

          <div className="relative w-full max-w-[420px] h-full sm:h-[90vh] sm:max-h-[820px] bg-zinc-900 sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col z-[65] border dark:border-white/10">
            
            {/* Inner Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-[4px] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-white animate-spin opacity-50" />
              </div>
            )}

            {/* Reaction Animation */}
            {reaction && (
              <div className="absolute inset-0 z-[110] flex items-center justify-center pointer-events-none">
                <span className="text-9xl animate-ping drop-shadow-2xl">{reaction}</span>
              </div>
            )}

            {/* Segmented Progress Bars */}
            <div className="absolute top-4 left-0 right-0 flex px-4 gap-1.5 z-[60]">
              {currentUser.stories.map((_, i) => (
                <div key={i} className="h-[2px] flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-white transition-all ease-linear ${i === currentStoryIdx && isLoading ? 'opacity-30' : 'opacity-100'}`} 
                    style={{ 
                      width: i === currentStoryIdx ? `${progress}%` : i < currentStoryIdx ? '100%' : '0%',
                      transitionDuration: i === currentStoryIdx ? '40ms' : '0s'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-[60]">
              <div className="flex items-center gap-3">
                <div className="p-[1.5px] bg-gradient-to-tr from-yellow-400 to-purple-600 rounded-full shadow-lg">
                   <img src={currentUser.avatar} className="w-9 h-9 rounded-full border-2 border-black object-cover" alt="" />
                </div>
                <div className="flex flex-col drop-shadow-md">
                  <span className="text-white text-[14px] font-bold leading-none">{currentUser.username}</span>
                  <span className="text-white/70 text-[11px] mt-0.5 flex items-center gap-1">
                    {currentUser.timestamp} • <Circle size={4} className="fill-white/40 border-none" /> Sponsored
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsPaused(!isPaused)}
                  className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  {isPaused ? <History size={18} className="rotate-180" /> : <MoreHorizontal size={20} />}
                </button>
                <button onClick={() => setSelectedUserIdx(null)} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
              </div>
            </div>

            {/* Tap Targets */}
            <div className="absolute inset-0 z-[55] flex">
              <div className="w-[30%] h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
              <div className="w-[70%] h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNext(); }} />
            </div>

            {/* Media Content */}
            <div className="flex-1 bg-zinc-950 flex items-center justify-center relative overflow-hidden">
              <img 
                src={activeStory.mediaUrl} 
                className={`w-full h-full object-cover select-none pointer-events-none transition-all duration-1000 ${isLoading ? 'scale-110 blur-xl opacity-50' : 'scale-100 blur-0 opacity-100'}`} 
                alt="" 
              />
              
              {/* Captions */}
              {activeStory.caption && (
                <div className="absolute bottom-32 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <p className="text-white text-center text-sm font-medium drop-shadow-xl leading-relaxed max-w-[80%] mx-auto">
                    {activeStory.caption}
                  </p>
                </div>
              )}
            </div>

            {/* Footer / Interaction */}
            <div className="p-4 pb-10 bg-gradient-to-t from-black via-black/80 to-transparent z-[65] mt-auto">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowViewers(true); setIsPaused(true); }}
                  className="mb-6 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-white text-[12px] border border-white/10 active:scale-95 transition-all mx-auto w-fit"
                >
                  <div className="flex -space-x-2">
                    {activeStory.viewers.slice(0, 2).map((v, i) => (
                      <img key={i} src={v.avatar} className="w-5 h-5 rounded-full border-2 border-black object-cover" alt="" />
                    ))}
                  </div>
                  <span className="font-bold tracking-wide">{activeStory.viewers.length} Activity</span>
                </button>

              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Send message" 
                    className="w-full bg-transparent border border-white/30 rounded-full px-6 py-3 text-white text-sm outline-none placeholder:text-white/40 focus:border-white transition-all backdrop-blur-sm"
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => setIsPaused(false)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleLike(activeStory.id); }} 
                  className={`transition-all duration-300 active:scale-150 ${storyLikedStates[activeStory.id] ? 'text-red-500 fill-red-500 scale-110' : 'text-white'}`}
                >
                  <Heart size={26} strokeWidth={storyLikedStates[activeStory.id] ? 0 : 2} />
                </button>

                <button className="text-white rotate-[-15deg] active:translate-x-3 active:-translate-y-3 transition-all">
                  <Send size={26} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEWERS MODAL */}
      {showViewers && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in slide-in-from-bottom duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => { setShowViewers(false); setIsPaused(false); }} />
          <div className="relative w-full max-w-[420px] bg-white dark:bg-zinc-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[70vh]">
            <div className="p-6 border-b dark:border-zinc-800 flex items-center justify-between">
               <h4 className="font-black text-sm uppercase tracking-widest text-zinc-400">Activity</h4>
               <button onClick={() => { setShowViewers(false); setIsPaused(false); }} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <X size={20} />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
               {activeStory?.viewers.map((viewer) => (
                 <div key={viewer.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <img src={viewer.avatar} className="w-11 h-11 rounded-full object-cover border dark:border-zinc-800" alt="" />
                      <div>
                        <p className="text-sm font-bold">{viewer.username}</p>
                        <p className="text-[10px] text-zinc-500 font-medium">Watched {viewer.time} ago</p>
                      </div>
                    </div>
                    <button className="bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-500 hover:text-white transition-all">Follow</button>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}