'use client';

import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import FluidBackground from '../FluidBackground';

interface BusinessCard {
  id: string;
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  socials?: Array<{
    platform: string;
    handle: string;
    label: string;
  }>;
  image_data?: string;
  imageData?: string;
  style?: string;
  created_at: string;
}

export default function ProfilePage() {
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
    // Navigate to the main page
    router.push('/');
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
      
      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => router.push('/')}
              className="px-3 py-1.5 text-sm bg-black border-2 border-white text-white rounded transition-colors hover:bg-white hover:text-black"
            >
              ×
            </button>
          </div>

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
                        className="px-4 py-2 bg-black border-2 border-white text-white rounded-lg transition-colors hover:bg-white hover:text-black"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setDisplayName(user.displayName || '');
                          setIsEditing(false);
                        }}
                        className="px-4 py-2 bg-black border-2 border-white text-white rounded-lg transition-colors hover:bg-white hover:text-black"
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
                      className="px-4 py-2 bg-black border-2 border-white text-white rounded-lg transition-colors hover:bg-white hover:text-black"
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
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-black border-2 border-white text-white rounded-lg transition-colors hover:bg-white hover:text-black"
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
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{card.name}</h3>
                        <p className="text-white/70 text-sm">{card.title || 'No title'}</p>
                        <p className="text-white/50 text-sm">{card.company}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {card.email && (
                        <p className="text-white/70 text-sm">{card.email}</p>
                      )}
                      {card.phone && (
                        <p className="text-white/70 text-sm">{card.phone}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/c/${card.id}`)}
                        className="px-4 py-2 bg-black border-2 border-white text-white rounded-lg transition-colors hover:bg-white hover:text-black text-sm"
                      >
                        View Card
                      </button>
                      <button
                        onClick={() => handleEditCard(card)}
                        className="px-4 py-2 bg-black border-2 border-white text-white rounded-lg transition-colors hover:bg-white hover:text-black text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="px-4 py-2 bg-black border-2 border-red-400 text-red-400 rounded-lg transition-colors hover:bg-red-400 hover:text-black text-sm"
                      >
                        Delete
                      </button>
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
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{card.name}</h3>
                        <p className="text-white/70 text-sm">{card.title || 'No title'}</p>
                        <p className="text-white/50 text-sm">{card.company}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {card.email && (
                        <p className="text-white/70 text-sm">{card.email}</p>
                      )}
                      {card.phone && (
                        <p className="text-white/70 text-sm">{card.phone}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/c/${card.id}`)}
                        className="flex-1 px-4 py-2 bg-black border-2 border-white text-white rounded-lg transition-colors hover:bg-white hover:text-black text-sm"
                      >
                        View Card
                      </button>
                      <button
                        onClick={() => handleUnsaveCard(card.id)}
                        className="px-4 py-2 bg-black border-2 border-white text-white rounded-lg transition-colors hover:bg-white hover:text-black text-sm"
                      >
                        Unsave
                      </button>
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
