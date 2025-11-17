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
  let title = 'Vite + TypeScript + Clerk'

  if (isSignedIn) {
    const user = clerk.user!
    const isEmailVerified = user.emailAddresses[0]?.verification?.status === 'verified'
    const hasMFA = user.twoFactorEnabled
    const userImage = user.imageUrl || ''
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'

    title = `Welcome, ${fullName}!`

    clerkSection = `
      ${userImage ? `<img src="${userImage}" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%; margin: 10px;" />` : ''}
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
      <a href="https://vite.dev" target="_blank">
        <img src="${viteLogo}" class="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
      </a>
      <a href="https://clerk.com" target="_blank">
        <img src="${clerkLogo}" class="logo" alt="Clerk logo" />
      </a>
      <h1>${title}</h1>
      ${clerkSection}
      <div class="card">
        <button id="counter" type="button"></button>
      </div>
      <p class="read-the-docs">
        Click on the logos to learn more
      </p>
    </div>
  `

  setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

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