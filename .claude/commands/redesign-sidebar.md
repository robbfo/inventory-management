---
description: Redesign the app UI from a top nav bar to a modern SaaS vertical sidebar layout
---

# Redesign: Top Nav to Vertical Sidebar

Transform this Vue 3 app from a horizontal top-nav layout into a modern SaaS-style layout with a fixed 240px dark vertical sidebar. Follow the steps below exactly. All `.vue` file changes **must** be delegated to the `vue-expert` subagent via the Agent tool.

---

## Target Layout

```
┌──────────────────────┬────────────────────────────────────────┐
│  Brand Name          │                                        │
│  Subtitle            │  [router-view — page content]          │
├──────────────────────│                                        │
│  ○ Overview          │                                        │
│  ○ Inventory         │                                        │
│  ○ Orders            │                                        │
│  ○ Finance           │                                        │
│  ○ Demand Forecast   │                                        │
│  ○ Reports           │                                        │
├──────────────────────│                                        │
│  FILTERS             │                                        │
│  Time Period ▾        │                                        │
│  Location    ▾        │                                        │
│  Category    ▾        │                                        │
│  Status      ▾        │                                        │
│  [ Reset ]           │                                        │
├──────────────────────│                                        │
│  🌐 English          │                                        │
│  [JD] Jane Doe       │                                        │
└──────────────────────┴────────────────────────────────────────┘
  240px fixed, #0f172a           flex:1, margin-left:240px
```

---

## Design Tokens (do not deviate)

| Element | Value |
|---------|-------|
| Sidebar width | `240px` |
| Sidebar background | `#0f172a` |
| Sidebar position | `fixed; left:0; top:0; bottom:0; z-index:100; overflow-y:auto` |
| Logo zone height | `64px` |
| Active nav background | `#2563eb` |
| Nav link default color | `rgba(255,255,255,0.65)` |
| Nav link active color | `#ffffff` |
| Nav link hover background | `rgba(255,255,255,0.07)` |
| Dividers | `1px solid rgba(255,255,255,0.08)` |
| Filter select background | `rgba(255,255,255,0.08)` |
| Filter select border | `1px solid rgba(255,255,255,0.12)` |
| Filter select color | `rgba(255,255,255,0.85)` |
| Filter label color | `rgba(255,255,255,0.4)` |
| Main content margin | `margin-left:240px` |
| Main content padding | `padding:1.5rem 2rem` |

---

## Step 1 — Read Current Files

Before touching anything, read these four files:
- `client/src/App.vue`
- `client/src/components/FilterBar.vue`
- `client/src/components/LanguageSwitcher.vue`
- `client/src/components/ProfileMenu.vue`

Note the exact structure of each — especially:
- The nav route paths and their `t()` translation keys in `App.vue`
- The event names emitted by `ProfileMenu.vue` (`show-profile-details`, `show-tasks`)
- The CSS class names for dropdowns in `LanguageSwitcher.vue` and `ProfileMenu.vue`
- The task management refs/methods in `App.vue` script (keep them all)

---

## Step 2 — Create AppSidebar.vue (via vue-expert)

Use the Agent tool with `subagent_type: "vue-expert"` to create `client/src/components/AppSidebar.vue`.

Provide this full spec to vue-expert:

---
**File to create:** `client/src/components/AppSidebar.vue`

**Purpose:** Fixed left sidebar containing logo, navigation, global filters, language switcher, and profile menu. Replaces the `.top-nav` header and wraps `FilterBar`, `LanguageSwitcher`, and `ProfileMenu`.

**Imports needed:**
- `FilterBar` from `'./FilterBar.vue'`
- `LanguageSwitcher` from `'./LanguageSwitcher.vue'`
- `ProfileMenu` from `'./ProfileMenu.vue'`
- `useI18n` from `'../composables/useI18n'`
- `RouterLink` and `useRoute` from `'vue-router'`

**Emits:** `['show-profile-details', 'show-tasks']`

**Setup:**
```js
const { t } = useI18n()
const route = useRoute()
```

**Template structure:**
```html
<template>
  <div class="app-sidebar">
    <!-- Logo zone -->
    <div class="sidebar-logo">
      <span class="sidebar-brand">{{ t('nav.companyName') }}</span>
      <span class="sidebar-tagline">{{ t('nav.subtitle') }}</span>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <RouterLink to="/" class="nav-link" :class="{ active: route.path === '/' }">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        {{ t('nav.overview') }}
      </RouterLink>
      <RouterLink to="/inventory" class="nav-link" :class="{ active: route.path === '/inventory' }">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M5 6h6M5 9h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        {{ t('nav.inventory') }}
      </RouterLink>
      <RouterLink to="/orders" class="nav-link" :class="{ active: route.path === '/orders' }">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        {{ t('nav.orders') }}
      </RouterLink>
      <RouterLink to="/spending" class="nav-link" :class="{ active: route.path === '/spending' }">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 5v1.5M8 9.5V11M6.5 7.25C6.5 6.56 7.17 6 8 6s1.5.56 1.5 1.25c0 1.5-3 1.5-3 3C6.5 11 7.17 11 8 11s1.5-.44 1.5-1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        {{ t('nav.finance') }}
      </RouterLink>
      <RouterLink to="/demand" class="nav-link" :class="{ active: route.path === '/demand' }">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 12l4-4 3 2 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ t('nav.demandForecast') }}
      </RouterLink>
      <RouterLink to="/reports" class="nav-link" :class="{ active: route.path === '/reports' }">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="8" width="3" height="6" rx="0.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="6.5" y="5" width="3" height="9" rx="0.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="11" y="2" width="3" height="12" rx="0.5" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        Reports
      </RouterLink>
    </nav>

    <!-- Filters -->
    <div class="sidebar-filters">
      <div class="sidebar-filters-label">Filters</div>
      <FilterBar />
    </div>

    <!-- Bottom: language + profile -->
    <div class="sidebar-bottom">
      <LanguageSwitcher />
      <ProfileMenu
        @show-profile-details="$emit('show-profile-details')"
        @show-tasks="$emit('show-tasks')"
      />
    </div>
  </div>
</template>
```

**Scoped styles:**
```css
.app-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: #0f172a;
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-logo {
  height: 64px;
  min-height: 64px;
  padding: 0 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-brand {
  font-size: 0.938rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.sidebar-tagline {
  font-size: 0.688rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 0.125rem;
  line-height: 1.3;
}

.sidebar-nav {
  padding: 0.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.9);
}

.nav-link.active {
  background: #2563eb;
  color: #ffffff;
}

.sidebar-filters {
  padding: 0.75rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-filters-label {
  font-size: 0.688rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0 1.25rem;
  margin-bottom: 0.5rem;
}

.sidebar-bottom {
  padding: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

/* Make language and profile buttons full-width and fit dark sidebar */
.sidebar-bottom :deep(.language-button),
.sidebar-bottom :deep(.profile-button) {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.8);
}

.sidebar-bottom :deep(.language-button):hover,
.sidebar-bottom :deep(.profile-button):hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.sidebar-bottom :deep(.lang-name),
.sidebar-bottom :deep(.profile-name) {
  color: rgba(255, 255, 255, 0.8);
}

.sidebar-bottom :deep(.chevron-icon) {
  color: rgba(255, 255, 255, 0.4);
}

/* Open dropdowns upward and to the right to avoid sidebar clipping */
.sidebar-bottom :deep(.dropdown-menu) {
  bottom: calc(100% + 0.5rem);
  top: auto;
  left: 0;
  right: auto;
  min-width: 200px;
}
```
---

## Step 3 — Modify App.vue (via vue-expert)

Use the Agent tool with `subagent_type: "vue-expert"` to modify `client/src/App.vue`.

Provide this full spec to vue-expert:

---
**File to modify:** `client/src/App.vue`

**Template — replace the entire `<template>` block with:**
```html
<template>
  <div class="app">
    <AppSidebar
      @show-profile-details="showProfileDetails = true"
      @show-tasks="showTasks = true"
    />
    <main class="main-content">
      <router-view />
    </main>

    <ProfileDetailsModal
      v-if="showProfileDetails"
      :is-open="showProfileDetails"
      @close="showProfileDetails = false"
    />

    <TasksModal
      v-if="showTasks"
      :is-open="showTasks"
      :tasks="tasks"
      @close="showTasks = false"
      @add-task="addTask"
      @delete-task="deleteTask"
      @toggle-task="toggleTask"
    />
  </div>
</template>
```

**Script changes:**
- Add `import AppSidebar from './components/AppSidebar.vue'`
- Add `AppSidebar` to the `components` object
- Remove `import FilterBar` (now inside AppSidebar)
- Remove `import LanguageSwitcher` (now inside AppSidebar)
- Remove `import ProfileMenu` (now inside AppSidebar)
- Remove `FilterBar`, `LanguageSwitcher`, `ProfileMenu` from the `components` object
- Keep ALL task management logic: `showProfileDetails`, `showTasks`, `tasks`, `addTask`, `deleteTask`, `toggleTask`
- Remove `useI18n` and `useAuth` imports only if they are no longer referenced in the script after the above changes

**CSS — in the global unscoped `<style>` block:**

CRITICAL: Do NOT modify any of these global utility classes — they are used by all view components:
`.page-header`, `.stats-grid`, `.stat-card`, `.card`, `.card-header`, `.card-title`, `.badge`, `.table-container`, `table`, `thead`, `th`, `td`, `tbody tr`, `.loading`, `.error`, and all base/reset rules.

**Remove ONLY these rules** (old top-nav layout — no longer used):
- `.top-nav` and all its properties
- `.nav-container` and all its properties
- `.logo` and all its properties
- `.logo h1` and all its properties
- `.subtitle` and all its properties
- `.nav-tabs` and all its properties
- `.nav-tabs a` and all its properties
- `.nav-tabs a:hover` and all its properties
- `.nav-tabs a.active` and all its properties
- `.nav-tabs a.active::after` and all its properties

**Replace `.app`:**
```css
.app {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}
```

**Replace `.main-content`:**
```css
.main-content {
  flex: 1;
  margin-left: 240px;
  padding: 1.5rem 2rem;
  min-height: 100vh;
  overflow-y: auto;
}
```
(Remove `max-width: 1600px`, `margin: 0 auto`, and `width: 100%`.)
---

## Step 4 — Modify FilterBar.vue (via vue-expert)

Use the Agent tool with `subagent_type: "vue-expert"` to modify `client/src/components/FilterBar.vue`.

Provide this full spec to vue-expert:

---
**File to modify:** `client/src/components/FilterBar.vue`

FilterBar now lives inside the dark sidebar. Redesign for a vertical, dark-background context.

**Layout changes:**
- Remove `position: sticky`, `top: 70px`, `z-index: 90` from `.filters-bar`
- `.filters-bar { padding: 0; background: none; border: none }`
- `.filters-container { padding: 0 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; max-width: none; margin: 0 }`
- `.filters-grid { display: flex; flex-direction: column; gap: 0.5rem; flex: none }`
- `.filter-group { display: flex; flex-direction: column; gap: 0.25rem }`

**Filter label styling:**
```css
.filter-label {
  font-size: 0.688rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

**Select styling:**
```css
.filter-select {
  width: 100%;
  min-width: 0;
  padding: 0.375rem 0.625rem;
  font-size: 0.813rem;
  font-weight: 400;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 5px;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  appearance: auto;
}

.filter-select:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.filter-select option {
  background: #1e293b;
  color: #e2e8f0;
}
```

**Reset button:**
```css
.reset-filters-btn {
  width: 100%;
  height: auto;
  padding: 0.375rem 0.625rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  cursor: pointer;
  font-size: 0.813rem;
  margin-top: 0.25rem;
}

.reset-filters-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.75);
}
```

Also add a `<span>Reset</span>` text label next to the existing SVG icon inside the reset button element.
---

## Step 5 — Verify

1. If servers are not already running, invoke `/start`.

2. Use Playwright MCP tools (`mcp__playwright__*`) to verify:
   - Navigate to `http://localhost:3000`
   - Take a screenshot — confirm: 240px dark sidebar on the left, content area to the right, no horizontal top bar
   - Verify nav links are visible and the active route is highlighted blue
   - Click Inventory nav link → confirm URL changes and active state updates
   - Click Orders nav link → confirm URL changes and active state updates
   - Verify filter selects are visible and readable (white text on dark bg)
   - Click the language switcher — confirm dropdown opens without clipping off the sidebar edge
   - Click the profile button — confirm dropdown opens without clipping
   - Take a final screenshot

3. If any layout issues are found (overlapping, clipping, broken styles), invoke vue-expert with targeted CSS corrections.

4. Report what changed and a summary of the final visual state.
