import useAppStore from "../stores/appStore";

function ProcessPanel() {
  const processes = useAppStore((state) => state.processes);
  return (
    <div>
      <ul>
        {processes.map((process) => (
          <li>{process.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProcessPanel;
