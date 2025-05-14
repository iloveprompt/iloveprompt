-- Migration: Create user_llm_apis table
-- Timestamp: 20250512163300

-- Define ENUM types for provider and test status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'llm_provider') THEN
        CREATE TYPE llm_provider AS ENUM ('openai', 'gemini', 'groq', 'deepseek', 'grok');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'api_test_status') THEN
        CREATE TYPE api_test_status AS ENUM ('untested', 'success', 'failure');
    END IF;
END$$;


CREATE TABLE public.user_llm_apis (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider llm_provider NOT NULL,
    -- Consider encrypting this column using pgsodium or similar
    api_key text NOT NULL CHECK (char_length(api_key) > 0), -- Basic check
    models text[] NULL, -- Store available models for the provider/key if needed
    is_active boolean NOT NULL DEFAULT false,
    last_tested_at timestamp with time zone NULL,
    test_status api_test_status NOT NULL DEFAULT 'untested',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_llm_apis ENABLE ROW LEVEL SECURITY;

-- Policies:
-- Users can manage their own API keys
CREATE POLICY "Allow users to manage their own API keys"
ON public.user_llm_apis
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger function for handling updated_at (Create if it doesn't exist)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS handle_user_llm_apis_updated_at ON public.user_llm_apis; -- Drop if exists
CREATE TRIGGER handle_user_llm_apis_updated_at
BEFORE UPDATE ON public.user_llm_apis
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add comments
COMMENT ON COLUMN public.user_llm_apis.api_key IS 'User-provided API key. Consider encrypting this value.';
COMMENT ON TABLE public.user_llm_apis IS 'Stores API keys provided by users for different LLM providers.';

-- Grant necessary permissions to the authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_llm_apis TO authenticated;
-- Grant usage on the types if they are in the public schema (default)
GRANT USAGE ON TYPE public.llm_provider TO authenticated;
GRANT USAGE ON TYPE public.api_test_status TO authenticated;

-- Note: The constraint to enforce only one active API per user will be handled at the application level (in UserSettingService.setActiveAPI).
