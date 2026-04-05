import React, { useState, useEffect, useMemo, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Users, 
  UserPlus, 
  Search, 
  FileText, 
  Trash2, 
  Edit, 
  Printer, 
  ChevronRight, 
  LayoutDashboard, 
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Plus,
  X,
  Save,
  BarChart3,
  PieChart as PieChartIcon,
  Settings,
  User as UserIcon,
  Shield,
  Lock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { 
  Employee, 
  DiscAssessment, 
  ProfileFactor, 
  DiscQuestion
} from './types';
import { 
  DISC_QUESTIONS as DEFAULT_QUESTIONS, 
  PROFILE_DESCRIPTIONS 
} from './constants';

const STORAGE_KEY = 'disc_dashboard_employees';
const QUESTIONS_KEY = 'disc_dashboard_questions';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [questions, setQuestions] = useState<DiscQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isManagingQuestions, setIsManagingQuestions] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedEmployees = localStorage.getItem(STORAGE_KEY);
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
    
    const savedQuestions = localStorage.getItem(QUESTIONS_KEY);
    if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
    else setQuestions(DEFAULT_QUESTIONS);
    
    setIsLoading(false);
  }, []);

  // Persist data to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    }
  }, [employees, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
    }
  }, [questions, isLoading]);

  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees(prev => [...prev, newEmployee]);
    setSelectedEmployeeId(newEmployee.id);
    setIsAdding(false);
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prev => prev.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
    setIsEditing(false);
  };

  const handleDeleteEmployee = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Colaborador',
      message: 'Tem certeza que deseja excluir este colaborador? Esta ação não pode ser desfeita.',
      onConfirm: () => {
        setEmployees(prev => prev.filter(e => e.id !== id));
        if (selectedEmployeeId === id) setSelectedEmployeeId(null);
        setConfirmModal(null);
      }
    });
  };

  const handleSaveQuestions = (newQuestions: DiscQuestion[]) => {
    setQuestions(newQuestions);
    setIsManagingQuestions(false);
  };

  const selectedEmployee = useMemo(() => 
    employees.find(e => e.id === selectedEmployeeId),
    [employees, selectedEmployeeId]
  );

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'Todos' || e.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [employees, searchTerm, roleFilter]);

  const roles = useMemo(() => {
    const uniqueRoles = Array.from(new Set(employees.map(e => e.role)));
    return ['Todos', ...uniqueRoles];
  }, [employees]);

  const handleExportPDF = async () => {
    if (!reportRef.current || !selectedEmployee) return;
    
    setIsExporting(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Relatorio_DISC_${selectedEmployee.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col print:hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">DISC Dashboard</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Análise Comportamental</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="px-4 py-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Menu Principal</p>
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl transition-all font-bold text-sm">
                <Users size={18} /> Colaboradores
              </button>
              <button 
                onClick={() => setIsManagingQuestions(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all font-medium text-sm"
              >
                <Settings size={18} /> Banco de Perguntas
              </button>
            </nav>
          </div>

          <div className="px-4 py-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Filtros Rápidos</p>
            <div className="space-y-1">
              {roles.map(role => (
                <button 
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all",
                    roleFilter === role ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {role}
                  {roleFilter === role && <ChevronRight size={14} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 mt-auto border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-widest">Versão 2.1 • Local Storage</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header / Search */}
        <header className="bg-white border-b border-slate-200 p-6 flex flex-col sm:flex-row items-center gap-4 print:hidden">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar colaborador por nome..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-2xl transition-all outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <UserPlus size={20} /> Novo Colaborador
          </button>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* List */}
          <aside className="w-full lg:w-80 bg-white border-r border-slate-100 flex flex-col overflow-hidden print:hidden">
            <div className="p-4 border-b border-slate-50 bg-slate-50/30">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lista de Colaboradores</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredEmployees.map(employee => (
                <button
                  key={employee.id}
                  onClick={() => {
                    setSelectedEmployeeId(employee.id);
                    setIsEditing(false);
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group",
                    selectedEmployeeId === employee.id 
                      ? "bg-blue-50 text-blue-700 shadow-sm" 
                      : "hover:bg-slate-50 text-slate-600"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg",
                    selectedEmployeeId === employee.id ? "bg-blue-600" : "bg-slate-200"
                  )}>
                    {employee.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{employee.name}</p>
                    <p className="text-[10px] font-bold uppercase opacity-60 truncate">{employee.role}</p>
                  </div>
                  <ChevronRight size={16} className={cn(
                    "transition-transform",
                    selectedEmployeeId === employee.id ? "translate-x-0" : "translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                  )} />
                </button>
              ))}
              {filteredEmployees.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  <Users size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Nenhum colaborador encontrado.</p>
                </div>
              )}
            </div>
          </aside>

          {/* Content Area */}
          <section className="flex-1 overflow-y-auto p-8 print:p-0">
            <AnimatePresence mode="wait">
              {selectedEmployee ? (
                <motion.div
                  key={selectedEmployee.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 pb-12 print:pb-0 bg-slate-50/30 p-4 rounded-3xl"
                  ref={reportRef}
                >
                  {/* Employee Info Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                    
                    <div className="flex justify-between items-start mb-6 print:hidden">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">{selectedEmployee.name}</h2>
                        <p className="text-slate-500 flex items-center gap-2 mt-1">
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                            {selectedEmployee.role}
                          </span>
                          • {selectedEmployee.department}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Editar Cadastro"
                        >
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={handlePrint}
                          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Imprimir Relatório"
                        >
                          <Printer size={20} />
                        </button>
                        <button 
                          onClick={() => handleDeleteEmployee(selectedEmployee.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Excluir Colaborador"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-600">
                          <Clock size={18} className="text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">Tempo de Empresa</p>
                            <p className="text-sm font-medium">{selectedEmployee.timeAtCompany}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <MapPin size={18} className="text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">Endereço</p>
                            <p className="text-sm font-medium">{selectedEmployee.address}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-600">
                          <Phone size={18} className="text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">Telefone</p>
                            <p className="text-sm font-medium">{selectedEmployee.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <Mail size={18} className="text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">E-mail</p>
                            <p className="text-sm font-medium">{selectedEmployee.email}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Observações Gerais</p>
                        <p className="text-sm text-slate-600 italic">
                          {selectedEmployee.observations || "Nenhuma observação registrada."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DISC Assessment Section */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Results or Questionnaire */}
                    {selectedEmployee.assessment ? (
                      <DiscResults 
                        assessment={selectedEmployee.assessment} 
                        questions={questions}
                        onUpdateAssessment={(assessment) => {
                          handleUpdateEmployee({ ...selectedEmployee, assessment });
                        }}
                        onRetake={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: 'Refazer Avaliação',
                            message: 'Deseja realmente excluir os resultados atuais e refazer o questionário?',
                            onConfirm: () => {
                              handleUpdateEmployee({ ...selectedEmployee, assessment: undefined });
                              setConfirmModal(null);
                            }
                          });
                        }}
                        onExportPDF={handleExportPDF}
                        isExporting={isExporting}
                      />
                    ) : (
                      <DiscQuestionnaire 
                        questions={questions}
                        onComplete={(assessment) => {
                          handleUpdateEmployee({ ...selectedEmployee, assessment });
                        }}
                      />
                    )}

                    {/* Legend / Info */}
                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Info size={20} className="text-blue-500" />
                          Legenda de Perfis
                        </h3>
                        <div className="space-y-4">
                          {Object.values(PROFILE_DESCRIPTIONS).map(profile => (
                            <div key={profile.factor} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0",
                                profile.factor === 'D' ? "bg-red-500" :
                                profile.factor === 'I' ? "bg-yellow-500" :
                                profile.factor === 'S' ? "bg-green-500" : "bg-blue-500"
                              )}>
                                {profile.factor}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{profile.name}</p>
                                <p className="text-sm text-slate-600 leading-relaxed">{profile.description}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                                    Força: {profile.strength}
                                  </span>
                                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-red-50 text-red-500 rounded">
                                    Atenção: {profile.attention}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="bg-white p-8 rounded-full shadow-sm border border-slate-100">
                    <Users size={64} className="opacity-20" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-600">Selecione um colaborador</h3>
                    <p>Escolha um perfil na lista ao lado para visualizar os dados e avaliações.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {(isAdding || isEditing) && (
          <EmployeeModal 
            employee={isEditing ? selectedEmployee : undefined}
            onClose={() => {
              setIsAdding(false);
              setIsEditing(false);
            }}
            onSave={isEditing ? handleUpdateEmployee : handleAddEmployee}
          />
        )}
        {isManagingQuestions && (
          <QuestionsModal 
            questions={questions}
            onClose={() => setIsManagingQuestions(false)}
            onSave={handleSaveQuestions}
          />
        )}
        {confirmModal && confirmModal.isOpen && (
          <ConfirmModal 
            title={confirmModal.title}
            message={confirmModal.message}
            onConfirm={confirmModal.onConfirm}
            onCancel={() => setConfirmModal(null)}
          />
        )}
      </AnimatePresence>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Esconder tudo que não é o conteúdo principal */
          header, aside, .no-print, button, .print\\:hidden { 
            display: none !important; 
          }
          
          /* Resetar o layout para impressão */
          body, html {
            background: white !important;
            height: auto !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          #root, .min-h-screen, main {
            display: block !important;
            height: auto !important;
            overflow: visible !important;
            position: static !important;
          }

          /* Forçar a seção de resultados a ocupar a página toda */
          section {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            position: static !important;
          }

          .max-w-5xl {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
          }

          /* Estilizar os cards para impressão */
          .bg-white {
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            margin-bottom: 20px !important;
            break-inside: avoid !important;
          }

          /* Garantir que os gráficos apareçam */
          .recharts-responsive-container {
            width: 100% !important;
            height: 350px !important;
            display: block !important;
          }

          /* Quebras de página */
          .break-before-page {
            break-before: page !important;
            margin-top: 2cm !important;
          }

          h1, h2, h3, h4 {
            color: black !important;
          }

          /* Mostrar URLs de links se necessário, mas aqui vamos apenas garantir o texto */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />
    </div>
  );
}

// --- Sub-components ---

function EmployeeModal({ employee, onClose, onSave }: { 
  employee?: Employee, 
  onClose: () => void, 
  onSave: (e: Employee) => void 
}) {
  const [formData, setFormData] = useState<Partial<Employee>>(
    employee || {
      name: '',
      role: '',
      department: '',
      timeAtCompany: '',
      address: '',
      phone: '',
      email: '',
      observations: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: employee?.id || Date.now().toString(),
    } as Employee);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {employee ? <Edit size={20} className="text-blue-500" /> : <UserPlus size={20} className="text-blue-500" />}
            {employee ? 'Editar Colaborador' : 'Novo Colaborador'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nome Completo</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Cargo</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Setor / Departamento</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Tempo de Empresa</label>
              <input 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: 2 anos"
                value={formData.timeAtCompany}
                onChange={e => setFormData({ ...formData, timeAtCompany: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Telefone</label>
              <input 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">E-mail</label>
              <input 
                type="email"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Endereço Completo</label>
            <input 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Observações Gerais</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
              value={formData.observations}
              onChange={e => setFormData({ ...formData, observations: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Salvar Cadastro
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function DiscQuestionnaire({ questions, onComplete }: { questions: DiscQuestion[], onComplete: (a: DiscAssessment) => void }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const questionsPerPage = 5;

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(currentStep * questionsPerPage, (currentStep + 1) * questionsPerPage);

  const isPageComplete = currentQuestions.every(q => answers[q.id]);
  const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0;

  const handleFinish = () => {
    const scores: Record<ProfileFactor, number> = { D: 0, I: 0, S: 0, C: 0 };
    questions.forEach(q => {
      scores[q.factor] += answers[q.id] || 0;
    });

    // Calculate max possible score per factor based on number of questions for that factor
    const factorCounts = questions.reduce((acc, q) => {
      acc[q.factor] = (acc[q.factor] || 0) + 1;
      return acc;
    }, {} as Record<ProfileFactor, number>);

    const percentages: Record<ProfileFactor, number> = {
      D: factorCounts.D ? (scores.D / (factorCounts.D * 5)) * 100 : 0,
      I: factorCounts.I ? (scores.I / (factorCounts.I * 5)) * 100 : 0,
      S: factorCounts.S ? (scores.S / (factorCounts.S * 5)) * 100 : 0,
      C: factorCounts.C ? (scores.C / (factorCounts.C * 5)) * 100 : 0,
    };

    const sortedFactors = (Object.keys(percentages) as ProfileFactor[]).sort((a, b) => percentages[b] - percentages[a]);

    onComplete({
      answers,
      scores,
      percentages,
      predominant: sortedFactors[0],
      secondary: sortedFactors[1],
      date: new Date().toISOString(),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Questionário DISC</h3>
          <p className="text-sm text-slate-500">Avaliação comportamental (Escala 1 a 5)</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase">Progresso</p>
          <p className="text-lg font-bold text-blue-600">{Math.round(progress)}%</p>
        </div>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="bg-blue-500 h-full"
        />
      </div>

      <div className="flex-1 space-y-8">
        {currentQuestions.map(q => (
          <div key={q.id} className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded mt-1">
                {q.id}
              </span>
              <p className="text-slate-700 font-medium leading-tight">{q.text}</p>
            </div>
            <div className="flex items-center justify-between gap-2 px-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase w-20 text-right">Discordo</span>
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  onClick={() => setAnswers({ ...answers, [q.id]: val })}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all font-bold flex items-center justify-center",
                    answers[q.id] === val 
                      ? "bg-blue-600 border-blue-600 text-white scale-110 shadow-md shadow-blue-100" 
                      : "border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-400"
                  )}
                >
                  {val}
                </button>
              ))}
              <span className="text-[10px] text-slate-400 font-bold uppercase w-20">Concordo</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(prev => prev - 1)}
          className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          Anterior
        </button>
        {currentStep === totalPages - 1 ? (
          <button
            disabled={!isPageComplete}
            onClick={handleFinish}
            className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-100 disabled:opacity-50"
          >
            Finalizar Avaliação
          </button>
        ) : (
          <button
            disabled={!isPageComplete}
            onClick={() => setCurrentStep(prev => prev + 1)}
            className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            Próxima Página
          </button>
        )}
      </div>
    </div>
  );
}

function DiscResults({ assessment, questions, onUpdateAssessment, onRetake, onExportPDF, isExporting }: { 
  assessment: DiscAssessment, 
  questions: DiscQuestion[],
  onUpdateAssessment: (a: DiscAssessment) => void,
  onRetake: () => void,
  onExportPDF: () => void,
  isExporting: boolean
}) {
  const [observations, setObservations] = useState(assessment.reportObservations || '');

  const data = [
    { name: 'D', value: assessment.percentages.D, color: '#ef4444' },
    { name: 'I', value: assessment.percentages.I, color: '#eab308' },
    { name: 'S', value: assessment.percentages.S, color: '#22c55e' },
    { name: 'C', value: assessment.percentages.C, color: '#3b82f6' },
  ];

  // Radar data based on traits from questions
  const radarData = useMemo(() => {
    return questions.map(q => ({
      subject: q.trait || q.interpretation,
      A: (assessment.answers[q.id] || 0) * 20, // Scale 1-5 to 0-100
      fullMark: 100,
      factor: q.factor
    }));
  }, [questions, assessment.answers]);

  const predominantProfile = PROFILE_DESCRIPTIONS[assessment.predominant];
  const secondaryProfile = PROFILE_DESCRIPTIONS[assessment.secondary];

  const handleSaveObservations = () => {
    onUpdateAssessment({ ...assessment, reportObservations: observations });
  };

  const getStatusColor = (val: number) => {
    if (val >= 70) return 'text-green-600 bg-green-50';
    if (val >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusLabel = (val: number) => {
    if (val >= 70) return 'Alto';
    if (val >= 40) return 'Médio';
    return 'Baixo';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-500" />
            Perfil Comportamental
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-medium">
              Avaliado em: {new Date(assessment.date).toLocaleDateString('pt-BR')}
            </span>
            <button 
              onClick={onExportPDF}
              disabled={isExporting}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all print:hidden disabled:opacity-50",
                isExporting && "cursor-not-allowed"
              )}
            >
              <FileText size={14} /> {isExporting ? 'Gerando...' : 'Salvar PDF'}
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all print:hidden"
            >
              <Printer size={14} /> Imprimir
            </button>
            <button 
              onClick={onRetake}
              className="text-xs font-bold text-slate-400 hover:text-red-500 transition-all print:hidden"
            >
              Refazer Teste
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {data.map(item => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: item.color }}>
                    {item.name}
                  </div>
                  <span className="font-bold text-slate-700">{PROFILE_DESCRIPTIONS[item.name].name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", getStatusColor(item.value))}>
                    {getStatusLabel(item.value)}
                  </span>
                  <span className="font-bold text-slate-800">{Math.round(item.value)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Radar Chart Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <PieChartIcon size={20} className="text-blue-500" />
          Mapa de Competências
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Perfil"
                dataKey="A"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FileText size={20} className="text-blue-500" />
          Análise de Resultados
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
            <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Perfil Predominante</p>
            <p className="text-xl font-black text-blue-700">{predominantProfile.name}</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Perfil Secundário</p>
            <p className="text-xl font-black text-slate-700">{secondaryProfile.name}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              Pontos Fortes
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Como {predominantProfile.name.toLowerCase()}, sua maior força reside em {predominantProfile.strength.toLowerCase()} 
              {secondaryProfile ? ` Complementado pela característica de ${secondaryProfile.name.toLowerCase()}, que traz ${secondaryProfile.strength.toLowerCase()}` : '.'}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <AlertCircle size={16} className="text-yellow-500" />
              Pontos de Atenção
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              É importante focar em {predominantProfile.attention.toLowerCase()}
              {secondaryProfile ? ` e também estar atento a ${secondaryProfile.attention.toLowerCase()}` : '.'}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              Sugestões de Função
            </h4>
            <div className="flex flex-wrap gap-2">
              {predominantProfile.suggestedRoles.map(role => (
                <span key={role} className="text-xs font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Report Observations Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print:break-inside-avoid">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Edit size={20} className="text-blue-500" />
          Observações do Relatório
        </h3>
        <textarea
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          onBlur={handleSaveObservations}
          placeholder="Adicione observações específicas para este relatório..."
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none min-h-[120px] print:border-none print:bg-transparent print:p-0"
        />
        <p className="text-[10px] text-slate-400 mt-2 print:hidden">As observações são salvas automaticamente ao sair do campo.</p>
      </div>

      {/* Detailed Answers Section (Visible in Print or Toggle) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm break-before-page">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Info size={20} className="text-blue-500" />
          Detalhamento das Respostas
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="p-3 border-b border-slate-100">Cód</th>
                <th className="p-3 border-b border-slate-100">Fator</th>
                <th className="p-3 border-b border-slate-100">Pergunta</th>
                <th className="p-3 border-b border-slate-100 text-center">Nota</th>
                <th className="p-3 border-b border-slate-100">Interpretação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {questions.map(q => (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-400">{q.id}</td>
                  <td className="p-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold text-white",
                      q.factor === 'D' ? "bg-red-500" :
                      q.factor === 'I' ? "bg-yellow-500" :
                      q.factor === 'S' ? "bg-green-500" : "bg-blue-500"
                    )}>
                      {q.factor}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{q.text}</td>
                  <td className="p-3 text-center font-bold text-blue-600">{assessment.answers[q.id]}</td>
                  <td className="p-3 text-xs text-slate-400 italic">{q.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel }: { 
  title: string, 
  message: string, 
  onConfirm: () => void, 
  onCancel: () => void 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-8 text-center"
      >
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 mb-8">{message}</p>
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-200"
          >
            Confirmar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function QuestionsModal({ questions, onClose, onSave }: { 
  questions: DiscQuestion[], 
  onClose: () => void, 
  onSave: (q: DiscQuestion[]) => void 
}) {
  const [localQuestions, setLocalQuestions] = useState<DiscQuestion[]>([...questions]);
  const [newQuestion, setNewQuestion] = useState<Partial<DiscQuestion>>({ factor: 'D', text: '', interpretation: '', trait: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddOrUpdate = () => {
    if (!newQuestion.text || !newQuestion.interpretation) return;
    
    if (editingId) {
      // Update existing
      setLocalQuestions(localQuestions.map(q => 
        q.id === editingId 
          ? { ...q, factor: newQuestion.factor as ProfileFactor, text: newQuestion.text!, interpretation: newQuestion.interpretation!, trait: newQuestion.trait } 
          : q
      ));
      setEditingId(null);
    } else {
      // Add new
      const q: DiscQuestion = {
        id: `${newQuestion.factor}${Date.now()}`,
        factor: newQuestion.factor as ProfileFactor,
        text: newQuestion.text,
        interpretation: newQuestion.interpretation,
        trait: newQuestion.trait
      };
      setLocalQuestions([...localQuestions, q]);
    }
    
    setNewQuestion({ factor: 'D', text: '', interpretation: '', trait: '' });
  };

  const handleEdit = (q: DiscQuestion) => {
    setEditingId(q.id);
    setNewQuestion({
      factor: q.factor,
      text: q.text,
      interpretation: q.interpretation,
      trait: q.trait
    });
  };

  const handleDelete = (id: string) => {
    setLocalQuestions(localQuestions.filter(q => q.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNewQuestion({ factor: 'D', text: '', interpretation: '', trait: '' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Settings size={20} className="text-blue-500" />
              Banco de Perguntas DISC
            </h2>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">
              Salvo localmente • Alterações são permanentes
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add/Edit Question */}
          <div className={cn(
            "p-6 rounded-2xl border space-y-4 transition-colors",
            editingId ? "bg-amber-50 border-amber-100" : "bg-blue-50 border-blue-100"
          )}>
            <h3 className={cn(
              "text-sm font-bold uppercase tracking-wider",
              editingId ? "text-amber-700" : "text-blue-700"
            )}>
              {editingId ? 'Editar Pergunta' : 'Adicionar Nova Pergunta'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select 
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                value={newQuestion.factor}
                onChange={e => setNewQuestion({ ...newQuestion, factor: e.target.value as ProfileFactor })}
              >
                <option value="D">D - Dominância</option>
                <option value="I">I - Influência</option>
                <option value="S">S - Estabilidade</option>
                <option value="C">C - Conformidade</option>
              </select>
              <input 
                placeholder="Texto da pergunta..."
                className="md:col-span-2 px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                value={newQuestion.text}
                onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
              />
              <input 
                placeholder="Interpretação..."
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                value={newQuestion.interpretation}
                onChange={e => setNewQuestion({ ...newQuestion, interpretation: e.target.value })}
              />
              <input 
                placeholder="Traço/Competência (ex: Ousadia)..."
                className="md:col-span-3 px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                value={newQuestion.trait}
                onChange={e => setNewQuestion({ ...newQuestion, trait: e.target.value })}
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleAddOrUpdate}
                  className={cn(
                    "flex-1 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2",
                    editingId ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  {editingId ? <Save size={18} /> : <Plus size={18} />}
                  {editingId ? 'Atualizar' : 'Adicionar'}
                </button>
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setNewQuestion({ factor: 'D', text: '', interpretation: '', trait: '' });
                  }}
                  className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 transition-colors"
                  title="Limpar campos"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* List Questions */}
          <div className="space-y-3">
            {localQuestions.map(q => (
              <div 
                key={q.id} 
                className={cn(
                  "p-4 border rounded-2xl transition-all flex items-center gap-4",
                  editingId === q.id ? "bg-amber-50 border-amber-200 shadow-sm" : "border-slate-100 hover:bg-slate-50"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0",
                  q.factor === 'D' ? "bg-red-500" :
                  q.factor === 'I' ? "bg-yellow-500" :
                  q.factor === 'S' ? "bg-green-500" : "bg-blue-500"
                )}>
                  {q.factor}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{q.text}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">{q.interpretation} • {q.trait || 'Sem traço'}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(q)}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      editingId === q.id ? "text-amber-600 bg-amber-100" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                    )}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(q.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => {
              if (confirm('Deseja realmente restaurar as perguntas padrão? Isso apagará suas perguntas personalizadas.')) {
                setLocalQuestions([...DEFAULT_QUESTIONS]);
              }
            }}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Clock size={18} /> Restaurar Padrão
          </button>
          <div className="flex-1 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => {
                onSave(localQuestions);
                onClose();
              }}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
