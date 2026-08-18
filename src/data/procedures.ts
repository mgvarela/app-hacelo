import { ProcessDefinition } from '../types';

export const MVP_PROCEDURES: Record<string, ProcessDefinition> = {
  licencia_conducir: {
    id: 'licencia_conducir',
    category: 'transit',
    title: 'Renovación de Licencia de Conducir',
    subtitle: 'Dirección de Tránsito y Transporte',
    jurisdiction: 'San Martín / Buenos Aires',
    summary: 'Gestión integral de renovación con validación de DNI, examen psicofísico médico y asignación de turno oficial.',
    estimatedTimeMin: 2,
    n8nWorkflowName: 'WF_RESERVA_TURNO_SYNC',
    requirements: [
      {
        id: 'req_dni',
        name: 'DNI Vigente & Libre Deuda',
        description: 'Verificación automática de identidad y antecedentes de tránsito',
        status: 'VALIDATED',
        statusLabel: 'VALIDADO'
      },
      {
        id: 'req_medico',
        name: 'Certificado Médico Psicofísico',
        description: 'Revisión médica obligatoria en centro certificado habilitado',
        status: 'PENDING',
        statusLabel: 'PENDIENTE',
        requiredAction: 'Agendar turno médico en centro cercano',
        actionPayload: {
          type: 'SELECT_SLOT',
          fieldLabel: 'Elegí el horario más conveniente para tu examen médico:',
          options: [
            {
              id: 'slot_1',
              label: 'Martes 18 de Agosto — 09:30 hs',
              sublabel: 'Centro Médico San Martín Centro (A 4 cuadras de la Sede)',
              date: '18/08/2026',
              time: '09:30 hs',
              location: 'Belgrano 3721, San Martín'
            },
            {
              id: 'slot_2',
              label: 'Martes 18 de Agosto — 10:15 hs',
              sublabel: 'Centro de Diagnóstico Integral San Martín',
              date: '18/08/2026',
              time: '10:15 hs',
              location: 'San Lorenzo 2140, San Martín'
            },
            {
              id: 'slot_3',
              label: 'Miércoles 19 de Agosto — 11:00 hs',
              sublabel: 'Policlínica Municipal Villa Ballester',
              date: '19/08/2026',
              time: '11:00 hs',
              location: 'Alvear 1450, Villa Ballester'
            }
          ],
          defaultSelected: 'slot_1'
        }
      },
      {
        id: 'req_tasa',
        name: 'Pago de Tasa Municipal & CENAT',
        description: 'Boleta de pago integrada con código de barras digital',
        status: 'LOCKED',
        statusLabel: 'BLOQUEADO'
      }
    ],
    humanGateMessage: 'Voy a agendar tu examen psicofísico para el Martes 18/08 a las 09:30 hs en San Martín Centro y tramitar tu turno oficial de renovación.',
    finalSuccessTitle: '¡Renovación de Licencia Coordinada con Éxito!',
    finalDetails: [
      { label: 'Trámite', value: 'Renovación Licencia B1 (Particular)' },
      { label: 'Examen Médico', value: 'Martes 18/08 - 09:30 hs (Belgrano 3721)' },
      { label: 'Turno en Sede', value: 'Martes 18/08 - 10:30 hs (Sede Tránsito Central)' },
      { label: 'Código de Trámite', value: '#TRM-84920-SM' },
      { label: 'Sincronización', value: 'Agendado en Google Calendar + WhatsApp enviado' }
    ]
  },

  subsidio_luz: {
    id: 'subsidio_luz',
    category: 'subsidies',
    title: 'Reclamo y Reempadronamiento de Subsidio Eléctrico',
    subtitle: 'Registro de Acceso a los Subsidios a la Energía (RASE / ENRE)',
    jurisdiction: 'Nacional / Conurbano',
    summary: 'Análisis de factura con sobrecargo, cruce con padrón de ingresos y confección automática de expediente de reconsideración.',
    estimatedTimeMin: 2,
    n8nWorkflowName: 'WF_SUBSIDIO_ENRE_DISPATCH',
    requirements: [
      {
        id: 'req_factura',
        name: 'Identificación de Cuenta y Suministro',
        description: 'Número de cliente y punto de suministro detectados',
        status: 'VALIDATED',
        statusLabel: 'VALIDADO'
      },
      {
        id: 'req_declaracion',
        name: 'Declaración Jurada de Ingresos (Nivel 2 / Nivel 3)',
        description: 'Acreditación de ingresos familiares inferiores a la canasta básica',
        status: 'PENDING',
        statusLabel: 'PENDIENTE',
        requiredAction: 'Confirmar rango de ingresos del hogar',
        actionPayload: {
          type: 'SELECT_SLOT',
          fieldLabel: 'Seleccioná la situación socioeconómica de tu hogar:',
          options: [
            {
              id: 'ing_n2',
              label: 'Nivel 2 (Ingresos Menores - Tarifa Social)',
              sublabel: 'Ingresos netos menores a 1 Canasta Básica Total (Recomendado para subsidio máximo)'
            },
            {
              id: 'ing_n3',
              label: 'Nivel 3 (Ingresos Medios)',
              sublabel: 'Ingresos entre 1 y 3.5 Canastas Básicas Totales'
            },
            {
              id: 'ing_discapacidad',
              label: 'Titular con Certificado Único de Discapacidad (CUD)',
              sublabel: 'Bonificación prioritaria con tarifa protegida'
            }
          ],
          defaultSelected: 'ing_n2'
        }
      },
      {
        id: 'req_enre_exp',
        name: 'Presentación Formal ante el ENRE',
        description: 'Generación del expediente oficial digital con firma electrónica',
        status: 'LOCKED',
        statusLabel: 'BLOQUEADO'
      }
    ],
    humanGateMessage: 'HACÉLO armó tu expediente oficial de reclamo con categoría N2 (Tarifa Protegida) para la distribuidora y el ENRE. ¿Deseás presentarlo ahora?',
    finalSuccessTitle: '¡Reclamo y Subsidio Presentado Oficialmente!',
    finalDetails: [
      { label: 'Organismo', value: 'Ente Nacional Regulador de la Electricidad (ENRE)' },
      { label: 'Categoría Asignada', value: 'Nivel 2 - Subsidio Máximo Activo' },
      { label: 'Expediente Oficial', value: '#ENRE-2026-981244-APN' },
      { label: 'Impacto Estimado', value: 'Reducción del 55% en tu próxima factura' },
      { label: 'Notificación', value: 'Enviada confirmación oficial por e-mail y webhook' }
    ]
  },

  escudo_antifraude: {
    id: 'escudo_antifraude',
    category: 'security',
    title: 'Escudo Anti-Estafas & Ciberseguridad Ciudadana',
    subtitle: 'Análisis Forense de Amenazas y Phishing en Tiempo Real',
    jurisdiction: 'Ciberdelincuencia / Bancos / Envíos',
    summary: 'Auditoría heurística con IA de mensajes sospechosos, cruce con bases de dominios maliciosos y plan de contención de 1 clic.',
    estimatedTimeMin: 1,
    n8nWorkflowName: 'WF_CYBER_SHIELD_DEFENSE',
    requirements: [
      {
        id: 'req_threat_scan',
        name: 'Heurística de Urgencia & Manipulación',
        description: 'Patrón de coacción psicológica: "Cuenta suspendida / Pague hoy"',
        status: 'VALIDATED',
        statusLabel: 'DETECTADO (ALTO RIESGO)'
      },
      {
        id: 'req_domain_check',
        name: 'Auditoría de Enlace & Certificado SSL',
        description: 'Dominio no oficial detectado: "correo-envios-pago-urgente.online"',
        status: 'PENDING',
        statusLabel: 'ACCIONES PREVENTIVAS',
        requiredAction: 'Seleccionar medidas de protección inmediata',
        actionPayload: {
          type: 'SELECT_SLOT',
          fieldLabel: 'Elegí las medidas preventivas automáticas a disparar:',
          options: [
            {
              id: 'shield_all',
              label: 'Protección Integral Recomendada',
              sublabel: 'Bloquear remitente + Reportar URL al CERT + Generar texto de aviso familiar'
            },
            {
              id: 'shield_bank',
              label: 'Alerta Bancaria Preventiva',
              sublabel: 'Acceso directo a números de bloqueo de tarjetas 24hs'
            }
          ],
          defaultSelected: 'shield_all'
        }
      },
      {
        id: 'req_report_cert',
        name: 'Notificación a Unidad de Ciberdelitos',
        description: 'Envío de telemetría de la estafa para desmantelar el sitio malicioso',
        status: 'LOCKED',
        statusLabel: 'BLOQUEADO'
      }
    ],
    humanGateMessage: '⚠️ PELIGRO CONFIRMADO (99% Probabilidad de Estafa). HACÉLO bloqueará la amenaza, reportará la URL maliciosa y te protegerá. ¿Ejecutar escudo?',
    finalSuccessTitle: '🛡️ ¡Amenaza Neutralizada y Escudo Activado!',
    finalDetails: [
      { label: 'Veredicto', value: '🚨 ESTAFA / PHISHING CONFIRMADO' },
      { label: 'Acción Ejecutada', value: 'URL reportada a CERT.AR y Google Safe Browsing' },
      { label: 'Protección Dispositivo', value: 'Remitente bloqueado y caché de rastreo aislada' },
      { label: 'Reporte ID', value: '#SEC-SHIELD-44120' },
      { label: 'Recomendación', value: 'No ingresar credenciales ni códigos OTP en ningún enlace.' }
    ]
  }
};

export const QUICK_DEMO_PROMPTS = [
  {
    id: 'licencia',
    icon: 'Car',
    badge: 'Trámite Burocrático',
    title: 'Renovar Registro de Conducir',
    prompt: 'Quiero renovar mi licencia de conducir en San Martín.',
    procedureId: 'licencia_conducir'
  },
  {
    id: 'subsidio',
    icon: 'Zap',
    badge: 'Reclamo Económico',
    title: 'Pedir Subsidio de Luz',
    prompt: 'Me vino el triple de luz en la factura y no puedo pagarla, ¿cómo pido subsidio?',
    procedureId: 'subsidio_luz'
  },
  {
    id: 'estafa',
    icon: 'ShieldAlert',
    badge: 'Seguridad Ciudadana',
    title: 'Analizar Mensaje Sospechoso',
    prompt: 'Me llegó un SMS diciendo que tengo un paquete retenido en el correo y que pague $4.500 urgente en un link.',
    procedureId: 'escudo_antifraude'
  }
];
