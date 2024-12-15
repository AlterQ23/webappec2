import { useState, useEffect } from 'react';
import EC2Instance from '../components/EC2Instance';

export default function Home() {
  const [instances, setInstances] = useState([]);

  useEffect(() => {
    // Llamada al backend para obtener las instancias y sus estados
    async function fetchInstances() {
      const res = await fetch('/api/instances');
      const data = await res.json();
      setInstances(data.instances);
    }
    fetchInstances();
  }, []);

  const startInstance = async (instanceId) => {
    await fetch('/api/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instanceId }),
    });
    // Actualizar la lista de instancias
    updateInstances();
  };

  const stopInstance = async (instanceId) => {
    await fetch('/api/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instanceId }),
    });
    // Actualizar la lista de instancias
    updateInstances();
  };

  const updateInstances = async () => {
    const res = await fetch('/api/instances');
    const data = await res.json();
    setInstances(data.instances);
  };

  return (
    <div className="container">
      <h1>Administración de Instancias EC2</h1>
      <div className="instances">
        {instances.map((instance) => (
          <EC2Instance
            key={instance.id}
            instanceId={instance.id}
            state={instance.state}
            onStart={startInstance}
            onStop={stopInstance}
          />
        ))}
      </div>
    </div>
  );
}
