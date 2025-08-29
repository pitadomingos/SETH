'use server';

import { createUserInFirestore, createSchoolInFirestore } from '@/lib/firebase/firestore-service';
import { sendEmail } from '@/lib/email-service';
import { UserProfile } from '@/context/school-data-context';

interface SchoolRegistrationData {
  schoolName: string;
  adminName: string;
  schoolAddress: string;
  schoolPhone: string;
  adminEmail: string;
  schoolMotto?: string;
  tier: 'Starter' | 'Pro' | 'Premium';
}

interface ParentRegistrationData {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export async function registerSchoolAction(data: SchoolRegistrationData) {
  try {
    const newSchoolData = {
      name: data.schoolName,
      head: data.adminName,
      address: data.schoolAddress,
      phone: data.schoolPhone,
      email: data.adminEmail,
      motto: data.schoolMotto || 'A new beginning',
      tier: data.tier,
    };
    
    // We create the school but keep it inactive until approved
    const { adminUsername, adminProfile } = await createSchoolInFirestore(newSchoolData);
    
    await sendEmail({
      to: data.adminEmail,
      subject: 'Welcome to EduDesk! School Registration Received',
      html: `<h1>Thank You for Registering ${data.schoolName}!</h1><p>Your registration has been received and is pending approval. We will notify you once your school is active on the platform.</p><p>Your temporary login details are:<br/>Username: <b>${adminUsername}</b><br/>Password: <b>password</b></p><p>You will be able to log in once your school is approved.</p>`,
    });

    return { success: true };
  } catch (error) {
    console.error("School registration failed:", error);
    return { success: false, error: "Server error during school registration." };
  }
}

export async function registerParentAction(data: ParentRegistrationData) {
  try {
    const username = data.email.split('@')[0].replace(/[^a-z0-9]/gi, '');
    const password = data.password || 'password'; // Use provided password or a default

    const userProfile: UserProfile = {
      user: {
        username,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'Parent',
      },
      password: password,
    };

    await createUserInFirestore(username, userProfile);

    await sendEmail({
      to: data.email,
      subject: 'Welcome to EduDesk!',
      html: `<h1>Welcome, ${data.name}!</h1><p>Your parent account has been successfully created. You can now log in to view your children's progress.</p><p>Your login details are:<br/>Username: <b>${username}</b><br/>Password: <b>${password}</b></p>`,
    });

    return { success: true };
  } catch (error) {
    console.error("Parent registration failed:", error);
    return { success: false, error: "Server error during parent registration." };
  }
}
