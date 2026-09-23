import React, { useState } from 'react';
import { User, Truck, Zap, Fuel, Shield, Check, X } from 'lucide-react';
import { Operator, Machine } from '../types';

interface OperatorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  operators: Operator[];
  machines: Machine[];
  activeOperator: Operator;
  activeMachine: Machine;
  onConfirm: (op: Operator, mach: Machine) => void;
}

export const OperatorLoginModal: React.FC<OperatorLoginModalProps> = ({
  isOpen,
  onClose,
  operators,
  machines,
  activeOperator,
  activeMachine,
  onConfirm
}) => {
  const [selectedOpId, setSelectedOpId] = useState(activeOperator.operator_id);
  const [selectedMachineId, setSelectedMachineId] = useState(activeMachine.machine_id);

  if (!isOpen) return null;

  const handleSave = () => {
    const op = operators.find((o) => o.operator_id === selectedOpId) || activeOperator;
    const mach = machines.find((m) => m.machine_id === selectedMachineId) || activeMachine;
    onConfirm(op, mach);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-nordic-card border border-nordic-border rounded-2xl max-w-xl w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-nordic-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ice-blue flex items-center justify-center text-nordic-base font-black">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-industrial text-white tracking-wide uppercase">
                Operator & Equipment Setup
              </h2>
              <p className="text-xs text-nordic-muted">
                Rugged In-Cab Tablet Initialization
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-nordic-base text-nordic-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 my-5">
          {/* Operator Selection */}
          <div className="bg-nordic-base p-4 rounded-xl border border-nordic-border">
            <label className="text-xs font-mono text-ice-blue uppercase block mb-2 font-bold">
              1. Select Operator Profile
            </label>
            <select
              value={selectedOpId}
              onChange={(e) => setSelectedOpId(e.target.value)}
              className="w-full bg-nordic-card text-white text-sm font-bold p-3 rounded-lg border border-nordic-border focus:border-ice-blue focus:outline-none cursor-pointer"
            >
              {operators.map((op) => (
                <option key={op.operator_id} value={op.operator_id}>
                  {op.operator_id} — {op.name} ({op.role} • {op.skill_level} • {op.experience_hours} hrs)
                </option>
              ))}
            </select>
          </div>

          {/* Machine Selection */}
          <div className="bg-nordic-base p-4 rounded-xl border border-nordic-border">
            <label className="text-xs font-mono text-ice-blue uppercase block mb-2 font-bold">
              2. Select Heavy Machinery & Power Source
            </label>
            <select
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              className="w-full bg-nordic-card text-white text-sm font-bold p-3 rounded-lg border border-nordic-border focus:border-ice-blue focus:outline-none cursor-pointer"
            >
              {machines.map((m) => (
                <option key={m.machine_id} value={m.machine_id}>
                  {m.machine_id} — {m.model} ({m.machine_type} • {m.power_type} • {m.operating_hours} hrs)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-nordic-border flex justify-end gap-3">
          <button
            onClick={onClose}
            className="touch-btn bg-nordic-base hover:bg-nordic-card border border-nordic-border text-xs px-5 py-2.5 text-nordic-text font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="touch-btn bg-ice-blue hover:bg-ice-blue-light text-nordic-base font-black text-xs px-6 py-2.5 shadow-ice-glow"
          >
            <Check className="w-4 h-4" />
            <span>Confirm & Launch In-Cab Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
