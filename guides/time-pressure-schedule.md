# Time-Pressure Practice Schedule

A 6-week calendar plan for the exercises in `time-tested-pressure.md`. Importable as `time-pressure-schedule.ics` (drag-and-drop into Google Calendar / Apple Calendar / Outlook).

═════════════════════════════════════════════════
ASSUMPTIONS — edit before importing
═════════════════════════════════════════════════

```
  Timezone     America/Los_Angeles (Seattle)
  Start        Monday 2026-06-08
  End          Saturday 2026-07-18  (6 weeks)
  Weekday AM   7:00 - 7:50 PT (daily reps)
  Thu add-on   7:50 - 8:00 PT (bounded uncertainty)
  Weekday PM   12:30 - 12:50 PT (cross-cutting, 3×/wk)
  Saturday     9:00 - 10:30 PT (normal weeks)
               9:00 - 13:00 PT (mock-loop or take-home weeks)
  Sunday       REST — no scheduled exercise
```

Move slots by ±2 hours without breaking the plan; just keep the weekly structure.

═════════════════════════════════════════════════
WEEKLY RHYTHM
═════════════════════════════════════════════════

```
                Mon    Tue    Wed    Thu    Fri    Sat        Sun
  ─────────────────────────────────────────────────────────────────
  7:00 AM       LC     LC     LC     LC     LC     —          —
                +STAR  +STAR  +STAR  +STAR  +STAR
                                     +BU
  12:30 PM      XC     —      XC     —      XC     —          —
  9:00 AM       —      —      —      —      —      MOCK*      —

  LC    = LeetCode 45 min, narrated aloud
  STAR  = 90-sec STAR delivery, recorded
  BU    = Bounded-uncertainty drill 10 min (Thursdays only)
  XC    = Cross-cutting exercise 20 min — rotates:
            Mon → project walkthrough + Q&A
            Wed → "why not X?" reps
            Fri → onboarding pitch (90 sec, recorded × 3)
  MOCK* = varies by week (see below)
  Sun   = REST. Burnout kills prep.
```

═════════════════════════════════════════════════
SATURDAY VARIATION — 6 weeks
═════════════════════════════════════════════════

```
  Week  Date          Saturday session
  ────────────────────────────────────────────────────────────
  1     Jun 13 2026   Peer mock 60 min + recording review 30 min
  2     Jun 20 2026   FULL MOCK LOOP — 3-4 rounds back-to-back (4h)
  3     Jun 27 2026   Peer mock 60 min + recording review 30 min
  4     Jul 4  2026   TAKE-HOME TIME-BOX — 4 hrs, real decision,
                      ship a design doc, peer red-teams next day
                      (note: US Independence Day — move if needed)
  5     Jul 11 2026   Peer mock 60 min + recording review 30 min
  6     Jul 18 2026   FULL MOCK LOOP — final dress rehearsal (4h)
```

═════════════════════════════════════════════════
WEEKLY TIME BUDGET
═════════════════════════════════════════════════

```
  Daily reps      50 min × 5 = 4 hr 10 min
  Bounded unc.    10 min × 1 =     10 min
  Cross-cutting   20 min × 3 =  1 hr  0 min
  Saturday        90 min × 1 =  1 hr 30 min  (normal weeks)
                  4 hrs   × 1 =  4 hr  0 min  (heavy weeks: 2, 4, 6)
  ─────────────────────────────────────────────
  Normal week     ~ 7 hours
  Heavy week      ~10 hours
```

Reasonable load alongside a full-time job. If you're between roles and can go full-time on prep, double the cross-cutting + daily and add a second mock midweek.

═════════════════════════════════════════════════
IMPORT INSTRUCTIONS
═════════════════════════════════════════════════

```
  Google Calendar    Settings → Import & Export → Import →
                     select time-pressure-schedule.ics →
                     choose target calendar → Import

  Apple Calendar     File → Import → select the .ics →
                     drag onto a calendar in the sidebar

  Outlook            File → Open & Export → Import/Export →
                     iCalendar (.ics) file
```

All events are tagged `[AIPE]` in the title so you can filter, mass-edit, or mass-delete after the 6 weeks.

═════════════════════════════════════════════════
POST-6-WEEKS
═════════════════════════════════════════════════

If you finish without an interview lined up:

  → Swap take-homes for new project drills (`/aipe:drill`).
  → Keep one weekly mock rolling — the muscle is maintained, not
    maintained-once.
  → Re-run `/aipe:rehearse-behavioral-stories` to surface stories
    your last 6 weeks of mocks generated (yes, the mocks themselves
    become STAR material — "how I prepared for this loop" is a real
    story for the right interviewer).
  → Drop daily LeetCode to 3×/week to avoid burn-down between loops.

If you finish WITH an interview lined up, the dress rehearsal in
week 6 is the muscle test. The last 24 hours before should be
re-reading your bank + sleeping, not new material.
