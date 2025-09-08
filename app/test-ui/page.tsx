import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function TestUIPage() {
  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">UI Test Page</h1>
      
      <div className="space-y-4">
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="ghost">Ghost Button</Button>
      </div>
      
      <div className="mt-6 space-y-2">
        <Badge variant="success">Success Badge</Badge>
        <Badge variant="warning">Warning Badge</Badge>
        <Badge variant="neutral">Neutral Badge</Badge>
      </div>
    </div>
  );
} 