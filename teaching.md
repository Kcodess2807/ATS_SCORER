# Recorded Bootcamp Script — `backend/database/supabase_db.py`

> **Format:** Hinglish (Hindi sentence-structure + English tech terms)
> **Style:** Recorded video — direct camera delivery, no instructor meta-markers
> **Duration:** ~20–25 min
> **Sections:** Intro → Supabase Kya Hai → File Walkthrough → Live Coding → Recap

---

## SECTION 1 — Hook + Intro (recorded, direct to camera) (~2 min)

---

"Kya chal raha hai guys — welcome back.

Aaj ka session thoda interesting hai — kyunki aaj hum database touch karenge. Specifically, hum dekhenge ki hamari ATS Resume Scorer app Supabase ke saath kaise baat karti hai.

File hai `backend/database/supabase_db.py` — teen functions hain, aur aaj hum unhe ek-ek karke tod ke dekhenge. Lekin pehle — aur yeh important hai — pehle hum yeh samjhenge ki **Supabase actually kya hai**. Kyunki agar yeh clear nahi hai, toh file mein jo bhi likhenge woh gibberish lagega.

Toh chalo — Supabase se shuru karte hain."

---

## SECTION 2 — Supabase Kya Hai? (recorded, direct to camera + diagram/slides) (~5 min)

---

"Socho ki tum ek web app bana rahe ho. Kya chahiye hoga tumhe?

Pehli cheez — **database**. Data kahan store karoge? Postgres? MySQL? SQLite?

Doosri cheez — **auth**. Users login karenge — toh unhe pehchanna kaise? JWT? Sessions? OAuth?

Teesri cheez — kabhi-kabhi **file storage**. User ne image upload ki — kahan rakhoge?

Normally yeh teeno cheezein alag-alag set up karni padti hain. Postgres khud configure karo, auth ke liye JWT khud likho, file storage ke liye S3 ya kuch aur lagao. Bahut time, bahut complexity.

**Supabase yeh saara kaam ek jagah deta hai.**

Andar kya chal raha hai? Pure **PostgreSQL**. Real SQL database — tables hain, rows hain, joins hain, full power. Lekin uske upar Supabase ek **REST API automatically bana deta hai**. Matlab tumhare table ka naam agar `analyses` hai, toh `rest/v1/analyses` URL automatically ready hai — koi extra code nahi likhna.

Aur nahi chahiye koi database driver — koi `psycopg2` nahi, koi `SQLAlchemy` nahi. Bas HTTP calls.

---

**Firebase se comparison:**

Maine socha tumse Firebase ka comparison karoon — bahut logon ne yeh use kiya hai.

Firebase bhi aise hi kaam karta hai — ek package mein sab kuch. Lekin difference yeh hai:

- Firebase ka database **NoSQL** hai — JSON documents, koi schema nahi
- Supabase mein **real SQL** hai — tum JOIN kar sakte ho, complex queries likh sakte ho, aur agar kabhi Supabase chhod ke koi aur DB use karna ho, toh PostgreSQL knowledge directly kaam aati hai

Aur ek aur cheez — Supabase **open-source** hai. Tumhare apne server pe bhi chalaa sakte ho agar chahiye.

---

**RLS — Row Level Security:**

Ek aur concept jaldi mention karta hoon — **RLS, Row Level Security**. Yeh Supabase ki badi baat hai.

Normally backend code mein hum likhte hain — 'sirf woh rows dikhao jinka `user_id` match karta hai'. Sahi hai, lekin yeh logic backend code mein hai.

RLS ke saath yeh same rule **database ke andar** likh sakte ho — SQL policy ke roop mein. Matlab chahe koi directly database se query kare, woh bhi unauthorized rows nahi dekh payega. Defense in depth.

Hamare code mein hum dono karenge — code-level filter bhi, aur Supabase dashboard mein RLS policy bhi. Aaj ke walkthrough mein code-level filter clearly dekhoge.

Theek hai — ab file kholte hain."

---

## SECTION 2.5 — Table Kaise Bani? (recorded, direct to camera + screen) (~3 min)

---

"Ek important cheez batana bhool gaya — aur yeh confusion bahut logon ko hoti hai pehli baar Supabase use karte waqt.

**`supabase_db.py` mein table creation ka koi code nahi hai.** Dhundhoge toh nahi milega — kyunki woh yahan hai hi nahi.

Reason simple hai — hum REST API se baat kar rahe hain, koi ORM nahi hai, koi migration tool nahi hai. SQLAlchemy hota toh models define karte aur `create_all()` chala dete. Prisma hota toh schema file se `migrate` chala dete. Yahan kuch nahi hai — toh tables **manually banana padta hai**.

Yeh by design hai Supabase ka. Supabase tumhara Python code nahi padhta — usse nahi pata ki tum kya store karna chahte ho. Table pehle se exist karni chahiye — tab REST API uspe kaam karega.

**Yahi wajah thi ki pehle humein `analyses` table missing milti thi.** Jab tak table banayi nahi, koi bhi `save_analysis()` call silently fail hoti thi — `except` block log karta tha, app chalta rehta tha, lekin history kabhi save nahi hoti thi.

---

**Tables banane ke 4 tarike hain — main quickly cover karta hoon:**

*[Screen: Supabase Dashboard kholo]*

**Pehla — SQL Editor.** Dashboard mein jaao, SQL Editor, New Query. SQL likho, run karo. Yeh mera favorite hai bootcamp ke liye — kyunki tum actually SQL likh rahe ho, copy-paste nahi kar rahe.

**Doosra — Table Editor.** Dashboard ka GUI — click karke columns add karo. Beginners ke liye visual hai, lekin ek problem hai — 'code likha hi nahi'. Kal kisi naye environment mein yahi setup reproduce karna ho toh kaise karoge? Schema ka koi record nahi.

**Teesra — Supabase CLI + migrations.** `supabase/migrations/` folder mein SQL files hoti hain, git mein version-controlled. Production aur team projects ke liye yeh **gold standard** hai. Ek team member ne schema change kiya — baaki sab `supabase db push` chala ke sync ho jaate hain.

**Chautha — Direct Postgres connection** — `psycopg2` ya `psql` se directly connect karke DDL chalaao. Ad-hoc setup ke liye kaam karta hai.

---

**Bootcamp ke liye hum SQL Editor use karenge.** Screen dekho:

*[Screen: Supabase Dashboard → SQL Editor → New Query]*

```sql
create table public.analyses (
  id              bigint generated by default as identity primary key,
  user_id         uuid not null,
  filename        text not null,
  ats_score       numeric,
  keyword_match   numeric,
  missing_keywords jsonb default '[]'::jsonb,
  analysis_result  jsonb not null,
  created_at      timestamptz default now()
);
```

Run karo. Table Editor mein jaao — `analyses` table wahan dikhi. Ab `save_analysis()` call maaro — row aayegi.

**Yeh connection yaad rakhna** — Python file mein jo column names hain — `ats_score`, `keyword_match`, `analysis_result` — yeh sab exactly yahan SQL mein define kiye hain. Agar kal column ka naam change kiya SQL mein aur Python mein nahi kiya, ya ulta — runtime error milega. Dono jagah sync rehna chahiye.

Theek hai — ab actual file kholte hain."

---

## SECTION 3 — File Open: Imports + `_get_headers()` (screen recording) (~3 min)

---

*[Screen: Open `backend/database/supabase_db.py`, scroll to top, Lines 1–19]*

---

"Yeh dekho — file ke top pe imports hain. Ek cheez notice karo — koi `psycopg2` nahi, koi `SQLAlchemy` nahi. Database ki file hai — lekin koi DB driver nahi.

Kyun? Kyunki Supabase REST API hai. Humein bas **`httpx`** chahiye — ek HTTP client. Bas itne se database se baat kar rahe hain.

```python
import logging
import httpx
import json
from datetime import datetime, timezone
from typing import List, Optional, Dict

logger = logging.getLogger('ats_resume_scorer')

from backend.core.config import SUPABASE_URL, SUPABASE_KEY
```

Aur `httpx` kyun, `requests` kyun nahi? Kyunki `httpx` **async** support karta hai natively. Hamari app FastAPI pe hai — jo async framework hai. Jab ek user resume upload kar raha hota hai aur hum DB call maar rahe hote hain, server ko block nahi hona chahiye — woh doosre requests bhi handle karta rahe. Isliye async.

---

Ab yeh function dekho — Lines 11 to 19:

```python
def _get_headers():
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
```

Yeh helper function hai — har HTTP request ke saath yeh headers jaate hain. Char cheezein hain, ek-ek samjho.

**`apikey`** aur **`Authorization`** — yeh dono Supabase ke security gateway ko batate hain ki hum authorized hain. Dono mein same key ja rahi hai — `SUPABASE_KEY`. Yeh hamaari **service_role key** hai — backend pe hi rakhni hai, kabhi frontend pe nahi bhejni. `.env` mein hoti hai.

**`Content-Type: application/json`** — standard. Body JSON format mein ja rahi hai.

**`Prefer: return=representation`** — yeh sabse interesting hai. Normally jab tum Supabase mein ek row INSERT karte ho, woh sirf `200 OK` deta hai — koi data wapas nahi. Yeh header lagao toh Supabase **poori inserted row wapas bhejta hai JSON mein**. Kyun chahiye? Kyunki inserted row ka `id` chahiye hoga humein — taaki user ko history mein usse refer kar sakein.

Aur notice karo — function `None` return karta hai agar env vars set nahi hain. Yeh **defensive coding** hai. App crash nahi karega agar `.env` theek se set nahi hua — bas history feature kaam nahi karega, baaki sab theek rahega."

---

## SECTION 4 — `save_analysis()`: Core Function (screen recording + live typing) (~7 min)

---

*[Screen: Lines 21–59]*

---

"Ab is file ka dil — `save_analysis()`.

```python
async def save_analysis(user_id: str, filename: str, analysis_result: Dict) -> Optional[str]:
```

`async def` — kyunki HTTP call karni hai, async hoga. Teen inputs: `user_id` — kis user ka hai, `filename` — kaunsi file thi, `analysis_result` — poora analysis ka dict. Return karta hai `Optional[str]` — successfully save hua toh inserted row ka ID string mein, warna `None`.

---

Pehle defensive check:

```python
    headers = _get_headers()
    if not headers:
        return None
```

Same pattern — config nahi hai, `None` return karo, crash nahi.

---

Ab yeh block dekho — yahan ek real bug fix ki story hai:

```python
    def _json_default(o):
        if hasattr(o, 'model_dump'):
            return o.model_dump()
        return str(o)
    serializable_result = json.loads(json.dumps(analysis_result, default=_json_default))
```

**Kya ho raha hai yahan?**

Hamara `analysis_result` jo aata hai, usmein nested Pydantic objects hote hain — jaise `IssueDetail` objects `detailed_feedback` list ke andar. Yeh Python objects hain, JSON nahi.

`json.dumps` in objects ko directly serialize nahi kar paata. Isliye `default=` argument dete hain — yeh function batata hai ki 'agar koi object serialize na ho, toh isko aise handle karo'.

Pehle hamara code tha `default=str` — matlab jo bhi serialize na ho, usse `str(obj)` bana do — string. **Yeh bug tha.** Jab baad mein DB se data wapas nikalte the, toh `IssueDetail` object ki jagah ek raw string milti — aur frontend crash karta tha.

Fix simple tha: agar object Pydantic ka hai — matlab `model_dump()` method hai usmein — toh `model_dump()` call karo. Yeh ek dict deta hai jo fully JSON-serializable hoti hai, saare nested fields ke saath.

**Phir turant `json.loads` kyun?**

Kyunki `json.dumps` ke baad jo string mili — usse parse karke wapas dict banate hain. Ab is dict mein koi Pydantic object nahi bacha — sab kuch pure dict, list, strings, numbers. Yeh **guaranteed JSON-safe** hai. Yeh sabse clean tarika hai complex Python objects ko fully serialize karne ka."

---

*[Screen: Lines 35–43]*

---

"Ab row banate hain:

```python
    doc = {
        "user_id": user_id,
        "filename": filename,
        "ats_score": serializable_result.get("ats_score", 0),
        "keyword_match": serializable_result.get("keyword_match", 0),
        "missing_keywords": serializable_result.get("missing_keywords", []),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "analysis_result": serializable_result,
    }
```

Yeh dict ek database row banega. Notice karo — kuch fields **top-level columns** hain: `ats_score`, `keyword_match`, `filename`. Aur poora analysis `analysis_result` column mein `jsonb` type mein ja raha hai.

**Yeh pattern bahut useful hai.** Jo fields tum dashboard mein filter karoge, sort karoge — unke liye proper columns banao. Baaki sab ek `jsonb` blob mein daal do. Best of both worlds — SQL queries aur flexible storage.

`created_at` hum khud bhej rahe hain — DB ka default `now()` bhi kaam karta, lekin explicit rakhna better control deta hai migration ke time."

---

*[Screen: Lines 45–59]*

---

"Ab actual HTTP call:

```python
    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/analyses"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=doc)
            response.raise_for_status()
            data = response.json()
            if data and len(data) > 0:
                inserted_id = str(data[0].get("id"))
                logger.info(f"Saved analysis for user {user_id}: {inserted_id}")
                return inserted_id
            return None
    except Exception as exc:
        logger.error(f"Failed to save analysis to Supabase: {exc}")
        return None
```

URL dekho — `{SUPABASE_URL}/rest/v1/analyses`. Yeh **PostgREST pattern** hai. Supabase tumhare har table ke liye automatically ek REST endpoint banata hai. Table ka naam `analyses` hai — endpoint hai `/rest/v1/analyses`. Koi extra backend code nahi likhna.

`async with httpx.AsyncClient()` — context manager. Client use ke baad clean up ho jaata hai automatically.

`response.raise_for_status()` — agar server ne 4xx ya 5xx bheja, toh exception raise hoga. `except` block usse pakad lega.

`response.json()` ek **list** return karta hai — object nahi. Kyunki Supabase batch insert support karta hai — ek call mein 10 rows daal sakte ho. Toh response hamesha list hoti hai. Hum pehle item ka `id` nikal lete hain.

Aur agar kuch bhi fail ho — network down, table missing, auth fail — `except` log karta hai, `None` return karta hai. App crash nahi hoti. **Yeh graceful degradation hai** — resume analysis user ko milti rahegi, bas history save nahi hogi."

---

## SECTION 5 — Live Coding Demo: Raw `curl` Call (screen recording, terminal) (~3 min)

---

*[Screen: Terminal]*

---

"Ab main tumhe dikhata hoon — yeh Python code actually kya kar raha hai under the hood.

Yeh dekhao — same cheez `curl` se karte hain:

```bash
curl -X POST \
  "https://YOUR_PROJECT.supabase.co/rest/v1/analyses" \
  -H "apikey: YOUR_SERVICE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "user_id": "00000000-0000-0000-0000-000000000000",
    "filename": "demo_resume.pdf",
    "ats_score": 72,
    "analysis_result": {}
  }'
```

Run karo.

*[Run command — response aata hai JSON mein, inserted row ke saath]*

Dekha? Wahi response jo Python code mein `data[0]` se nikalte hain — woh yahan hai. ID, saare fields.

Ab Supabase dashboard mein Table Editor kholo — wahan woh row seedha dikhtI hai.

**Yeh exactly wahi hai jo hamara Python code kar raha hai.** Python sirf ek wrapper hai — actual communication pure HTTP hai. Yeh powerful concept hai — iska matlab tum directly Postman, curl, ya browser se bhi Supabase ko hit kar sakte ho — debug karna bahut aasaan ho jaata hai."

---

## SECTION 6 — `get_user_history()`: PostgREST Filters (screen recording) (~4 min)

---

*[Screen: Lines 61–98]*

---

"Doosra function — `get_user_history()`. Ek user ki saari history fetch karni hai.

```python
async def get_user_history(user_id: str) -> List[Dict]:
    headers = _get_headers()
    if not headers:
        return []
    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/analyses"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url, 
                headers=headers, 
                params={
                    "user_id": f"eq.{user_id}",
                    "order": "created_at.desc"
                }
            )
```

Same structure — `GET` request is baar. Aur yeh query params dekho — yahan PostgREST ka asli magic hai.

`user_id=eq.{user_id}` — yeh URL parameter ban jaata hai `?user_id=eq.<uuid>`. PostgREST isko samajhta hai: 'sirf woh rows do jinka `user_id` column **equal** hai is value ke'. `eq` matlab equal.

Aur `order=created_at.desc` — newest records pehle. SQL mein yeh hota `ORDER BY created_at DESC`.

---

**PostgREST filter syntax** kaafi powerful hai — yahan kuch common operators hain:

- `eq.value` — equal
- `gt.5` / `gte.5` — greater than / greater than or equal
- `lt.100` / `lte.100` — less than / less than or equal
- `like.*pattern*` — pattern match (like SQL LIKE)
- `in.(a,b,c)` — value in list
- `is.null` — null check

Poori SQL WHERE clause REST params mein express kar sakte ho. Koi SQL likhna nahi.

---

*[Screen: Lines 81–95 — result mapping]*

```python
            results = []
            for doc in docs:
                results.append({
                    "id": str(doc.get("id")),
                    "filename": doc.get("filename", "resume"),
                    "resume_name": doc.get("filename", "resume"),
                    "job_title": "Software Engineer",
                    ...
                })
            return results
```

DB se jo shape aata hai aur frontend jo expect karta hai — woh exactly same nahi hote. Toh yahan mapping kar rahe hain.

`filename` ko do alag keys mein bhej rahe hain — `filename` aur `resume_name` — kyunki frontend ke do alag components inhe alag-alag keys se read karte hain.

Aur yeh `job_title: 'Software Engineer'` — haan, yeh hardcoded hai. Main honest rahoon toh yeh **technical debt** hai. Proper solution yeh hoga ki `job_title` column banao DB mein aur actually save karo. Yeh placeholder hai abhi — baad mein fix hoga. Real-world code mein aisi cheezein milti hain — important hai ki inhe pehchano aur track karo."

---

## SECTION 7 — `delete_analysis()`: Ownership Check (screen recording) (~3 min)

---

*[Screen: Lines 100–121]*

---

"Teesra aur last function — `delete_analysis()`.

```python
async def delete_analysis(analysis_id: str, user_id: str) -> bool:
    headers = _get_headers()
    if not headers:
        return False
    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/analyses"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                url, 
                headers=headers, 
                params={
                    "id": f"eq.{analysis_id}",
                    "user_id": f"eq.{user_id}"
                }
            )
            response.raise_for_status()
            return True
    except Exception as exc:
        logger.error(f"Failed to delete analysis {analysis_id}: {exc}")
        return False
```

`DELETE` request — aur query params mein **dono filters** hain: `id` aur `user_id`.

Yeh important kyun hai?

Socho — ek attacker ne apna JWT token use karke hamari API hit ki. Woh apna `user_id` provide karta hai — auth verify ho jaata hai. Lekin woh URL mein **kisi aur ka `analysis_id`** daal deta hai.

Agar sirf `id` filter hota, woh dusre ka data delete kar deta.

Lekin humne **dono** filters lagaye hain — `id=eq.<target_id>` aur `user_id=eq.<attacker_user_id>`. Database mein koi bhi row nahi hogi jo dono conditions satisfy kare — kyunki woh ID kisi aur user ki hai. DELETE 0 rows pe chalega. Koi data delete nahi hoga.

Yeh **ownership filtering** pattern hai. Aur yeh rule hai — **DELETE ya UPDATE ke time hamesha owner-id filter saath mein lagao**. ID pe akele trust mat karo.

Aur jaise maine Supabase intro mein bataya tha — agar RLS bhi enable karo Supabase dashboard mein, toh yeh same check **database layer pe bhi** enforce hoga. Code fail ho jaye toh bhi DB bach jaata hai. Defense in depth."

---

## SECTION 8 — Recap (direct to camera) (~2 min)

---

"Theek hai — wrap up karte hain.

Aaj humne dekha ki `supabase_db.py` mein teen functions hain aur teen HTTP methods se map hote hain:

- `save_analysis` — **POST** — ek row insert karna
- `get_user_history` — **GET** — filtered rows fetch karna
- `delete_analysis` — **DELETE** — ownership check ke saath row hatana

**Pattern har jagah same raha:**
1. Headers banao
2. URL banao — `{SUPABASE_URL}/rest/v1/{table_name}`
3. `httpx.AsyncClient` se call karo
4. Error gracefully handle karo — log aur safe default return

**Key takeaways jo yaad rakhna:**

Pehli — **Pydantic objects ko DB mein daalte time serialization check karo**. `default=str` ka shortcut baad mein bug deta hai. `model_dump()` use karo nested objects ke liye.

Doosri — **hot columns aur jsonb blob pattern**. Jo fields filter/sort karni hain — proper columns. Baaki sab `jsonb` mein.

Teesri — **ownership filter hamesha**. DELETE aur UPDATE mein `user_id` filter bholo mat, chahe auth already verify ho chuka ho.

Chauthi — **PostgREST syntax** — `eq.`, `gt.`, `like.`, `order=`, `limit=` — pure SQL power, sirf URL params mein.

Paanchvi — **graceful degradation** — DB fail ho toh app crash mat karo. Log karo, safe value return karo.

---

Agli video mein hum `backend/api/auth.py` dekhenge — jahan JWT verify hota hai aur `user_id` extract kiya jaata hai jo is file mein use hota hai. Woh piece dekhoge toh poora picture clear ho jaayega.

Tab tak — code likhte raho."

---

## Quick Reference Card

### HTTP Method → Function → Supabase URL

| HTTP | Function | URL | Key Detail |
|---|---|---|---|
| POST | `save_analysis` | `/rest/v1/analyses` | `Prefer: return=representation` se inserted row milti hai |
| GET | `get_user_history` | `/rest/v1/analyses?user_id=eq.X&order=created_at.desc` | PostgREST filters |
| DELETE | `delete_analysis` | `/rest/v1/analyses?id=eq.X&user_id=eq.Y` | Double filter = ownership check |

### PostgREST Filter Cheat Sheet

| Operator | Matlab | Example |
|---|---|---|
| `eq.` | equal | `user_id=eq.abc` |
| `neq.` | not equal | `status=neq.deleted` |
| `gt.` / `gte.` | greater (or equal) | `ats_score=gte.70` |
| `lt.` / `lte.` | less (or equal) | `score=lt.50` |
| `like.` | pattern match | `filename=like.*pdf*` |
| `in.` | value in list | `status=in.(active,pending)` |
| `is.` | null check | `deleted_at=is.null` |
| `order=` | sort | `order=created_at.desc` |
| `limit=` / `offset=` | pagination | `limit=10&offset=20` |
| `select=` | specific columns | `select=id,filename,ats_score` |