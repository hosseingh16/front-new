export type PasswordButtonT = 'otp' | 'fixedPassword';

export type DirectionT = 'forward' | 'back';

/** Matches `PUT users/{user}` validation: role in job_seeker,employer */
export type AccountRole = 'employer' | 'job_seeker';

export type SignUpProfile = {
  profile: File | null
  fullName: string
  password: string
}
