import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Download, RefreshCw, Award, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";

interface DiplomaRecord {
  id: string;
  studentName: string;
  totalStars: number;
  avgAccuracy: number;
  completedAt?: string;
  levelResults: string;
}

export default function Admin() {
  const [diplomas, setDiplomas] = useState<DiplomaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin-login");
      return;
    }
    
    fetchDiplomas();
  }, [setLocation]);

  const fetchDiplomas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/diplomas", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      
      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        setLocation("/admin-login");
        return;
      }
      
      if (!response.ok) throw new Error("Failed to fetch diplomas");
      const data = await response.json();
      setDiplomas(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching diplomas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/");
  };

  const handleExportCSV = () => {
    if (diplomas.length === 0) {
      alert("Ingen diplomer å eksportere");
      return;
    }

    const headers = ["Elev", "Dato", "Stjerner", "Nøyaktighet"];
    const rows = diplomas.map(d => [
      d.studentName,
      d.completedAt ? new Date(d.completedAt).toLocaleDateString('no-NO') : "N/A",
      d.totalStars,
      `${d.avgAccuracy}%`,
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MatteFlyt-resultater-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/levels">
              <Button variant="ghost" className="gap-2 mb-4">
                <ArrowLeft className="w-4 h-4" /> Tilbake
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-slate-800">Admin Panel</h1>
            <p className="text-slate-500 mt-2">Oversikt over fullførte diplomer</p>
          </div>
          <div className="flex gap-2 flex-col">
            <div className="flex gap-2">
              <Button onClick={fetchDiplomas} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" /> Oppdater
              </Button>
              <Button onClick={handleExportCSV} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4" /> Eksporter CSV
              </Button>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
              <LogOut className="w-4 h-4" /> Logg ut
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-white">
            <div className="text-sm text-slate-500 uppercase font-bold mb-2">Totalt fullførte</div>
            <div className="text-4xl font-bold text-blue-600">{diplomas.length}</div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-sm text-slate-500 uppercase font-bold mb-2">Gjennomsn. nøyaktighet</div>
            <div className="text-4xl font-bold text-green-600">
              {diplomas.length > 0 
                ? Math.round(diplomas.reduce((acc, d) => acc + d.avgAccuracy, 0) / diplomas.length)
                : 0}%
            </div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-sm text-slate-500 uppercase font-bold mb-2">Gjennomsnittlige stjerner</div>
            <div className="text-4xl font-bold text-yellow-500">
              {diplomas.length > 0 
                ? (diplomas.reduce((acc, d) => acc + d.totalStars, 0) / diplomas.length).toFixed(1)
                : 0}
            </div>
          </Card>
        </div>

        {/* Diplomas Table */}
        <Card className="bg-white">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Laster inn...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">Feil: {error}</div>
          ) : diplomas.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Ingen diplomer funnet ennå</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Elev</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Dato</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-600">Stjerner</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-600">Nøyaktighet</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Detaljer</th>
                  </tr>
                </thead>
                <tbody>
                  {diplomas.map((diploma, index) => {
                    const levelResults = JSON.parse(diploma.levelResults);
                    const completedCount = Object.keys(levelResults).length;
                    
                    return (
                      <motion.tr 
                        key={diploma.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-800">{diploma.studentName}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {diploma.completedAt 
                            ? new Date(diploma.completedAt).toLocaleDateString('no-NO')
                            : "N/A"
                          }
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg font-bold text-yellow-500">{diploma.totalStars}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`font-semibold ${
                            diploma.avgAccuracy >= 90 ? 'text-green-600' :
                            diploma.avgAccuracy >= 80 ? 'text-blue-600' :
                            'text-orange-600'
                          }`}>
                            {diploma.avgAccuracy}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          Fullførte {completedCount} nivåer
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
