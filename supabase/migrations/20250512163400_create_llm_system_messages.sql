-- Migration: Create llm_system_messages table
-- Timestamp: 20250512163400

CREATE TABLE public.llm_system_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    content text NOT NULL CHECK (char_length(content) > 0),
    -- Assuming you have a way to identify admins, e.g., a role or a separate table.
    -- If using Supabase built-in roles, you might check roles in policies.
    -- For simplicity, storing the user_id of the admin who created it.
    created_by_admin_id uuid NOT NULL REFERENCES auth.users(id),
    is_default boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.llm_system_messages ENABLE ROW LEVEL SECURITY;

-- Policies:
-- Admins can manage all system messages (Requires a way to identify admins, e.g., a custom 'admin' role or checking against a list of admin user IDs)
-- Example policy assuming an 'is_admin' function exists or check against specific IDs:
-- CREATE POLICY "Allow admins to manage system messages"
-- ON public.llm_system_messages
-- FOR ALL
-- USING (is_admin(auth.uid())) -- Replace is_admin with your actual admin check logic
-- WITH CHECK (is_admin(auth.uid()));

-- For now, let's allow any authenticated user to read (users need to see the default message)
-- but restrict write operations until admin logic is defined.
CREATE POLICY "Allow authenticated users to read system messages"
ON public.llm_system_messages
FOR SELECT
USING (auth.role() = 'authenticated');

-- Placeholder policies for admin write access (MODIFY THESE WITH ACTUAL ADMIN CHECK)
CREATE POLICY "Allow specific admin users to insert system messages"
ON public.llm_system_messages
FOR INSERT
WITH CHECK (auth.uid() IN ('ADMIN_USER_ID_1', 'ADMIN_USER_ID_2')); -- Replace with actual admin IDs or role check

CREATE POLICY "Allow specific admin users to update system messages"
ON public.llm_system_messages
FOR UPDATE
USING (auth.uid() IN ('ADMIN_USER_ID_1', 'ADMIN_USER_ID_2')); -- Replace with actual admin IDs or role check

CREATE POLICY "Allow specific admin users to delete system messages"
ON public.llm_system_messages
FOR DELETE
USING (auth.uid() IN ('ADMIN_USER_ID_1', 'ADMIN_USER_ID_2')); -- Replace with actual admin IDs or role check


-- Trigger to update updated_at timestamp (using the function created in the previous migration)
DROP TRIGGER IF EXISTS handle_llm_system_messages_updated_at ON public.llm_system_messages; -- Drop if exists
CREATE TRIGGER handle_llm_system_messages_updated_at
BEFORE UPDATE ON public.llm_system_messages
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add comments
COMMENT ON TABLE public.llm_system_messages IS 'Stores global system messages for LLMs, managed by admins.';
COMMENT ON COLUMN public.llm_system_messages.is_default IS 'Indicates the currently active default system message.';
COMMENT ON COLUMN public.llm_system_messages.created_by_admin_id IS 'User ID of the admin who created/last modified the message.';

-- Grant necessary permissions
GRANT SELECT ON TABLE public.llm_system_messages TO authenticated;
-- Grant write permissions only to roles/users who should manage these (e.g., service_role or specific admin role)
-- GRANT INSERT, UPDATE, DELETE ON TABLE public.llm_system_messages TO service_role; -- Example for server-side operations

-- Note: A constraint to enforce only one default message should ideally be handled
-- either by application logic (when setting is_default=true, set others to false)
-- or potentially with a more complex partial index or trigger if strict DB enforcement is needed.
