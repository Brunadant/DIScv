-- SQL para configurar o banco de dados no Supabase

-- Tabela de Colaboradores
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  "timeAtCompany" TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  observations TEXT,
  assessment JSONB, -- Armazena o objeto DiscAssessment
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Perguntas
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  factor TEXT NOT NULL, -- D, I, S, C
  text TEXT NOT NULL,
  interpretation TEXT NOT NULL,
  trait TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (opcional, mas recomendado)
-- ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso público (para fins de demonstração/anon key)
-- CREATE POLICY "Acesso Público" ON employees FOR ALL USING (true);
-- CREATE POLICY "Acesso Público" ON questions FOR ALL USING (true);
