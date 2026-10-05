# RepsnSets — V1 Requirements

## 1. Product Overview

Gym Workout Tracker is an offline-first Progressive Web App (PWA) for tracking gym workouts, exercise performance, body measurements, workout duration, and workout progression.

Version 1 is a **frontend-only application**.

There is no backend, authentication system, or remote database in V1.

All application data must be stored locally using:

* React
* Dexie.js
* IndexedDB
* PWA / Service Worker

The application must work completely offline after the PWA has been installed and its assets have been cached.

---

# 2. V1 Goals

The application should allow a user to:

1. Create and manage multiple local profiles.
2. Create one active workout plan per profile.
3. Define any number of workout days in the plan.
4. Add exercises to each workout day.
5. Create custom exercises.
6. Reuse exercises from the exercise dictionary.
7. Define alternative exercises.
8. Reorder exercises within a workout day.
9. Start, pause, resume, and complete workouts.
10. Continue an incomplete workout after reopening the app.
11. Load the previous performance of each exercise.
12. Copy previous sets into the current workout.
13. Modify copied sets before saving.
14. Add additional sets.
15. Record body weight.
16. Record body measurements.
17. Record treadmill, cycling, and plank activities.
18. Use a generic stopwatch and save its result as an activity.
19. Add workout-level and exercise-level notes.
20. Edit completed workouts.
21. Delete completed workouts.
22. View workout history.
23. View body-weight progression.
24. View workout-duration history for the last six days.
25. Export all application data to JSON.
26. Import previously exported JSON data.
27. Use light and dark themes.
28. Use the application completely offline.

---

# 3. Explicit V1 Non-Goals

The following features are intentionally excluded from V1:

* Backend
* Cloud database
* User authentication
* Account/login
* Data synchronization across devices
* Push notifications
* Workout reminders
* Rest timer
* Supersets
* Online exercise database
* Social features
* Sharing workouts
* Leaderboards
* AI workout recommendations
* Automatic workout programming
* Calorie tracking
* Nutrition tracking

These may be considered in future versions.

---

# 4. Technology Requirements

## 4.1 Frontend

The application should be built using React.

The implementation should use a maintainable component-based architecture.

## 4.2 Local Database

Use:

* Dexie.js
* IndexedDB

IndexedDB is the source of truth for application data.

React state must not be treated as the permanent data store.

## 4.3 PWA

The application must be installable as a PWA.

Requirements:

* Application manifest
* Service worker
* Offline application shell
* Cached application assets
* App should open without an internet connection after installation

## 4.4 Units

V1 uses metric units only.

Weight:

* KG

Distance:

* KM

Body measurements:

* CM

No LB support is required in V1.

---

# 5. Profiles

The application supports multiple local profiles.

When the application starts, the user should be prompted to select a profile.

Example:

```text
Select Profile

[ Profile A ]
[ Profile B ]

[ + Create Profile ]
```

If no profiles exist, the application must automatically redirect the user to profile creation.

## 5.1 Profile Information

A profile contains:

* Name
* Gender
* Date of Birth
* Height
* Created timestamp
* Updated timestamp

Do not permanently store age as the primary profile field.

Age should be calculated from Date of Birth when required.

## 5.2 Active Profile

The application must maintain an active profile.

All profile-specific data must be associated with the corresponding profile ID.

A user switching profiles must only see data belonging to the selected profile.

---

# 6. Workout Plan

Each profile has exactly **one active workout plan** in V1.

The user can edit the active plan at any time.

## 6.1 Workout Plan Information

The plan contains:

* Plan name
* Number of workout days
* Ordered workout days

The user should be able to define the number of workout days per week during initial plan creation.

The application must dynamically create the required number of workout-day slots.

Example:

```text
Workout Plan: PPL

Day 1
Day 2
Day 3
Day 4
Day 5
Day 6
```

Workout days are sequence-based.

They are NOT tied to calendar days.

---

# 7. Workout Sequence Logic

Workout progression is based on workout-day completion.

Example:

```text
Day 1 → Push A
Day 2 → Pull A
Day 3 → Legs A
Day 4 → Push B
Day 5 → Pull B
Day 6 → Legs B
```

If Day 1 is completed:

```text
Next Workout = Day 2
```

If the user does not work out for several calendar days, the next workout remains Day 2.

The application must NOT automatically skip missed workout days.

For example:

```text
Monday:
Day 1 completed

Tuesday:
No workout

Wednesday:
No workout

Thursday:
Next Workout = Day 2
```

After the final workout day is completed, progression loops back to Day 1.

```text
Day 1
  ↓
Day 2
  ↓
Day 3
  ↓
...
Day N
  ↓
Day 1
```

---

# 8. Workout Day

Each workout day has:

* Name
* Display order
* Exercises
* Exercise order

Example:

```text
Day 1 — Push A

1. Bench Press
2. Incline Dumbbell Press
3. Cable Fly
4. Lateral Raise
5. Triceps Pushdown
```

The user must be able to:

* Add exercises
* Remove exercises
* Reorder exercises
* Edit workout-day name
* Add alternative exercises
* Modify the workout plan after it has already been created

---

# 9. Exercise Dictionary

The application maintains a global exercise dictionary.

The exercise dictionary is shared across profiles unless the implementation explicitly determines otherwise.

Users can:

* Add exercises
* Edit exercises
* Search exercises
* Soft-delete exercises

## 9.1 Exercise Information

An exercise should contain information such as:

* ID
* Name
* Exercise type
* Muscle group
* Default unit
* Active/deleted status
* Created timestamp
* Updated timestamp

## 9.2 Exercise Types

V1 should support at least:

```text
WEIGHT_REPS
REPS
TIME
DISTANCE
```

Examples:

```text
Bench Press
Type: WEIGHT_REPS

Pull-ups
Type: REPS

Plank
Type: TIME

Treadmill
Type: TIME / DISTANCE
```

The application should not assume every exercise is weight + reps.

## 9.3 Exercise Soft Delete

Exercises must be soft-deleted.

Do not physically remove an exercise from the database if it has historical references.

Example:

```text
isActive = false
```

A soft-deleted exercise:

* Should not appear in new exercise selections by default.
* Must remain available for historical workout records.
* Must not break existing workout plans or workout history.

---

# 10. Adding Exercises to Workout Plans

When adding an exercise to a workout day, the user should be able to:

1. Select an existing exercise from the exercise dictionary.
2. Create a new exercise.
3. Add an alternative exercise.

If an existing exercise has already been added to another workout day, the application should notify the user.

Example:

```text
Bench Press is already used in:
- Push A

Do you still want to add it to Pull B?

[ Cancel ]
[ Add Anyway ]
```

This is a warning only.

The user is allowed to reuse the exercise.

---

# 11. Alternative Exercises

A planned exercise may have one or more alternative exercises.

Example:

```text
Primary:
Bench Press

Alternative:
Machine Chest Press
```

Alternatives belong to the planned exercise within the workout plan.

An alternative relationship should not necessarily be global.

Example:

```text
Push A:
Bench Press
Alternative → Machine Chest Press

Push B:
Bench Press
Alternative → Dumbbell Chest Press
```

The user should be able to choose an alternative while performing a workout.

---

# 12. Exercise Ordering

Exercises within a workout day must be reorderable.

The preferred UI is drag-and-drop.

Example:

```text
☰ Bench Press
☰ Incline DB Press
☰ Cable Fly
☰ Lateral Raise
☰ Triceps Pushdown
```

The order must be persisted.

Do not rely on database insertion order.

Each planned exercise should have an explicit ordering value.

---

# 13. Dashboard

After selecting a profile, the user lands on the Dashboard.

The Dashboard should contain:

1. Profile summary
2. Body weight
3. Height
4. Gender
5. Calculated age
6. Calculated BMI
7. Body-weight graph
8. Last completed workout
9. Next workout
10. Workout-duration graph
11. Quick access to start the next workout

---

# 14. Dashboard — Profile Summary

Show:

```text
Name
Age
Gender
Height
Current Weight
BMI
```

BMI is derived data.

Do not permanently store BMI as the source of truth.

Calculate it from:

```text
BMI = weightKg / (heightMeters × heightMeters)
```

---

# 15. Dashboard — Last Completed Workout

Show the most recently completed workout.

Example:

```text
LAST WORKOUT

Push A
Completed: 05 Oct 2026
Duration: 01:12:35

[ View Results ]
```

Clicking it opens the completed workout details.

---

# 16. Dashboard — Next Workout

Show the next workout according to the workout sequence.

Example:

```text
NEXT WORKOUT

Day 2
Pull A

5 Exercises

[ Start Workout ]
```

The same workout must also be accessible through the Workout module.

---

# 17. Dashboard — Body Weight Graph

Display body-weight progression over time.

The graph should use recorded body-weight entries.

The application should not require the user to enter body weight on every workout.

Body weight is an independent measurement history.

Future versions may provide selectable ranges such as:

* 7 days
* 30 days
* 3 months
* 6 months
* 1 year

The exact range selector is optional for V1.

---

# 18. Dashboard — Workout Duration Graph

Show workout duration as a bar graph.

Only the most recent six calendar days should be displayed.

Example:

```text
Workout Duration

Mon  ███████
Tue
Wed  █████████
Thu  █████
Fri
Sat  ████████
```

Days without a completed workout should not be treated as completed workouts.

Only completed workout sessions should contribute to this graph.

---

# 19. Workout Module

The Workout module allows the user to perform a planned workout.

The user can access a workout through:

* Dashboard → Next Workout
* Workout module

The workout screen should provide:

* Start
* Pause
* Resume
* Complete
* Exercise list
* Previous workout performance
* Sets
* Add Set
* Notes
* Body weight
* Body measurements
* Treadmill
* Cycling
* Plank
* Stopwatch

---

# 20. Starting a Workout

When the user presses Start:

1. Create an in-progress workout session immediately.
2. Persist it to IndexedDB.
3. Start tracking elapsed workout time.
4. Load the planned exercises.
5. Load the previous completed performance for each exercise where available.

The workout should not wait until completion before creating the session.

---

# 21. Workout Timer

The workout timer supports:

```text
START
PAUSE
RESUME
COMPLETE
```

Paused time must not count toward active workout duration.

The timer must be robust against:

* Browser backgrounding
* Screen locking
* PWA being temporarily suspended
* User switching applications

Do not rely only on a continuously running JavaScript `setInterval()` to determine elapsed duration.

Persist timestamps and calculate elapsed duration from timestamps.

---

# 22. Incomplete Workout Handling

If the application detects an `IN_PROGRESS` workout when the app starts, notify the user.

Example:

```text
Incomplete Workout

You have an unfinished Push A workout.

Started:
05 Oct 2026, 7:30 PM

[ Resume Workout ]
[ Discard Workout ]
```

The workout should remain recoverable until the user either:

* Completes it
* Discards it

The application should not silently lose an incomplete workout.

---

# 23. Exercise Sets

Each exercise can contain any number of sets.

The user must have an:

```text
[ + Add Set ]
```

button.

For weight + rep exercises:

```text
Set     Weight     Reps

1       40 kg      10
2       40 kg      10
3       42.5 kg     8

[ + Add Set ]
```

The fields must remain editable.

---

# 24. Previous Workout History

When starting an exercise, load the most recent completed performance for that exercise in the relevant workout context.

Example:

```text
Previous Workout

Bench Press

40 kg × 10
40 kg × 10
40 kg × 8
```

The current workout should be pre-populated using the previous sets.

The user must be able to:

* Change weight
* Change reps
* Delete a set
* Add a set
* Change the number of sets

Previous data must never be overwritten.

The current workout creates a new historical record.

---

# 25. Copy Previous Sets

Previous sets should be copied into the new workout as editable values.

Example:

```text
Previous:
40 × 10
40 × 10
40 × 8

Current:
40 × 10
40 × 10
40 × 8
```

The user can modify:

```text
42.5 × 8
```

without changing the previous workout.

---

# 26. Workout Notes

The user can add a workout-level note.

Example:

```text
Workout Notes:

Felt strong today.
Increased bench press weight.
```

Notes should be editable after workout completion.

---

# 27. Exercise Notes

The user can add notes to an individual exercise.

Example:

```text
Bench Press

Notes:
Last set was difficult.
```

Exercise notes should be preserved with the workout session.

---

# 28. Body Weight During Workout

The user should be able to record the day's body weight from the workout screen.

Saving body weight should create a body-weight measurement entry.

It should not simply overwrite a profile-level current-weight value.

---

# 29. Body Measurements

The user should be able to record body measurements.

Supported V1 measurements should include:

* Weight
* Waist
* Chest
* Left arm
* Right arm
* Left thigh
* Right thigh
* Left calf
* Right calf

All fields are optional.

A user may record only the measurements they have available.

Each measurement entry should have a timestamp/date.

Historical measurements must be preserved.

---

# 30. Activities

Workout activities are separate from normal resistance-training exercises.

V1 activities:

* Treadmill
* Cycling
* Plank

Each activity should support an appropriate duration/time value.

Example:

```text
Treadmill
15 minutes

Cycling
10 minutes

Plank
1 minute 30 seconds
```

---

# 31. Generic Stopwatch

The workout screen should provide a generic stopwatch.

Example:

```text
STOPWATCH

00:15:32

[ STOP ]
```

When stopped, ask the user:

```text
Save this activity as:

○ Treadmill
○ Cycling
○ Plank
○ Don't Save
```

If the user chooses an activity, save it against the current workout session.

If the user chooses "Don't Save", discard the stopwatch result.

---

# 32. Completing a Workout

When the user selects Complete:

Show a confirmation/summary.

Example:

```text
Complete Workout?

Workout:
Push A

Duration:
01:12:35

Exercises:
5

Sets:
15

Body Weight:
75.4 kg

[ Cancel ]
[ Complete ]
```

After completion:

1. Mark the session as completed.
2. Persist all sets.
3. Persist all activities.
4. Persist notes.
5. Persist measurements.
6. Update the workout sequence.
7. Determine the next workout.
8. Update the dashboard.

---

# 33. Completed Workout History

Completed workouts must be retained as historical records.

A completed workout should contain enough information to reconstruct what happened on that date.

Historical records must not change if the workout plan is modified later.

For example:

If the user changes:

```text
Push A
Bench Press → Machine Chest Press
```

an old completed Push A workout must still display what was actually performed.

---

# 34. Edit Completed Workout

Users can edit completed workouts.

They may modify:

* Sets
* Weight
* Reps
* Activities
* Body weight
* Body measurements associated with the workout
* Workout notes
* Exercise notes

Editing a completed workout must update that historical workout rather than creating an unrelated duplicate session.

---

# 35. Delete Completed Workout

Users can delete completed workouts.

Show a confirmation before deletion.

Example:

```text
Delete Workout?

This workout and its recorded results will be removed.

[ Cancel ]
[ Delete ]
```

Deleting a workout must not delete exercises from the exercise dictionary.

---

# 36. Workout Plan Editing

The user can modify the active workout plan after creation.

Supported operations:

* Rename plan
* Change workout-day names
* Add/remove exercises
* Reorder exercises
* Add/remove alternatives
* Modify exercise configuration

Changes to the plan must not corrupt historical workout records.

Historical workouts represent what actually happened at that time.

---

# 37. Exercise Dictionary Management

The Exercise Dictionary module supports:

### Add

Create a new exercise.

### Edit

Modify an existing exercise's information.

### Soft Delete

Mark an exercise inactive.

### Search

Search exercises by name.

Soft-deleted exercises should not normally appear in new workout-plan selection.

They must remain available for historical records.

---

# 38. Data Model Principles

The application should distinguish between:

### Profile data

Who is performing the workout.

### Exercise dictionary

What exercises exist.

### Workout plan

What the user intends to perform.

### Workout session

What the user actually performed.

### Measurements

How the user's body changed over time.

### Activities

Additional cardio/core activities performed during workouts.

Do not combine these concepts into one large database object.

---

# 39. Historical Data Integrity

Historical data is extremely important.

Changing a workout plan must not rewrite old workout history.

Changing an exercise name must not make old historical workouts ambiguous.

Deleting an exercise must not break old workouts.

Deleting a workout must only affect that workout's historical session data.

---

# 40. Data Export

V1 must support exporting all application data.

The export format should be JSON.

Example filename:

```text
gym-tracker-backup-2026-10-05.json
```

The exported file should contain all required data to reconstruct the local application state, including:

* Profiles
* Exercises
* Workout plans
* Workout days
* Planned exercises
* Workout sessions
* Sets
* Activities
* Body measurements
* Relevant settings

---

# 41. Data Import

V1 must support importing previously exported JSON backups.

Import should:

1. Validate the file.
2. Validate the backup format/version.
3. Prevent malformed data from corrupting IndexedDB.
4. Import all supported entities.
5. Preserve relationships between records.
6. Handle duplicate IDs safely.
7. Provide a clear success/failure message.

The export format must contain a schema/data version.

Example:

```json
{
  "version": 1,
  "exportedAt": "...",
  "data": {}
}
```

Future versions should be able to introduce migrations.

---

# 42. Theme

The application supports:

* Light theme
* Dark theme

Recommended default:

* System preference

The selected theme should persist locally.

---

# 43. Mobile-First UX

The primary target is mobile.

The UI must be designed for one-handed/touch interaction where practical.

Workout entry should minimize typing.

Controls such as:

```text
+ Add Set
Start
Pause
Resume
Complete
```

should be easy to access during a workout.

The application should also remain usable on desktop/tablet screens.

---

# 44. Recommended Main Navigation

The application should use persistent navigation rather than a strictly linear flow.

Recommended structure:

```text
Dashboard
Workout
Plan
More
```

Potentially:

```text
Dashboard
Workout
Plan
Exercises
More
```

The exact visual implementation can be decided during UI architecture.

---

# 45. Suggested Application Flow

## First Launch

```text
Open PWA
   ↓
Profiles exist?
   │
   ├── No
   │    ↓
   │  Create Profile
   │    ↓
   │  Create Workout Plan
   │    ↓
   │  Dashboard
   │
   └── Yes
        ↓
      Select Profile
        ↓
      Dashboard
```

---

# 46. Normal Usage Flow

```text
Open PWA
   ↓
Select Profile
   ↓
Dashboard
   ↓
View Next Workout
   ↓
Start Workout
   ↓
Load Previous Performance
   ↓
Perform Exercises
   ↓
Add/Edit Sets
   ↓
Record Body Weight
   ↓
Record Measurements
   ↓
Record Activities
   ↓
Add Notes
   ↓
Complete Workout
   ↓
Dashboard
   ↓
Next Workout Updated
```

---

# 47. Workout Sequence Example

Example six-day plan:

```text
Day 1 → Push A
Day 2 → Pull A
Day 3 → Legs A
Day 4 → Push B
Day 5 → Pull B
Day 6 → Legs B
```

After:

```text
Push A completed
```

the dashboard shows:

```text
Next Workout:
Pull A
```

If the user waits three days:

```text
Next Workout:
Pull A
```

It must not automatically move to Legs A.

After:

```text
Legs B completed
```

the next workout becomes:

```text
Push A
```

---

# 48. Important Data Integrity Rules

The following rules must always be respected:

1. IndexedDB is the persistent source of truth.
2. Every profile-specific entity must reference a profile ID where applicable.
3. Workout sessions must preserve historical information.
4. Workout-plan changes must not rewrite historical workouts.
5. Exercise deletion must be soft deletion.
6. Previous workout sets must be copied, not referenced as editable objects.
7. In-progress workouts must be persisted.
8. Timers must use timestamps rather than relying solely on JavaScript intervals.
9. Completed workout history must remain available until explicitly deleted.
10. Export/import must preserve relationships.
11. Import must validate data before modifying the database.
12. There is only one active workout plan per profile in V1.
13. Workout progression is sequence-based, not calendar-based.
14. Missed workouts must not be skipped automatically.
15. KG is the only supported weight unit in V1.

---

# 49. V1 Feature Checklist

| Feature                                          | Status       |
| ------------------------------------------------ | ------------ |
| Multiple profiles                                | Required     |
| Profile selection                                | Required     |
| Profile creation                                 | Required     |
| Profile editing                                  | Required     |
| Date of birth                                    | Required     |
| Height                                           | Required     |
| Gender                                           | Required     |
| One active plan/profile                          | Required     |
| Configurable workout days                        | Required     |
| Workout sequence                                 | Required     |
| Missed workout handling                          | Required     |
| Exercise dictionary                              | Required     |
| Create exercise                                  | Required     |
| Edit exercise                                    | Required     |
| Soft-delete exercise                             | Required     |
| Search exercises                                 | Required     |
| Alternative exercises                            | Required     |
| Exercise warning for duplicate workout-day usage | Required     |
| Exercise reordering                              | Required     |
| Workout start                                    | Required     |
| Workout pause                                    | Required     |
| Workout resume                                   | Required     |
| Workout completion                               | Required     |
| Incomplete workout detection                     | Required     |
| Resume incomplete workout                        | Required     |
| Discard incomplete workout                       | Required     |
| Previous workout history                         | Required     |
| Copy previous sets                               | Required     |
| Edit copied sets                                 | Required     |
| Add sets                                         | Required     |
| Workout notes                                    | Required     |
| Exercise notes                                   | Required     |
| Body weight                                      | Required     |
| Body measurements                                | Required     |
| Treadmill                                        | Required     |
| Cycling                                          | Required     |
| Plank                                            | Required     |
| Generic stopwatch                                | Required     |
| Workout history                                  | Required     |
| Edit completed workout                           | Required     |
| Delete completed workout                         | Required     |
| Body weight graph                                | Required     |
| Six-day workout duration graph                   | Required     |
| BMI calculation                                  | Required     |
| Offline functionality                            | Required     |
| PWA installation                                 | Required     |
| IndexedDB                                        | Required     |
| Dexie.js                                         | Required     |
| JSON export                                      | Required     |
| JSON import                                      | Required     |
| Import validation                                | Required     |
| Light theme                                      | Required     |
| Dark theme                                       | Required     |
| Rest timer                                       | Out of scope |
| Supersets                                        | Out of scope |
| Notifications                                    | Out of scope |
| Backend                                          | Out of scope |
| Authentication                                   | Out of scope |
| Cloud sync                                       | Out of scope |
| Social features                                  | Out of scope |
| Nutrition tracking                               | Out of scope |

---

# 50. Future Version Candidates

Do not implement these in V1 unless explicitly requested.

Potential future features:

* Cloud synchronization
* User accounts
* Multi-device synchronization
* Authentication
* Workout reminders
* Push notifications
* Rest timer
* Supersets
* Drop sets
* Progressive overload recommendations
* Exercise PR tracking
* Volume analytics
* Muscle-group volume analytics
* Advanced charts
* Exercise videos
* Exercise instructions/images
* Nutrition tracking
* Calorie tracking
* AI workout recommendations
* Social/sharing functionality
* Workout templates
* Multiple active workout plans
* Automatic plan scheduling
* Calendar-based workout history
* Wearable integrations
* Apple Health / Google Health Connect integration

---

# 51. Development Constraint

Do not introduce a backend or remote service into V1.

Do not add authentication.

Do not introduce cloud synchronization.

The application should remain fully functional using only:

```text
React
    +
Dexie.js
    +
IndexedDB
    +
PWA
```

The architecture should, however, avoid making future backend synchronization impossible.

---

# 52. Implementation Guidance for Cursor

Treat this document as the **source of truth for V1 requirements**.

Before implementing a feature:

1. Check whether it is explicitly included in this document.
2. Do not add V2 features unless explicitly requested.
3. Preserve historical workout data.
4. Prefer normalized data relationships over large nested objects where appropriate.
5. Keep the application offline-first.
6. Keep IndexedDB access isolated behind a data-access/repository layer rather than accessing Dexie directly throughout UI components.
7. Keep business logic separate from presentation components.
8. Use TypeScript types/interfaces for persisted entities.
9. Use stable IDs for persisted records.
10. Include database/schema versioning and migration support.
11. Do not silently discard user data.
12. Confirm destructive operations such as deleting workouts.
13. Treat an in-progress workout as recoverable persistent state.
14. Keep the UI mobile-first.
15. Avoid adding unnecessary dependencies.

---

# 53. Current Project Status

The requirements phase for V1 is complete.

The next development phase should **NOT start automatically**.

When explicitly instructed with:

```text
NEXT STEP
```

the next task is:

**Design the complete V1 data model and Dexie.js schema**, including:

* Database tables
* Entity definitions
* TypeScript interfaces
* Primary keys
* Indexed fields
* Relationships
* Workout-session state machine
* Workout progression logic
* Historical-data strategy
* Import/export schema
* Example records
* Dexie database structure
* Migration/versioning strategy

Do not begin implementation until the data model is reviewed and approved.
