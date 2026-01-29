"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { LatLngTuple } from "leaflet";
import type { FloodLevel } from "@/types";
import { db, auth } from "@/lib/firebase";

const levelOptions: { value: FloodLevel; label: string }[] = [
  { value: "orange", label: "Orange - tidak diakses sama sekali" },
  { value: "red", label: "Merah - banjir parah akses terblokir" },
  { value: "yellow", label: "Kuning - sedang, agak sulit dilewati" },
  { value: "green", label: "Hijau - banjir ringan, masih bisa dilewati" },
  { value: "blue", label: "Biru - aman dari banjir" },
];

export default function ReportForm({
  selected,
}: {
  selected: LatLngTuple | null;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<FloodLevel>("blue");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!auth.currentUser) {
      setStatus("Silakan login terlebih dahulu untuk mengirim laporan.");
      return;
    }

    if (!selected) {
      setStatus("Pilih lokasi di peta sebelum mengirim laporan.");
      return;
    }

    if (!title) {
      setStatus("Judul laporan wajib diisi.");
      return;
    }

    try {
      await addDoc(collection(db, "floodReports"), {
        title,
        description,
        level,
        location: {
          lat: selected[0],
          lng: selected[1],
        },
        reporter: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDescription("");
      setLevel("blue");
      setStatus("Laporan berhasil dikirim.");
    } catch (error) {
      setStatus("Gagal mengirim laporan. Coba lagi.");
    }
  };

  return (
    <section className="card">
      <h2>Form Laporan Banjir</h2>
      <p className="helper">
        Klik peta untuk memilih koordinat laporan. Lokasi saat ini: {" "}
        {selected ? `${selected[0].toFixed(5)}, ${selected[1].toFixed(5)}` : "-"}
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Judul lokasi (contoh: Jl. Ahmad Yani)"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <textarea
          rows={3}
          placeholder="Deskripsi kondisi banjir"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <select value={level} onChange={(event) => setLevel(event.target.value as FloodLevel)}>
          {levelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="submit">Kirim Laporan</button>
      </form>
      {status && <p className="helper">{status}</p>}
    </section>
  );
}
