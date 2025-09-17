'use client';

import { useEffect, useState } from 'react';
import { User, Save, ArrowLeft } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { createClient } from '@/lib/supabaseClient';
import Link from 'next/link';
import ProfilePhotoUploader from '@/components/ui/ProfilePhotoUploader';

interface ProfileData {
  display_name: string;
  bio: string;
  interests: string[];
  profile_picture_url?: string | null;
}

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<ProfileData>({
    display_name: '',
    bio: '',
    interests: [],
    profile_picture_url: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        await fetchProfile(user.id);
      } else {
        window.location.href = '/signin';
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error('No access token available');
        return;
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.profile) {
          setProfile({
            display_name: data.profile.display_name || user?.email?.split('@')[0] || 'User',
            bio: data.profile.bio || '',
            interests: data.profile.interests || [],
            profile_picture_url: data.profile.profile_picture_url || null
          });
        }
      } else {
        console.error('Failed to fetch profile:', response.status);
        setProfile({
          display_name: user?.email?.split('@')[0] || 'User',
          bio: '',
          interests: [],
          profile_picture_url: null
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile({
        display_name: user?.email?.split('@')[0] || 'User',
        bio: '',
        interests: [],
        profile_picture_url: null
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No access token available');
      }

      // Use the interests array directly
      const interests = profile.interests;

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          display_name: profile.display_name,
          bio: profile.bio,
          interests: interests,
          profile_picture_url: profile.profile_picture_url
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
        // Update the profile state with parsed interests
        setProfile(prev => ({ ...prev, interests }));
      } else {
        throw new Error(data.message || 'Failed to save profile');
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveInterest = (index: number) => {
    const newInterests = profile.interests.filter((_, i) => i !== index);
    setProfile(prev => ({ ...prev, interests: newInterests }));
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link 
            href="/profile"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <User className="w-8 h-8 text-[var(--wl-forest)]" />
          <h1 className="text-2xl font-bold text-[var(--wl-ink)]">Profile Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Settings Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex justify-center">
              <ProfilePhotoUploader
                currentImageUrl={profile.profile_picture_url || undefined}
                onImageChange={(imageUrl) => setProfile(prev => ({ ...prev, profile_picture_url: imageUrl }))}
                disabled={isSaving}
              />
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                id="display_name"
                type="text"
                value={profile.display_name}
                onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--wl-forest)] focus:border-transparent transition-colors"
                placeholder="Enter your display name"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--wl-forest)] focus:border-transparent transition-colors resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests
              </label>
              <div className="space-y-3">
                {/* Add new interest input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Add an interest (e.g., travel)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--wl-forest)] focus:border-transparent transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = (e.target as HTMLInputElement).value.trim();
                        if (value && !profile.interests.includes(value)) {
                          const newInterests = [...profile.interests, value];
                          setProfile(prev => ({ ...prev, interests: newInterests }));
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add an interest (e.g., travel)"]') as HTMLInputElement;
                      const value = input?.value.trim();
                      if (value && !profile.interests.includes(value)) {
                        const newInterests = [...profile.interests, value];
                        setProfile(prev => ({ ...prev, interests: newInterests }));
                        input.value = '';
                      }
                    }}
                    className="px-6 py-3 bg-[var(--wl-forest)] text-white rounded-xl hover:bg-[var(--wl-forest)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--wl-forest)] focus:ring-offset-2 transition-colors font-medium min-w-[80px]"
                  >
                    Add
                  </button>
                </div>
                
                <p className="text-sm text-gray-500">
                  Type an interest and press Enter or click Add
                </p>
                
                {/* Show current interests as tags */}
                {profile.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[var(--wl-forest)]/10 text-[var(--wl-forest)] rounded-full text-sm font-medium flex items-center gap-1"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(index)}
                          className="ml-1 text-[var(--wl-forest)]/60 hover:text-[var(--wl-forest)]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-6 py-3 bg-[var(--wl-forest)] text-white rounded-xl hover:bg-[var(--wl-forest)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--wl-forest)] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}