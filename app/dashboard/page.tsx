'use client';

import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import AppHeader from '../components/AppHeader';
const FluidBackground = dynamic(() => import('../FluidBackground'), { ssr: false });

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
const CardThumbnail = ({ card, onView, onEdit, onDelete }: { 
  card: BusinessCard;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
    <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:bg-white/15 transition-colors group cursor-pointer" onClick={onView}>
      {/* Card Preview */}
      <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden border-b border-white/10 relative">
        {/* Miniature kosma-style card front */}
        <div className="w-full h-full flex flex-col p-4" style={{
          background: 'linear-gradient(135deg, #050505 0%, #1F1F1F 50%, #888888 100%)',
          position: 'relative'
        }}>
          {/* Company header */}
          {card.company && (
            <div className="text-sm font-semibold text-white/90 mb-2 text-center">
              {card.company}
            </div>
          )}

          {/* Profile image/initial in center */}
          <div className="flex-1 flex items-center justify-center">
            {card.image_data || card.imageData ? (
              <Image
                src={card.image_data || card.imageData!}
                alt="Profile"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-white">
                {card.name ? card.name.charAt(0).toUpperCase() : "K"}
              </span>
            )}
          </div>

          {/* Name at bottom */}
          <div className="text-sm font-bold text-white text-center">
            {card.name}
          </div>
        </div>

        {/* Three dots menu button */}
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="12" cy="19" r="2"/>
            </svg>
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-black/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20 overflow-hidden z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onView();
                }}
                className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm"
              >
                View Card
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  window.open(`/c/${card.id}?export=png`, '_blank');
                }}
                className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm"
              >
                Export Card
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit();
                }}
                className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete();
                }}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/10 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1 truncate">{card.name}</h3>
        <p className="text-white/70 text-sm truncate">{card.title || 'No title'}</p>
        {card.company && (
          <p className="text-white/50 text-sm truncate">{card.company}</p>
        )}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const user = useUser();
  const router = useRouter();
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.push('/');
      return;
    }
    loadCards();
  }, [user, router]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cards/my-cards');
      if (res.ok) {
        const data = await res.json();
        setCards(data.cards || []);
      }
    } catch (error) {
      console.error('Failed to load cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCards(cards.filter(card => card.id !== cardId));
      }
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  const handleEditCard = (card: BusinessCard) => {
    localStorage.setItem('edit_card_data', JSON.stringify(card));
    localStorage.setItem('creating_new_card', 'true'); // Mark as editing
    router.push('/create');
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
            </div>
            <div>
              <button
                onClick={() => {
                  // Mark that user is creating a new card
                  localStorage.removeItem('edit_card_data');
                  localStorage.setItem('creating_new_card', 'true');
                  router.push('/create');
                }}
                className="btn btn-primary"
              >
                + Create New Card
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {cards.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">No cards yet</h2>
                <p className="text-white/70 mb-6">Create your first business card to get started</p>
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
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <p className="text-white/70">Cards: {cards.length}/2</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cards.map((card) => (
                  <CardThumbnail
                    key={card.id}
                    card={card}
                    onView={() => router.push(`/c/${card.id}`)}
                    onEdit={() => handleEditCard(card)}
                    onDelete={() => handleDeleteCard(card.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
