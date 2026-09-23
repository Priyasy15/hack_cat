import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Check,
  Calendar,
  Fuel,
  Clock,
  Award,
  Zap,
  Sparkles,
  X
} from 'lucide-react';
import { ShiftRecap } from '../types';
import { api } from '../api';

interface ShiftRecapViewProps {
  operatorId: string;
  machineId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShiftRecapView: React.FC<ShiftRecapViewProps> = ({
  operatorId,
  machineId,
  isOpen,
  onClose
}) => {
  const [recap, setRecap] = useState<ShiftRecap | null>(null);
  const [signedOff, setSignedOff] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRecap();
    }
  }, [isOpen, operatorId, machineId]);

  const loadRecap = async () => {
    try {
      const data = await api.getShiftRecap(operatorId, machineId);
      setRecap(data);
    } catch (err) {
      console.error('Failed to load shift recap', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-nordic-card border border-nordic-border rounded-2xl max-w-3xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-nordic-border flex items-center justify-between bg-nordic-base">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ice-blue flex items-center justify-center text-nordic-base font-black shadow-ice-glow">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-industrial text-white tracking-wide uppercase">
                End-of-Shift Telematics Sign-Off Ticket
              </h2>
              <p className="text-xs text-nordic-muted font-mono">
                Official Caterpillar Certified Operational Record
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-nordic-card text-nordic-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {recap && (
            <>
              {/* Operator Info Box */}
              <div className="bg-nordic-base p-4 rounded-xl border border-nordic-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-nordic-muted block">OPERATOR & EQUIPMENT</span>
                  <span className="text-base font-bold text-white font-sans">
                    {recap.operator_name} [{recap.operator_id}]
                  </span>
                  <span className="text-ice-blue block mt-0.5">{recap.machine_model} ({recap.machine_id})</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-nordic-muted block">SHIFT DATE</span>
                  <span className="text-white font-bold">{recap.shift_date}</span>
                  <span className="text-frost-green block mt-0.5">TELEMETRY VERIFIED</span>
                </div>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-nordic-base p-3.5 rounded-xl border border-nordic-border">
                  <span className="text-nordic-muted text-[10px] uppercase">Tasks Executed</span>
                  <div className="text-2xl font-black text-white mt-1">
                    {recap.tasks_completed} / {recap.tasks_scheduled}
                  </div>
                  <span className="text-[10px] text-pastel-ochre mt-1 block">
                    {recap.tasks_weather_rescheduled} weather held
                  </span>
                </div>

                <div className="bg-nordic-base p-3.5 rounded-xl border border-nordic-border">
                  <span className="text-nordic-muted text-[10px] uppercase">Shift Safety Rating</span>
                  <div className="text-2xl font-black text-frost-green mt-1">
                    {recap.safety_score}
                  </div>
                  <span className="text-[10px] text-nordic-muted mt-1 block">
                    {recap.seatbelt_compliance_pct}% compliance
                  </span>
                </div>

                <div className="bg-nordic-base p-3.5 rounded-xl border border-nordic-border">
                  <span className="text-nordic-muted text-[10px] uppercase">Idling Ratio</span>
                  <div className={`text-2xl font-black mt-1 ${recap.idling_pct > 25 ? 'text-pastel-ochre' : 'text-frost-green'}`}>
                    {recap.idling_pct}%
                  </div>
                  <span className="text-[10px] text-nordic-muted mt-1 block">
                    {recap.idling_hours}h idle / {recap.total_shift_hours}h shift
                  </span>
                </div>

                <div className="bg-nordic-base p-3.5 rounded-xl border border-nordic-border">
                  <span className="text-nordic-muted text-[10px] uppercase">Energy / Fuel</span>
                  <div className="text-lg font-black text-ice-blue mt-1">
                    {recap.fuel_or_energy_used}
                  </div>
                  <span className="text-[10px] text-frost-green mt-1 block">
                    {recap.eco_savings}
                  </span>
                </div>
              </div>

              {/* Telematic Signature Block */}
              <div className="p-4 rounded-xl bg-nordic-base border border-nordic-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-nordic-muted block">SHA-256 TELEMATIC SIGNATURE HASH</span>
                  <span className="text-ice-blue font-bold text-sm tracking-wider">
                    {recap.verified_hash}
                  </span>
                  <span className="text-nordic-muted block text-[10px]">
                    Validated across Cat Connect CAN bus telemetry
                  </span>
                </div>

                <div>
                  {signedOff ? (
                    <div className="flex items-center gap-1.5 bg-frost-green/20 text-frost-green border border-frost-green/40 px-3 py-1.5 rounded-lg font-bold">
                      <Check className="w-4 h-4" />
                      <span>SHIFT SIGNED OFF</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSignedOff(true)}
                      className="touch-btn bg-ice-blue hover:bg-ice-blue-light text-nordic-base font-black text-xs px-5 py-2 shadow-ice-glow"
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
        <div className="p-4 border-t border-nordic-border bg-nordic-base flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="touch-btn bg-nordic-card hover:bg-nordic-card-hover border border-nordic-border text-xs px-4 py-2 text-nordic-text"
          >
            <Printer className="w-4 h-4" />
            <span>Print Shift Ticket</span>
          </button>
          <button
            onClick={onClose}
            className="touch-btn bg-nordic-card hover:bg-nordic-card-hover border border-nordic-border text-xs px-5 py-2 text-white font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
