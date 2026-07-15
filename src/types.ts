/**
 * Shared type definitions for the FanAssist AI application.
 * Centralizes all data structures used across components and API routes.
 */

/**
 * Represents the structured result from the GenAI incident analysis pipeline.
 * Used by both the Fan SOS interface and CCTV Vision AI monitor.
 */
export interface AnalysisResult {
  /** Short 1-3 word crisis classification (e.g., "Lost Child", "Medical Emergency"). */
  crisisType: string;
  /** Specific stadium location (e.g., "Gate B", "Section 104, Row G"). */
  location: string;
  /** Key identifying details extracted from the report (e.g., "Red shirt, boy"). */
  identifiers: string;
  /** English translation of the original fan message. */
  translatedMessage: string;
  /** Empathetic response in the fan's original language. */
  empatheticResponse?: string;
  /** AI-assessed threat level determining dispatch priority. */
  severity: 'Low' | 'Medium' | 'High' | 'CRITICAL';
  /** Recommended operational unit for dispatch (e.g., "Medical Team Alpha"). */
  dispatchUnit: string;
  /** Specific instructions for the dispatched unit. */
  dispatchInstruction?: string;
  /** Auto-generated English PA announcement script. */
  announcementScriptEn?: string;
  /** Auto-generated Spanish PA announcement script for multilingual assistance. */
  announcementScriptEs?: string;
}
