'use client';

import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import FluidBackground from '../FluidBackground';
import AppHeader from '../components/AppHeader';

interface SocialLink {
  platform: string;
  handle: string;
  label: string;
}

interface BusinessCard {
  id: string;
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  socials?: SocialLink[];
  image_data?: string;
  imageData?: string;
  style?: string;
  created_at: string;
}

// Card Thumbnail Component - Shows actual card front side design
const CardThumbnail = ({ card, onView, onEdit, onDelete, onUnsave, showUnsave = false }: { 
  card: BusinessCard;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onUnsave?: () => void;
  showUnsave?: boolean;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="w-full h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-white/10 relative group">
      {/* Miniature kosma-style card front */}
      <div className="w-full h-full flex flex-col p-2" style={{
        background: 'linear-gradient(135deg, #050505 0%, #1F1F1F 50%, #888888 100%)',
        position: 'relative'
      }}>
        {/* Company header */}
        {card.company && (
          <div className="text-xs font-semibold text-white/90 mb-1 text-center">
            {card.company}
          </div>
        )}

        {/* Profile image/initial in center */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
            {card.image_data || card.imageData ? (
              <Image
                src={card.image_data || card.imageData!}
                alt="Profile"
                width={40}
                height={40}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-white">
                {card.name ? card.name.charAt(0).toUpperCase() : "K"}
              </span>
            )}
          </div>
        </div>

        {/* Name at bottom */}
        <div className="text-xs font-bold text-white text-center">
          {card.name}
        </div>
      </div>

      {/* Three dots menu button */}
      <div className="absolute top-1 right-1" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2"/>
            <circle cx="12" cy="12" r="2"/>
            <circle cx="12" cy="19" r="2"/>
          </svg>
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-1 w-32 bg-black/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20 overflow-hidden z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                onView();
              }}
              className="w-full px-3 py-2 text-left text-white hover:bg-white/10 transition-colors text-xs"
            >
              View
            </button>
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit();
                }}
                className="w-full px-3 py-2 text-left text-white hover:bg-white/10 transition-colors text-xs"
              >
                Edit
              </button>
            )}
            {showUnsave && onUnsave ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onUnsave();
                }}
                className="w-full px-3 py-2 text-left text-white hover:bg-white/10 transition-colors text-xs"
              >
                Unsave
              </button>
            ) : onDelete ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete();
                }}
                className="w-full px-3 py-2 text-left text-red-400 hover:bg-white/10 transition-colors text-xs"
              >
                Delete
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};export default function ProfilePage() {
  const user = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [myCards, setMyCards] = useState<BusinessCard[]>([]);
  const [savedCards, setSavedCards] = useState<BusinessCard[]>([]);
  const [activeTab, setActiveTab] = useState<'my-cards' | 'saved'>('my-cards');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.push('/');
      return;
    }

    setDisplayName(user.displayName || '');
    setProfileImage(user.profileImageUrl || '');
    loadCards();
  }, [user, router]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const [myCardsRes, savedCardsRes] = await Promise.all([
        fetch('/api/cards/my-cards'),
        fetch('/api/cards/saved-cards'),
      ]);

      if (myCardsRes.ok) {
        const data = await myCardsRes.json();
        setMyCards(data.cards || []);
      }

      if (savedCardsRes.ok) {
        const data = await savedCardsRes.json();
        setSavedCards(data.cards || []);
      }
    } catch (error) {
      console.error('Failed to load cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      await user.update({
        displayName,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMyCards(myCards.filter(card => card.id !== cardId));
      }
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  const handleEditCard = (card: BusinessCard) => {
    // Store the card data in localStorage to be loaded by the main page
    localStorage.setItem('edit_card_data', JSON.stringify(card));
    localStorage.setItem('creating_new_card', 'true'); // Mark as editing
    // Navigate to the main page
    router.push('/create');
  };

  const handleUnsaveCard = async (cardId: string) => {
    try {
      const res = await fetch(`/api/cards/${cardId}/unsave`, {
        method: 'POST',
      });

      if (res.ok) {
        setSavedCards(savedCards.filter(card => card.id !== cardId));
      }
    } catch (error) {
      console.error('Failed to unsave card:', error);
    }
  };

  if (user === undefined || loading) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center">
        <FluidBackground />
        <div className="relative z-10 text-white">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-black">
      <FluidBackground />
      <div className="relative z-10">
        <AppHeader />
      </div>
      
      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Profile Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={displayName}
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateProfile}
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setDisplayName(user.displayName || '');
                          setIsEditing(false);
                        }}
                        className="btn btn-ghost"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{displayName}</h2>
                    <p className="text-white/70 mb-4">{user.primaryEmail}</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-ghost"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('my-cards')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'my-cards'
                  ? 'bg-black border-2 border-white text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              My Cards ({myCards.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'saved'
                  ? 'bg-black border-2 border-white text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Saved Cards ({savedCards.length})
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTab === 'my-cards' ? (
              myCards.length === 0 ? (
                <div className="col-span-full text-center py-12 text-white/50">
                  <p className="mb-4">You haven&apos;t created any cards yet</p>
                  <button
                    onClick={() => {
                      localStorage.removeItem('edit_card_data');
                      localStorage.setItem('creating_new_card', 'true');
                      router.push('/create');
                    }}
                    className="btn btn-primary"
                  >
                    Create Your First Card
                  </button>
                </div>
              ) : (
                myCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/15 transition-colors"
                  >
                    <div className="flex gap-4">
                      {/* Card Thumbnail */}
                      <div className="flex-shrink-0 w-32">
                        <CardThumbnail 
                          card={card}
                          onView={() => router.push(`/c/${card.id}`)}
                          onEdit={() => handleEditCard(card)}
                          onDelete={() => handleDeleteCard(card.id)}
                        />
                      </div>
                      
                      {/* Card Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{card.name}</h3>
                            <p className="text-white/70 text-sm">{card.title || 'No title'}</p>
                            <p className="text-white/50 text-sm">{card.company}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {card.email && (
                            <p className="text-white/70 text-sm">{card.email}</p>
                          )}
                          {card.phone && (
                            <p className="text-white/70 text-sm">{card.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (
              savedCards.length === 0 ? (
                <div className="col-span-full text-center py-12 text-white/50">
                  You haven&apos;t saved any cards yet
                </div>
              ) : (
                savedCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/15 transition-colors"
                  >
                    <div className="flex gap-4">
                      {/* Card Thumbnail */}
                      <div className="flex-shrink-0 w-32">
                        <CardThumbnail 
                          card={card}
                          onView={() => router.push(`/c/${card.id}`)}
                          onUnsave={() => handleUnsaveCard(card.id)}
                          showUnsave={true}
                        />
                      </div>
                      
                      {/* Card Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{card.name}</h3>
                            <p className="text-white/70 text-sm">{card.title || 'No title'}</p>
                            <p className="text-white/50 text-sm">{card.company}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {card.email && (
                            <p className="text-white/70 text-sm">{card.email}</p>
                          )}
                          {card.phone && (
                            <p className="text-white/70 text-sm">{card.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
