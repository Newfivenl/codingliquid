class TWTabs {
    constructor(container) {
        this.tabBtns = container.querySelectorAll('.tab-btn');
        this.tabsWrapper = container.querySelector('.tw-tabs-content-wrapper');
        this.tabContents = container.querySelectorAll('.tw-tabs-content-link-list');
        this.tabBtnContainer = container.querySelector('.tw-tab-btn-container');
        this.isScrollingFromClick = false;
        this.activeIndicator = null;

        if (this.tabBtnContainer && this.tabsWrapper) {
            this.init();
        }
    }

    init() {
        this.createActiveIndicator();
        this.bindEvents();
        this.initializeFirstTab();
    }

    createActiveIndicator() {
        // Remove existing indicator if present
        const existingIndicator = this.tabBtnContainer.querySelector('.active-tab-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        this.activeIndicator = document.createElement('span');
        this.activeIndicator.classList.add('active-tab-indicator');
        Object.assign(this.activeIndicator.style, {
            position: 'absolute',
            bottom: '0',
            left: '0',
            height: '2px',
            backgroundColor: 'currentColor',
            transition: 'transform 0.3s ease, width 0.3s ease',
            display: 'block'
        });
        this.tabBtnContainer.appendChild(this.activeIndicator);
    }

    updateIndicator(activeBtn) {
        if (!activeBtn || !this.activeIndicator) return;
        
        const width = activeBtn.offsetWidth;
        const left = activeBtn.offsetLeft;
        
        this.activeIndicator.style.width = `${width}px`;
        this.activeIndicator.style.transform = `translateX(${left}px)`;
    }

    bindEvents() {
        this.tabBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => this.handleTabClick(btn, index));
        });

        this.tabsWrapper.addEventListener('scroll', () => {
            if (!this.isScrollingFromClick) {
                this.updateActiveTabOnScroll();
            }
        });

        this.tabsWrapper.addEventListener('wheel', (e) => this.handleWheel(e));
        window.addEventListener('resize', () => this.handleResize());
    }

    handleTabClick(btn, index) {
        this.isScrollingFromClick = true;
        
        this.tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateIndicator(btn);
        
        const scrollPosition = this.tabContents[index].offsetLeft;
        
        this.tabsWrapper.scrollTo({
            left: scrollPosition,
            top: 0,
            behavior: 'smooth'
        });

        setTimeout(() => {
            this.isScrollingFromClick = false;
        }, 500);
    }

    handleWheel(e) {
        if (e.deltaY !== 0) {
            e.preventDefault();
            this.tabsWrapper.scrollLeft += e.deltaY;
            if (!this.isScrollingFromClick) {
                this.updateActiveTabOnScroll();
            }
        }
    }

    handleResize() {
        const activeBtn = this.tabBtnContainer.querySelector('.tab-btn.active');
        this.updateIndicator(activeBtn);
    }

    updateActiveTabOnScroll() {
        const scrollPosition = this.tabsWrapper.scrollLeft;
        
        let activeIndex = 0;
        let minDistance = Infinity;
        
        this.tabContents.forEach((content, index) => {
            const distance = Math.abs(content.offsetLeft - scrollPosition);
            if (distance < minDistance) {
                minDistance = distance;
                activeIndex = index;
            }
        });

        this.tabBtns.forEach((btn, index) => {
            if (index === activeIndex) {
                btn.classList.add('active');
                this.updateIndicator(btn);
            } else {
                btn.classList.remove('active');
            }
        });
    }

    initializeFirstTab() {
        if (this.tabBtns.length > 0) {
            this.tabBtns.forEach(btn => btn.classList.remove('active'));
            this.tabBtns[0].classList.add('active');
            requestAnimationFrame(() => {
                this.updateIndicator(this.tabBtns[0]);
            });
            this.tabsWrapper.scrollLeft = 0;
        }
    }
}

class TWDialog {
    constructor(triggerButton, closeBtn, animation = 'vertical') {
        this.btn = document.querySelector(triggerButton);
        if (!this.btn) return;

        this.triggerId = this.btn.parentNode.getAttribute('trigger-id');
        this.triggerSectionId = this.btn.parentNode.getAttribute("section-id");
        this.dialogContent = document.querySelector(`#tw-dialog-content-${this.triggerSectionId}-${this.triggerId}`);
        this.closeButton = document.querySelector(closeBtn);
        
        if (!this.dialogContent || !this.closeButton) return;

        this.triggerSpan = document.querySelector(triggerButton);
        this.hamburgerIcon = this.triggerSpan.querySelector('[data-icon="hamburger"]');
        this.closeIcon = this.triggerSpan.querySelector('[data-icon="close"]');
        
        this.animation = animation;
        this.isDragging = false;
        this.touchStartY = 0;
        this.touchCurrentY = 0;
        this.CLOSE_THRESHOLD = window.innerHeight * 0.50;

        this.init();
    }

    init() {
        this.setAnimation();
        this.toggleIcons(false);
        this.bindEvents();
        this.tabs = new TWTabs(this.dialogContent);
    }

    setAnimation() {
        if (this.animation === 'horizontal') {
            this.dialogContent.classList.remove('vertical');
            this.dialogContent.classList.add('horizontal');
        } else {
            this.dialogContent.classList.remove('horizontal');
            this.dialogContent.classList.add('vertical');
        }
    }

    toggleIcons(isOpen) {
        if (isOpen) {
            this.hamburgerIcon.classList.remove('tw-inline-block');
            this.hamburgerIcon.classList.add('tw-hidden');
            this.closeIcon.classList.remove('tw-hidden');
            this.closeIcon.classList.add('tw-inline-block');
        } else {
            this.hamburgerIcon.classList.remove('tw-hidden');
            this.hamburgerIcon.classList.add('tw-inline-block');
            this.closeIcon.classList.remove('tw-inline-block');
            this.closeIcon.classList.add('tw-hidden');
        }
    }

    bindEvents() {
        this.btn.addEventListener("click", () => this.openDialog());
        this.closeButton.addEventListener("click", () => this.closeDialog());
        this.dialogContent.addEventListener('click', (event) => this.handleDialogClick(event));
        this.dialogContent.addEventListener('keydown', (event) => this.handleKeyDown(event));
        this.setupSwipeClose();
    }

    setupSwipeClose() {
        const handle = this.dialogContent.querySelector('.tw-dialog-handle');
        if (!handle) return;

        handle.addEventListener('touchstart', (e) => this.handleTouchStart(e, handle), { passive: true });
        handle.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        handle.addEventListener('touchend', () => this.handleTouchEnd(handle));
        handle.addEventListener('touchcancel', () => this.handleTouchCancel(handle));

        // Mouse events
        handle.addEventListener('mousedown', (e) => this.handleMouseDown(e, handle));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', () => this.handleMouseUp(handle));
    }

    updateDialogPosition(yPosition) {
        const swipeDistance = yPosition - this.touchStartY;
        if (swipeDistance > 0) {
            const resistanceFactor = Math.min(1, swipeDistance / window.innerHeight);
            const easedDistance = swipeDistance * (1 - resistanceFactor * 0.6);
            this.dialogContent.style.transform = `translateY(${easedDistance}px)`;
        }
    }

    handleTouchStart(e, handle) {
        this.touchStartY = e.touches[0].clientY;
        this.isDragging = true;
        this.dialogContent.style.transition = 'none';
        handle.style.cursor = 'grabbing';
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        this.touchCurrentY = e.touches[0].clientY;
        this.updateDialogPosition(this.touchCurrentY);
    }

    handleTouchEnd(handle) {
        if (!this.isDragging) return;
        this.isDragging = false;

        const swipeDistance = this.touchCurrentY - this.touchStartY;
        
        if (swipeDistance >= this.CLOSE_THRESHOLD) {
            this.finishClose();
        } else {
            this.resetDialog(handle);
        }
        
        this.touchStartY = 0;
        this.touchCurrentY = 0;
    }

    handleMouseDown(e, handle) {
        this.isDragging = true;
        this.touchStartY = e.clientY;
        this.dialogContent.style.transition = 'none';
        handle.style.cursor = 'grabbing';
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.touchCurrentY = e.clientY;
        this.updateDialogPosition(this.touchCurrentY);
    }

    handleMouseUp(handle) {
        if (!this.isDragging) return;
        this.handleTouchEnd(handle);
    }

    handleTouchCancel(handle) {
        this.isDragging = false;
        this.resetDialog(handle);
        this.touchStartY = 0;
        this.touchCurrentY = 0;
    }

    finishClose() {
        this.dialogContent.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        this.dialogContent.style.transform = `translateY(${window.innerHeight}px)`;

        setTimeout(() => {
            document.body.classList.remove('overflow-hidden');
            this.toggleIcons(false);
            this.dialogContent.close();
            
            this.dialogContent.style.transform = '';
            this.dialogContent.style.transition = '';
            const handle = this.dialogContent.querySelector('.tw-dialog-handle');
            if (handle) handle.style.cursor = 'grab';
        }, 500);
    }

    resetDialog(handle) {
        this.dialogContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        this.dialogContent.style.transform = 'translateY(0)';
        handle.style.cursor = 'grab';
    }

    openDialog() {
        this.dialogContent.removeAttribute('close');
        this.dialogContent.showModal();
        this.dialogContent.classList.remove('hide');
        document.body.classList.add('overflow-hidden');
        this.toggleIcons(true);
    }

    closeDialog(fromSwipe = false) {
        if (fromSwipe) {
            document.body.classList.remove('overflow-hidden');
            this.toggleIcons(false);
            this.dialogContent.close();
            return;
        }
        
        this.dialogContent.classList.add('hide');
        document.body.classList.remove('overflow-hidden');
        this.toggleIcons(false);

        const handleAnimationEnd = () => {
            this.dialogContent.classList.remove('hide');
            this.dialogContent.close();
            this.dialogContent.removeEventListener('webkitAnimationEnd', handleAnimationEnd);
        };

        if (!('showModal' in document.createElement('dialog'))) {
            this.dialogContent.close();
        } else {
            this.dialogContent.addEventListener('webkitAnimationEnd', handleAnimationEnd);
        }
    }

    handleDialogClick(event) {
        if (event.target === this.dialogContent) {
            this.closeDialog();
            event.stopPropagation();
        }
    }

    handleKeyDown(event) {
        if (event.key === 'Escape') {
            this.closeDialog();
        }
    }
}

// Initialize the dialog when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all dialogs on the page
    const initDialogs = () => {
        const dialogTriggers = document.querySelectorAll('[trigger-id]');
        dialogTriggers.forEach(trigger => {
            const sectionId = trigger.getAttribute('section-id');
            new TWDialog(
                `#showDialog-${sectionId}`,
                `#tw-dialog-button-${sectionId}`,
                'vertical'
            );
        });
    };

    initDialogs();
});