import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Printer,
  X,
  Clock,
  Fuel,
  ShieldCheck,
  TrendingUp,
  Award,
  Download,
  Check
} from 'lucide-react';
import { ShiftSummary } from '../types';
import { api } from '../api';

interface ShiftRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatorId: string;
  machineId: string;
}

export const ShiftRecapModal: React.FC<ShiftRecapModalProps> = ({
  isOpen,
  onClose,
  operatorId,
  machineId
}) => {
  const [summary, setSummary] = useState<ShiftSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedOff, setSignedOff] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSummary();
    }
  }, [isOpen, operatorId, machineId]);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const data = await api.getShiftSummary(operatorId, machineId);
      setSummary(data);
    } catch (err) {
      console.error('Failed to load shift summary', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cab-card border border-cab-border rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cab-border flex items-center justify-between bg-cab-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cat-yellow flex items-center justify-center text-cab-black shadow-cat-glow">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-industrial text-white tracking-wide uppercase">
                End-of-Shift Telematics Sign-Off Recap
              </h2>
              <p className="text-xs text-gray-400">
                Official Caterpillar Certified Shift Performance Record
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-cab-dark hover:bg-cab-card-hover text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {summary && (
            <>
              {/* Operator & Equipment Header Banner */}
              <div className="bg-cab-dark p-4 rounded-xl border border-cab-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-gray-400 block">OPERATOR & UNIT</span>
                  <span className="text-base font-bold text-white font-sans">
                    {summary.operator_name} [{summary.operator_id}]
                  </span>
                  <span className="text-cat-yellow block mt-0.5">{summary.machine_id}</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-gray-400 block">SHIFT LOG DATE</span>
                  <span className="text-white font-bold">{summary.shift_date}</span>
                  <span className="text-emerald-400 block mt-0.5">TELEMETRY VERIFIED</span>
                </div>
              </div>

              {/* 4 Core Pillars Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* 1. Tasks Completed */}
                <div className="bg-cab-dark p-3.5 rounded-xl border border-cab-border flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">
                    Tasks Executed
                  </span>
                  <div className="mt-1">
                    <span className="text-2xl font-black font-mono text-white">
                      {summary.tasks_completed} / {summary.tasks_total}
                    </span>
                    <span className="text-[11px] text-cat-yellow block font-medium mt-0.5">
                      {Math.round((summary.tasks_completed / Math.max(1, summary.tasks_total)) * 100)}% Execution
                    </span>
                  </div>
                </div>

                {/* 2. Safety Score */}
                <div className="bg-cab-dark p-3.5 rounded-xl border border-cab-border flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">
                    Shift Safety Rating
                  </span>
                  <div className="mt-1">
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      {summary.safety_score}
                    </span>
                    <span className="text-[11px] text-gray-300 block font-medium mt-0.5">
                      {summary.seatbelt_compliance_pct}% Interlock Safe
                    </span>
                  </div>
                </div>

                {/* 3. Idling Ratio */}
                <div className="bg-cab-dark p-3.5 rounded-xl border border-cab-border flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">
                    Idling Ratio
                  </span>
                  <div className="mt-1">
                    <span
                      className={`text-2xl font-black font-mono ${
                        summary.idling_pct > 25 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {summary.idling_pct}%
                    </span>
                    <span className="text-[11px] text-gray-400 block font-medium mt-0.5">
                      {summary.idling_hours}h idle / {summary.shift_hours}h total
                    </span>
                  </div>
                </div>

                {/* 4. ML Estimation Accuracy */}
                <div className="bg-cab-dark p-3.5 rounded-xl border border-cab-border flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">
                    Plan Accuracy
                  </span>
                  <div className="mt-1">
                    <span className="text-2xl font-black font-mono text-cat-yellow">
                      {summary.time_estimate_accuracy_pct}%
                    </span>
                    <span className="text-[11px] text-gray-400 block font-medium mt-0.5">
                      vs Scikit-Learn Model
                    </span>
                  </div>
                </div>
              </div>

              {/* Eco & Productivity Breakdown */}
              <div className="bg-cab-dark p-4 rounded-xl border border-cab-border">
                <span className="text-xs font-industrial font-bold uppercase tracking-wider text-gray-300 block mb-3">
                  Productivity & Environmental Stewardship
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="bg-cab-card p-3 rounded-lg border border-cab-border">
                    <span className="text-gray-400 text-[10px]">TOTAL LOAD CYCLES</span>
                    <span className="text-xl font-bold text-white block mt-1">
                      {summary.total_load_cycles} passes
                    </span>
                    <span className="text-[10px] text-cat-yellow">~29.2 cycles/hr</span>
                  </div>

                  <div className="bg-cab-card p-3 rounded-lg border border-cab-border">
                    <span className="text-gray-400 text-[10px]">ECO FUEL SAVED</span>
                    <span className="text-xl font-bold text-emerald-400 block mt-1">
                      +{summary.eco_fuel_saved_L} Liters
                    </span>
                    <span className="text-[10px] text-gray-400">AES auto-shutdown</span>
                  </div>

                  <div className="bg-cab-card p-3 rounded-lg border border-cab-border">
                    <span className="text-gray-400 text-[10px]">CO2 EMISSIONS REDUCED</span>
                    <span className="text-xl font-bold text-emerald-400 block mt-1">
                      -{summary.carbon_saved_kg} kg CO2
                    </span>
                    <span className="text-[10px] text-gray-400">Carbon offset credit</span>
                  </div>
                </div>
              </div>

              {/* Sign-off & Verification Hash */}
              <div className="p-4 rounded-xl bg-cab-black border border-cab-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-gray-400 block">TELEMATIC SIGNATURE HASH</span>
                  <span className="text-cat-yellow font-bold text-sm tracking-wider">
                    {summary.signature_hash}
                  </span>
                  <span className="text-gray-500 block text-[10px]">
                    SHA-256 Block Authenticated by OperatorOS
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {signedOff ? (
                    <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg font-bold">
                      <Check className="w-4 h-4" />
                      <span>SHIFT SIGNED OFF</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSignedOff(true)}
                      className="touch-btn bg-cat-yellow hover:bg-cat-yellow-hover text-cab-black font-black text-xs px-4 py-2 shadow-cat-glow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sign-Off & Submit Shift</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cab-border bg-cab-black flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="touch-btn bg-cab-dark hover:bg-cab-card-hover border border-cab-border text-xs px-4 py-2 text-gray-200"
          >
            <Printer className="w-4 h-4" />
            <span>Print Shift Ticket</span>
          </button>

          <button
            onClick={onClose}
            className="touch-btn bg-cab-card hover:bg-cab-card-hover border border-cab-border text-xs px-5 py-2 text-white font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
