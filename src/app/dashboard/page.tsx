"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("light");
  const [profileOpen, setProfileOpen] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Real-time listener for notes (Fixes the "stale state" bug)
  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, "notes"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort client-side to avoid needing a composite index initially
      notesData.sort((a: any, b: any) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark-theme" : "light");
    document.body.classList.toggle("dark-theme");
  };

  const handleSignOut = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      await signOut(auth);
    }
  };

  const createNote = async () => {
    if (!user) return;
    try {
      const noteData = {
        title: "",
        content: "",
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        userId: user.uid,
        tags: [],
        archived: false
      };
      
      const docRef = await addDoc(collection(db, "notes"), noteData);
      // Wait for creation to finish before redirecting (Fixes missing ID bug)
      router.push(`/editor/${docRef.id}`);
    } catch (error) {
      console.error("Error creating note:", error);
      alert("Failed to create a new note. Please try again.");
    }
  };

  const deleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "notes", id));
        // Note: Real-time listener handles the state update cleanly
        if (expandedNoteId === id) setExpandedNoteId(null);
      } catch (error) {
        console.error("Error deleting note:", error);
        alert("Failed to delete note.");
      }
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    (n.content && n.content.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading || !user) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <div className={styles["header-content"]}>
          <div className={styles.logo}>
            <Image src={theme === "light" ? "/logo1.png" : "/logo-dark.png"} alt="Logo" width={120} height={80} priority />
          </div>
          
          <div className={styles["search-bar"]}>
            <span className={styles["search-icon"]}>🔍</span>
            <input 
              type="text" 
              placeholder="Search your notes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles["header-actions"]}>
            <button className={styles["theme-toggle"]} onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
            <div className={styles.profile} onClick={() => setProfileOpen(!profileOpen)}>
              <div className={styles["profile-avatar"]}>
                {user.email?.charAt(0).toUpperCase()}
              </div>
              {profileOpen && (
                <div className={styles["profile-menu"]}>
                  <div className={styles["profile-info"]}>
                    <p>{user.email}</p>
                  </div>
                  <button className={styles["signout-btn"]} onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles["dashboard-header"]}>
          <div className={styles.welcome}>
            <h1>My Notes</h1>
          </div>
          <button className={styles["add-note-btn"]} onClick={createNote}>
            <span>+</span> New Note
          </button>
        </div>

        <div className={styles["notes-grid"]}>
          {filteredNotes.length === 0 ? (
            <div className={styles["empty-state"]}>
              <h2>No notes found</h2>
              <p>Create a new note to get started.</p>
            </div>
          ) : (
            filteredNotes.map(note => {
              const isExpanded = expandedNoteId === note.id;
              return (
                <div 
                  key={note.id} 
                  className={`${styles["notes-container"]} ${isExpanded ? styles.expanded : ''}`}
                  onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                >
                  <div className={styles["notes-content"]}>
                    <div className={styles["notes-header"]}>
                      {note.title || "Untitled Note"}
                    </div>
                    <div className={styles["notes-body"]}>
                      <div dangerouslySetInnerHTML={{ __html: note.content ? (note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content) : 'Click to add content...' }} />
                      <div className={styles["note-date-info"]}>
                        <small>{new Date(note.lastModified).toLocaleString()}</small>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className={styles["note-actions"]}>
                        <Link href={`/editor/${note.id}`} className={styles["note-action-btn"]}>
                          ✏️ Edit
                        </Link>
                        <button className={`${styles["note-action-btn"]} ${styles["delete-btn"]}`} onClick={(e) => deleteNote(note.id, e)}>
                          🗑️ Delete
                        </button>
                        <button className={styles["note-close-btn"]} onClick={(e) => { e.stopPropagation(); setExpandedNoteId(null); }}>×</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
      {expandedNoteId && <div className={styles["note-zoom-overlay"]} onClick={() => setExpandedNoteId(null)}></div>}
    </div>
  );
}
