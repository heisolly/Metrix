# Admin Tournament Page - Bracket Integration Code

## Add this code to: `src/app/admin/tournaments/[id]/page.tsx`

### Step 1: The imports are already added ✅

```tsx
import TournamentBracket from "@/components/TournamentBracket";
import AdminBracketEditor from "@/components/AdminBracketEditor";
import { Brackets } from "lucide-react";
```

### Step 2: The state is already added ✅

```tsx
const [matches, setMatches] = useState<any[]>([]);
const [spectators, setSpectators] = useState<any[]>([]);
const [editingBracket, setEditingBracket] = useState(false);
```

### Step 3: Add to `loadTournamentDetails()` function

**Find this section (around line 94):**

```tsx
      } else {
        setParticipants(parts || []);
      }

    } catch (error) {
```

**Add BEFORE the `} catch (error) {` line:**

```tsx
      } else {
        setParticipants(parts || []);
      }

      // Get matches
      const { data: matchesData } = await supabase
        .from('matches')
        .select(`
          *,
          player1:player1_id(id, username, email),
          player2:player2_id(id, username, email),
          spectator:spectator_id(id, username, email)
        `)
        .eq('tournament_id', tournamentId)
        .order('round', { ascending: true })
        .order('match_number', { ascending: true });

      setMatches(matchesData || []);

      // Get active spectators
      const { data: spectatorsData } = await supabase
        .from('spectators')
        .select(`
          *,
          user:user_id(id, username, email)
        `)
        .eq('status', 'active');

      setSpectators(spectatorsData || []);

    } catch (error) {
```

### Step 4: Add Bracket Section to UI

**Find the Participants section (around line 274):**

```tsx
          </div>

        </div>
```

**Add BEFORE `</div>` (before the closing of the main column):**

```tsx
          </div>

          {/* Bracket & Match Schedule */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Brackets className="w-5 h-5 text-purple-500" />
                Bracket & Match Schedule
              </h3>

              {!editingBracket && (
                <button
                  onClick={() => setEditingBracket(true)}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Pairings
                </button>
              )}
            </div>

            {editingBracket ? (
              <AdminBracketEditor
                tournamentId={tournamentId}
                participants={participants}
                existingMatches={matches}
                spectators={spectators}
                onSave={() => {
                  setEditingBracket(false);
                  loadTournamentDetails();
                }}
                onCancel={() => setEditingBracket(false)}
              />
            ) : (
              <TournamentBracket
                matches={matches}
                isAdmin={true}
                onMatchClick={(match) => {
                  router.push(`/admin/matches/{match.id}`);
                }}
              />
            )}
          </div>

        </div>
```

---

## That's it! The bracket system will now work on the admin tournament page! 🚀
