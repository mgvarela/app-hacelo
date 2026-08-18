import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SimulatorDevice } from './components/SimulatorDevice';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { MVP_PROCEDURES } from './data/procedures';
import {
  ProcessDefinition,
  ProcessStatus,
  AutomationExecutionResult,
} from './types';

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

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        highContrast ? 'bg-black text-white' : 'bg-slate-100/70 text-slate-900'
      }`}
    >
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-3.5 sm:px-6 md:px-8 py-5 sm:py-8 md:py-12 flex flex-col items-center justify-center">
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
        className={`w-full py-4 sm:py-5 text-center text-xs sm:text-sm font-medium border-t px-4 ${
          highContrast
            ? 'bg-neutral-950 text-neutral-300 border-neutral-800'
            : 'bg-white text-slate-600 border-slate-200'
        }`}
      >
        <p>HACÉLO • Asistente de Trámites Accesible según Pautas WCAG (AA/AAA)</p>
      </footer>
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
