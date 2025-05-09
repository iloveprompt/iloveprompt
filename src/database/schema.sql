
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
  sort_order INT NOT NULL,
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
  sort_order INT NOT NULL,
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
  sort_order INT NOT NULL,
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

-- NOVAS TABELAS PARA GESTÃO DE USUÁRIOS E PLANOS

-- Tabela para perfis de usuários (complementa a auth.users do Supabase)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para roles/funções de usuários
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de associação entre usuários e roles
CREATE TABLE IF NOT EXISTS user_role_assignments (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES user_roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Tabela para planos de assinatura
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('monthly', 'yearly')),
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  prompt_limit INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para assinaturas de usuários
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  payment_method_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para rastrear uso de prompts pelos usuários
CREATE TABLE IF NOT EXISTS prompt_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID REFERENCES prompts(id) ON DELETE SET NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para registros de log do sistema (para admin visualizar)
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir roles padrão
INSERT INTO user_roles (name, description, permissions)
VALUES 
  ('admin', 'Administrador do sistema', '{"all": true}'),
  ('user', 'Usuário comum', '{"prompts": {"create": true, "read_own": true, "update_own": true, "delete_own": true}}'),
  ('premium', 'Usuário premium', '{"prompts": {"create": true, "read_own": true, "update_own": true, "delete_own": true}, "premium_features": true}');

-- Inserir planos padrão
INSERT INTO subscription_plans (name, description, price, interval, features, prompt_limit)
VALUES 
  ('Gratuito', 'Plano básico com recursos limitados', 0, 'monthly', '["5 prompts por mês", "Acesso a modelos básicos"]', 5),
  ('Premium', 'Plano completo com todos os recursos', 19.90, 'monthly', '["Prompts ilimitados", "Acesso a todos os modelos", "Suporte prioritário"]', 1000),
  ('Profissional', 'Plano para empresas e equipes', 49.90, 'monthly', '["Prompts ilimitados", "Acesso a modelos avançados", "API de integração", "Suporte 24/7"]', 10000);

-- Configurar RLS (Row Level Security)

-- Política para prompts
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Usuários podem acessar somente seus próprios prompts
CREATE POLICY prompts_users_policy ON prompts 
  FOR ALL 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Políticas para user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_profiles_select_own ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY user_profiles_update_own ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Admin pode ver todos os perfis
CREATE POLICY user_profiles_admin_all ON user_profiles 
  FOR ALL 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM user_role_assignments ura
    JOIN user_roles ur ON ura.role_id = ur.id
    WHERE ura.user_id = auth.uid() AND ur.name = 'admin'
  ));

-- Políticas para user_subscriptions
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_subscriptions_select_own ON user_subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Admin pode ver todas as assinaturas
CREATE POLICY user_subscriptions_admin_all ON user_subscriptions 
  FOR ALL 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM user_role_assignments ura
    JOIN user_roles ur ON ura.role_id = ur.id
    WHERE ura.user_id = auth.uid() AND ur.name = 'admin'
  ));

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

-- Índices para as novas tabelas
CREATE INDEX idx_user_role_assignments_user_id ON user_role_assignments(user_id);
CREATE INDEX idx_user_role_assignments_role_id ON user_role_assignments(role_id);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_plan_id ON user_subscriptions(plan_id);
CREATE INDEX idx_prompt_usage_user_id ON prompt_usage(user_id);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);

-- Função para verificar se um usuário é administrador
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_role_assignments ura
    JOIN user_roles ur ON ura.role_id = ur.id
    WHERE ura.user_id = $1 AND ur.name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter o plano atual de um usuário
CREATE OR REPLACE FUNCTION get_user_plan(user_id UUID)
RETURNS TABLE (
  plan_id UUID,
  plan_name TEXT,
  prompt_limit INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT sp.id, sp.name, sp.prompt_limit
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = $1 AND us.status = 'active'
  ORDER BY us.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criação de uma função RPC para verificar as tabelas existentes (para diagnóstico)
CREATE OR REPLACE FUNCTION get_tables()
RETURNS TEXT[] AS $$
DECLARE
  tables TEXT[];
BEGIN
  SELECT array_agg(tablename::TEXT) INTO tables
  FROM pg_tables
  WHERE schemaname = 'public';
  
  RETURN tables;
END;
$$ LANGUAGE plpgsql;
