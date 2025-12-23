export interface Story {
  id: string;
  mediaUrl: string;
  type: 'image' | 'video';
}

export interface User {
  userId: string;
  username: string;
  avatar: string;
  timestamp: string;
  stories: Story[];
  initialViewers: string[];
}

export const STORIES_DATA: User[] = [
  {
    userId: 'u1',
    username: 'cosmic.explorer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
    timestamp: '2h',
    initialViewers: ['luna_sky', 'astro_dennis'],
    stories: [
      { id: 's1', mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1080&q=80', type: 'image' },
      { id: 's2', mediaUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1080&q=80', type: 'image' },
    ],
  },
  {
    userId: 'u2',
    username: 'urban.architect',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&h=150',
    timestamp: '5h',
    initialViewers: ['city_vibe'],
    stories: [
      { id: 's3', mediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1080&q=80', type: 'image' },
    ],
  },
  {
    userId: 'u3',
    username: 'minimalist_vibes',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&h=150',
    timestamp: '12h',
    initialViewers: ['design.daily', 'pure_art'],
    stories: [
      { id: 's4', mediaUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1080&q=80', type: 'image' },
    ],
  },
];