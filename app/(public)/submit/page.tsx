'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { PhotoUploader } from '@/components/ui/PhotoUploader';
import Geocoder from '@/components/Geocoder';
import Confetti from '@/components/Confetti';
import { useRecaptcha } from '@/components/hooks/useRecaptcha';
import type { ListingPayload, SocialLinks } from '@/lib/validation';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

type Step = 1 | 2;

interface FormData {
  type: 'event' | 'hub';
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  locationText: string;
  lat?: number;
  lng?: number;
  contactEmail: string;
  contactPhone: string;
  organiserName: string;
  organiserAbout: string;
  socials: SocialLinks;
  ageRange: string;
  capacity: string;
  price: string;
  photos: string[];
  verifiedIntent: boolean;
  is_permanent: boolean;
}

interface FormErrors {
  title?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  locationText?: string;
  description?: string;
  organiserName?: string;
  contactEmail?: string;
  organiserAbout?: string;
  photos?: string;
  verifiedIntent?: string;
  socials?: string;
}

const initialFormData: FormData = {
  type: 'event',
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  locationText: '',
  contactEmail: '',
  contactPhone: '',
  organiserName: '',
  organiserAbout: '',
  socials: {},
  ageRange: '',
  capacity: '',
  price: '',
  photos: [],
  verifiedIntent: false,
  is_permanent: false,
};

const ageRangeOptions = [
  { value: 'all-ages', label: 'All ages' },
  { value: '0-4', label: '0–4' },
  { value: '5-8', label: '5–8' },
  { value: '9-12', label: '9–12' },
  { value: '13-16', label: '13–16' },
  { value: 'teens', label: 'Teens' },
];

const capacityOptions = [
  { value: 'small', label: 'Small (5–10)' },
  { value: 'medium', label: '10–30' },
  { value: 'large', label: '30–100' },
  { value: '100+', label: '100+' },
];

export default function SubmitPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      console.log('Getting session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Session result:', { session, error });
      setSession(session);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session);
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing (only for fields that have error types)
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const updateSocials = (field: keyof SocialLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      socials: { ...prev.socials, [field]: value }
    }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim() || formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.type) {
      newErrors.type = 'Please select a type';
    }

    // Only require start date for non-permanent listings
    if (!formData.is_permanent && !formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    // Only validate end date if start date exists and it's not a permanent hub
    if (!formData.is_permanent && formData.startDate && formData.endDate && 
        new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.locationText.trim()) {
      newErrors.locationText = 'Location is required';
    }

    if (!formData.description.trim() || formData.description.length > 600) {
      newErrors.description = 'Description must be between 1 and 600 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.organiserName.trim()) {
      newErrors.organiserName = 'Organiser name is required';
    }

    if (!formData.contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Valid email address is required';
    }

    if (formData.organiserAbout.length > 200) {
      newErrors.organiserAbout = 'About section must be 200 characters or less';
    }

    if (formData.type === 'hub' && formData.photos.length < 1) {
      newErrors.photos = 'At least 1 photo is required for hubs';
    }

    if (!formData.verifiedIntent) {
      newErrors.verifiedIntent = 'You must agree to provide proof if requested';
    }

    // Check if at least one social link is provided
    const hasSocialLink = Object.values(formData.socials).some(link => link?.trim());
    if (!hasSocialLink) {
      newErrors.socials = 'At least one social link or website is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
      return;
    }

    if (!validateStep2()) {
      return;
    }

    // Check if user is authenticated
    if (!session?.access_token) {
      alert('Please sign in to submit a listing. You will be redirected to the sign-in page.');
      router.push('/signin');
      return;
    }

    setIsSubmitting(true);
    try {
      // Transform formData to match API schema
      const payload = {
        ltype: formData.type,
        title: formData.title,
        description: formData.description,
        start_date: formData.is_permanent ? null : formData.startDate,
        end_date: formData.is_permanent ? null : formData.endDate,
        is_permanent: formData.is_permanent,
        city: formData.locationText.split(',')[0].trim(),
        region: formData.locationText.split(',').slice(1, -1).join(',').trim() || undefined,
        country: formData.locationText.split(',').slice(-1)[0].trim(),
        lat: formData.lat,
        lng: formData.lng,
        price: formData.price ? parseFloat(formData.price) : undefined,
        website_url: formData.socials.website || undefined,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone || undefined,
        organiser_name: formData.organiserName,
        organiser_about: formData.organiserAbout || undefined,
        age_range: formData.ageRange || undefined,
        capacity: formData.capacity || undefined,
        photos: formData.photos, // These are now real URLs from Supabase
        verified_intent: formData.verifiedIntent,
        social_links: {
          website: formData.socials.website || undefined,
          facebook: formData.socials.facebook || undefined,
          instagram: formData.socials.instagram || undefined,
          other: formData.socials.other || undefined
        }
      };

      console.log('Submitting payload:', payload);
      console.log('Session:', session);
      console.log('Access token exists:', !!session?.access_token);

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Listing created successfully:', result);
        setIsSuccess(true);
      } else {
        const error = await response.json();
        console.error('API error:', error);
        alert(`Error: ${error.message || 'Failed to create listing'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting your listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setCurrentStep(1);
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <AppShell>
        <div className="min-h-screen bg-[var(--wl-beige)] flex items-center justify-center p-4">
          <Confetti isActive={true} />
          <div className="bg-white rounded-2xl shadow-card p-8 max-w-md w-full text-center">
            <CheckCircle className="w-16 h-16 text-[var(--wl-forest)] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[var(--wl-forest)] mb-2">
              Thanks for your submission!
            </h1>
            <p className="text-[var(--wl-slate)] mb-6">
              We'll review your listing within 48 hours and get back to you via email.
            </p>
            <div className="space-y-3">
              <Button 
                variant="primary" 
                onClick={() => router.push('/explore')}
                className="w-full"
              >
                Back to Explore
              </Button>
              <Button 
                variant="ghost" 
                onClick={resetForm}
                className="w-full"
              >
                Submit Another
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-[var(--wl-beige)] p-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-[var(--wl-forest)]">
                Submit a Listing
              </h1>
              <Badge variant="neutral">
                Step {currentStep} of 2
              </Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-[var(--wl-border)] rounded-full h-2">
              <div 
                className="bg-[var(--wl-forest)] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between mt-2 text-sm text-[var(--wl-slate)]">
              <span className={currentStep >= 1 ? 'text-[var(--wl-forest)] font-medium' : ''}>
                Basics
              </span>
              <span className={currentStep >= 2 ? 'text-[var(--wl-forest)] font-medium' : ''}>
                Trust & Details
              </span>
            </div>
          </div>

          {/* Authentication Status */}
          <div className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${session?.access_token ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium text-[var(--wl-ink)]">
                  {session?.access_token ? 'Signed in' : 'Not signed in'}
                </span>
                {session?.user?.email && (
                  <span className="text-sm text-[var(--wl-slate)]">
                    as {session.user.email}
                  </span>
                )}
              </div>
              {!session?.access_token && (
                <button
                  onClick={() => router.push('/signin')}
                  className="text-sm text-[var(--wl-forest)] hover:text-[var(--wl-sky)] underline"
                >
                  Sign in now
                </button>
              )}
            </div>
          </div>

          <form role="form" aria-describedby="form-description" className="space-y-6">
            <div id="form-description" className="sr-only">
              Contact email is used for verification and is not shown publicly unless you choose to.
            </div>

            {/* Step 1: Basics */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card p-4 sm:p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-[var(--wl-forest)]">Basic Information</h2>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('title', e.target.value)}
                      placeholder="e.g., Family Nature Walk, Co-working Hub"
                      error={errors.title}
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <Select
                      id="type"
                      value={formData.type}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('type', e.target.value as 'event' | 'hub')}
                      error={errors.type}
                    >
                      <option value="event">Event</option>
                      <option value="hub">Hub</option>
                    </Select>
                  </div>

                  {/* Permanent Hub Checkbox */}
                  {formData.type === 'hub' && (
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_permanent}
                          onChange={(e) => updateFormData('is_permanent', e.target.checked)}
                          className="rounded border-gray-300 text-[var(--wl-forest)] focus:ring-[var(--wl-forest)]"
                        />
                        <span className="text-sm font-medium text-[var(--wl-ink)]">
                          This is a permanent hub (always open)
                        </span>
                      </label>
                      {formData.is_permanent && (
                        <p className="text-xs text-[var(--wl-slate)] ml-6">
                          Permanent hubs are always available and don't have specific start/end dates
                        </p>
                      )}
                    </div>
                  )}

                  {/* Conditionally show date fields */}
                  {!formData.is_permanent && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                          {formData.type === 'event' ? 'Start Date' : 'Opening Date'} <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('startDate', e.target.value)}
                          error={errors.startDate}
                        />
                        <p className="text-xs text-[var(--wl-slate)] mt-1">
                          {formData.type === 'event' 
                            ? 'When the event starts' 
                            : 'When this hub opens or becomes available'
                          }
                        </p>
                      </div>
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                          {formData.type === 'event' ? 'End Date' : 'Closing Date'}
                        </label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('endDate', e.target.value)}
                          error={errors.endDate}
                        />
                        <p className="text-xs text-[var(--wl-slate)] mt-1">
                          {formData.type === 'event' 
                            ? 'When the event ends' 
                            : 'When this hub closes (leave empty if ongoing)'
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <Geocoder
                      onLocationSelect={(location) => {
                        updateFormData('locationText', `${location.city}, ${location.country}`);
                        updateFormData('lat', location.lat);
                        updateFormData('lng', location.lng);
                      }}
                    />
                    {errors.locationText && (
                      <p className="text-sm text-red-600 mt-1">{errors.locationText}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('description', e.target.value)}
                      placeholder="Tell families what to expect..."
                      rows={4}
                      maxLength={600}
                      error={errors.description}
                    />
                    <p className="text-xs text-[var(--wl-slate)] mt-1">
                      {formData.description.length}/600 characters
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="primary" 
                    onClick={nextStep}
                    className="flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Trust & Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card p-4 sm:p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-[var(--wl-forest)]">About the Organiser</h2>
                  
                  <div>
                    <label htmlFor="organiserName" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                      Organiser Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="organiserName"
                      value={formData.organiserName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('organiserName', e.target.value)}
                      placeholder="Your name or organisation name"
                      error={errors.organiserName}
                    />
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                      Contact Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('contactEmail', e.target.value)}
                      placeholder="your@email.com"
                      error={errors.contactEmail}
                    />
                    <p className="text-xs text-[var(--wl-slate)] mt-1">
                      Used for verification and is not shown publicly unless you choose to.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                      Contact Phone (Optional)
                    </label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('contactPhone', e.target.value)}
                      placeholder="+44 20 7123 4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="organiserAbout" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                      About Us
                    </label>
                    <Textarea
                      id="organiserAbout"
                      value={formData.organiserAbout}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('organiserAbout', e.target.value)}
                      placeholder="Tell families about your experience and background..."
                      rows={3}
                      maxLength={200}
                      error={errors.organiserAbout}
                    />
                    <p className="text-xs text-[var(--wl-slate)] mt-1">
                      {formData.organiserAbout.length}/200 characters
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card p-4 sm:p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-[var(--wl-forest)]">Links & Media</h2>
                  
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                      Website
                    </label>
                    <Input
                      id="website"
                      value={formData.socials.website || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSocials('website', e.target.value)}
                      placeholder="yoursite.com or any website link"
                    />
                    <p className="text-xs text-[var(--wl-slate)] mt-1">
                      Link to your official site, booking page, or any relevant website.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="facebook" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                        Facebook
                      </label>
                      <Input
                        id="facebook"
                        value={formData.socials.facebook || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSocials('facebook', e.target.value)}
                        placeholder="Page or group URL"
                      />
                    </div>
                    <div>
                      <label htmlFor="instagram" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                        Instagram
                      </label>
                      <Input
                        id="instagram"
                        value={formData.socials.instagram || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSocials('instagram', e.target.value)}
                        placeholder="@username or profile URL"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="other" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                      Other Link
                    </label>
                    <Input
                      id="other"
                      value={formData.socials.other || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSocials('other', e.target.value)}
                      placeholder="Any other relevant link"
                    />
                  </div>

                  <PhotoUploader
                    photos={formData.photos}
                    onChange={(urls) => updateFormData('photos', urls)}
                    minPhotos={formData.type === 'hub' ? 1 : 0}
                    maxPhotos={5}
                    required={formData.type === 'hub'}
                  />
                </div>

                <div className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card p-4 sm:p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-[var(--wl-forest)]">Extra Information</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="ageRange" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                        Age Range
                      </label>
                      <Select
                        id="ageRange"
                        value={formData.ageRange}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('ageRange', e.target.value)}
                      >
                        <option value="">Select age range</option>
                        {ageRangeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="capacity" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                        Capacity
                      </label>
                      <Select
                        id="capacity"
                        value={formData.capacity}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('capacity', e.target.value)}
                      >
                        <option value="">Select capacity</option>
                        {capacityOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-[var(--wl-ink)] mb-1">
                        Price
                      </label>
                      <Input
                        id="price"
                        value={formData.price}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('price', e.target.value)}
                        placeholder="Free, £10, €15"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card p-4 sm:p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-[var(--wl-forest)]">Verification</h2>
                  
                  <div className="flex items-start space-x-3">
                    <input
                      id="verifiedIntent"
                      type="checkbox"
                      checked={formData.verifiedIntent}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('verifiedIntent', e.target.checked)}
                      className="mt-1 w-4 h-4 text-[var(--wl-forest)] border-[var(--wl-border)] rounded focus:ring-[var(--wl-sky)]"
                    />
                    <label htmlFor="verifiedIntent" className="text-sm text-[var(--wl-ink)]">
                      I agree to provide proof of legitimacy (e.g., website, photos, social media) if requested by WanderLink.
                    </label>
                  </div>
                  {errors.verifiedIntent && (
                    <p className="text-sm text-red-600 mt-1">{errors.verifiedIntent}</p>
                  )}
                  {errors.socials && (
                    <p className="text-sm text-red-600 mt-1">{errors.socials}</p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={prevStep}
                    className="flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="primary" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </AppShell>
  );
} 