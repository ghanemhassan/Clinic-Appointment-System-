/**
 * Modal Manager
 */

class ModalManager {
  constructor() {
    this.overlay = document.getElementById('modal-overlay');
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.id = 'modal-overlay';
      document.body.appendChild(this.overlay);
    }

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.overlay.classList.contains('open');
  }

  open(contentHtml, onClose = null) {
    this.onCloseCallback = onClose;
    this.overlay.innerHTML = `<div class="modal">${contentHtml}</div>`;
    this.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Auto-focus first input or button
    setTimeout(() => {
      const focusable = this.overlay.querySelector('input, select, textarea, button');
      if (focusable) focusable.focus();
    }, 50);
  }

  close() {
    this.overlay.classList.remove('open');
    this.overlay.innerHTML = '';
    document.body.style.overflow = '';
    if (this.onCloseCallback) {
      this.onCloseCallback();
      this.onCloseCallback = null;
    }
  }

  confirm({
    title = 'تأكيد الإجراء',
    message = 'هل أنت متأكد من المتابعة؟',
    confirmText = 'تأكيد',
    cancelText = 'إلغاء',
    confirmClass = 'btn-danger',
  }) {
    return new Promise((resolve) => {
      const html = `
        <h2>${title}</h2>
        <p style="color: var(--color-slate); margin-bottom: var(--spacing-24); line-height: 1.6;">
          ${message}
        </p>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="modal-cancel-btn">${cancelText}</button>
          <button type="button" class="btn ${confirmClass}" id="modal-confirm-btn">${confirmText}</button>
        </div>
      `;

      this.open(html, () => resolve(false));

      document.getElementById('modal-cancel-btn')?.addEventListener('click', () => {
        this.close();
        resolve(false);
      });

      document.getElementById('modal-confirm-btn')?.addEventListener('click', () => {
        this.onCloseCallback = null;
        this.close();
        resolve(true);
      });
    });
  }
}

export const modal = new ModalManager();
export default modal;
