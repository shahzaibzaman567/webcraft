import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { isAuthenticated } from '../lib/auth';
import {
  connectIntegration,
  createProject,
  disconnectIntegration,
  getIntegrations,
  getProjects,
  IntegrationCredentials,
} from '../lib/userApi';
import {
  ServiceId,
  ConnectedServiceState,
  ServiceAccountDetails,
  ProjectDraft,
} from '../types/services.ts';

interface ConnectedServicesContextType {
  services: Record<ServiceId, ConnectedServiceState>;
  connectService: (id: ServiceId, credentials: IntegrationCredentials) => Promise<void>;
  disconnectService: (id: ServiceId) => Promise<void>;
  activeConnectModal: ServiceId | null;
  setActiveConnectModal: (id: ServiceId | null) => void;
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (open: boolean) => void;
  projects: ProjectDraft[];
  projectsLoading: boolean;
  refreshProjects: () => Promise<void>;
  addProject: (project: Omit<ProjectDraft, 'id' | 'createdAt'>) => Promise<ProjectDraft>;
}

const DEFAULT_SERVICES: Record<ServiceId, ConnectedServiceState> = {
  mongodb: {
    id: 'mongodb',
    name: 'MongoDB Atlas',
    category: 'database',
    tagline: 'Fully managed document database with global clusters and flexible JSON schemas',
    badgeColor: 'emerald',
    status: 'disconnected',
    authType: 'connection_string',
    docsUrl: 'https://www.mongodb.com/docs/atlas/',
    pricingUrl: 'https://www.mongodb.com/pricing',
    quotaNotice: 'Users connect their own MongoDB Atlas clusters (M0 Free or dedicated). Quotas, bandwidth, and billing are managed directly in your MongoDB Cloud dashboard.',
  },
  supabase: {
    id: 'supabase',
    name: 'Supabase',
    category: 'database',
    tagline: 'Open source Firebase alternative with Postgres database, auth, and real-time APIs',
    badgeColor: 'emerald',
    status: 'disconnected',
    authType: 'token',
    docsUrl: 'https://supabase.com/docs',
    pricingUrl: 'https://supabase.com/pricing',
    quotaNotice: 'Users link their personal or organization Supabase project API keys. Usage limits, egress, and plan upgrades are managed in your Supabase dashboard.',
  },
  mega: {
    id: 'mega',
    name: 'MEGA File Storage',
    category: 'storage',
    tagline: 'End-to-end encrypted cloud file storage and media asset distribution',
    badgeColor: 'red',
    status: 'disconnected',
    authType: 'token',
    docsUrl: 'https://mega.io/',
    pricingUrl: 'https://mega.io/pricing',
    quotaNotice: 'Connect your MEGA account to store user uploads, user media, and assets with client-side encryption.',
  },
  vercel: {
    id: 'vercel',
    name: 'Vercel',
    category: 'hosting',
    tagline: 'Frontend cloud platform for instant global edge deployment and serverless routes',
    badgeColor: 'blue',
    status: 'disconnected',
    authType: 'oauth',
    docsUrl: 'https://vercel.com/docs',
    pricingUrl: 'https://vercel.com/pricing',
    quotaNotice: 'Deployments build directly into your Vercel team or personal account. You control custom domain routing, build execution limits, and team seats.',
  },
  netlify: {
    id: 'netlify',
    name: 'Netlify',
    category: 'hosting',
    tagline: 'Global edge application hosting with automated Git pipelines and serverless compute',
    badgeColor: 'cyan',
    status: 'disconnected',
    authType: 'oauth',
    docsUrl: 'https://docs.netlify.com/',
    pricingUrl: 'https://www.netlify.com/pricing',
    quotaNotice: 'Deploys directly into your Netlify account via access token. You manage your monthly build minutes, bandwidth tiers, and custom domain SSL.',
  },
};

function createDefaultServices(): Record<ServiceId, ConnectedServiceState> {
  return Object.fromEntries(
    Object.entries(DEFAULT_SERVICES).map(([id, service]) => [id, { ...service }]),
  ) as Record<ServiceId, ConnectedServiceState>;
}

const ConnectedServicesContext = createContext<ConnectedServicesContextType | undefined>(undefined);

export const ConnectedServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Record<ServiceId, ConnectedServiceState>>(
    createDefaultServices,
  );
  const [activeConnectModal, setActiveConnectModal] = useState<ServiceId | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectDraft[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const refreshIntegrations = useCallback(async () => {
    if (!isAuthenticated()) {
      setServices(createDefaultServices());
      return;
    }

    try {
      const integrations = await getIntegrations();
      setServices(() => {
        const next = createDefaultServices();
        for (const integration of integrations) {
          const current = next[integration.service];
          if (!current) continue;
          next[integration.service] = {
            ...current,
            status: 'connected',
            accountDetails: integration.accountDetails as ServiceAccountDetails,
            connectedAt: integration.connectedAt,
            errorMessage: undefined,
          };
        }
        return next;
      });
    } catch {
      setServices(createDefaultServices());
    }
  }, []);

  const refreshProjects = useCallback(async () => {
    if (!isAuthenticated()) {
      setProjects([]);
      return;
    }
    setProjectsLoading(true);
    try {
      const liveProjects = await getProjects();
      setProjects(
        liveProjects.map((project) => ({
          id: project.id,
          name: project.name,
          description: project.description,
          framework: 'React 19 + Tailwind CSS',
          backend: 'Node.js + Express.js REST API',
          createdAt: project.createdAt.split('T')[0] || project.createdAt,
          status: project.status === 'ready' ? 'ready' : project.status === 'building' ? 'synthesizing' : 'draft',
        })),
      );
    } catch {
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshIntegrations();
    void refreshProjects();
    const handleAuthChange = () => {
      void refreshIntegrations();
      void refreshProjects();
    };
    window.addEventListener('webcraft-auth-change', handleAuthChange);
    return () => window.removeEventListener('webcraft-auth-change', handleAuthChange);
  }, [refreshIntegrations, refreshProjects]);

  const connectService = useCallback(async (id: ServiceId, credentials: IntegrationCredentials) => {
    if (!isAuthenticated()) {
      throw new Error('Sign in and create your profile before connecting a provider account.');
    }
    if (id === 'mega') {
      throw new Error('MEGA integration is not available yet.');
    }

    const integration = await connectIntegration(id, credentials);
    setServices((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: 'connected',
        connectedAt: integration.connectedAt,
        accountDetails: integration.accountDetails as ServiceAccountDetails,
        errorMessage: undefined,
      },
    }));
  }, []);

  const disconnectService = useCallback(async (id: ServiceId) => {
    if (id === 'mega') return;

    await disconnectIntegration(id);
    setServices((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: 'disconnected',
        connectedAt: undefined,
        accountDetails: undefined,
        errorMessage: undefined,
      },
    }));
  }, []);

  const addProject = async (
    projectData: Omit<ProjectDraft, 'id' | 'createdAt'>,
  ): Promise<ProjectDraft> => {
    const created = await createProject({
      name: projectData.name,
      description: projectData.description,
      framework: 'react',
      status: 'building',
    });

    const newProject: ProjectDraft = {
      ...projectData,
      id: created.id,
      createdAt: created.createdAt.split('T')[0] || created.createdAt,
      status: 'synthesizing',
    };
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  return (
    <ConnectedServicesContext.Provider
      value={{
        services,
        connectService,
        disconnectService,
        activeConnectModal,
        setActiveConnectModal,
        isProjectModalOpen,
        setIsProjectModalOpen,
        projects,
        projectsLoading,
        refreshProjects,
        addProject,
      }}
    >
      {children}
    </ConnectedServicesContext.Provider>
  );
};

export const useConnectedServices = () => {
  const context = useContext(ConnectedServicesContext);
  if (!context) {
    throw new Error('useConnectedServices must be used within a ConnectedServicesProvider');
  }
  return context;
};
