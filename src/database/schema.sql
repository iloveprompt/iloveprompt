
-- Schema para o Prompt Generator

-- Tabela para armazenar prompts
CREATE TABLE IF NOT EXISTS prompts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  wizard_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Tabela para categorias do wizard
CREATE TABLE IF NOT EXISTS wizard_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  order INT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  active BOOLEAN DEFAULT true
);

-- Tabela para traduções das categorias
CREATE TABLE IF NOT EXISTS wizard_category_translations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES wizard_categories(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  UNIQUE(category_id, language)
);

-- Tabela para itens do wizard
CREATE TABLE IF NOT EXISTS wizard_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES wizard_categories(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  order INT NOT NULL,
  type TEXT NOT NULL,
  has_other_option BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  UNIQUE(category_id, key)
);

-- Tabela para traduções dos itens
CREATE TABLE IF NOT EXISTS wizard_item_translations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES wizard_items(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  text TEXT NOT NULL,
  placeholder TEXT,
  help_text TEXT,
  UNIQUE(item_id, language)
);

-- Tabela para opções dos itens
CREATE TABLE IF NOT EXISTS wizard_item_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES wizard_items(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  order INT NOT NULL,
  active BOOLEAN DEFAULT true,
  UNIQUE(item_id, key)
);

-- Tabela para traduções das opções
CREATE TABLE IF NOT EXISTS wizard_option_translations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  option_id UUID REFERENCES wizard_item_options(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  text TEXT NOT NULL,
  UNIQUE(option_id, language)
);

-- Tabela para exemplos dos itens
CREATE TABLE IF NOT EXISTS wizard_item_examples (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES wizard_items(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  active BOOLEAN DEFAULT true
);

-- Configurar RLS (Row Level Security)

-- Política para prompts
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Usuários podem acessar somente seus próprios prompts
CREATE POLICY prompts_users_policy ON prompts 
  FOR ALL 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Admins podem ver todos os prompts (para implementação futura)
-- CREATE POLICY prompts_admin_policy ON prompts 
--   FOR SELECT 
--   TO authenticated 
--   USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Políticas para tabelas de wizard (somente leitura para usuários)

-- Categorias - Leitura pública
ALTER TABLE wizard_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY wizard_categories_select ON wizard_categories FOR SELECT TO authenticated USING (true);

-- Traduções das categorias - Leitura pública
ALTER TABLE wizard_category_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY wizard_category_translations_select ON wizard_category_translations FOR SELECT TO authenticated USING (true);

-- Itens - Leitura pública
ALTER TABLE wizard_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY wizard_items_select ON wizard_items FOR SELECT TO authenticated USING (true);

-- Traduções dos itens - Leitura pública
ALTER TABLE wizard_item_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY wizard_item_translations_select ON wizard_item_translations FOR SELECT TO authenticated USING (true);

-- Opções - Leitura pública
ALTER TABLE wizard_item_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY wizard_item_options_select ON wizard_item_options FOR SELECT TO authenticated USING (true);

-- Traduções das opções - Leitura pública
ALTER TABLE wizard_option_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY wizard_option_translations_select ON wizard_option_translations FOR SELECT TO authenticated USING (true);

-- Exemplos - Leitura pública
ALTER TABLE wizard_item_examples ENABLE ROW LEVEL SECURITY;
CREATE POLICY wizard_item_examples_select ON wizard_item_examples FOR SELECT TO authenticated USING (true);

-- Índices para melhorar a performance

CREATE INDEX idx_prompts_user_id ON prompts(user_id);
CREATE INDEX idx_prompts_created_at ON prompts(created_at);

CREATE INDEX idx_wizard_category_translations_category_id ON wizard_category_translations(category_id);
CREATE INDEX idx_wizard_category_translations_language ON wizard_category_translations(language);

CREATE INDEX idx_wizard_items_category_id ON wizard_items(category_id);

CREATE INDEX idx_wizard_item_translations_item_id ON wizard_item_translations(item_id);
CREATE INDEX idx_wizard_item_translations_language ON wizard_item_translations(language);

CREATE INDEX idx_wizard_item_options_item_id ON wizard_item_options(item_id);

CREATE INDEX idx_wizard_option_translations_option_id ON wizard_option_translations(option_id);
CREATE INDEX idx_wizard_option_translations_language ON wizard_option_translations(language);

CREATE INDEX idx_wizard_item_examples_item_id ON wizard_item_examples(item_id);
