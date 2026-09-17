import React, { useState } from 'react';
import { AnalyticsService } from '../../services/analytics.service.js';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d'>('30d');
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadCsv = () => {
    setDownloading('csv');
    AnalyticsService.downloadCsv(dateRange);
    setTimeout(() => setDownloading(null), 1000);
  };

  const handleDownloadPdf = () => {
    setDownloading('pdf');
    AnalyticsService.downloadPdf(dateRange);
    setTimeout(() => setDownloading(null), 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full inline-block mb-2">
          Export & Compliance
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Canteen Reports & Data Export
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Generate formal audit reports, CSV transactional exports, and PDF summaries for college administration.
        </p>
      </div>

      {/* Date Range Selector Card */}
      <div className="card-3d p-6 border border-white/10 space-y-4">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          Select Reporting Horizon
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'today', title: "Today's Report", desc: 'Past 24 hours transactions' },
            { id: '7d', title: '7-Day Summary', desc: 'Current operating week' },
            { id: '30d', title: '30-Day Monthly Audit', desc: 'Comprehensive monthly statement' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setDateRange(r.id as any)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                dateRange === r.id
                  ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/30'
                  : 'border-white/10 bg-dark-elevated/40 hover:bg-dark-elevated/80 text-slate-300'
              }`}
            >
              <h4 className={`text-xs font-bold ${dateRange === r.id ? 'text-brand-400' : 'text-white'}`}>{r.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Download Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Card */}
        <div className="card-3d p-6 border border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-inner">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">CSV Spreadsheet Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download raw transaction logs containing Order IDs, timestamps, student names, itemized lines, total amounts, and payment references for Excel or spreadsheet accounting.
            </p>
          </div>

          <button
            onClick={handleDownloadCsv}
            disabled={downloading !== null}
            className="w-full btn-secondary py-3 text-xs font-bold flex items-center justify-center gap-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            {downloading === 'csv' ? 'Generating CSV...' : `Download CSV (${dateRange.toUpperCase()})`}
          </button>
        </div>

        {/* PDF Card */}
        <div className="card-3d p-6 border border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center shadow-inner">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Official PDF Summary Report</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate formatted PDF summary documents branded with CampusBite credentials, executive sales summaries, average order values, and transaction tables.
            </p>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading !== null}
            className="w-full btn-primary py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30"
          >
            <Download className="w-4 h-4" />
            {downloading === 'pdf' ? 'Generating PDF...' : `Generate PDF (${dateRange.toUpperCase()})`}
          </button>
        </div>
      </div>
    </div>
  );
};
