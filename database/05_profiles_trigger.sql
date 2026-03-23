-- Create a public "profiles" table to mirror auth.users identity hooks
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  email text,
  phone text,
  wishlist text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security natively preventing data leakage
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users strict access strictly to their identity node
CREATE POLICY "Users can view own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Authentication Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Authentication Trigger Binding
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
