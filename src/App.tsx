import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SimulatorDevice } from './components/SimulatorDevice';
import { HistoryModal } from './components/HistoryModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { MVP_PROCEDURES } from './data/procedures';
import {
  ProcessDefinition,
  ProcessStatus,
  AutomationExecutionResult,
  UserProfile,
  HistoryItem,
} from './types';

// Pre-registered user profile for demonstration
const INITIAL_DEMO_USER: UserProfile = {
  name: 'María Elena Rossi',
  dni: '14.289.412',
  cuil: '27-14289412-4',
  email: 'maria.elena.rossi@gmail.com',
  phone: '+54 11 4892-1100',
  address: 'Av. Libertador 4200, San Martín, Bs. As.',
  isVerified: true,
};

const INITIAL_HISTORY_ITEMS: HistoryItem[] = [
  {
    id: 'hist-1',
    procedureKey: 'licencia_conducir',
    procedureTitle: 'Renovación de Licencia de Conducir B1',
    jurisdiction: 'Municipalidad de Gral. San Martín',
    date: '18 Ago 2026, 11:20 hs',
    status: 'COMPLETED',
    referenceCode: '#TRM-74921-SM',
    iconType: 'car',
    description: 'Turno psicofísico agendado para el 25/08/2026 (Sede San Martín Centro).',
    hasAppointment: true,
  },
  {
    id: 'hist-2',
    procedureKey: 'subsidio_luz',
    procedureTitle: 'Inscripción Subsidio Eléctrico y Gas (RASE)',
    jurisdiction: 'Secretaría de Energía / ENRE',
    date: '12 Ago 2026, 09:45 hs',
    status: 'IN_PROGRESS',
    referenceCode: '#ENRE-2026-88120',
    iconType: 'lightbulb',
    description: 'En revisión de ingresos declarados con ANSES y AFIP. Nivel 2 confirmado provisoriamente.',
    hasAppointment: false,
  },
  {
    id: 'hist-3',
    procedureKey: 'escudo_antifraude',
    procedureTitle: 'Verificación de SMS y Correo Sospechoso',
    jurisdiction: 'Defensa del Consumidor / Escudo Digital',
    date: '05 Ago 2026, 16:10 hs',
    status: 'COMPLETED',
    referenceCode: '#ESCUDO-39401',
    iconType: 'shield',
    description: 'Sitio clon falso de Correo bloqueado y remitente reportado al CERT.',
    hasAppointment: false,
  },
];

function AppContent() {
  const { highContrast } = useAccessibility();
  const [currentPrompt, setCurrentPrompt] = useState<string>(
    'Quiero renovar mi licencia de conducir en San Martín'
  );
  const [activeProcedure, setActiveProcedure] = useState<ProcessDefinition>(
    MVP_PROCEDURES.licencia_conducir
  );
  const [processStatus, setProcessStatus] = useState<ProcessStatus>('PLAN_READY');
  const [userExplanation, setUserExplanation] = useState<string>(
    'Encontré el trámite de renovación de registro en San Martín. Ya validé tu DNI, solo tenés que elegir el turno del examen psicofísico.'
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<AutomationExecutionResult | null>(null);

  // User and History Modal States
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(true); // Pre-registered for demo
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_DEMO_USER);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(INITIAL_HISTORY_ITEMS);

  const handleSubmitPrompt = useCallback(
    async (promptToUse?: string) => {
      const text = promptToUse || currentPrompt;
      if (!text.trim()) return;

      setIsProcessing(true);
      setExecutionResult(null);

      try {
        const res = await fetch('/api/agent/intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userPrompt: text }),
        });

        if (res.ok) {
          const data = await res.json();
          const targetProcedure =
            MVP_PROCEDURES[data.matchedProcedureId] || MVP_PROCEDURES.licencia_conducir;

          setActiveProcedure(targetProcedure);
          setUserExplanation(data.userExplanation);
          setProcessStatus('PLAN_READY');
        } else {
          throw new Error('API fallback triggered');
        }
      } catch {
        const lower = text.toLowerCase();
        let targetKey = 'licencia_conducir';
        if (
          lower.includes('luz') ||
          lower.includes('subsidio') ||
          lower.includes('factura') ||
          lower.includes('caro')
        ) {
          targetKey = 'subsidio_luz';
        } else if (
          lower.includes('estafa') ||
          lower.includes('sospech') ||
          lower.includes('sms') ||
          lower.includes('pague') ||
          lower.includes('paquete')
        ) {
          targetKey = 'escudo_antifraude';
        }

        const fallbackProcedure = MVP_PROCEDURES[targetKey];
        setActiveProcedure(fallbackProcedure);
        setProcessStatus('PLAN_READY');
      } finally {
        setIsProcessing(false);
      }
    },
    [currentPrompt]
  );

  const handleExecuteAutomation = async (selectedOption?: any) => {
    setProcessStatus('EXECUTING_AUTOMATION');

    try {
      const res = await fetch('/api/agent/execute-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procedureId: activeProcedure.id,
          selectedOption,
          payload: { prompt: currentPrompt },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setExecutionResult(data);
        setProcessStatus('COMPLETED');
        return;
      }
    } catch {
      // fallback
    }

    const randomRef = Math.floor(10000 + Math.random() * 90000);
    const mockRef =
      activeProcedure.id === 'subsidio_luz'
        ? `#ENRE-2026-${randomRef}`
        : activeProcedure.id === 'escudo_antifraude'
        ? `#ESCUDO-${randomRef}`
        : `#TRM-${randomRef}-SM`;

    const fallbackResult: AutomationExecutionResult = {
      success: true,
      referenceCode: mockRef,
      workflowId: activeProcedure.n8nWorkflowName,
      executionTimestamp: new Date().toISOString(),
      targetService: activeProcedure.jurisdiction,
      notifiedVia: ['Sincronización de Calendario', 'WhatsApp'],
      googleCalendarEventAdded: true,
      executionTimeMs: 380,
      summary: activeProcedure.finalSuccessTitle,
      details: activeProcedure.finalDetails.reduce((acc, item) => {
        acc[item.label] = item.value;
        return acc;
      }, {} as Record<string, string>),
    };

    // Add to history
    const newHistoryEntry: HistoryItem = {
      id: `hist-${Date.now()}`,
      procedureKey: activeProcedure.id,
      procedureTitle: activeProcedure.title,
      jurisdiction: activeProcedure.jurisdiction,
      date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'COMPLETED',
      referenceCode: mockRef,
      iconType: activeProcedure.id === 'licencia_conducir' ? 'car' : activeProcedure.id === 'subsidio_luz' ? 'lightbulb' : 'shield',
      description: `${activeProcedure.finalSuccessTitle}. Registrado con éxito.`,
      hasAppointment: activeProcedure.id === 'licencia_conducir',
    };

    setHistoryItems((prev) => [newHistoryEntry, ...prev]);
    setExecutionResult(fallbackResult);
    setProcessStatus('COMPLETED');
  };

  const handleReset = () => {
    setCurrentPrompt('Quiero renovar mi licencia de conducir en San Martín');
    setActiveProcedure(MVP_PROCEDURES.licencia_conducir);
    setProcessStatus('PLAN_READY');
    setExecutionResult(null);
    setUserExplanation(
      'Encontré el trámite de renovación de registro en San Martín. Ya validé tu DNI, solo tenés que elegir el turno del examen psicofísico.'
    );
  };

  const handleSelectFromHistory = (procedureKey: string, promptText: string) => {
    const procedure = MVP_PROCEDURES[procedureKey] || MVP_PROCEDURES.licencia_conducir;
    setActiveProcedure(procedure);
    setCurrentPrompt(promptText);
    setProcessStatus('PLAN_READY');
    setExecutionResult(null);
    setUserExplanation(procedure.summary);
  };

  const handleCancelAppointment = (itemId: string) => {
    setHistoryItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: 'CANCELLED',
              description: 'Turno cancelado a pedido del usuario. Se liberó la reserva en el municipio.',
              hasAppointment: false,
            }
          : item
      )
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        highContrast ? 'bg-black text-white' : 'bg-slate-100/70 text-slate-900'
      }`}
    >
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        isRegistered={isRegistered}
        user={userProfile}
        historyCount={historyItems.length}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-3.5 sm:px-6 md:px-8 py-4 sm:py-7 md:py-10 flex flex-col items-center justify-center">
        <SimulatorDevice
          currentPrompt={currentPrompt}
          onPromptChange={setCurrentPrompt}
          onSubmitPrompt={handleSubmitPrompt}
          activeProcedure={activeProcedure}
          processStatus={processStatus}
          userExplanation={userExplanation}
          isProcessing={isProcessing}
          onExecuteAutomation={handleExecuteAutomation}
          onReset={handleReset}
          executionResult={executionResult}
        />
      </main>

      <footer
        className={`w-full py-3.5 sm:py-4 text-center text-xs sm:text-sm font-medium border-t px-4 ${
          highContrast
            ? 'bg-neutral-950 text-orange-200 border-neutral-800'
            : 'bg-white text-slate-600 border-slate-200'
        }`}
      >
        <p>HACÉLO • Asistente de Trámites Accesible según Pautas WCAG (AA/AAA)</p>
      </footer>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectProcedure={handleSelectFromHistory}
        historyItems={historyItems}
        onCancelAppointment={handleCancelAppointment}
      />

      {/* User Profile / Registration Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={userProfile}
        isRegistered={isRegistered}
        onToggleRegistration={() => setIsRegistered(!isRegistered)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
}
