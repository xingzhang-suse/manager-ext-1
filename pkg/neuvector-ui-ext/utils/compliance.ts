import { sortByDisplayName } from "./common";

export function complianceImpactComp(a: any, b: any) {
  const aTotal =
    a.images.length + a.nodes.length + a.workloads.length + a.platforms.length;
  const bTotal =
    b.images.length + b.nodes.length + b.workloads.length + b.platforms.length;
  if (aTotal === bTotal) return 0;
  return aTotal > bTotal ? -1 : 1;
}

export function complianceContainerComp(a: any, b: any) {
  if (a.workloads.length === b.workloads.length) return 0;
  return a.workloads.length > b.workloads.length ? -1 : 1;
}

export function preprocessCompliance(complianceData: any) {
  complianceData.compliances.forEach((compliance: any) => {
    let domains = new Set();
    compliance.nodes = compliance.nodes.map((nodeId: any) => {
      complianceData.nodes[nodeId][0].id = nodeId;
      complianceData.nodes[nodeId][0].domains?.forEach((domain: any) => {
        domains.add(domain);
      });
      return complianceData.nodes[nodeId][0];
    });
    compliance.workloads = compliance.workloads.map((workloadId: any) => {
      complianceData.workloads[workloadId][0].id = workloadId;
      complianceData.workloads[workloadId][0].domains?.forEach(
        (domain: any) => {
          domains.add(domain);
        }
      );
      return complianceData.workloads[workloadId][0];
    });
    compliance.platforms = compliance.platforms.map((platformId: any) => {
      complianceData.platforms[platformId][0].id = platformId;
      complianceData.platforms[platformId][0].domains?.forEach(
        (domain: any) => {
          domains.add(domain);
        }
      );
      return complianceData.platforms[platformId][0];
    });
    compliance.images = compliance.images.map((imageId: any) => {
      complianceData.images[imageId][0].id = imageId;
      complianceData.images[imageId][0].domains?.forEach((domain: any) => {
        domains.add(domain);
      });
      return complianceData.images[imageId][0];
    });
    compliance.domains = [...domains];
    compliance.images.sort(sortByDisplayName);
    compliance.workloads.sort(sortByDisplayName);
    compliance.nodes.sort(sortByDisplayName);
    compliance.platforms.sort(sortByDisplayName);
  });
  return complianceData;
}
