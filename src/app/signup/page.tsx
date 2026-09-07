"use client";

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./signup.module.css";
import Image from "next/image";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark-theme" : "light");
    document.body.classList.toggle("dark-theme");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error creating user:", error);
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("This email is already registered. Please use a different email or try signing in.");
          break;
        case "auth/invalid-email":
          alert("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          alert("Password should be at least 6 characters long.");
          break;
        default:
          alert("Error creating account: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <div className={styles["header-content"]}>
          <div className={styles.logo}>
            <Image id="logo-img" src={theme === "light" ? "/logo1.png" : "/logo-dark.png"} alt="Logo" width={192} height={128} priority />
          </div>
          <button className={styles["theme-toggle"]} onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles["signup-container"]}>
          <div className={styles["signup-header"]}>
            <p>Create your QuickBlip account</p>
          </div>

          <form onSubmit={handleSignup}>
            <div className={styles["form-group"]}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className={styles["form-actions"]}>
              <button type="submit" className={styles["btn-signup"]} disabled={loading}>
                {loading ? "Creating..." : "Sign Up"}
              </button>
              <Link href="/login" className={styles["btn-signin"]}>
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles["footer-bottom"]}>
          <div className={styles["footer-bottom-content"]}>
            <p>&copy; 2025 QuickBlip. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
