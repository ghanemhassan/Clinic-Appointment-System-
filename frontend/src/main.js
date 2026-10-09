/**
 * Application Entry Point
 */
import './styles.css';
import { auth } from './services/auth.js';
import { router } from './router.js';
import { i18n, t } from './utils/i18n.js';

async function bootstrap() {
  try {
    updateLocalizedMetadata();
    // Check and verify existing token
    await auth.init();
  } catch (error) {
    console.error('Failed during auth initialization:', error);
  } finally {
    // Start routing
    router.init();
  }
}

function updateLocalizedMetadata() {
  document.title = t('app_title');
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = t('meta_description');
}

// Subscribe to language changes to re-render current view and update title
i18n.subscribe(() => {
  updateLocalizedMetadata();
  router.handleRoute();
});

// Subscribe to auth changes to re-route if necessary
auth.subscribe(({ isAuthenticated, role }) => {
  const hash = window.location.hash || '#/';
  if (!isAuthenticated && !hash.startsWith('#/login') && !hash.startsWith('#/register')) {
    window.location.hash = '#/login';
  }
});

// Run bootstrap when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
