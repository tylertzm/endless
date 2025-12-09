"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { useState, useRef, useEffect } from "react";

export default function AppHeader() {
  const user = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  const avatarLetter = user?.displayName?.charAt(0).toUpperCase() || "U";

  return (
    <header className="app-header">
      <div className="app-header__left" onClick={() => router.push(user ? "/dashboard" : "/")}>
        <div className="app-header__brand" aria-label="Endless home">
          <div className="app-header__logo">
            <img
              src="/endless.webp"
              alt="Endless"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>
      </div>
      <div className="app-header__right" ref={menuRef}>
        {user ? (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn-circle"
            aria-label="User menu"
          >
            {avatarLetter}
          </button>
        ) : (
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={() => router.push("/")}>Sign In</button>
            <button className="btn btn-primary" onClick={() => router.push("/")}>Get Started</button>
          </div>
        )}

        {user && menuOpen && (
          <div className="app-header__menu" onClick={(e) => e.stopPropagation()}>
            <div className="app-header__menu-name">{user.displayName || "User"}</div>
            <button className="menu-item" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); router.push("/dashboard"); }}>Dashboard</button>
            <button className="menu-item" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); localStorage.removeItem('cardData'); localStorage.removeItem('cardStyle'); localStorage.removeItem('currentStep'); localStorage.removeItem('savedCardId'); localStorage.removeItem('creating_new_card'); router.push("/create"); }}>Create</button>
            <button className="menu-item" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); router.push("/profile"); }}>Profile</button>
            <button className="menu-item" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); user.signOut(); }}>Sign Out</button>
          </div>
        )}
      </div>
    </header>
  );
}
