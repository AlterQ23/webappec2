import { EC2Client, DescribeInstancesCommand } from '@aws-sdk/client-ec2';

// Crear un cliente de EC2
const client = new EC2Client({ region: process.env.AWS_REGION || 'us-east-1' });

export default async function handler(req, res) {
  try {
    // Configurar el comando para describir instancias
    const command = new DescribeInstancesCommand({
      Filters: [{ Name: 'instance-state-name', Values: ['running', 'stopped'] }],
    });

    // Ejecutar el comando
    const data = await client.send(command);

    // Procesar las instancias
    const instances = data.Reservations.flatMap((reservation) =>
      reservation.Instances.map((instance) => {
        const nameTag = instance.Tags.find((tag) => tag.Key === 'Name'); // Busca la etiqueta "Name"

        const name = nameTag ? nameTag.Value : 'Sin Nombre';
        return {
          id: instance.InstanceId,
          state: instance.State.Name,
          name: nameTag ? nameTag.Value : 'Sin Nombre', // Obtén el valor o asigna "Sin Nombre"
        };
      })
    );

    res.status(200).json({ instances });
  } catch (error) {
    console.error('Error fetching instances:', error);
    res.status(500).json({ error: error.message });
  }
}
