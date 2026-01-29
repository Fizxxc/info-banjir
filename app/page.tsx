"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import type { LatLngTuple } from "leaflet";
import AuthPanel from "@/components/AuthPanel";
import FloodMap from "@/components/FloodMap";
import ReportForm from "@/components/ReportForm";
import ReportList from "@/components/ReportList";
import type { FloodReport, FloodLevel } from "@/types";
import { db } from "@/lib/firebase";

const levelLegend: { level: FloodLevel; label: string; color: string }[] = [
  { level: "orange", label: "Tidak bisa diakses sama sekali", color: "#f97316" },
  { level: "red", label: "Banjir parah, akses terblokir", color: "#dc2626" },
  { level: "yellow", label: "Sedang, agak sulit dilewati", color: "#facc15" },
  { level: "green", label: "Masih bisa dilewati", color: "#22c55e" },
  { level: "blue", label: "Aman dari banjir", color: "#38bdf8" },
];

export default function HomePage() {
  const [reports, setReports] = useState<FloodReport[]>([]);
  const [selected, setSelected] = useState<LatLngTuple | null>(null);

  useEffect(() => {
    const reportsQuery = query(
      collection(db, "floodReports"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
      const nextReports = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.() ?? new Date();
        return {
          id: doc.id,
          title: data.title ?? "Laporan",
          description: data.description ?? "",
          level: (data.level ?? "blue") as FloodLevel,
          location: data.location ?? { lat: 0, lng: 0 },
          reporter: data.reporter ?? "anonim",
          createdAt,
          timeLabel: createdAt.toLocaleString("id-ID"),
        } as FloodReport;
      });
      setReports(nextReports);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main>
      <div className="container">
        <header>
          <h1>Info Banjir Bekasi</h1>
          <p>
            Sistem realtime untuk pelaporan banjir di Bekasi lengkap dengan peta,
            tingkatan status, dan waktu kejadian.
          </p>
        </header>

        <section className="card">
          <h2>Legenda Tingkatan Banjir</h2>
          <div className="legend">
            {levelLegend.map((item) => (
              <div key={item.level} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: item.color }}
                />
                <span>
                  {item.level.toUpperCase()} - {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <AuthPanel />

        <section className="card">
          <h2>Peta Laporan Banjir Bekasi</h2>
          <p className="helper">
            Klik peta untuk menentukan lokasi laporan. Marker laporan akan tampil
            secara realtime.
          </p>
          <FloodMap
            reports={reports}
            selected={selected}
            onSelect={(position) => setSelected(position)}
          />
        </section>

        <div className="grid">
          <ReportForm selected={selected} />
          <ReportList reports={reports} />
        </div>
      </div>
    </main>
  );
}
