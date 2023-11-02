import { Edge } from "reactflow";

export const RESOURCE_EDGE_TYPE = "resource";

export type ResourceEdgeData = {
    resource: string;
};

export type ResourceEdge = Edge<ResourceEdgeData>;
