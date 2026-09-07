"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark-theme" : "light");
    document.body.classList.toggle("dark-theme");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error signing in:", error);
      switch (error.code) {
        case "auth/user-not-found":
          alert("No account found with this email. Please check your email or sign up.");
          break;
        case "auth/wrong-password":
          alert("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          alert("Please enter a valid email address.");
          break;
        case "auth/user-disabled":
          alert("This account has been disabled. Please contact support.");
          break;
        case "auth/too-many-requests":
          alert("Too many failed attempts. Please try again later.");
          break;
        default:
          alert("Error signing in: " + error.message);
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
        <div className={styles["login-container"]}>
          <div className={styles["login-header"]}>
            <p>Sign in to your QuickBlip account</p>
          </div>

          <form onSubmit={handleLogin}>
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
              />
            </div>

            <div className={styles["form-actions"]}>
              <button type="submit" className={styles["btn-signin"]} disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
              <Link href="/signup" className={styles["btn-signup"]}>
                Sign Up
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
