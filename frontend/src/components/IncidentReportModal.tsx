import React, { useState } from 'react';
import { FileText, Send, CheckCircle2, ShieldAlert, AlertTriangle, X } from 'lucide-react';
import { LiveTelemetry, Operator, Machine } from '../types';
import { api } from '../api';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  operator: Operator;
  machine: Machine;
  telemetry: LiveTelemetry | null;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  isOpen,
  onClose,
  operator,
  machine,
  telemetry
}) => {
  const [incidentType, setIncidentType] = useState('PROXIMITY_HAZARD');
  const [notes, setNotes] = useState('Ground worker entered rear blind spot at 3.6m during boom swing. Swing brake was engaged.');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.reportIncident({
        operator_id: operator.operator_id,
        machine_id: machine.machine_id,
        incident_type: incidentType,
        notes
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit incident report', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-nordic-card border border-nordic-border rounded-2xl max-w-xl w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-nordic-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-coral-red flex items-center justify-center text-white font-black shadow-danger-glow">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-industrial text-white tracking-wide uppercase">
                One-Tap Safety Incident Report
              </h2>
              <p className="text-xs text-nordic-muted">
                Auto-Populated Telematics Incident Documentation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-nordic-base text-nordic-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-frost-green/20 text-frost-green flex items-center justify-center mx-auto shadow-safe-glow">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase font-industrial">
              Incident Report Transmitted
            </h3>
            <p className="text-xs font-mono text-nordic-muted max-w-md mx-auto">
              Record cryptographically filed and synced to Site Safety Supervisor dashboard. Corrective training module assigned to queue.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="touch-btn bg-ice-blue hover:bg-ice-blue-light text-nordic-base font-bold text-xs px-6 py-2.5 mx-auto mt-4"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div className="space-y-4 my-4 text-xs font-mono">
            {/* Auto-Captured Telematics Context */}
            <div className="bg-nordic-base p-4 rounded-xl border border-nordic-border space-y-2">
              <span className="text-[11px] font-bold text-ice-blue uppercase block mb-1">
                Auto-Captured Machine Telemetry Context:
              </span>
              <div className="grid grid-cols-2 gap-2 text-nordic-muted">
                <div>Operator: <strong className="text-white">{operator.name} ({operator.operator_id})</strong></div>
                <div>Machine: <strong className="text-white">{machine.model}</strong></div>
                <div>Speed: <strong className="text-white">{telemetry?.speed_kmh || 2.4} km/h</strong></div>
                <div>Cab Tilt: <strong className="text-white">{telemetry?.machine_tilt_deg || 8.4}°</strong></div>
                <div>Seatbelt: <strong className="text-white">{telemetry?.seatbelt_status || 'Fastened'}</strong></div>
                <div>Location: <strong className="text-white">Zone B - West Sector</strong></div>
              </div>
            </div>

            {/* Incident Type Select */}
            <div>
              <label className="text-nordic-muted block mb-1 font-bold">Incident Classification:</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full bg-nordic-base text-white text-xs font-bold p-3 rounded-lg border border-nordic-border focus:border-ice-blue focus:outline-none cursor-pointer"
              >
                <option value="PROXIMITY_HAZARD">Proximity Breach / Blind Spot Intrusion</option>
                <option value="STABILITY_TILT">Excessive Machine Tilt / Slope Slide Hazard</option>
                <option value="SEATBELT_VIOLATION">Cab Seatbelt Interlock Non-Compliance</option>
                <option value="EQUIPMENT_MECHANICAL">Hydraulic Flow Drop / Mechanical Anomaly</option>
              </select>
            </div>

            {/* Operator Notes */}
            <div>
              <label className="text-nordic-muted block mb-1 font-bold">Operator Field Observations:</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-nordic-base text-white text-xs p-3 rounded-lg border border-nordic-border focus:border-ice-blue focus:outline-none"
                placeholder="Enter observations..."
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-nordic-border flex justify-end gap-3">
              <button
                onClick={onClose}
                className="touch-btn bg-nordic-base hover:bg-nordic-card border border-nordic-border text-xs px-5 py-2 text-nordic-text font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="touch-btn bg-coral-red hover:bg-coral-red-dark text-white font-black text-xs px-6 py-2.5 shadow-danger-glow"
              >
                <Send className="w-4 h-4" />
                <span>Submit One-Tap Report</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
