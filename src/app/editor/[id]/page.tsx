"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import styles from "./editor.module.css";
import Image from "next/image";

export default function Editor({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [theme, setTheme] = useState("light");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [lastSaved, setLastSaved] = useState("");
  const [noteLoaded, setNoteLoaded] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load Note (Fixes silent failure bug)
  useEffect(() => {
    if (!user || !id) return;

    const loadNote = async () => {
      try {
        const noteDoc = await getDoc(doc(db, "notes", id));
        if (noteDoc.exists()) {
          const data = noteDoc.data();
          if (data.userId !== user.uid) {
            alert("Permission denied.");
            router.push("/dashboard");
            return;
          }
          setTitle(data.title || "");
          setContent(data.content || "");
          if (editorRef.current) {
            editorRef.current.innerHTML = data.content || "";
          }
          setNoteLoaded(true);
        } else {
          alert("Note not found.");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error loading note", error);
        router.push("/dashboard");
      }
    };
    loadNote();
  }, [user, id, router]);

  // Handle Word Count
  const updateStats = (newTitle: string, newContent: string) => {
    // Strip HTML for accurate word counting
    const plainText = newContent.replace(/<[^>]*>?/gm, '');
    const words = (newTitle + ' ' + plainText).trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount((newTitle + plainText).length);
  };

  useEffect(() => {
    updateStats(title, content);
  }, [title, content]);

  // Handle Auto-Save
  const saveNote = async (currentTitle: string, currentContent: string) => {
    if (!user || !noteLoaded) return;
    
    // Fix Empty Note Auto-Save bug
    if (!currentTitle.trim() && !currentContent.trim().replace(/<[^>]*>?/gm, '')) {
      return; 
    }

    setSaveStatus("Saving...");
    try {
      await updateDoc(doc(db, "notes", id), {
        title: currentTitle,
        content: currentContent,
        lastModified: new Date().toISOString()
      });
      setSaveStatus("Saved");
      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error saving note:", error);
      setSaveStatus("Error");
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => saveNote(title, newContent), 1500);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveNote(newTitle, content), 1500);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark-theme" : "light");
    document.body.classList.toggle("dark-theme");
  };

  const formatText = (command: string) => {
    document.execCommand(command, false, undefined);
    if (editorRef.current) editorRef.current.focus();
    handleInput();
  };

  if (loading || !user || !noteLoaded) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <div className={styles["header-content"]}>
          <div className={styles["left-actions"]}>
            <Link href="/dashboard" className={styles["back-btn"]}>
              ← Back
            </Link>
          </div>
          <div className={styles["center-info"]}>
            <span className={styles["save-status"]} id="saveStatus">
              {saveStatus}
            </span>
            <span className={styles["last-saved"]}>
              {lastSaved && `Last edited at ${lastSaved}`}
            </span>
          </div>
          <div className={styles["right-actions"]}>
            <button className={styles["theme-toggle"]} onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
            <button className={styles["save-btn"]} onClick={() => saveNote(title, content)}>
              Save Now
            </button>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles["editor-container"]}>
          <div className={styles["editor-toolbar"]}>
            <div className={styles["toolbar-group"]}>
              <button className={styles["tool-btn"]} onClick={() => formatText('bold')} title="Bold"><b>B</b></button>
              <button className={styles["tool-btn"]} onClick={() => formatText('italic')} title="Italic"><i>I</i></button>
              <button className={styles["tool-btn"]} onClick={() => formatText('underline')} title="Underline"><u>U</u></button>
            </div>
            <div className={styles["toolbar-group"]}>
              <button className={styles["tool-btn"]} onClick={() => formatText('insertUnorderedList')} title="Bullet List">• List</button>
              <button className={styles["tool-btn"]} onClick={() => formatText('insertOrderedList')} title="Number List">1. List</button>
            </div>
          </div>
          
          <div className={styles["editor-content"]}>
            <input 
              type="text" 
              className={styles["note-title"]} 
              placeholder="Note Title" 
              value={title}
              onChange={handleTitleChange}
            />
            <div 
              className={styles["note-body"]} 
              contentEditable 
              ref={editorRef}
              onInput={handleInput}
              suppressContentEditableWarning={true}
            />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles["footer-bottom"]}>
          <div className={styles["footer-bottom-content"]}>
            <div className={styles.stats}>
              <span id="wordCount">{wordCount} words</span>
              <span className={styles.separator}>|</span>
              <span id="charCount">{charCount} characters</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
