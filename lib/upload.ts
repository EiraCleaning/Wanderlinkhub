import { supabase } from './supabaseClient';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export async function uploadImage(
  file: File, 
  folder: string = 'listings'
): Promise<UploadResult> {
  try {
    console.log('Starting upload for file:', file.name, 'Size:', file.size);
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    console.log('Generated file path:', filePath);

    // Check if we have the required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return { url: '', path: '', error: 'Missing Supabase configuration' };
    }

    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Anon Key exists:', !!supabaseAnonKey);

    // Upload to Supabase Storage - using 'uploads' bucket instead of 'images'
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return { url: '', path: '', error: error.message };
    }

    console.log('Upload successful, data:', data);

    // Get public URL from 'uploads' bucket
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    console.log('Public URL generated:', urlData.publicUrl);

    return {
      url: urlData.publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Upload failed with exception:', error);
    return { 
      url: '', 
      path: '', 
      error: error instanceof Error ? error.message : 'Upload failed' 
    };
  }
}

export async function deleteImage(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('uploads')
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
}

export async function uploadMultipleImages(
  files: File[], 
  folder: string = 'listings'
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return Promise.all(uploadPromises);
}
