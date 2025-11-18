import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import clerkLogo from '/clerk.svg'
import { setupCounter } from './counter.ts'
import { Clerk } from '@clerk/clerk-js'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable')
}

const clerk = new Clerk(publishableKey)

await clerk.load({
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
  afterSignOutUrl: "/",
  localization: {
    locale: "en-US"
  },
  polling: true
})

function renderApp() {
  const app = document.querySelector<HTMLDivElement>('#app')!
  const isSignedIn = clerk.user !== null;

  let clerkSection = ''

  if (isSignedIn) {
    const user = clerk.user!
    const isEmailVerified = user.emailAddresses[0]?.verification?.status === 'verified'
    const hasMFA = user.twoFactorEnabled
    const userImage = user.imageUrl || ''
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'

    const title = `Welcome, ${fullName}!`

    clerkSection = `
      ${userImage ? `<img src="${userImage}" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%; margin: 10px;" />` : ''}
      <h1>${title}</h1>
      <div class="card">
        <p><strong>Account Information</strong></p>
        <p>Email: ${user.emailAddresses[0]?.emailAddress || 'N/A'}</p>
        <p>Email Verified: ${isEmailVerified ? '✅ Verified' : '❌ Not Verified'}</p>
        <p>MFA Enabled: ${hasMFA ? '✅ Yes' : '❌ No'}</p>
        ${user.username ? `<p>Username: ${user.username}</p>` : ''}
        ${user.createdAt ? `<p>Member since: ${new Date(user.createdAt).toLocaleDateString()}</p>` : ''}
        
        <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin: 20px 0;">
          <button id="user-profile-btn" type="button">Manage Account</button>
          <button id="mfa-btn" type="button">${hasMFA ? 'Manage MFA' : 'Enable MFA'}</button>
          <button id="sessions-btn" type="button">Active Sessions</button>
          <button id="sign-out-btn" type="button">Sign Out</button>
        </div>
      </div>
    `
  } else {
    clerkSection = `
      <div class="card">
        <p>Please sign in to access your account</p>
        <div style="display: flex; gap: 10px; justify-content: center; margin: 10px 0;">
          <button id="sign-in-btn" type="button">Sign In</button>
          <button id="sign-up-btn" type="button">Sign Up</button>
        </div>
      </div>
    `
  }

  app.innerHTML = `
    <div>
      ${clerkSection}
    </div>
  `

  if (isSignedIn) {
    document.getElementById('user-profile-btn')?.addEventListener('click', () => {
      clerk.openUserProfile()
    })

    document.getElementById('mfa-btn')?.addEventListener('click', () => {
      clerk.openUserProfile()
    })

    document.getElementById('sessions-btn')?.addEventListener('click', async () => {
      try {
        const sessions = await clerk.client?.sessions
        const sessionCount = sessions?.length || 0
        const currentSession = clerk.session

        if (sessionCount > 0) {
          alert(`You have ${sessionCount} active session(s).\nCurrent session ID: ${currentSession?.id?.substring(0, 8)}...`)
        } else {
          alert('No active sessions found.')
        }
      } catch (error) {
        console.error('Error fetching sessions:', error)
        alert('Unable to fetch sessions.')
      }
    })

    document.getElementById('sign-out-btn')?.addEventListener('click', async () => {
      await clerk.signOut()
      renderApp()
    })
  } else {
    document.getElementById('sign-in-btn')?.addEventListener('click', () => {
      clerk.openSignIn()
    })

    document.getElementById('sign-up-btn')?.addEventListener('click', () => {
      clerk.openSignUp()
    })
  }
}

clerk.addListener((event) => {
  if (event.user) {
    renderApp()
  }
})

renderApp()