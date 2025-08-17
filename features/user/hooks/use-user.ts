// User Hooks
// Hooks for user profile management

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUserStore, userSelectors } from '../stores/user-store';
import { userApi } from '../services/user-api';
import { queryKeys } from '@/lib/utils/query-keys';
import { handleMutationError, handleMutationSuccess } from '@/lib/utils/query-error-handler';
import type {
  UpdateUserProfileRequest,
  UpdateTTSSettingsRequest,
  User,
  TTSSettings
} from '../types';

export function useUser() {
  const queryClient = useQueryClient();
  
  // Store state and actions
  const user = useUserStore(userSelectors.user);
  const profile = useUserStore(userSelectors.profile);
  const ttsSettings = useUserStore(userSelectors.ttsSettings);
  const stats = useUserStore(userSelectors.stats);
  const achievements = useUserStore(userSelectors.achievements);
  
  const isLoading = useUserStore(userSelectors.isLoading);
  const isProfileLoading = useUserStore(userSelectors.isProfileLoading);
  const isTTSLoading = useUserStore(userSelectors.isTTSLoading);
  const isStatsLoading = useUserStore(userSelectors.isStatsLoading);
  
  const error = useUserStore(userSelectors.error);
  const profileError = useUserStore(userSelectors.profileError);
  const ttsError = useUserStore(userSelectors.ttsError);
  
  const avatarUpload = useUserStore(userSelectors.avatarUpload);
  
  const fullName = useUserStore(userSelectors.fullName);
  const initials = useUserStore(userSelectors.initials);
  const isProfileComplete = useUserStore(userSelectors.isProfileComplete);
  
  const {
    setUser,
    setProfile,
    setTTSSettings,
    setStats,
    setAchievements,
    setLoading,
    setProfileLoading,
    setTTSLoading,
    setStatsLoading,
    setError,
    setProfileError,
    setTTSError,
    setAvatarUpload,
    clearUser,
    clearErrors,
    updateUserField
  } = useUserStore();

  // Profile query
  const profileQuery = useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: userApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle profile query success/error
  useEffect(() => {
    if (profileQuery.data?.success && profileQuery.data?.data) {
      setUser(profileQuery.data.data);
      setProfile(profileQuery.data.data);
    }
  }, [profileQuery.data, setUser, setProfile]);

  useEffect(() => {
    if (profileQuery.error) {
      console.error('Failed to load profile:', profileQuery.error);
      setError('Failed to load profile');
    }
  }, [profileQuery.error, setError]);

  // TTS settings query
  const ttsQuery = useQuery({
    queryKey: queryKeys.user.ttsSettings(),
    queryFn: userApi.getTTSSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Handle TTS query success/error
  useEffect(() => {
    if (ttsQuery.data?.success && ttsQuery.data?.data) {
      setTTSSettings(ttsQuery.data.data);
    }
  }, [ttsQuery.data, setTTSSettings]);

  useEffect(() => {
    if (ttsQuery.error) {
      console.error('Failed to load TTS settings:', ttsQuery.error);
      setTTSError('Failed to load TTS settings');
    }
  }, [ttsQuery.error, setTTSError]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onMutate: (variables) => {
      setProfileLoading(true);
      setProfileError(null);
      
      // Optimistic update
      if (user) {
        const optimisticUser = { ...user, ...variables };
        setUser(optimisticUser);
        setProfile(optimisticUser);
      }
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        setUser(response.data);
        setProfile(response.data);
        handleMutationSuccess('Profile updated successfully!', 'profile-update');
        
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      }
    },
    onError: (error, variables) => {
      // Revert optimistic update
      profileQuery.refetch();
      
      handleMutationError(error, 'profile-update');
      setProfileError(error instanceof Error ? error.message : 'Profile update failed');
    },
    onSettled: () => {
      setProfileLoading(false);
    }
  });

  // Update TTS settings mutation
  const updateTTSMutation = useMutation({
    mutationFn: userApi.updateTTSSettings,
    onMutate: (variables) => {
      setTTSLoading(true);
      setTTSError(null);
      
      // Optimistic update
      if (ttsSettings) {
        const optimisticSettings = { ...ttsSettings, ...variables };
        setTTSSettings(optimisticSettings);
      }
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        setTTSSettings(response.data);
        handleMutationSuccess('TTS settings updated successfully!', 'tts-update');
        
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: queryKeys.user.ttsSettings() });
      }
    },
    onError: (error) => {
      // Revert optimistic update
      ttsQuery.refetch();
      
      handleMutationError(error, 'tts-update');
      setTTSError(error instanceof Error ? error.message : 'TTS settings update failed');
    },
    onSettled: () => {
      setTTSLoading(false);
    }
  });

  // Avatar upload mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async ({ file, contentType }: { file: File; contentType: string }) => {
      setAvatarUpload({ isUploading: true, uploadProgress: 0, error: null });
      
      try {
        // Get presigned URL
        const presignResponse = await userApi.getAvatarPresignedUrl(contentType);
        if (!presignResponse.success || !presignResponse.data) {
          throw new Error('Failed to get upload URL');
        }
        
        const { uploadUrl, publicUrl } = presignResponse.data;
        
        // Upload file to presigned URL
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': contentType,
          },
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }
        
        setAvatarUpload({ uploadProgress: 100 });
        
        // Confirm upload
        const confirmResponse = await userApi.confirmAvatarUpload(publicUrl);
        if (!confirmResponse.success) {
          throw new Error('Failed to confirm upload');
        }
        
        return confirmResponse.data;
      } catch (error) {
        setAvatarUpload({ isUploading: false, error: error instanceof Error ? error.message : 'Upload failed' });
        throw error;
      }
    },
    onSuccess: (response) => {
      setAvatarUpload({ isUploading: false, uploadProgress: 0, previewUrl: null });
      updateUserField('profileImageUrl', response.data);
      handleMutationSuccess('Avatar updated successfully!', 'avatar-upload');
      
      // Invalidate profile query
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
    onError: (error) => {
      setAvatarUpload({ isUploading: false });
      handleMutationError(error, 'avatar-upload');
    }
  });

  // Helper functions
  const updateProfile = async (data: UpdateUserProfileRequest) => {
    return updateProfileMutation.mutateAsync(data);
  };

  const updateTTSSettings = async (data: UpdateTTSSettingsRequest) => {
    return updateTTSMutation.mutateAsync(data);
  };

  const uploadAvatar = async (file: File) => {
    const contentType = file.type;
    if (!contentType.startsWith('image/')) {
      throw new Error('File must be an image');
    }
    
    return uploadAvatarMutation.mutateAsync({ file, contentType });
  };

  const refreshProfile = () => {
    return profileQuery.refetch();
  };

  const refreshTTSSettings = () => {
    return ttsQuery.refetch();
  };

  return {
    // State
    user,
    profile,
    ttsSettings,
    stats,
    achievements,
    
    // Loading states
    isLoading: isLoading || profileQuery.isLoading,
    isProfileLoading: isProfileLoading || updateProfileMutation.isPending,
    isTTSLoading: isTTSLoading || ttsQuery.isLoading || updateTTSMutation.isPending,
    isStatsLoading,
    isAvatarUploading: avatarUpload.isUploading || uploadAvatarMutation.isPending,
    
    // Error states
    error,
    profileError,
    ttsError,
    avatarError: avatarUpload.error,
    
    // Avatar upload state
    avatarUpload,
    
    // Computed values
    fullName,
    initials,
    isProfileComplete,
    
    // Actions
    updateProfile,
    updateTTSSettings,
    uploadAvatar,
    refreshProfile,
    refreshTTSSettings,
    clearUser,
    clearErrors,
    updateUserField,
    
    // Mutation states
    isUpdateProfileLoading: updateProfileMutation.isPending,
    isUpdateTTSLoading: updateTTSMutation.isPending,
    isUploadAvatarLoading: uploadAvatarMutation.isPending,
  };
}

export default useUser;
