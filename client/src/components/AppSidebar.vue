<template>
  <div class="app-sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Logo zone -->
    <div class="sidebar-logo">
      <div class="sidebar-brand-wrap">
        <span class="sidebar-brand">{{ t('nav.companyName') }}</span>
        <span class="sidebar-tagline">{{ t('nav.subtitle') }}</span>
      </div>
      <button
        class="sidebar-toggle"
        @click="toggle"
        :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 3L6 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <RouterLink to="/" class="nav-link" :class="{ active: route.path === '/' }" data-tooltip="Overview">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <span class="nav-text">{{ t('nav.overview') }}</span>
      </RouterLink>
      <RouterLink to="/inventory" class="nav-link" :class="{ active: route.path === '/inventory' }" data-tooltip="Inventory">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M5 6h6M5 9h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="nav-text">{{ t('nav.inventory') }}</span>
      </RouterLink>
      <RouterLink to="/orders" class="nav-link" :class="{ active: route.path === '/orders' }" data-tooltip="Orders">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="nav-text">{{ t('nav.orders') }}</span>
      </RouterLink>
      <RouterLink to="/spending" class="nav-link" :class="{ active: route.path === '/spending' }" data-tooltip="Finance">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 5v1.5M8 9.5V11M6.5 7.25C6.5 6.56 7.17 6 8 6s1.5.56 1.5 1.25c0 1.5-3 1.5-3 3C6.5 11 7.17 11 8 11s1.5-.44 1.5-1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <span class="nav-text">{{ t('nav.finance') }}</span>
      </RouterLink>
      <RouterLink to="/demand" class="nav-link" :class="{ active: route.path === '/demand' }" data-tooltip="Demand Forecast">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 12l4-4 3 2 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="nav-text">{{ t('nav.demandForecast') }}</span>
      </RouterLink>
      <RouterLink to="/reports" class="nav-link" :class="{ active: route.path === '/reports' }" data-tooltip="Reports">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="8" width="3" height="6" rx="0.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="6.5" y="5" width="3" height="9" rx="0.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="11" y="2" width="3" height="12" rx="0.5" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <span class="nav-text">Reports</span>
      </RouterLink>
    </nav>

    <!-- Filters: full when expanded, icon when collapsed -->
    <div v-if="!isCollapsed" class="sidebar-filters">
      <div class="sidebar-filters-label">Filters</div>
      <FilterBar />
    </div>
    <div v-else class="sidebar-filters-collapsed">
      <button class="filter-icon-btn" @click="expand" title="Filters">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span v-if="hasActiveFilters" class="filter-active-dot"></span>
      </button>
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

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '../composables/useI18n'
import { useSidebar } from '../composables/useSidebar'
import { useFilters } from '../composables/useFilters'
import FilterBar from './FilterBar.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ProfileMenu from './ProfileMenu.vue'

defineEmits(['show-profile-details', 'show-tasks'])

const { t } = useI18n()
const route = useRoute()
const { isCollapsed, toggle, expand } = useSidebar()
const { hasActiveFilters } = useFilters()

const handleResize = () => {
  if (window.innerWidth < 1024) isCollapsed.value = true
}

onMounted(() => {
  if (window.innerWidth < 1024) isCollapsed.value = true
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
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
  overflow-x: hidden;
  transition: width 0.2s ease;
}

.app-sidebar.collapsed {
  width: 56px;
}

/* Logo zone */
.sidebar-logo {
  height: 64px;
  min-height: 64px;
  padding: 0 1.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.sidebar-brand-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-brand {
  font-size: 0.938rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-tagline {
  font-size: 0.688rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 0.125rem;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Toggle button */
.sidebar-toggle {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  padding: 0;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

/* Flip chevron when collapsed */
.app-sidebar.collapsed .sidebar-toggle svg {
  transform: rotate(180deg);
}

/* Hide brand text when collapsed */
.app-sidebar.collapsed .sidebar-brand-wrap {
  display: none;
}

.app-sidebar.collapsed .sidebar-logo {
  justify-content: center;
  padding: 0 0.75rem;
}

/* Navigation */
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
  white-space: nowrap;
  overflow: hidden;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.9);
}

.nav-link.active {
  background: #2563eb;
  color: #ffffff;
}

/* Collapsed nav links: icon only, centered, with tooltips */
.app-sidebar.collapsed .nav-link {
  justify-content: center;
  padding: 0.625rem;
  position: relative;
  overflow: visible;
}

.app-sidebar.collapsed .nav-text {
  display: none;
}

/* CSS tooltips */
.app-sidebar.collapsed .nav-link::after {
  content: attr(data-tooltip);
  position: absolute;
  left: calc(100% + 0.75rem);
  top: 50%;
  transform: translateY(-50%);
  background: #1e293b;
  color: rgba(255, 255, 255, 0.9);
  padding: 0.3rem 0.625rem;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 200;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.app-sidebar.collapsed .nav-link:hover::after {
  opacity: 1;
}

/* Expanded filters section */
.sidebar-filters {
  padding: 0.75rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
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

/* Collapsed filter icon section */
.sidebar-filters-collapsed {
  padding: 0.75rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.filter-icon-btn {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  padding: 0;
}

.filter-icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.filter-active-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2563eb;
  pointer-events: none;
}

/* Bottom section */
.sidebar-bottom {
  padding: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex-shrink: 0;
}

/* Dark sidebar overrides for language button */
.sidebar-bottom :deep(.language-button) {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.8);
}

.sidebar-bottom :deep(.language-button):hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.sidebar-bottom :deep(.language-label) {
  color: rgba(255, 255, 255, 0.8);
}

/* Dark sidebar overrides for profile button */
.sidebar-bottom :deep(.profile-button) {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.8);
}

.sidebar-bottom :deep(.profile-button):hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.sidebar-bottom :deep(.profile-name) {
  color: rgba(255, 255, 255, 0.8);
}

.sidebar-bottom :deep(.chevron) {
  color: rgba(255, 255, 255, 0.4);
}

.sidebar-bottom :deep(.globe-icon) {
  color: rgba(255, 255, 255, 0.5);
}

/* Open dropdowns upward to avoid clipping at sidebar bottom */
.sidebar-bottom :deep(.dropdown-menu) {
  bottom: calc(100% + 0.5rem);
  top: auto;
  left: 0;
  right: auto;
  min-width: 200px;
}

/* Collapsed bottom: hide language switcher, avatar-only profile */
.app-sidebar.collapsed .sidebar-bottom :deep(.language-switcher) {
  display: none;
}

.app-sidebar.collapsed .sidebar-bottom :deep(.profile-name),
.app-sidebar.collapsed .sidebar-bottom :deep(.chevron) {
  display: none;
}

.app-sidebar.collapsed .sidebar-bottom :deep(.profile-button) {
  justify-content: center;
  padding: 0.375rem;
}

.app-sidebar.collapsed .sidebar-bottom {
  align-items: center;
}
</style>
