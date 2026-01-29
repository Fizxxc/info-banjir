"use client";

import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AuthPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    setStatus(null);
    if (!email || !password) {
      setStatus("Email dan password wajib diisi.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      setStatus("Login gagal. Pastikan akun sudah terdaftar.");
    }
  };

  const handleRegister = async () => {
    setStatus(null);
    if (!email || !password) {
      setStatus("Email dan password wajib diisi.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      setStatus("Registrasi gagal. Coba gunakan email lain atau password lebih kuat.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <section className="card">
      <h2>Login Petugas/Laporan Warga</h2>
      {user ? (
        <div className="auth-actions">
          <p>Masuk sebagai {user.email}</p>
          <button type="button" className="secondary" onClick={handleLogout}>
            Keluar
          </button>
        </div>
      ) : (
        <>
          <div className="grid">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="auth-actions">
            <button type="button" onClick={handleLogin}>
              Masuk
            </button>
            <button type="button" className="secondary" onClick={handleRegister}>
              Daftar
            </button>
          </div>
        </>
      )}
      {status && <p className="helper">{status}</p>}
    </section>
  );
}
