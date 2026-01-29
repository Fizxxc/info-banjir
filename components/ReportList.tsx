"use client";

import type { FloodReport } from "@/types";

const levelLabels: Record<string, string> = {
  orange: "Orange - tidak diakses sama sekali",
  red: "Merah - banjir parah",
  yellow: "Kuning - sedang",
  green: "Hijau - ringan",
  blue: "Biru - aman",
};

export default function ReportList({ reports }: { reports: FloodReport[] }) {
  return (
    <section className="card">
      <h2>Update Realtime</h2>
      <div className="report-list">
        {reports.length === 0 ? (
          <p className="helper">Belum ada laporan masuk.</p>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="report-item">
              <div className="report-header">
                <span>{report.title}</span>
                <span className="badge">{report.level.toUpperCase()}</span>
              </div>
              <p>{levelLabels[report.level]}</p>
              <p>{report.description}</p>
              <p className="helper">
                {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)} •{" "}
                {report.timeLabel} • oleh {report.reporter}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
