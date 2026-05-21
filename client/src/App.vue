<template>
  <div class="app">
    <AppSidebar
      @show-profile-details="showProfileDetails = true"
      @show-tasks="showTasks = true"
    />
    <main class="main-content" :class="{ 'sidebar-collapsed': isCollapsed }">
      <router-view />
    </main>

    <ProfileDetailsModal
      :is-open="showProfileDetails"
      @close="showProfileDetails = false"
    />

    <TasksModal
      :is-open="showTasks"
      :tasks="tasks"
      @close="showTasks = false"
      @add-task="addTask"
      @delete-task="deleteTask"
      @toggle-task="toggleTask"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { api } from "./api";
import { useAuth } from "./composables/useAuth";
import { useSidebar } from "./composables/useSidebar";
import { useDarkMode } from "./composables/useDarkMode";
import AppSidebar from "./components/AppSidebar.vue";
import ProfileDetailsModal from "./components/ProfileDetailsModal.vue";
import TasksModal from "./components/TasksModal.vue";

export default {
  name: "App",
  components: {
    AppSidebar,
    ProfileDetailsModal,
    TasksModal,
  },
  setup() {
    const { currentUser } = useAuth();
    const { isCollapsed } = useSidebar();
    useDarkMode(); // initializes dark class on <html>
    const showProfileDetails = ref(false);
    const showTasks = ref(false);
    const apiTasks = ref([]);

    // Merge mock tasks from currentUser with API tasks
    const tasks = computed(() => {
      return [...currentUser.value.tasks, ...apiTasks.value];
    });

    const loadTasks = async () => {
      try {
        apiTasks.value = await api.getTasks();
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    };

    const addTask = async (taskData) => {
      try {
        const newTask = await api.createTask(taskData);
        // Add new task to the beginning of the array
        apiTasks.value.unshift(newTask);
      } catch (err) {
        console.error("Failed to add task:", err);
      }
    };

    const deleteTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const isMockTask = currentUser.value.tasks.some((t) => t.id === taskId);

        if (isMockTask) {
          // Remove from mock tasks
          const index = currentUser.value.tasks.findIndex(
            (t) => t.id === taskId,
          );
          if (index !== -1) {
            currentUser.value.tasks.splice(index, 1);
          }
        } else {
          // Remove from API tasks
          await api.deleteTask(taskId);
          apiTasks.value = apiTasks.value.filter((t) => t.id !== taskId);
        }
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    };

    const toggleTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const mockTask = currentUser.value.tasks.find((t) => t.id === taskId);

        if (mockTask) {
          // Toggle mock task status
          mockTask.status =
            mockTask.status === "pending" ? "completed" : "pending";
        } else {
          // Toggle API task
          const updatedTask = await api.toggleTask(taskId);
          const index = apiTasks.value.findIndex((t) => t.id === taskId);
          if (index !== -1) {
            apiTasks.value[index] = updatedTask;
          }
        }
      } catch (err) {
        console.error("Failed to toggle task:", err);
      }
    };

    onMounted(loadTasks);

    return {
      showProfileDetails,
      showTasks,
      tasks,
      addTask,
      deleteTask,
      toggleTask,
      isCollapsed,
    };
  },
};
</script>

<style>
:root {
  --bg-page: #f8fafc;
  --bg-card: #ffffff;
  --bg-card-hover: #f8fafc;
  --border-card: #e2e8f0;
  --border-card-hover: #cbd5e1;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-body: #334155;
  --table-head-bg: #f8fafc;
  --table-border: #e2e8f0;
  --table-row-border: #f1f5f9;
  --table-row-hover: #f8fafc;
}

html.dark {
  --bg-page: #0f172a;
  --bg-card: #1e293b;
  --bg-card-hover: #243349;
  --border-card: rgba(255, 255, 255, 0.08);
  --border-card-hover: rgba(255, 255, 255, 0.15);
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-body: #cbd5e1;
  --table-head-bg: #1e293b;
  --table-border: rgba(255, 255, 255, 0.08);
  --table-row-border: rgba(255, 255, 255, 0.04);
  --table-row-hover: #243349;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    sans-serif;
  background: var(--bg-page);
  color: #1e293b;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 240px;
  padding: 1.5rem 2rem;
  min-height: 100vh;
  overflow-y: auto;
  transition: margin-left 0.2s ease;
}

.main-content.sidebar-collapsed {
  margin-left: 56px;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.375rem;
  letter-spacing: -0.025em;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 0.938rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--bg-card);
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid var(--border-card);
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: var(--border-card-hover);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.625rem;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.025em;
}

.stat-card.warning .stat-value {
  color: #ea580c;
}

.stat-card.success .stat-value {
  color: #059669;
}

.stat-card.danger .stat-value {
  color: #dc2626;
}

.stat-card.info .stat-value {
  color: #2563eb;
}

.card {
  background: var(--bg-card);
  border-radius: 10px;
  padding: 1.25rem;
  border: 1px solid var(--border-card);
  margin-bottom: 1.25rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid var(--border-card);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.025em;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--table-head-bg);
  border-top: 1px solid var(--table-border);
  border-bottom: 1px solid var(--table-border);
}

th {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid var(--table-row-border);
  color: var(--text-body);
  font-size: 0.875rem;
}

tbody tr {
  transition: background-color 0.15s ease;
}

tbody tr:hover {
  background: var(--table-row-hover);
}

.badge {
  display: inline-block;
  padding: 0.313rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge.success {
  background: #d1fae5;
  color: #065f46;
}

.badge.warning {
  background: #fed7aa;
  color: #92400e;
}

.badge.danger {
  background: #fecaca;
  color: #991b1b;
}

.badge.info {
  background: #dbeafe;
  color: #1e40af;
}

.badge.increasing {
  background: #d1fae5;
  color: #065f46;
}

.badge.decreasing {
  background: #fecaca;
  color: #991b1b;
}

.badge.stable {
  background: #e0e7ff;
  color: #3730a3;
}

.badge.high {
  background: #fecaca;
  color: #991b1b;
}

.badge.medium {
  background: #fed7aa;
  color: #92400e;
}

.badge.low {
  background: #dbeafe;
  color: #1e40af;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  font-size: 0.938rem;
}

.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.938rem;
}
</style>
