export const allCourses = [
  {
    id: "aws-cloud-practitioner",
    name: "AWS Certified Cloud Practitioner",
    group: "AWS",
    description: "Prepare for the AWS Cloud Practitioner certification with foundational cloud concepts and AWS services.",
  },
  {
    id: "aws-solutions-architect",
    name: "AWS Certified Solutions Architect – Associate",
    group: "AWS",
    description: "Master AWS architecture and design for the Solutions Architect certification.",
  },
  { id: "aws-developer", name: "AWS Certified Developer – Associate", group: "AWS", description: "Develop and deploy applications on AWS with best practices for the Developer Associate exam." },
  {
    id: "aws-sysops",
    name: "AWS Certified SysOps Administrator – Associate",
    group: "AWS",
    description: "Operate, manage, and deploy systems on AWS for the SysOps Administrator certification.",
  },
  {
    id: "aws-devops",
    name: "AWS Certified DevOps Engineer – Professional",
    group: "AWS",
    description: "Design and manage DevOps solutions on AWS for the Professional certification.",
  },
  { id: "aws-security", name: "AWS Certified Security – Specialty", group: "AWS", description: "Specialize in securing AWS environments for the Security Specialty exam." },
  {
    id: "aws-advanced-networking",
    name: "AWS Certified Advanced Networking – Specialty",
    group: "AWS",
    description: "Master advanced networking concepts and solutions on AWS for the Specialty certification.",
  },
  {
    id: "aws-machine-learning",
    name: "AWS Certified Machine Learning – Specialty",
    group: "AWS",
    description: "Build, train, and deploy machine learning models on AWS for the ML Specialty exam.",
  },
  {
    id: "azure-fundamentals",
    name: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    group: "Azure",
    description: "Learn the basics of Microsoft Azure and cloud computing for the Azure Fundamentals exam.",
  },
  {
    id: "azure-administrator",
    name: "Microsoft Certified: Azure Administrator Associate (AZ-104)",
    group: "Azure",
    description: "Get ready for the Azure Administrator certification with hands-on cloud management skills.",
  },
  {
    id: "azure-developer",
    name: "Microsoft Certified: Azure Developer Associate (AZ-204)",
    group: "Azure",
    description: "Develop and deploy applications on Azure for the Developer Associate exam.",
  },
  {
    id: "azure-solutions-architect",
    name: "Microsoft Certified: Azure Solutions Architect Expert (AZ-305)",
    group: "Azure",
    description: "Design and implement solutions on Azure for the Solutions Architect Expert certification.",
  },
  {
    id: "azure-security",
    name: "Microsoft Certified: Azure Security Engineer Associate (AZ-500)",
    group: "Azure",
    description: "Secure Azure environments and manage security operations for the Security Engineer certification.",
  },
  {
    id: "azure-ai",
    name: "Microsoft Certified: Azure AI Engineer Associate (AI-102)",
    group: "Azure",
    description: "Design and implement AI solutions on Azure for the AI Engineer certification.",
  },
  {
    id: "azure-data-engineer",
    name: "Microsoft Certified: Azure Data Engineer Associate (DP-203)",
    group: "Azure",
    description: "Design and implement data solutions on Azure for the Data Engineer certification.",
  },
  { id: "gcp-cloud-digital-leader", name: "Google Cloud Digital Leader", group: "Google Cloud", description: "Demonstrate knowledge of Google Cloud services and digital transformation for the Digital Leader exam." },
  {
    id: "gcp-associate-cloud-engineer",
    name: "Google Associate Cloud Engineer",
    group: "Google Cloud",
    description: "Deploy and manage Google Cloud solutions for the Associate Cloud Engineer certification.",
  },
  {
    id: "gcp-professional-cloud-architect",
    name: "Google Professional Cloud Architect",
    group: "Google Cloud",
    description: "Design and manage scalable Google Cloud solutions for the Professional Cloud Architect exam.",
  },
  { id: "gcp-data-engineer", name: "Google Professional Data Engineer", group: "Google Cloud", description: "Design and build data processing systems on Google Cloud for the Data Engineer certification." },
  {
    id: "gcp-security-engineer",
    name: "Google Professional Cloud Security Engineer",
    group: "Google Cloud",
    description: "Design and implement secure infrastructure on Google Cloud for the Security Engineer exam.",
  },
  {
    id: "gcp-network-engineer",
    name: "Google Professional Cloud Network Engineer",
    group: "Google Cloud",
    description: "Design, implement, and manage Google Cloud networks for the Network Engineer certification.",
  },
  // Oracle Cloud
  {
    id: "oracle-foundations-associate",
    name: "Oracle Cloud Infrastructure Foundations Associate",
    group: "Oracle Cloud",
    description: "Learn the basics of Oracle Cloud Infrastructure for the Foundations Associate exam.",
  },
  {
    id: "oracle-architect-associate",
    name: "Oracle Cloud Infrastructure Architect Associate",
    group: "Oracle Cloud",
    description: "Design and implement Oracle Cloud solutions for the Architect Associate certification.",
  },
  {
    id: "oracle-architect-professional",
    name: "Oracle Cloud Infrastructure Architect Professional",
    group: "Oracle Cloud",
    description: "Advanced design and implementation of Oracle Cloud solutions for the Architect Professional exam.",
  },
  // IBM Cloud
  {
    id: "ibm-cloud-adv-architect",
    name: "IBM Certified Solution Architect – Cloud Pak for Applications v4.1",
    group: "IBM Cloud",
    description: "Design and architect cloud-native applications using IBM Cloud Pak for Applications.",
  },
  {
    id: "ibm-cloud-developer",
    name: "IBM Certified Application Developer – Cloud Pak for Applications v4.1",
    group: "IBM Cloud",
    description: "Develop and deploy applications on IBM Cloud Pak for Applications.",
  },
  {
    id: "ibm-cloud-fundamentals",
    name: "IBM Cloud Foundations",
    group: "IBM Cloud",
    description: "Understand IBM Cloud core concepts and services for the Foundations certification.",
  },
  // HashiCorp
  {
    id: "hashicorp-terraform-associate",
    name: "HashiCorp Certified: Terraform Associate",
    group: "HashiCorp",
    description: "Validate your skills in infrastructure as code and automation using HashiCorp Terraform.",
  },
  {
    id: "hashicorp-vault-associate",
    name: "HashiCorp Certified: Vault Associate",
    group: "HashiCorp",
    description: "Demonstrate knowledge of secure secret management and data protection with HashiCorp Vault.",
  },
  {
    id: "hashicorp-consul-associate",
    name: "HashiCorp Certified: Consul Associate",
    group: "HashiCorp",
    description: "Show your expertise in service networking and service mesh with HashiCorp Consul.",
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
]; 