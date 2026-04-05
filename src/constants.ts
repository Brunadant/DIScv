import { DiscQuestion, ProfileDescription } from './types';

export const DISC_QUESTIONS: DiscQuestion[] = [
  { id: 'D1', factor: 'D', text: 'Quando algo precisa ser decidido rápido, eu costumo assumir a frente.', interpretation: 'Iniciativa e Decisão', trait: 'Comando e firmeza' },
  { id: 'D2', factor: 'D', text: 'Gosto de enfrentar desafios e metas difíceis.', interpretation: 'Orientação para Resultados', trait: 'Ousadia' },
  { id: 'D3', factor: 'D', text: 'Prefiro conversas diretas e objetivas, sem rodeios.', interpretation: 'Diretividade', trait: 'Objetividade' },
  { id: 'D4', factor: 'D', text: 'Quando vejo um problema, tomo iniciativa para resolver.', interpretation: 'Resolução de Problemas', trait: 'DINAMISMO' },
  { id: 'D5', factor: 'D', text: 'Sinto conforto em cobrar resultado de outras pessoas.', interpretation: 'Firmeza', trait: 'Senso de urgência' },
  
  { id: 'I1', factor: 'I', text: 'Gosto de conversar com as pessoas e animar o ambiente de trabalho.', interpretation: 'Sociabilidade', trait: 'Sociabilidade' },
  { id: 'I2', factor: 'I', text: 'Tenho facilidade para explicar ideias ao grupo.', interpretation: 'Comunicação', trait: 'Extroversão' },
  { id: 'I3', factor: 'I', text: 'Consigo motivar colegas quando o clima está ruim.', interpretation: 'Entusiasmo', trait: 'Entusiasmo e motivação' },
  { id: 'I4', factor: 'I', text: 'Faço conexões com facilidade e ganho confiança rapidamente.', interpretation: 'Relacionamento', trait: 'Persuasão' },
  { id: 'I5', factor: 'I', text: 'Sinto conforto em representar a equipe diante de outras pessoas.', interpretation: 'Persuasão', trait: 'Carisma' },
  
  { id: 'S1', factor: 'S', text: 'Prefiro manter rotina e estabilidade no trabalho.', interpretation: 'Estabilidade', trait: 'ESTABILIDADE' },
  { id: 'S2', factor: 'S', text: 'Tenho paciência para ouvir e ajudar colegas.', interpretation: 'Paciência', trait: 'Empatia' },
  { id: 'S3', factor: 'S', text: 'Costumo manter a calma mesmo sob pressão.', interpretation: 'Calma', trait: 'Paciência' },
  { id: 'S4', factor: 'S', text: 'Gosto de seguir o que foi combinado, sem mudanças bruscas.', interpretation: 'Segurança', trait: 'Persistência' },
  { id: 'S5', factor: 'S', text: 'Sou confiável para tarefas contínuas e acompanhamento.', interpretation: 'Lealdade', trait: 'Conciliação e consentimento' },
  
  { id: 'C1', factor: 'C', text: 'Gosto de organizar documentos, controles e informações.', interpretation: 'Organização', trait: 'Organização e Controle' },
  { id: 'C2', factor: 'C', text: 'Antes de decidir, prefiro analisar para evitar erros.', interpretation: 'Análise', trait: 'Prudência' },
  { id: 'C3', factor: 'C', text: 'Valorizo regras, padrões e procedimentos claros.', interpretation: 'Conformidade', trait: 'Disciplina' },
  { id: 'C4', factor: 'C', text: 'Percebo detalhes que outras pessoas deixam passar.', interpretation: 'Atenção aos Detalhes', trait: 'Detalhismo' },
  { id: 'C5', factor: 'C', text: 'Acho importante registrar processos, ocorrências e resultados.', interpretation: 'Qualidade', trait: 'RACIONALIDADE' },
];

export const PROFILE_DESCRIPTIONS: Record<string, ProfileDescription> = {
  D: {
    factor: 'D',
    name: 'Dominância',
    description: 'Foco em resultado, rapidez, firmeza e enfrentamento de problemas.',
    strength: 'Tomada de decisão e cobrança.',
    attention: 'Desenvolver escuta e paciência.',
    suggestedRoles: ['Gerente de Projetos', 'Diretor Comercial', 'Líder de Operações', 'Empreendedor']
  },
  I: {
    factor: 'I',
    name: 'Influência',
    description: 'Comunicação, persuasão, entusiasmo e relacionamento.',
    strength: 'Engajamento e representação.',
    attention: 'Desenvolver disciplina e constância.',
    suggestedRoles: ['Vendas', 'Relações Públicas', 'Recursos Humanos', 'Treinamento']
  },
  S: {
    factor: 'S',
    name: 'Estabilidade',
    description: 'Calma, cooperação, rotina e constância.',
    strength: 'Sustentação da operação e clima.',
    attention: 'Desenvolver rapidez na tomada de decisão.',
    suggestedRoles: ['Atendimento ao Cliente', 'Suporte Técnico', 'Administrativo', 'Planejamento']
  },
  C: {
    factor: 'C',
    name: 'Conformidade',
    description: 'Organização, regras, análise, qualidade e controle.',
    strength: 'Processos, padrões e qualidade.',
    attention: 'Desenvolver flexibilidade e comunicação direta.',
    suggestedRoles: ['Analista de Dados', 'Contador', 'Auditor', 'Desenvolvedor de Software']
  }
};
