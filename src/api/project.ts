import { Node, Edge } from "reactflow";
import { Project } from "../interfaces/project";
import useProjectStore from "../stores/projectStore";
import useRFStore from "../stores/rfStore";

function loadNodesFromProject(project: Project) {
  return []; // TODO
}

function loadEdgesFromProject(project: Project) {
  return []; // TODO
}

export function loadProject(project: Project) {
  const setProjectName = useProjectStore((state) => state.setName);
  const setRFNodes = useRFStore((state) => state.setNodes);
  const setRFEdges = useRFStore((state) => state.setEdges);
  setProjectName(project.name);
  setRFNodes(loadNodesFromProject(project));
  setRFEdges(loadEdgesFromProject(project));
}

function saveNodesToProject(project: Project, nodes: Node[]) {
  // TODO
}

function saveEdgesToProject(project: Project, edges: Edge[]) {
  // TODO
}

export function saveProject() {
  const projectName = useProjectStore((state) => state.name);
  const rfNodes = useRFStore((state) => state.nodes);
  const rfEdges = useRFStore((state) => state.edges);
  const project: Project = { name: projectName };
  saveNodesToProject(project, rfNodes);
  saveEdgesToProject(project, rfEdges);
  return project;
}
