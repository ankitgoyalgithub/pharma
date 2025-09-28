import salesforceLogo from "@/assets/salesforce-logo.png";
import s3Logo from "@/assets/s3-logo.png";
import slackLogo from "@/assets/slack-logo.png";
import hubspotLogo from "@/assets/hubspot-logo.png";
import zendeskLogo from "@/assets/zendesk-logo.png";
import dynamicsLogo from "@/assets/dynamics-logo.png";

// SAP logo placeholder
const sapLogo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwN0RDQyIvPgo8dGV4dCB4PSIyMCIgeT0iMjQiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TQVA8L3RleHQ+Cjwvc3ZnPgo=";

// Additional connector logos
const oracleLogo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0Y4MDAwMCIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk9SQUNMRTwvdGV4dD4KPC9zdmc+Cg==";

const postgresLogo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzMzNjc5MSIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI3IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBPU1RHUkVTPC90ZXh0Pgo8L3N2Zz4K";

const mysqlLogo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwNzg4QSIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1ZU1FMPC90ZXh0Pgo8L3N2Zz4K";

const kafkaLogo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzIzMUYyMCIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPktBRktBPC90ZXh0Pgo8L3N2Zz4K";

export interface ConfigField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'number' | 'boolean' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: { value: string; label: string }[];
  defaultValue?: any;
}

export interface Connector {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  description: string;
  category: string;
  capabilities: string[];
  version: string;
  configFields: ConfigField[];
  popularity: number;
  certified: boolean;
}

export const connectorsData: Connector[] = [
  {
    id: 'salesforce',
    name: "Salesforce",
    icon: salesforceLogo,
    connected: true,
    description: "Connect to Salesforce CRM for customer data, leads, and opportunities management",
    category: "CRM",
    capabilities: ["Read", "Write", "Real-time", "Bulk Operations"],
    version: "v2.1.0",
    popularity: 95,
    certified: true,
    configFields: [
      {
        name: 'instanceUrl',
        label: 'Instance URL',
        type: 'text',
        required: true,
        placeholder: 'https://your-domain.salesforce.com',
        description: 'Your Salesforce instance URL'
      },
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'user@company.com',
        description: 'Salesforce username'
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'Enter your password',
        description: 'Salesforce password'
      },
      {
        name: 'securityToken',
        label: 'Security Token',
        type: 'password',
        required: true,
        placeholder: 'Enter security token',
        description: 'Salesforce security token (found in your profile settings)'
      },
      {
        name: 'apiVersion',
        label: 'API Version',
        type: 'select',
        defaultValue: 'v58.0',
        options: [
          { value: 'v58.0', label: 'v58.0 (Latest)' },
          { value: 'v57.0', label: 'v57.0' },
          { value: 'v56.0', label: 'v56.0' }
        ],
        description: 'Salesforce API version to use'
      }
    ]
  },
  {
    id: 's3',
    name: "Amazon S3",
    icon: s3Logo,
    connected: true,
    description: "Connect to Amazon S3 for scalable cloud storage and data lake operations",
    category: "Storage",
    capabilities: ["Read", "Write", "Streaming", "Versioning"],
    version: "v3.2.1",
    popularity: 88,
    certified: true,
    configFields: [
      {
        name: 'accessKeyId',
        label: 'Access Key ID',
        type: 'text',
        required: true,
        placeholder: 'AKIA...',
        description: 'AWS Access Key ID'
      },
      {
        name: 'secretAccessKey',
        label: 'Secret Access Key',
        type: 'password',
        required: true,
        placeholder: 'Enter secret key',
        description: 'AWS Secret Access Key'
      },
      {
        name: 'region',
        label: 'AWS Region',
        type: 'select',
        required: true,
        defaultValue: 'us-east-1',
        options: [
          { value: 'us-east-1', label: 'US East (N. Virginia)' },
          { value: 'us-west-2', label: 'US West (Oregon)' },
          { value: 'eu-west-1', label: 'Europe (Ireland)' },
          { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' }
        ],
        description: 'AWS region where your S3 bucket is located'
      },
      {
        name: 'bucketName',
        label: 'Bucket Name',
        type: 'text',
        required: true,
        placeholder: 'my-data-bucket',
        description: 'S3 bucket name'
      },
      {
        name: 'enableEncryption',
        label: 'Enable Server-Side Encryption',
        type: 'boolean',
        defaultValue: true,
        description: 'Enable AES-256 server-side encryption'
      }
    ]
  },
  {
    id: 'slack',
    name: "Slack",
    icon: slackLogo,
    connected: false,
    description: "Send notifications and alerts to Slack channels and users",
    category: "Communication",
    capabilities: ["Notifications", "Bot Integration", "File Sharing"],
    version: "v1.8.3",
    popularity: 76,
    certified: true,
    configFields: [
      {
        name: 'botToken',
        label: 'Bot User OAuth Token',
        type: 'password',
        required: true,
        placeholder: 'xoxb-...',
        description: 'Slack Bot User OAuth Token (starts with xoxb-)'
      },
      {
        name: 'defaultChannel',
        label: 'Default Channel',
        type: 'text',
        placeholder: '#general',
        description: 'Default channel for notifications'
      },
      {
        name: 'enableThreads',
        label: 'Enable Threading',
        type: 'boolean',
        defaultValue: false,
        description: 'Send follow-up messages as thread replies'
      }
    ]
  },
  {
    id: 'hubspot',
    name: "HubSpot",
    icon: hubspotLogo,
    connected: false,
    description: "Connect to HubSpot for marketing automation, CRM, and sales data",
    category: "Marketing",
    capabilities: ["CRM", "Marketing Automation", "Analytics", "Lead Scoring"],
    version: "v2.0.5",
    popularity: 72,
    certified: true,
    configFields: [
      {
        name: 'apiKey',
        label: 'API Key',
        type: 'password',
        required: true,
        placeholder: 'Enter HubSpot API key',
        description: 'HubSpot Private App API key'
      },
      {
        name: 'portalId',
        label: 'Portal ID',
        type: 'text',
        required: true,
        placeholder: '12345678',
        description: 'HubSpot Portal ID (found in account settings)'
      },
      {
        name: 'syncContacts',
        label: 'Sync Contacts',
        type: 'boolean',
        defaultValue: true,
        description: 'Enable contact synchronization'
      },
      {
        name: 'syncDeals',
        label: 'Sync Deals',
        type: 'boolean',
        defaultValue: true,
        description: 'Enable deals synchronization'
      }
    ]
  },
  {
    id: 'zendesk',
    name: "Zendesk",
    icon: zendeskLogo,
    connected: false,
    description: "Integrate with Zendesk for customer support and ticketing system",
    category: "Support",
    capabilities: ["Ticketing", "Customer Support", "Analytics", "Automation"],
    version: "v1.6.2",
    popularity: 68,
    certified: true,
    configFields: [
      {
        name: 'subdomain',
        label: 'Zendesk Subdomain',
        type: 'text',
        required: true,
        placeholder: 'company',
        description: 'Your Zendesk subdomain (company.zendesk.com)'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        required: true,
        placeholder: 'admin@company.com',
        description: 'Zendesk admin email'
      },
      {
        name: 'apiToken',
        label: 'API Token',
        type: 'password',
        required: true,
        placeholder: 'Enter API token',
        description: 'Zendesk API token'
      },
      {
        name: 'ticketPriority',
        label: 'Default Ticket Priority',
        type: 'select',
        defaultValue: 'normal',
        options: [
          { value: 'low', label: 'Low' },
          { value: 'normal', label: 'Normal' },
          { value: 'high', label: 'High' },
          { value: 'urgent', label: 'Urgent' }
        ],
        description: 'Default priority for new tickets'
      }
    ]
  },
  {
    id: 'dynamics',
    name: "Microsoft Dynamics",
    icon: dynamicsLogo,
    connected: false,
    description: "Connect to Microsoft Dynamics 365 for ERP and CRM operations",
    category: "ERP",
    capabilities: ["ERP", "CRM", "Financial Management", "Supply Chain"],
    version: "v2.3.1",
    popularity: 65,
    certified: true,
    configFields: [
      {
        name: 'organizationUrl',
        label: 'Organization URL',
        type: 'text',
        required: true,
        placeholder: 'https://orgname.crm.dynamics.com',
        description: 'Dynamics 365 organization URL'
      },
      {
        name: 'clientId',
        label: 'Client ID',
        type: 'text',
        required: true,
        placeholder: 'Enter application client ID',
        description: 'Azure AD application client ID'
      },
      {
        name: 'clientSecret',
        label: 'Client Secret',
        type: 'password',
        required: true,
        placeholder: 'Enter client secret',
        description: 'Azure AD application client secret'
      },
      {
        name: 'tenantId',
        label: 'Tenant ID',
        type: 'text',
        required: true,
        placeholder: 'Enter tenant ID',
        description: 'Azure AD tenant ID'
      }
    ]
  },
  {
    id: 'sap',
    name: "SAP",
    icon: sapLogo,
    connected: false,
    description: "Enterprise-grade SAP integration for ERP, supply chain, and business processes",
    category: "ERP",
    capabilities: ["ERP Integration", "Real-time Data", "Business Processes", "Financial Data"],
    version: "v3.0.2",
    popularity: 58,
    certified: true,
    configFields: [
      {
        name: 'host',
        label: 'SAP Host',
        type: 'text',
        required: true,
        placeholder: 'sap.company.com',
        description: 'SAP system hostname or IP address'
      },
      {
        name: 'systemNumber',
        label: 'System Number',
        type: 'text',
        required: true,
        placeholder: '00',
        description: 'SAP system number (typically 00)'
      },
      {
        name: 'client',
        label: 'Client',
        type: 'text',
        required: true,
        placeholder: '100',
        description: 'SAP client number'
      },
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'SAP_USER',
        description: 'SAP username'
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'Enter SAP password',
        description: 'SAP user password'
      },
      {
        name: 'language',
        label: 'Language',
        type: 'select',
        defaultValue: 'EN',
        options: [
          { value: 'EN', label: 'English' },
          { value: 'DE', label: 'German' },
          { value: 'FR', label: 'French' },
          { value: 'ES', label: 'Spanish' }
        ],
        description: 'SAP system language'
      }
    ]
  },
  {
    id: 'oracle',
    name: "Oracle Database",
    icon: oracleLogo,
    connected: false,
    description: "Connect to Oracle Database for enterprise data operations",
    category: "Database",
    capabilities: ["SQL Queries", "Stored Procedures", "Bulk Operations", "Transaction Support"],
    version: "v1.9.4",
    popularity: 62,
    certified: true,
    configFields: [
      {
        name: 'host',
        label: 'Database Host',
        type: 'text',
        required: true,
        placeholder: 'oracle.company.com',
        description: 'Oracle database hostname'
      },
      {
        name: 'port',
        label: 'Port',
        type: 'number',
        required: true,
        defaultValue: 1521,
        placeholder: '1521',
        description: 'Oracle database port (default: 1521)'
      },
      {
        name: 'serviceName',
        label: 'Service Name',
        type: 'text',
        required: true,
        placeholder: 'ORCL',
        description: 'Oracle service name or SID'
      },
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'db_user',
        description: 'Database username'
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'Enter database password',
        description: 'Database password'
      }
    ]
  },
  {
    id: 'postgresql',
    name: "PostgreSQL",
    icon: postgresLogo,
    connected: false,
    description: "Connect to PostgreSQL database for advanced SQL operations and analytics",
    category: "Database",
    capabilities: ["Advanced SQL", "JSON Support", "Full-text Search", "Analytics"],
    version: "v2.1.8",
    popularity: 79,
    certified: true,
    configFields: [
      {
        name: 'host',
        label: 'Database Host',
        type: 'text',
        required: true,
        placeholder: 'postgres.company.com',
        description: 'PostgreSQL database hostname'
      },
      {
        name: 'port',
        label: 'Port',
        type: 'number',
        required: true,
        defaultValue: 5432,
        placeholder: '5432',
        description: 'PostgreSQL port (default: 5432)'
      },
      {
        name: 'database',
        label: 'Database Name',
        type: 'text',
        required: true,
        placeholder: 'myapp_db',
        description: 'Name of the PostgreSQL database'
      },
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'postgres',
        description: 'Database username'
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'Enter database password',
        description: 'Database password'
      },
      {
        name: 'sslMode',
        label: 'SSL Mode',
        type: 'select',
        defaultValue: 'prefer',
        options: [
          { value: 'disable', label: 'Disable' },
          { value: 'prefer', label: 'Prefer' },
          { value: 'require', label: 'Require' },
          { value: 'verify-full', label: 'Verify Full' }
        ],
        description: 'SSL connection mode'
      }
    ]
  },
  {
    id: 'mysql',
    name: "MySQL",
    icon: mysqlLogo,
    connected: false,
    description: "Connect to MySQL database for web applications and data storage",
    category: "Database",
    capabilities: ["CRUD Operations", "Transactions", "Replication", "Performance Tuning"],
    version: "v1.7.3",
    popularity: 83,
    certified: true,
    configFields: [
      {
        name: 'host',
        label: 'Database Host',
        type: 'text',
        required: true,
        placeholder: 'mysql.company.com',
        description: 'MySQL database hostname'
      },
      {
        name: 'port',
        label: 'Port',
        type: 'number',
        required: true,
        defaultValue: 3306,
        placeholder: '3306',
        description: 'MySQL port (default: 3306)'
      },
      {
        name: 'database',
        label: 'Database Name',
        type: 'text',
        required: true,
        placeholder: 'myapp_db',
        description: 'Name of the MySQL database'
      },
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'db_user',
        description: 'Database username'
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'Enter database password',
        description: 'Database password'
      }
    ]
  },
  {
    id: 'kafka',
    name: "Apache Kafka",
    icon: kafkaLogo,
    connected: false,
    description: "Connect to Apache Kafka for real-time data streaming and event processing",
    category: "Streaming",
    capabilities: ["Real-time Streaming", "Event Processing", "Message Queuing", "High Throughput"],
    version: "v2.2.0",
    popularity: 71,
    certified: true,
    configFields: [
      {
        name: 'bootstrapServers',
        label: 'Bootstrap Servers',
        type: 'text',
        required: true,
        placeholder: 'kafka1:9092,kafka2:9092',
        description: 'Comma-separated list of Kafka broker addresses'
      },
      {
        name: 'groupId',
        label: 'Consumer Group ID',
        type: 'text',
        required: true,
        placeholder: 'my-consumer-group',
        description: 'Consumer group identifier'
      },
      {
        name: 'securityProtocol',
        label: 'Security Protocol',
        type: 'select',
        defaultValue: 'PLAINTEXT',
        options: [
          { value: 'PLAINTEXT', label: 'PLAINTEXT' },
          { value: 'SSL', label: 'SSL' },
          { value: 'SASL_PLAINTEXT', label: 'SASL_PLAINTEXT' },
          { value: 'SASL_SSL', label: 'SASL_SSL' }
        ],
        description: 'Security protocol for Kafka connection'
      },
      {
        name: 'enableAutoCommit',
        label: 'Enable Auto Commit',
        type: 'boolean',
        defaultValue: true,
        description: 'Automatically commit message offsets'
      }
    ]
  }
];

export const getConnectorsByCategory = () => {
  const categories = connectorsData.reduce((acc, connector) => {
    if (!acc[connector.category]) {
      acc[connector.category] = [];
    }
    acc[connector.category].push(connector);
    return acc;
  }, {} as Record<string, Connector[]>);

  // Sort connectors within each category by popularity
  Object.keys(categories).forEach(category => {
    categories[category].sort((a, b) => b.popularity - a.popularity);
  });

  return categories;
};

export const getPopularConnectors = (limit: number = 6) => {
  return connectorsData
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
};

export const searchConnectors = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return connectorsData.filter(connector =>
    connector.name.toLowerCase().includes(lowercaseQuery) ||
    connector.description.toLowerCase().includes(lowercaseQuery) ||
    connector.category.toLowerCase().includes(lowercaseQuery) ||
    connector.capabilities.some(cap => cap.toLowerCase().includes(lowercaseQuery))
  );
};