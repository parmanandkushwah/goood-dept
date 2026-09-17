import { z } from 'zod';

export const leadSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  loanType: z.string().min(1, 'Please select a loan type'),
  loanAmount: z.string().min(1, 'Please select or enter loan amount'),
  employmentType: z.string().min(1, 'Please select employment type'),
  monthlyIncome: z.string().min(1, 'Please enter monthly income'),
  city: z.string().min(2, 'Please enter your city'),
  state: z.string().min(1, 'Please select your state'),
  cibilScore: z.string().min(1, 'Please select CIBIL score range'),
  consent: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const userSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  role: z.string().min(1, 'Role required'),
  phone: z.string().optional(),
});
