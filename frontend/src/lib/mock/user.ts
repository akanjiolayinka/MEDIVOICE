export interface VoicePreferences {
  voice: "warm-female" | "calm-male" | "neutral";
  speakingSpeed: number; // 0.75 - 1.25
  autoPlayResponses: boolean;
}

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  preferredLanguage: string;
  ageRange?: string;
  codeSwitchingEnabled: boolean;
  voicePreferences: VoicePreferences;
  createdAt: string;
}

export const DEFAULT_VOICE_PREFERENCES: VoicePreferences = {
  voice: "warm-female",
  speakingSpeed: 1,
  autoPlayResponses: true,
};

export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    id: "demo-user",
    firstName: "Amara",
    lastName: "Okafor",
    email: "amara@example.com",
    preferredLanguage: "English",
    codeSwitchingEnabled: true,
    voicePreferences: DEFAULT_VOICE_PREFERENCES,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export const demoUser = createMockUser();
