-- ============================================
-- MATCH ID SYSTEM IMPROVEMENTS
-- ============================================
-- This migration ensures match IDs are unique and properly constrained

-- 1. Add unique constraint on match_code if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'matches_match_code_unique'
    ) THEN
        ALTER TABLE public.matches 
        ADD CONSTRAINT matches_match_code_unique UNIQUE (match_code);
    END IF;
END $$;

-- 2. Add composite unique constraint for tournament + round + match_number
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'matches_tournament_round_number_unique'
    ) THEN
        ALTER TABLE public.matches 
        ADD CONSTRAINT matches_tournament_round_number_unique 
        UNIQUE (tournament_id, round, match_number);
    END IF;
END $$;

-- 3. Add index on match_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_matches_match_code ON public.matches(match_code);

-- 4. Add index on tournament_id + round for bracket queries
CREATE INDEX IF NOT EXISTS idx_matches_tournament_round ON public.matches(tournament_id, round);

-- 5. Create function to generate match code
CREATE OR REPLACE FUNCTION generate_match_code(
    p_tournament_id UUID,
    p_round INTEGER,
    p_match_number INTEGER
)
RETURNS TEXT AS $$
BEGIN
    -- Format: TOURNEY-R1-M1 (first 8 chars of tournament ID + round + match number)
    RETURN CONCAT(
        SUBSTRING(p_tournament_id::TEXT, 1, 8),
        '-R', p_round,
        '-M', p_match_number
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6. Create trigger to auto-generate match_code if not provided
CREATE OR REPLACE FUNCTION auto_generate_match_code()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate if match_code is NULL or empty
    IF NEW.match_code IS NULL OR NEW.match_code = '' THEN
        NEW.match_code := generate_match_code(
            NEW.tournament_id,
            NEW.round,
            NEW.match_number
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_auto_generate_match_code ON public.matches;
CREATE TRIGGER trigger_auto_generate_match_code
    BEFORE INSERT OR UPDATE ON public.matches
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_match_code();

-- 7. Add validation function to ensure match integrity
CREATE OR REPLACE FUNCTION validate_match()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure round is positive
    IF NEW.round < 1 THEN
        RAISE EXCEPTION 'Round must be greater than 0';
    END IF;
    
    -- Ensure match_number is positive
    IF NEW.match_number < 1 THEN
        RAISE EXCEPTION 'Match number must be greater than 0';
    END IF;
    
    -- Ensure player1 and player2 are different (if both exist)
    IF NEW.player1_id IS NOT NULL AND NEW.player2_id IS NOT NULL 
       AND NEW.player1_id = NEW.player2_id THEN
        RAISE EXCEPTION 'Player 1 and Player 2 cannot be the same';
    END IF;
    
    -- Ensure spectator is not a player (if spectator exists)
    IF NEW.spectator_id IS NOT NULL THEN
        IF NEW.spectator_id = NEW.player1_id OR NEW.spectator_id = NEW.player2_id THEN
            RAISE EXCEPTION 'Spectator cannot be a player in the same match';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_validate_match ON public.matches;
CREATE TRIGGER trigger_validate_match
    BEFORE INSERT OR UPDATE ON public.matches
    FOR EACH ROW
    EXECUTE FUNCTION validate_match();

-- 8. Update existing matches without match_code
UPDATE public.matches
SET match_code = generate_match_code(tournament_id, round, match_number)
WHERE match_code IS NULL OR match_code = '';

-- 9. Verify the setup
SELECT 
    'Match Code Constraints' as check_type,
    COUNT(*) as total_matches,
    COUNT(DISTINCT match_code) as unique_match_codes,
    COUNT(*) - COUNT(DISTINCT match_code) as duplicates
FROM public.matches;

-- 10. Show sample match codes
SELECT 
    id,
    match_code,
    tournament_id,
    round,
    match_number,
    status
FROM public.matches
ORDER BY created_at DESC
LIMIT 10;
