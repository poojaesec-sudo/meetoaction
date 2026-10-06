import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import {
  DEFAULT_MEETINGS,
  DEFAULT_TASKS,
  DEFAULT_TEAM,
  DEFAULT_STATS,
  DEFAULT_ACCOUNTABILITY,
  DEFAULT_INSIGHTS
} from './services/demoData';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PortalPage } from './pages/PortalPage';
import { AddMeetingPage } from './pages/AddMeetingPage';
import { ActionItemsPage } from './pages/ActionItemsPage';
import { TasksPage } from './pages/TasksPage';
import { TeamPage } from './pages/TeamPage';
import { AccountabilityPage } from './pages/AccountabilityPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';

const VALID_TABS = [
  'dashboard',
  'portal',
  'meetings',
  'add-meeting',
  'action-items',
  'tasks',
  'team',
  'accountability',
  'insights',
  'settings'
];

function parseInitialRoute() {
  const path = (window.location.pathname || '').replace(/^\/+|\/+$/g, '').toLowerCase();
  const hash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
  const target = path || hash;

  if (target === 'login') {
    return { isLoginRoute: true, tab: 'dashboard' };
  }
  if (VALID_TABS.includes(target)) {
    return { isLoginRoute: false, tab: target };
  }
  return { isLoginRoute: false, tab: 'dashboard' };
}

export function App() {
  const initialRoute = parseInitialRoute();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      if (!saved || saved === 'undefined' || saved === 'null') return null;
      return JSON.parse(saved);
    } catch (err) {
      console.warn('Invalid user stored in localStorage, resetting:', err);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      return null;
    }
  });

  const [currentTab, setCurrentTabState] = useState(initialRoute.tab);
  const [isLoginRoute, setIsLoginRoute] = useState(initialRoute.isLoginRoute);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Handle tab navigation with URL synchronization
  const setTab = (newTab) => {
    if (VALID_TABS.includes(newTab)) {
      setCurrentTabState(newTab);
      setIsLoginRoute(false);
      try {
        const targetPath = newTab === 'dashboard' ? '/' : `/${newTab}`;
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ tab: newTab }, '', targetPath);
        }
      } catch (e) {
        console.warn('History pushState error:', e);
      }
    }
  };

  // Listen to browser popstate (back / forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseInitialRoute();
      if (route.isLoginRoute) {
        setIsLoginRoute(true);
      } else {
        setIsLoginRoute(false);
        if (VALID_TABS.includes(route.tab)) {
          setCurrentTabState(route.tab);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Data States with rich instant demo defaults
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [meetings, setMeetings] = useState(DEFAULT_MEETINGS);
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [teamMembers, setTeamMembers] = useState(DEFAULT_TEAM);
  const [accountability, setAccountability] = useState(DEFAULT_ACCOUNTABILITY);
  const [insights, setInsights] = useState(DEFAULT_INSIGHTS);
  const [loading, setLoading] = useState(false);

  // Selected meeting for detailed drawer/modal
  const [selectedMeetingDetail, setSelectedMeetingDetail] = useState(null);

  // Fetch all core application data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, meetingsData, tasksData, teamData, accData, insightsData] =
        await Promise.all([
          api.getDashboardStats().catch(() => null),
          api.getMeetings().catch(() => null),
          api.getActionItems().catch(() => null),
          api.getTeam().catch(() => null),
          api.getAccountability().catch(() => null),
          api.getAIInsights().catch(() => null),
        ]);

      if (statsData) setStats(statsData);
      if (meetingsData && meetingsData.length > 0) setMeetings(meetingsData);
      if (tasksData && tasksData.length > 0) setTasks(tasksData);
      if (teamData && teamData.length > 0) setTeamMembers(teamData);
      if (accData) setAccountability(accData);
      if (insightsData) setInsights(insightsData);
    } catch (err) {
      console.error('Error fetching workspace data, relying on local state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && !isLoginRoute) {
      fetchData();
    }
  }, [currentUser, isLoginRoute]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setCurrentUser(null);
    setIsLoginRoute(true);
    try {
      if (window.location.pathname !== '/login') {
        window.history.pushState({}, '', '/login');
      }
    } catch (e) {
      console.warn('Logout pushState error:', e);
    }
  };

  // Select meeting and load full detail
  const handleSelectMeeting = async (id) => {
    try {
      const detail = await api.getMeeting(id);
      setSelectedMeetingDetail(detail);
    } catch (err) {
      // Local fallback lookup
      const found = meetings.find((m) => m.id === id);
      if (found) {
        setSelectedMeetingDetail(found);
      }
    }
  };

  // Meeting Mutations
  const handleCreateMeeting = async (meetingData) => {
    try {
      const created = await api.createMeeting(meetingData);
      setMeetings((prev) => [created, ...prev]);
      fetchData();
    } catch (err) {
      console.warn('API error creating meeting, persisting in state:', err);
      const localMeeting = {
        id: Date.now(),
        ...meetingData,
        created_at: new Date().toISOString(),
        action_items_count: 0,
        completion_rate: 0
      };
      setMeetings((prev) => [localMeeting, ...prev]);
    }
  };

  const handleUpdateMeeting = async (id, updates) => {
    try {
      const updated = await api.updateMeeting(id, updates);
      setMeetings((prev) => prev.map((m) => (m.id === id ? updated : m)));
      if (selectedMeetingDetail && selectedMeetingDetail.id === id) {
        setSelectedMeetingDetail(updated);
      }
      fetchData();
    } catch (err) {
      console.warn('API error updating meeting, updating locally:', err);
      setMeetings((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
      );
    }
  };

  const handleDeleteMeeting = async (id) => {
    try {
      await api.deleteMeeting(id);
      setMeetings((prev) => prev.filter((m) => m.id !== id));
      setSelectedMeetingDetail(null);
      fetchData();
    } catch (err) {
      console.warn('API error deleting meeting, removing locally:', err);
      setMeetings((prev) => prev.filter((m) => m.id !== id));
      setSelectedMeetingDetail(null);
    }
  };

  // Task Mutations
  const handleUpdateTask = async (id, updates) => {
    try {
      const updated = await api.updateActionItem(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      if (selectedMeetingDetail) {
        setSelectedMeetingDetail((prev) => ({
          ...prev,
          action_items: prev.action_items.map((a) => (a.id === id ? updated : a)),
        }));
      }
      fetchData();
    } catch (err) {
      console.warn('API error updating task, updating locally:', err);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const created = await api.createActionItem(taskData);
      setTasks((prev) => [created, ...prev]);
      fetchData();
    } catch (err) {
      console.warn('API error creating task, adding locally:', err);
      const localTask = {
        id: Date.now(),
        ...taskData,
        created_at: new Date().toISOString()
      };
      setTasks((prev) => [localTask, ...prev]);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.deleteActionItem(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (selectedMeetingDetail) {
        setSelectedMeetingDetail((prev) => ({
          ...prev,
          action_items: prev.action_items.filter((a) => a.id !== id),
        }));
      }
      fetchData();
    } catch (err) {
      console.warn('API error deleting task, removing locally:', err);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleQuickCompleteTask = async (id) => {
    await handleUpdateTask(id, { status: 'Completed', progress: 100 });
  };

  const handleGlobalSearch = (val) => {
    setGlobalSearch(val);
    if (val && currentTab !== 'action-items') {
      setTab('action-items');
    }
  };

  // If not logged in or explicitly navigating to login, render Meet2Action AI Login page
  if (!currentUser || isLoginRoute) {
    return (
      <LoginPage
        onLoginSuccess={(u) => {
          setCurrentUser(u);
          setIsLoginRoute(false);
          try {
            const p = window.location.pathname.toLowerCase();
            if (p === '/login') {
              window.history.pushState({}, '', '/');
            }
          } catch (e) {
            console.warn('Navigation error:', e);
          }
        }}
      />
    );
  }

  const overdueList = tasks.filter((t) => t.status === 'Overdue');

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F7FA] flex relative overflow-x-hidden selection:bg-[#B8FF00] selection:text-[#050505]">
      {/* Obsidian Ambient Glow Highlights */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#B8FF00]/4 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-[600px] h-[600px] bg-[#FF2DA6]/4 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-1/2 right-10 w-[400px] h-[400px] bg-[#FF7A00]/3 rounded-full blur-[140px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setTab={setTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        overdueCount={overdueList.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative z-10">
        <Navbar
          currentTab={currentTab}
          setTab={setTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          overdueCount={overdueList.length}
          overdueTasks={overdueList}
          onSearch={handleGlobalSearch}
          searchQuery={globalSearch}
          currentUser={currentUser}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardPage
              stats={stats}
              loading={loading}
              setTab={setTab}
              currentUser={currentUser}
              onSelectMeeting={(id) => {
                handleSelectMeeting(id);
                setTab('meetings');
              }}
              onQuickCompleteTask={handleQuickCompleteTask}
            />
          )}

          {currentTab === 'portal' && (
            <PortalPage
              currentUser={currentUser}
              setTab={setTab}
              tasks={tasks}
              meetings={meetings}
              onQuickCompleteTask={handleQuickCompleteTask}
            />
          )}

          {currentTab === 'meetings' && (
            <MeetingsPage
              meetings={meetings}
              loading={loading}
              setTab={setTab}
              onSelectMeeting={handleSelectMeeting}
              selectedMeetingDetail={selectedMeetingDetail}
              onCloseDetail={() => setSelectedMeetingDetail(null)}
              onDeleteMeeting={handleDeleteMeeting}
              onCreateMeeting={handleCreateMeeting}
              onUpdateMeeting={handleUpdateMeeting}
              onUpdateTask={handleUpdateTask}
            />
          )}

          {currentTab === 'add-meeting' && (
            <AddMeetingPage
              onMeetingCreated={() => {
                fetchData();
              }}
              setTab={setTab}
            />
          )}

          {currentTab === 'action-items' && (
            <ActionItemsPage
              tasks={tasks}
              teamMembers={teamMembers}
              meetings={meetings}
              onUpdateTask={handleUpdateTask}
              onCreateTask={handleCreateTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksPage
              tasks={tasks}
              loading={loading}
              onUpdateTask={handleUpdateTask}
              onCreateTask={handleCreateTask}
              onDeleteTask={handleDeleteTask}
              setTab={setTab}
            />
          )}

          {currentTab === 'team' && (
            <TeamPage
              teamMembers={teamMembers}
              setTab={setTab}
              onRefreshTeam={fetchData}
            />
          )}

          {currentTab === 'accountability' && (
            <AccountabilityPage
              data={accountability}
              loading={loading}
              onUpdateTask={handleUpdateTask}
              setTab={setTab}
            />
          )}

          {currentTab === 'insights' && (
            <InsightsPage
              insights={insights}
              loading={loading}
              setTab={setTab}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              onDataReset={() => {
                fetchData();
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
