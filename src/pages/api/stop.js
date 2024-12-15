import { EC2Client, StopInstancesCommand } from '@aws-sdk/client-ec2';

const client = new EC2Client({ region: process.env.MY_ALTER_AWS_REGION || 'us-east-1' });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { instanceId } = req.body;
    try {
      const command = new StopInstancesCommand({ InstanceIds: [instanceId] });
      await client.send(command);
      res.status(200).json({ message: 'Instancia detenida correctamente' });
    } catch (error) {
      console.error('Error stopping instance:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
