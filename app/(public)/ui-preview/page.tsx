import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import Image from 'next/image';

export default function UIPreviewPage() {
  return (
    <div className="p-6 space-y-8 bg-[var(--wl-beige)] text-[var(--wl-ink)]">
      <div className="text-center">
        <div className="w-56 h-56 mx-auto mb-4">
          <Image 
            src="/logo.png" 
            alt="WanderLink Hub Logo" 
            width={224} 
            height={224} 
            className="w-56 h-56"
          />
        </div>
        <h1 className="text-3xl font-bold text-[var(--wl-forest)] mb-2">
          WanderLink Hub Design System
        </h1>
        <p className="text-[var(--wl-slate)]">
          Official Color Palette & UI Components
        </p>
      </div>

      {/* Color Palette Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--wl-forest)] border-b border-[var(--wl-border)] pb-2">
          Official Color Palette
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="w-20 h-20 rounded-lg bg-[var(--wl-forest)] border border-[var(--wl-border)]"></div>
            <p className="text-sm font-medium text-[var(--wl-forest)]">Forest</p>
            <p className="text-xs text-[var(--wl-slate)]">#2E5D50</p>
            <p className="text-xs text-[var(--wl-slate)]">Primary CTA</p>
            <p className="text-xs text-[var(--wl-slate)]">Buttons, nav active</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-20 h-20 rounded-lg bg-[var(--wl-sand)] border border-[var(--wl-border)]"></div>
            <p className="text-sm font-medium text-[var(--wl-sand)]">Sand</p>
            <p className="text-xs text-[var(--wl-slate)]">#E0A628</p>
            <p className="text-xs text-[var(--wl-slate)]">Secondary CTAs</p>
            <p className="text-xs text-[var(--wl-slate)]">Highlights, badges</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-20 h-20 rounded-lg bg-[var(--wl-coral)] border border-[var(--wl-border)]"></div>
            <p className="text-sm font-medium text-[var(--wl-coral)]">Coral</p>
            <p className="text-xs text-[var(--wl-slate)]">#E06C65</p>
            <p className="text-xs text-[var(--wl-slate)]">Success states</p>
            <p className="text-xs text-[var(--wl-slate)]">Positive accents</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-20 h-20 rounded-lg bg-[var(--wl-sky)] border border-[var(--wl-border)]"></div>
            <p className="text-sm font-medium text-[var(--wl-sky)]">Sky</p>
            <p className="text-xs text-[var(--wl-slate)]">#5BA4CF</p>
            <p className="text-xs text-[var(--wl-slate)]">Info states</p>
            <p className="text-xs text-[var(--wl-slate)]">Hover/focus</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-20 h-20 rounded-lg bg-[var(--wl-beige)] border border-[var(--wl-border)]"></div>
            <p className="text-sm font-medium text-[var(--wl-beige)]">Beige</p>
            <p className="text-xs text-[var(--wl-slate)]">#F8F4EC</p>
            <p className="text-xs text-[var(--wl-slate)]">Background</p>
            <p className="text-xs text-[var(--wl-slate)]">Neutral base</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-20 h-20 rounded-lg bg-[var(--wl-ink)] border border-[var(--wl-border)]"></div>
            <p className="text-sm font-medium text-[var(--wl-white)]">Ink</p>
            <p className="text-xs text-[var(--wl-white)]">#1B1B1B</p>
            <p className="text-xs text-[var(--wl-white)]">Headings</p>
            <p className="text-xs text-[var(--wl-white)]">Strong text</p>
          </div>
        </div>
      </section>

      {/* Button Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--wl-forest)] border-b border-[var(--wl-border)] pb-2">
          Buttons
        </h2>
        
        {/* Button Variants */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[var(--wl-forest)]">Variants</h3>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <p className="text-sm text-[var(--wl-slate)]">Primary</p>
              <Button variant="primary">Primary Button</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[var(--wl-slate)]">Secondary</p>
              <Button variant="secondary">Secondary Button</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[var(--wl-slate)]">Ghost</p>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>
        </div>

        {/* Button Sizes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[var(--wl-forest)]">Sizes</h3>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <p className="text-sm text-[var(--wl-slate)]">Small</p>
              <Button variant="primary" size="sm">Small Button</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[var(--wl-slate)]">Medium</p>
              <Button variant="primary" size="md">Medium Button</Button>
            </div>
          </div>
        </div>

        {/* Button States */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[var(--wl-forest)]">States</h3>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <p className="text-sm text-[var(--wl-slate)]">Default</p>
              <Button variant="primary">Click Me</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[var(--wl-slate)]">Disabled</p>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[var(--wl-slate)]">Loading</p>
              <Button variant="secondary" disabled>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Loading...
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Badge Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--wl-forest)] border-b border-[var(--wl-border)] pb-2">
          Badges
        </h2>
        
        {/* Badge Variants */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[var(--wl-forest)]">Variants</h3>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <p className="text-sm text-[var(--wl-slate)]">Success</p>
              <Badge variant="success">Verified</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[var(--wl-slate)]">Warning</p>
              <Badge variant="warning">Pending</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[var(--wl-slate)]">Neutral</p>
              <Badge variant="neutral">Draft</Badge>
            </div>
          </div>
        </div>

        {/* Badge Examples */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[var(--wl-forest)]">Examples</h3>
          <div className="flex flex-wrap gap-4">
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">Under Review</Badge>
            <Badge variant="neutral">Archived</Badge>
            <Badge variant="success">Featured</Badge>
            <Badge variant="warning">Expires Soon</Badge>
            <Badge variant="neutral">Beta</Badge>
          </div>
        </div>
      </section>

      {/* Combined Example */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--wl-forest)] border-b border-[var(--wl-border)] pb-2">
          Combined Example
        </h2>
        
        <div className="bg-[var(--wl-white)] p-6 rounded-lg border border-[var(--wl-border)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium text-[var(--wl-forest)]">Event Submission</h3>
              <Badge variant="warning">Pending Review</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="primary" size="sm">Submit</Button>
            </div>
          </div>
          <p className="text-[var(--wl-slate)] mb-4">
            This shows how buttons and badges work together using the official WanderLink Hub color palette.
          </p>
          <div className="flex gap-2">
            <Badge variant="neutral">Family Event</Badge>
            <Badge variant="neutral">Outdoor</Badge>
            <Badge variant="success">Free</Badge>
          </div>
        </div>
      </section>
    </div>
  );
} 