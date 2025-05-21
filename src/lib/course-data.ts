export const allCourses = [
  {
    id: "aws-cloud-practitioner",
    name: "CLF-C02 AWS Certified Cloud Practitioner",
    group: "AWS",
    description: "Prepare for the AWS Cloud Practitioner certification with foundational cloud concepts and AWS services.",
  },
  {
    id: "aws-solutions-architect",
    name: "SAA-C03 AWS Certified Solutions Architect – Associate",
    group: "AWS",
    description: "Master AWS architecture and design for the Solutions Architect certification.",
  },
  { id: "aws-developer", name: "DVA-C02 AWS Certified Developer – Associate", group: "AWS", description: "Develop and deploy applications on AWS with best practices for the Developer Associate exam." },
  {
    id: "aws-sysops",
    name: "SOA-C02 AWS Certified SysOps Administrator – Associate",
    group: "AWS",
    description: "Operate, manage, and deploy systems on AWS for the SysOps Administrator certification.",
  },
  {
    id: "aws-devops",
    name: "DOP-C02 AWS Certified DevOps Engineer – Professional",
    group: "AWS",
    description: "Design and manage DevOps solutions on AWS for the Professional certification.",
  },
  { id: "aws-security", name: "SCS-C02 AWS Certified Security – Specialty", group: "AWS", description: "Specialize in securing AWS environments for the Security Specialty exam." },
  {
    id: "aws-advanced-networking",
    name: "ANS-C01 AWS Certified Advanced Networking – Specialty",
    group: "AWS",
    description: "Master advanced networking concepts and solutions on AWS for the Specialty certification.",
  },
  {
    id: "aws-machine-learning",
    name: "MLS-C01 AWS Certified Machine Learning – Specialty",
    group: "AWS",
    description: "Build, train, and deploy machine learning models on AWS for the ML Specialty exam.",
  },
  {
    id: "azure-fundamentals",
    name: "AZ-900 Microsoft Certified: Azure Fundamentals",
    group: "Azure",
    description: "Learn the basics of Microsoft Azure and cloud computing for the Azure Fundamentals exam.",
  },
  {
    id: "azure-administrator",
    name: "AZ-104 Microsoft Certified: Azure Administrator Associate",
    group: "Azure",
    description: "Get ready for the Azure Administrator certification with hands-on cloud management skills.",
  },
  {
    id: "azure-developer",
    name: "AZ-204 Microsoft Certified: Azure Developer Associate",
    group: "Azure",
    description: "Develop and deploy applications on Azure for the Developer Associate exam.",
  },
  {
    id: "azure-solutions-architect",
    name: "AZ-305 Microsoft Certified: Azure Solutions Architect Expert",
    group: "Azure",
    description: "Design and implement solutions on Azure for the Solutions Architect Expert certification.",
  },
  {
    id: "azure-security",
    name: "AZ-500 Microsoft Certified: Azure Security Engineer Associate",
    group: "Azure",
    description: "Secure Azure environments and manage security operations for the Security Engineer certification.",
  },
  {
    id: "azure-ai",
    name: "AI-102 Microsoft Certified: Azure AI Engineer Associate",
    group: "Azure",
    description: "Design and implement AI solutions on Azure for the AI Engineer certification.",
  },
  {
    id: "azure-data-engineer",
    name: "DP-203 Microsoft Certified: Azure Data Engineer Associate",
    group: "Azure",
    description: "Design and implement data solutions on Azure for the Data Engineer certification.",
  },
  { id: "gcp-cloud-digital-leader", name: "GCDL Google Cloud Digital Leader", group: "Google Cloud", description: "Demonstrate knowledge of Google Cloud services and digital transformation for the Digital Leader exam." },
  {
    id: "gcp-associate-cloud-engineer",
    name: "ACE Google Associate Cloud Engineer",
    group: "Google Cloud",
    description: "Deploy and manage Google Cloud solutions for the Associate Cloud Engineer certification.",
  },
  {
    id: "gcp-professional-cloud-architect",
    name: "PCA Google Professional Cloud Architect",
    group: "Google Cloud",
    description: "Design and manage scalable Google Cloud solutions for the Professional Cloud Architect exam.",
  },
  { id: "gcp-data-engineer", name: "PDE Google Professional Data Engineer", group: "Google Cloud", description: "Design and build data processing systems on Google Cloud for the Data Engineer certification." },
  {
    id: "gcp-security-engineer",
    name: "PSE Google Professional Cloud Security Engineer",
    group: "Google Cloud",
    description: "Design and implement secure infrastructure on Google Cloud for the Security Engineer exam.",
  },
  {
    id: "gcp-network-engineer",
    name: "PNE Google Professional Cloud Network Engineer",
    group: "Google Cloud",
    description: "Design, implement, and manage Google Cloud networks for the Network Engineer certification.",
  },
  // Oracle Cloud
  {
    id: "oracle-foundations-associate",
    name: "1Z0-1085 Oracle Cloud Infrastructure Foundations Associate",
    group: "Oracle Cloud",
    description: "Learn the basics of Oracle Cloud Infrastructure for the Foundations Associate exam.",
  },
  {
    id: "oracle-architect-associate",
    name: "1Z0-1072 Oracle Cloud Infrastructure Architect Associate",
    group: "Oracle Cloud",
    description: "Design and implement Oracle Cloud solutions for the Architect Associate certification.",
  },
  {
    id: "oracle-architect-professional",
    name: "1Z0-997 Oracle Cloud Infrastructure Architect Professional",
    group: "Oracle Cloud",
    description: "Advanced design and implementation of Oracle Cloud solutions for the Architect Professional exam.",
  },
  {
    id: "oracle-developer-associate",
    name: "1Z0-1084 Oracle Cloud Infrastructure Developer Associate",
    group: "Oracle Cloud",
    description: "Develop and deploy applications on Oracle Cloud for the Developer Associate certification.",
  },
  {
    id: "oracle-security-professional",
    name: "1Z0-1104 Oracle Cloud Infrastructure Security Professional",
    group: "Oracle Cloud",
    description: "Demonstrate advanced security skills for Oracle Cloud Infrastructure.",
  },
  {
    id: "oracle-data-science-professional",
    name: "1Z0-1096 Oracle Cloud Infrastructure Data Science Professional",
    group: "Oracle Cloud",
    description: "Build and manage data science solutions on Oracle Cloud for the Data Science Professional certification.",
  },
  // IBM Cloud
  {
    id: "ibm-cloud-adv-architect",
    name: "C1000-117 IBM Certified Solution Architect – Cloud Pak for Applications v4.1",
    group: "IBM Cloud",
    description: "Design and architect cloud-native applications using IBM Cloud Pak for Applications.",
  },
  {
    id: "ibm-cloud-developer",
    name: "C1000-118 IBM Certified Application Developer – Cloud Pak for Applications v4.1",
    group: "IBM Cloud",
    description: "Develop and deploy applications on IBM Cloud Pak for Applications.",
  },
  {
    id: "ibm-cloud-fundamentals",
    name: "C1000-083 IBM Cloud Foundations",
    group: "IBM Cloud",
    description: "Understand IBM Cloud core concepts and services for the Foundations certification.",
  },
  {
    id: "ibm-cloud-professional-developer",
    name: "C1000-124 IBM Certified Professional Developer - Cloud v5",
    group: "IBM Cloud",
    description: "Develop, deploy, and manage applications on IBM Cloud for the Professional Developer certification.",
  },
  {
    id: "ibm-cloud-sre",
    name: "C1000-118 IBM Certified SRE - Cloud v2",
    group: "IBM Cloud",
    description: "Demonstrate skills in site reliability engineering and cloud operations for IBM Cloud.",
  },
  // HashiCorp
  {
    id: "hashicorp-terraform-associate",
    name: "HTA HashiCorp Certified: Terraform Associate",
    group: "HashiCorp",
    description: "Validate your skills in infrastructure as code and automation using HashiCorp Terraform.",
  },
  {
    id: "hashicorp-vault-associate",
    name: "HVA HashiCorp Certified: Vault Associate",
    group: "HashiCorp",
    description: "Demonstrate knowledge of secure secret management and data protection with HashiCorp Vault.",
  },
  {
    id: "hashicorp-consul-associate",
    name: "HCA HashiCorp Certified: Consul Associate",
    group: "HashiCorp",
    description: "Show your expertise in service networking and service mesh with HashiCorp Consul.",
  },
  {
    id: "hashicorp-nomad-associate",
    name: "HNA HashiCorp Certified: Nomad Associate",
    group: "HashiCorp",
    description: "Show your expertise in workload orchestration and scheduling with HashiCorp Nomad.",
  },
  {
    id: "hashicorp-vault-operations-professional",
    name: "HashiCorp Certified: Vault Operations Professional",
    group: "HashiCorp",
    description: "Demonstrate advanced operational skills for managing HashiCorp Vault in production environments.",
  },
  // PMI (Project Management Institute)
  {
    id: "pmi-pmp",
    name: "Project Management Professional (PMP)",
    group: "PMI",
    description: "Demonstrate your ability to manage projects and lead teams with the globally recognized PMP certification.",
  },
  {
    id: "pmi-capm",
    name: "Certified Associate in Project Management (CAPM)",
    group: "PMI",
    description: "Show your understanding of fundamental project management concepts and processes with the CAPM certification.",
  },
  {
    id: "pmi-acp",
    name: "PMI Agile Certified Practitioner (PMI-ACP)",
    group: "PMI",
    description: "Validate your knowledge of agile principles and skills with the PMI-ACP certification.",
  },
  {
    id: "pmi-rmp",
    name: "PMI Risk Management Professional (PMI-RMP)",
    group: "PMI",
    description: "Demonstrate your expertise in identifying and managing project risks with the PMI-RMP certification.",
  },
  {
    id: "pmi-pba",
    name: "PMI Professional in Business Analysis (PMI-PBA)",
    group: "PMI",
    description: "Show your skills in business analysis and requirements management with the PMI-PBA certification.",
  },
];

export const courseGroups = [
  {
    name: "AWS",
    courses: allCourses.filter((c) => c.group === "AWS"),
  },
  {
    name: "Azure",
    courses: allCourses.filter((c) => c.group === "Azure"),
  },
  {
    name: "Google Cloud",
    courses: allCourses.filter((c) => c.group === "Google Cloud"),
  },
  {
    name: "Oracle Cloud",
    courses: allCourses.filter((c) => c.group === "Oracle Cloud"),
  },
  {
    name: "IBM Cloud",
    courses: allCourses.filter((c) => c.group === "IBM Cloud"),
  },
  {
    name: "HashiCorp",
    courses: allCourses.filter((c) => c.group === "HashiCorp"),
  },
  {
    name: "PMI",
    courses: allCourses.filter((c) => c.group === "PMI"),
  },
]; 