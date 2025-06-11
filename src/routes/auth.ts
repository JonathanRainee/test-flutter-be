import { NextFunction, Request, Response, Router } from "express";
import { db, auth } from '../firebase'; 
import { User } from '../entities/users';

const router = Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    res.status(400).json({ message: 'Email, password, and username are required.' });
  }

  try {
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: username,
    });

    const uid = userRecord.uid;
    const now = new Date();

    const newUser: User = {
      id: uid,
      username: username,
      email: email,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('users').doc(uid).set(newUser);

    const userResponse: Omit<User, 'password'> = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    res.status(201).json({
      message: 'User registered successfully!',
      user: userResponse,
    });

  } catch (error: any) {
    console.error('Error during signup:', error);
    if (error.code === 'auth/email-already-in-use') {
      res.status(409).json({ message: 'Email already in use.' });
    }
    if (error.code === 'auth/weak-password') {
      res.status(400).json({ message: 'Password is too weak. Please use a stronger password.' });
    }
    res.status(500).json({ message: 'Failed to register user.', error: error.message });
  }
});

router.post('/signin', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const userRecord = await auth.getUserByEmail(email);
    const uid = userRecord.uid;
    const emailUser = userRecord.email;
    const username = userRecord.displayName;


    const customToken = await auth.createCustomToken(uid);

    res.status(200).json({
      message: 'Custom token generated successfully.',
      customToken: customToken,
      uid: uid,
      email: emailUser,
      username: username
    });

  } catch (error: any) {
    console.error('Error during custom token generation or user lookup:', error);
    if (error.code === 'auth/user-not-found') {
      res.status(404).json({ message: 'User not found. Please check your email.' });
    }
    res.status(500).json({ message: 'Failed to sign in or generate token.', error: error.message });
  }
});

router.post('/forget-password', async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ message: 'Email is required.' });
        return;
    }
    try {
        try {
            await auth.getUserByEmail(email); 
        } catch (userLookupError: any) {
            if (userLookupError.code === 'auth/user-not-found') {
                res.status(404).json({ message: 'User with this email not found.' });
                return;
            } else {
                throw userLookupError; 
            }
        }
        res.status(200).json({ message: 'Password reset email initiated. Please check your inbox (and spam folder).' });
    } catch (error: any) {
        console.error('Error during forget password:', error);
        res.status(500).json({ message: 'Failed to initiate password reset.', error: error.message });
    }
});

export default router;