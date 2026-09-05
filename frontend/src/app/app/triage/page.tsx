"use client";

import { useState, type FormEvent } from "react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import TriageCard from "@/components/triage/TriageCard";
import RedFlagAlert from "@/components/triage/RedFlagAlert";
import { mockAssessTriage } from "@/services/mockTriageService";
import type { MedicalState, TriageResult } from "@/lib/types";

const COMMON_SYMPTOMS = ["Fever", "Headache", "Cough", "Vomiting", "Diarrhea", "Fatigue / Weakness"];
const RED_FLAG_SYMPTOMS = [
  "Severe chest pain",
  "Severe difficulty breathing",
  "Loss of consciousness",
  "Severe bleeding",
  "Seizure",
];

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function TriagePage() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [redFlagSymptoms, setRedFlagSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("Mild");
  const [temperature, setTemperature] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [triage, setTriage] = useState<TriageResult | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsChecking(true);

    const state: MedicalState = {
      symptoms,
      duration,
      severity,
      temperature,
      additional_symptoms: redFlagSymptoms,
      red_flags: [],
      language_mix: ["English"],
      intent: "describe_symptoms",
      user_age: null,
      relevant_context: redFlagSymptoms.join(", "),
    };

    const result = await mockAssessTriage(state);
    setTriage(result);
    setIsChecking(false);
  };

  const handleReset = () => {
    setSymptoms([]);
    setRedFlagSymptoms([]);
    setDuration("");
    setSeverity("Mild");
    setTemperature("");
    setTriage(null);
  };

  return (
    <Container className="max-w-2xl py-10">
      <h1 className="text-xl font-semibold tracking-tight">Symptom Triage</h1>
      <p className="mt-1 text-sm text-muted-500">
        Select what you&rsquo;re experiencing to get a quick sense of how urgently you may need
        professional care.
      </p>

      {!triage ? (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Symptoms</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {COMMON_SYMPTOMS.map((symptom) => (
                <label
                  key={symptom}
                  className="flex items-center gap-2 rounded-xl border border-muted-200 bg-white px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={symptoms.includes(symptom)}
                    onChange={() => setSymptoms((prev) => toggle(prev, symptom))}
                    className="h-4 w-4 rounded border-muted-200 text-primary-600 focus:ring-primary-100"
                  />
                  {symptom}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">
              Any of these? <span className="font-normal text-muted-500">(select all that apply)</span>
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {RED_FLAG_SYMPTOMS.map((symptom) => (
                <label
                  key={symptom}
                  className="flex items-center gap-2 rounded-xl border border-muted-200 bg-white px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={redFlagSymptoms.includes(symptom)}
                    onChange={() => setRedFlagSymptoms((prev) => toggle(prev, symptom))}
                    className="h-4 w-4 rounded border-muted-200 text-primary-600 focus:ring-primary-100"
                  />
                  {symptom}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="duration" className="mb-1.5 block text-sm font-medium">
                Duration
              </label>
              <input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 2 days"
                className="w-full rounded-xl border border-muted-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label htmlFor="severity" className="mb-1.5 block text-sm font-medium">
                Severity
              </label>
              <select
                id="severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full rounded-xl border border-muted-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              >
                <option>Mild</option>
                <option>Moderate</option>
                <option>Severe</option>
              </select>
            </div>
            <div>
              <label htmlFor="temperature" className="mb-1.5 block text-sm font-medium">
                Temperature <span className="font-normal text-muted-500">(optional)</span>
              </label>
              <input
                id="temperature"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="e.g. 38.5°C"
                className="w-full rounded-xl border border-muted-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <Button type="submit" disabled={isChecking || symptoms.length + redFlagSymptoms.length === 0}>
            {isChecking ? "Checking…" : "Check symptoms"}
          </Button>
        </form>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-4">
          {triage.recommend_emergency_care && <RedFlagAlert message={triage.message} />}
          <TriageCard triage={triage} />
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-medium text-primary-700 hover:text-primary-900"
          >
            Check different symptoms
          </button>
        </div>
      )}
    </Container>
  );
}
