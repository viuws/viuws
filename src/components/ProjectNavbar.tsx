import useProjectStore from "../stores/projectStore";

function ProjectNavbar() {
  const projectName = useProjectStore((state) => state.name);
  const setProjectName = useProjectStore((state) => state.setName);

  return (
    <div className="navbar space-x-2">
      <div className="navbar-start">
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="input input-ghost font-bold"
        />
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-end"></div>
    </div>
  );
}

export default ProjectNavbar;
