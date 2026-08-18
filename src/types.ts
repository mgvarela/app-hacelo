export type ProcessStatus = 
  | 'IDLE' 
  | 'ANALYZING' 
  | 'PLAN_READY' 
  | 'INTERACTION_REQUIRED' 
  | 'AWAITING_CONFIRMATION' 
  | 'EXECUTING_AUTOMATION' 
  | 'COMPLETED' 
  | 'ERROR';

export type RequirementStatus = 'VALIDATED' | 'PENDING' | 'LOCKED' | 'NOT_APPLICABLE';

export interface ProcessRequirement {
  id: string;
  name: string;
  description: string;
  status: RequirementStatus;
  statusLabel: string;
  requiredAction?: string;
  actionPayload?: {
    type: 'SELECT_SLOT' | 'UPLOAD_DOC' | 'FILL_FORM' | 'CONFIRM_IDENTITY' | 'VIEW_REPORT';
    options?: Array<{ id: string; label: string; sublabel?: string; date?: string; time?: string; location?: string }>;
    defaultSelected?: string;
    fieldLabel?: string;
  };
}

export interface ProcessDefinition {
  id: string;
  category: 'transit' | 'subsidies' | 'security' | 'custom';
  title: string;
  subtitle: string;
  jurisdiction: string;
  summary: string;
  estimatedTimeMin: number;
  n8nWorkflowName: string;
  requirements: ProcessRequirement[];
  humanGateMessage: string;
  finalSuccessTitle: string;
  finalDetails: {
    label: string;
    value: string;
  }[];
}

export interface AgentTelemetryEvent {
  id: string;
  timestamp: string;
  stepNumber: number;
  type: 'INTENT' | 'ENTITY' | 'WORKFLOW' | 'HUMAN_GATE' | 'COMPLETED' | 'SECURITY_SCAN';
  title: string;
  detail: string;
  status: 'pending' | 'success' | 'warning' | 'active';
  codeSnippet?: string;
}

export interface ExtractedEntities {
  localidad?: string;
  dni?: string;
  tipoTramite?: string;
  empresaServicio?: string;
  numCliente?: string;
  montoOReclamo?: string;
  mensajeSospechoso?: string;
  remitenteSospechoso?: string;
  [key: string]: string | undefined;
}

export interface AgentIntentResponse {
  intentId: string;
  confidence: number;
  matchedProcedureId: string;
  intentTitle: string;
  extractedEntities: ExtractedEntities;
  userExplanation: string;
  missingDataPrompt?: string;
  missingDataField?: string;
  requirementsPlan: ProcessRequirement[];
  suggestedAction?: {
    label: string;
    actionType: 'RESOLVE_REQUIREMENT' | 'TRIGGER_CONFIRMATION' | 'CUSTOM_INPUT';
    requirementId?: string;
  };
  telemetryLogs: AgentTelemetryEvent[];
}

export interface AutomationExecutionResult {
  success: boolean;
  referenceCode: string;
  workflowId: string;
  executionTimestamp: string;
  targetService: string;
  notifiedVia: string[];
  pdfReceiptUrl?: string;
  googleCalendarEventAdded: boolean;
  executionTimeMs: number;
  summary: string;
  details: Record<string, string>;
}

export interface UserProfile {
  name: string;
  dni: string;
  cuil: string;
  email: string;
  phone: string;
  address: string;
  isVerified: boolean;
}

export interface HistoryItem {
  id: string;
  procedureKey: string;
  procedureTitle: string;
  jurisdiction: string;
  date: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'CANCELLED';
  referenceCode: string;
  iconType: 'car' | 'lightbulb' | 'shield' | 'other';
  description: string;
  hasAppointment?: boolean;
}
