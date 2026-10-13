import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { WorkspaceLandingView } from './components/views/WorkspaceLandingView';
import { DashboardView } from './components/views/DashboardView';
import { AdminPanelView } from './components/views/AdminPanelView';
import { CompanyPanelView } from './components/views/CompanyPanelView';
import { WasteLogView } from './components/views/WasteLogView';
import { WasteReportsView } from './components/views/WasteReportsView';
import { EnvironmentalCatalogsView } from './components/views/EnvironmentalCatalogsView';
import { CompaniesView } from './components/views/CompaniesView';
import { EstablishmentsView } from './components/views/EstablishmentsView';
import { PeriodsView } from './components/views/PeriodsView';
import { RuaFichasView } from './components/views/RuaFichasView';
import { DocumentsView } from './components/views/DocumentsView';
import { GuideView } from './components/views/GuideView';
import { SettingsView } from './components/views/SettingsView';

import { 
  NavigationModule, 
  UserRole, 
  Empresa, 
  Establecimiento, 
  PeriodoBalance, 
  DocumentoSoporte, 
  FichaRuaRegistro,
  FichaRuaStatus,
  PeriodStatus,
  RegistroResiduo,
  GestorAmbiental,
  CatalogoResiduo
} from './types';

import { 
  INITIAL_EMPRESAS, 
  INITIAL_ESTABLECIMIENTOS, 
  INITIAL_PERIODOS, 
  INITIAL_DOCUMENTOS, 
  INITIAL_FICHAS_RECORDS,
  INITIAL_RESIDUOS,
  INITIAL_GESTORES,
  INITIAL_CATALOGO_RESIDUOS,
  sanitizeStoredRecords,
  sanitizeFichasMap,
  isDemoEmpresa,
  isDemoEstablecimiento,
  isDemoPeriodo,
  isDemoDocumento,
  isDemoResiduo,
  isDemoGestor,
  isDemoCatalogo
} from './data/mockData';

export const App: React.FC = () => {
  // Navigation & Role State
  const [activeWorkspace, setActiveWorkspace] = useState<'admin' | 'empresa' | null>(() => {
    const saved = localStorage.getItem('nativa_workspace');
    if (saved === 'admin' || saved === 'empresa') {
      return saved;
    }
    return null;
  });

  const [currentModule, setCurrentModule] = useState<NavigationModule>(() => {
    const saved = localStorage.getItem('nativa_workspace');
    return saved === 'empresa' ? 'panel_empresas' : 'panel_admin';
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('nativa_workspace');
    return saved === 'empresa' ? 'empresa' : 'admin';
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedFichaNumero, setSelectedFichaNumero] = useState<number>(1);

  // Entities State with localStorage persistence and safe demo filtering
  const [empresas, setEmpresas] = useState<Empresa[]>(() => {
    return sanitizeStoredRecords(localStorage.getItem('rua_empresas'), isDemoEmpresa, INITIAL_EMPRESAS);
  });

  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>(() => {
    return sanitizeStoredRecords(localStorage.getItem('rua_establecimientos'), isDemoEstablecimiento, INITIAL_ESTABLECIMIENTOS);
  });

  const [periodos, setPeriodos] = useState<PeriodoBalance[]>(() => {
    return sanitizeStoredRecords(localStorage.getItem('rua_periodos'), isDemoPeriodo, INITIAL_PERIODOS);
  });

  const [documentos, setDocumentos] = useState<DocumentoSoporte[]>(() => {
    return sanitizeStoredRecords(localStorage.getItem('rua_documentos'), isDemoDocumento, INITIAL_DOCUMENTOS);
  });

  const [fichasRecordsMap, setFichasRecordsMap] = useState<Record<string, FichaRuaRegistro[]>>(() => {
    return sanitizeFichasMap(localStorage.getItem('rua_fichas_records'));
  });

  // Residuos y Trazabilidad Ambiental (Nativa Ambiental)
  const [residuos, setResiduos] = useState<RegistroResiduo[]>(() => {
    return sanitizeStoredRecords(localStorage.getItem('nativa_residuos'), isDemoResiduo, INITIAL_RESIDUOS);
  });

  const [gestores, setGestores] = useState<GestorAmbiental[]>(() => {
    return sanitizeStoredRecords(localStorage.getItem('nativa_gestores'), isDemoGestor, INITIAL_GESTORES);
  });

  const [catalogos, setCatalogos] = useState<CatalogoResiduo[]>(() => {
    return sanitizeStoredRecords(localStorage.getItem('nativa_catalogos'), isDemoCatalogo, INITIAL_CATALOGO_RESIDUOS);
  });

  // Selected Context
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>(() => {
    return empresas[0]?.id || '';
  });

  const [selectedPeriodoId, setSelectedPeriodoId] = useState<string>(() => {
    return periodos[0]?.id || '';
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('rua_empresas', JSON.stringify(empresas));
  }, [empresas]);

  useEffect(() => {
    localStorage.setItem('rua_establecimientos', JSON.stringify(establecimientos));
  }, [establecimientos]);

  useEffect(() => {
    localStorage.setItem('rua_periodos', JSON.stringify(periodos));
  }, [periodos]);

  useEffect(() => {
    localStorage.setItem('rua_documentos', JSON.stringify(documentos));
  }, [documentos]);

  useEffect(() => {
    localStorage.setItem('rua_fichas_records', JSON.stringify(fichasRecordsMap));
  }, [fichasRecordsMap]);

  useEffect(() => {
    localStorage.setItem('nativa_residuos', JSON.stringify(residuos));
  }, [residuos]);

  useEffect(() => {
    localStorage.setItem('nativa_gestores', JSON.stringify(gestores));
  }, [gestores]);

  useEffect(() => {
    localStorage.setItem('nativa_catalogos', JSON.stringify(catalogos));
  }, [catalogos]);

  // Derived Active Context
  const activePeriodo = periodos.find(p => p.id === selectedPeriodoId) || periodos[0];
  const activeEstablecimiento = establecimientos.find(e => e.id === activePeriodo?.establecimientoId) || establecimientos[0];
  const activeEmpresa = empresas.find(e => e.id === (activeEstablecimiento?.empresaId || selectedEmpresaId)) || empresas[0];

  // Active Fichas for current period
  const activeFichasRecords = fichasRecordsMap[selectedPeriodoId] || [];

  // Workspace Handlers
  const handleEnterWorkspace = (role: 'admin' | 'empresa', empresaId?: string) => {
    setActiveWorkspace(role);
    setUserRole(role);
    localStorage.setItem('nativa_workspace', role);
    if (empresaId) {
      setSelectedEmpresaId(empresaId);
    }
    if (role === 'admin') {
      setCurrentModule('panel_admin');
    } else {
      setCurrentModule('panel_empresas');
    }
  };

  const handleExitToLanding = () => {
    setActiveWorkspace(null);
    localStorage.removeItem('nativa_workspace');
  };

  const handleToggleRole = () => {
    const nextRole: UserRole = userRole === 'admin' ? 'empresa' : 'admin';
    setUserRole(nextRole);
    setActiveWorkspace(nextRole);
    localStorage.setItem('nativa_workspace', nextRole);
    setCurrentModule(nextRole === 'admin' ? 'panel_admin' : 'panel_empresas');
  };

  const handleAddEmpresa = (newEmpresa: Omit<Empresa, 'id'>) => {
    const created: Empresa = {
      ...newEmpresa,
      id: `emp-${Date.now()}`
    };
    setEmpresas(prev => [...prev, created]);
    setSelectedEmpresaId(created.id);
  };

  const handleUpdateEmpresa = (updated: Empresa) => {
    setEmpresas(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const handleAddEstablecimiento = (newEst: Omit<Establecimiento, 'id'>) => {
    const created: Establecimiento = {
      ...newEst,
      id: `est-${Date.now()}`
    };
    setEstablecimientos(prev => [...prev, created]);
  };

  const handleUpdateEstablecimiento = (updated: Establecimiento) => {
    setEstablecimientos(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const handleAddPeriodo = (newPer: Omit<PeriodoBalance, 'id'>) => {
    const created: PeriodoBalance = {
      ...newPer,
      id: `per-${Date.now()}`,
      progresoPorcentaje: 0,
      totalFichasCompletadas: 0,
      ultimaModificacion: new Date().toISOString().split('T')[0]
    };
    setPeriodos(prev => [created, ...prev]);
    setSelectedPeriodoId(created.id);

    // Initial empty list of chapters for this period
    setFichasRecordsMap(prev => ({
      ...prev,
      [created.id]: []
    }));
  };

  const handleAddChapter = () => {
    if (!selectedPeriodoId) return;
    const currentList = fichasRecordsMap[selectedPeriodoId] || [];
    const nextNum = currentList.length + 1;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newRecord: FichaRuaRegistro = {
      id: `frec-${selectedPeriodoId}-${Date.now()}`,
      periodoId: selectedPeriodoId,
      fichaNumero: nextNum,
      estado: 'sin_iniciar',
      ultimaActualizacion: nowStr,
      responsableDiligenciamiento: '',
      observacionesTecnicas: '',
      datos: {
        titulo: `Capítulo ${nextNum} - Registro de Variables`
      },
      documentosIds: []
    };
    const updated = [...currentList, newRecord];
    setFichasRecordsMap(prev => ({
      ...prev,
      [selectedPeriodoId]: updated
    }));
  };

  const handleUpdatePeriodoStatus = (periodoId: string, newStatus: PeriodStatus) => {
    setPeriodos(prev => prev.map(p => {
      if (p.id === periodoId) {
        return {
          ...p,
          estado: newStatus,
          ultimaModificacion: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));
  };

  const handleSaveFicha = (
    fichaNumero: number,
    nuevoEstado: FichaRuaStatus,
    responsable: string,
    observaciones: string,
    datos: Record<string, any>
  ) => {
    const currentList = fichasRecordsMap[selectedPeriodoId] || [];
    let updatedList = [...currentList];

    const existingIndex = updatedList.findIndex(r => r.fichaNumero === fichaNumero);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (existingIndex >= 0) {
      updatedList[existingIndex] = {
        ...updatedList[existingIndex],
        estado: nuevoEstado,
        responsableDiligenciamiento: responsable,
        observacionesTecnicas: observaciones,
        datos,
        ultimaActualizacion: nowStr
      };
    } else {
      updatedList.push({
        id: `frec-${selectedPeriodoId}-${fichaNumero}`,
        periodoId: selectedPeriodoId,
        fichaNumero,
        estado: nuevoEstado,
        responsableDiligenciamiento: responsable,
        observacionesTecnicas: observaciones,
        datos,
        documentosIds: [],
        ultimaActualizacion: nowStr
      });
    }

    // Recalculate completion metrics strictly from real existing records
    const completedCount = updatedList.filter(f => f.estado === 'completada').length;
    const totalCount = updatedList.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    setFichasRecordsMap(prev => ({
      ...prev,
      [selectedPeriodoId]: updatedList
    }));

    setPeriodos(prev => prev.map(p => {
      if (p.id === selectedPeriodoId) {
        return {
          ...p,
          progresoPorcentaje: progressPercent,
          totalFichasCompletadas: completedCount,
          ultimaModificacion: nowStr
        };
      }
      return p;
    }));
  };

  const handleAddDocument = (newDoc: Omit<DocumentoSoporte, 'id'>) => {
    const created: DocumentoSoporte = {
      ...newDoc,
      id: `doc-${Date.now()}`
    };
    setDocumentos(prev => [created, ...prev]);
  };

  const handleUpdateDocumentStatus = (
    docId: string, 
    status: 'Pendiente de revisión' | 'Aprobado' | 'Requiere subsanación'
  ) => {
    setDocumentos(prev => prev.map(d => d.id === docId ? { ...d, estadoValidacion: status } : d));
  };

  // Handlers para Residuos
  const handleAddResiduo = (newRes: Omit<RegistroResiduo, 'id' | 'fechaCreacion'>) => {
    const created: RegistroResiduo = {
      ...newRes,
      id: `res-${Date.now()}`,
      fechaCreacion: new Date().toISOString()
    };
    setResiduos(prev => [created, ...prev]);
  };

  const handleUpdateResiduo = (updated: RegistroResiduo) => {
    setResiduos(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const handleDeleteResiduo = (id: string) => {
    setResiduos(prev => prev.filter(r => r.id !== id));
  };

  // Handlers para Gestores
  const handleAddGestor = (newG: Omit<GestorAmbiental, 'id'>) => {
    const created: GestorAmbiental = {
      ...newG,
      id: `ges-${Date.now()}`
    };
    setGestores(prev => [...prev, created]);
  };

  const handleUpdateGestor = (updated: GestorAmbiental) => {
    setGestores(prev => prev.map(g => g.id === updated.id ? updated : g));
  };

  const handleDeleteGestor = (id: string) => {
    setGestores(prev => prev.filter(g => g.id !== id));
  };

  // Handlers para Catálogo
  const handleAddCatalogo = (newCat: Omit<CatalogoResiduo, 'id'>) => {
    const created: CatalogoResiduo = {
      ...newCat,
      id: `cat-${Date.now()}`
    };
    setCatalogos(prev => [...prev, created]);
  };

  const handleUpdateCatalogo = (updated: CatalogoResiduo) => {
    setCatalogos(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleDeleteCatalogo = (id: string) => {
    setCatalogos(prev => prev.filter(c => c.id !== id));
  };

  const handleNavigateToFichas = (fichaNumero?: number) => {
    if (fichaNumero) {
      setSelectedFichaNumero(fichaNumero);
    }
    setCurrentModule('fichas');
  };

  const handleResetData = () => {
    if (window.confirm('¿Desea restablecer todos los registros locales de trabajo a su estado inicial?')) {
      setEmpresas(INITIAL_EMPRESAS);
      setEstablecimientos(INITIAL_ESTABLECIMIENTOS);
      setPeriodos(INITIAL_PERIODOS);
      setDocumentos(INITIAL_DOCUMENTOS);
      setFichasRecordsMap(INITIAL_FICHAS_RECORDS);
      setResiduos(INITIAL_RESIDUOS);
      setGestores(INITIAL_GESTORES);
      setCatalogos(INITIAL_CATALOGO_RESIDUOS);
      setSelectedEmpresaId('');
      setSelectedPeriodoId('');
      localStorage.removeItem('rua_empresas');
      localStorage.removeItem('rua_establecimientos');
      localStorage.removeItem('rua_periodos');
      localStorage.removeItem('rua_documentos');
      localStorage.removeItem('rua_fichas_records');
      localStorage.removeItem('nativa_residuos');
      localStorage.removeItem('nativa_gestores');
      localStorage.removeItem('nativa_catalogos');
      localStorage.removeItem('nativa_workspace');
      setActiveWorkspace(null);
    }
  };

  if (!activeWorkspace) {
    return (
      <WorkspaceLandingView
        empresas={empresas}
        establecimientos={establecimientos}
        periodos={periodos}
        documentos={documentos}
        residuos={residuos}
        selectedEmpresaId={selectedEmpresaId}
        onSelectEmpresaId={setSelectedEmpresaId}
        onEnterWorkspace={handleEnterWorkspace}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        userRole={userRole}
        onToggleRole={handleToggleRole}
        selectedEmpresa={activeEmpresa}
        selectedPeriodo={activePeriodo}
        selectedEstablecimiento={activeEstablecimiento}
        isOpenMobile={isMobileMenuOpen}
        onToggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onExitToLanding={handleExitToLanding}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <Header
          currentModule={currentModule}
          userRole={userRole}
          empresas={empresas}
          periodos={periodos}
          establecimientos={establecimientos}
          selectedEmpresaId={selectedEmpresaId}
          selectedPeriodoId={selectedPeriodoId}
          onSelectEmpresaId={setSelectedEmpresaId}
          onSelectPeriodoId={setSelectedPeriodoId}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onExitToLanding={handleExitToLanding}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentModule === 'dashboard' && (
            <DashboardView
              userRole={userRole}
              empresas={empresas}
              establecimientos={establecimientos}
              periodos={periodos}
              activePeriodo={activePeriodo}
              activeEstablecimiento={activeEstablecimiento}
              activeEmpresa={activeEmpresa}
              documentos={documentos}
              fichasRecords={activeFichasRecords}
              residuos={residuos}
              gestores={gestores}
              onNavigateToFichas={handleNavigateToFichas}
              onNavigateToModule={setCurrentModule}
            />
          )}

          {currentModule === 'panel_admin' && (
            <AdminPanelView
              empresas={empresas}
              establecimientos={establecimientos}
              periodos={periodos}
              documentos={documentos}
              residuos={residuos}
              gestores={gestores}
              onSelectEmpresaId={setSelectedEmpresaId}
              onSelectPeriodoId={setSelectedPeriodoId}
              onNavigateToModule={setCurrentModule}
              onUpdateDocumentStatus={handleUpdateDocumentStatus}
              onUpdateResiduo={handleUpdateResiduo}
            />
          )}

          {currentModule === 'panel_empresas' && (
            <CompanyPanelView
              activeEmpresa={activeEmpresa}
              establecimientos={establecimientos}
              periodos={periodos}
              documentos={documentos}
              residuos={residuos}
              gestores={gestores}
              onNavigateToModule={setCurrentModule}
              onSelectPeriodoId={setSelectedPeriodoId}
            />
          )}

          {currentModule === 'bitacora_residuos' && (
            <WasteLogView
              userRole={userRole}
              residuos={residuos}
              gestores={gestores}
              catalogoResiduos={catalogos}
              establecimientos={establecimientos}
              activeEmpresa={activeEmpresa}
              activeEstablecimiento={activeEstablecimiento}
              documentos={documentos}
              onAddResiduo={handleAddResiduo}
              onUpdateResiduo={handleUpdateResiduo}
              onDeleteResiduo={handleDeleteResiduo}
              onNavigateToDocumentos={() => setCurrentModule('documentos')}
            />
          )}

          {currentModule === 'informes' && (
            <WasteReportsView
              userRole={userRole}
              residuos={residuos}
              gestores={gestores}
              establecimientos={establecimientos}
              activeEmpresa={activeEmpresa}
              activePeriodo={activePeriodo}
              documentos={documentos}
              onNavigateToModule={setCurrentModule}
            />
          )}

          {currentModule === 'gestores_catalogos' && (
            <EnvironmentalCatalogsView
              userRole={userRole}
              gestores={gestores}
              catalogos={catalogos}
              onAddGestor={handleAddGestor}
              onUpdateGestor={handleUpdateGestor}
              onDeleteGestor={handleDeleteGestor}
              onAddCatalogo={handleAddCatalogo}
              onUpdateCatalogo={handleUpdateCatalogo}
              onDeleteCatalogo={handleDeleteCatalogo}
            />
          )}

          {currentModule === 'empresas' && (
            <CompaniesView
              userRole={userRole}
              empresas={empresas}
              onAddEmpresa={handleAddEmpresa}
              onUpdateEmpresa={handleUpdateEmpresa}
              selectedEmpresaId={selectedEmpresaId}
              onSelectEmpresaId={setSelectedEmpresaId}
            />
          )}

          {currentModule === 'establecimientos' && (
            <EstablishmentsView
              userRole={userRole}
              establecimientos={establecimientos}
              empresas={empresas}
              selectedEmpresaId={selectedEmpresaId}
              onAddEstablecimiento={handleAddEstablecimiento}
              onUpdateEstablecimiento={handleUpdateEstablecimiento}
            />
          )}

          {currentModule === 'periodos' && (
            <PeriodsView
              userRole={userRole}
              periodos={periodos}
              establecimientos={establecimientos}
              empresas={empresas}
              selectedPeriodoId={selectedPeriodoId}
              onSelectPeriodoId={setSelectedPeriodoId}
              onAddPeriodo={handleAddPeriodo}
              onUpdatePeriodoStatus={handleUpdatePeriodoStatus}
              onNavigateToFichas={() => setCurrentModule('fichas')}
            />
          )}

          {currentModule === 'fichas' && (
            <RuaFichasView
              activePeriodo={activePeriodo}
              activeEstablecimiento={activeEstablecimiento}
              activeEmpresa={activeEmpresa}
              fichasRecords={activeFichasRecords}
              documentos={documentos}
              selectedFichaNumero={selectedFichaNumero}
              onSaveFicha={handleSaveFicha}
              onAddChapter={handleAddChapter}
              onAddDocument={handleAddDocument}
            />
          )}

          {currentModule === 'documentos' && (
            <DocumentsView
              userRole={userRole}
              documentos={documentos}
              activePeriodo={activePeriodo}
              activeEstablecimiento={activeEstablecimiento}
              activeEmpresa={activeEmpresa}
              onAddDocument={handleAddDocument}
              onUpdateDocumentStatus={handleUpdateDocumentStatus}
            />
          )}

          {currentModule === 'guia' && (
            <GuideView />
          )}

          {currentModule === 'configuracion' && (
            <SettingsView
              empresas={empresas}
              establecimientos={establecimientos}
              periodos={periodos}
              documentos={documentos}
              fichasRecords={fichasRecordsMap}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
