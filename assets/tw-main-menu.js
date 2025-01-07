
alert(1)

(() => {
    const twDialog = (triggerButton, closeBtn, animation) => {
        const btn = document.querySelector(triggerButton);
        if (!btn) return;

        const triggerId = btn.parentNode.getAttribute('trigger-id');
        const triggerSectionId = btn.parentNode.getAttribute("section-id");
        const dialogContent = document.querySelector(`#tw-dialog-content-${triggerSectionId}-${triggerId}`);
        const closeButton = document.querySelector(closeBtn);
        
        if (!dialogContent || !closeButton) return;

        const triggerSpan = document.querySelector(triggerButton);
        const hamburgerIcon = triggerSpan.querySelector('[data-icon="hamburger"]');
        const closeIcon = triggerSpan.querySelector('[data-icon="close"]');
        

        const handleSwipeClose = () => {
            const handle = dialogContent.querySelector('.tw-dialog-handle');
            if (!handle) return;

            let touchStartY = 0;
            let touchCurrentY = 0;
            const CLOSE_THRESHOLD = window.innerHeight * 0.50; // 50% of screen height
            let isDragging = false;

            handle.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
                isDragging = true;
                dialogContent.style.transition = 'none';
                handle.style.cursor = 'grabbing';
            }, { passive: true });

            const updateDialogPosition = (yPosition) => {
                const swipeDistance = yPosition - touchStartY;
                if (swipeDistance > 0) {
                    const resistanceFactor = Math.min(1, swipeDistance / window.innerHeight);
                    const easedDistance = swipeDistance * (1 - resistanceFactor * 0.6);
                    dialogContent.style.transform = `translateY(${easedDistance}px)`;
                }
            };

            handle.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                touchCurrentY = e.touches[0].clientY;
                updateDialogPosition(touchCurrentY);
            }, { passive: true });

            const finishClose = () => {
                
                dialogContent.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                dialogContent.style.transform = `translateY(${window.innerHeight}px)`;

                setTimeout(() => {
                    document.body.classList.remove('overflow-hidden');
                    toggleIcons(false);
                    dialogContent.close();
                    
                    dialogContent.style.transform = '';
                    dialogContent.style.transition = '';
                    handle.style.cursor = 'grab';
                }, 500); 
            };

            const resetDialog = () => {
                dialogContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                dialogContent.style.transform = 'translateY(0)';
                handle.style.cursor = 'grab';
            };

            handle.addEventListener('touchend', () => {
                if (!isDragging) return;
                isDragging = false;

                const swipeDistance = touchCurrentY - touchStartY;
                
                if (swipeDistance >= CLOSE_THRESHOLD) {
                    finishClose();
                } else {
                    resetDialog();
                }
                
                touchStartY = 0;
                touchCurrentY = 0;
            });

            let isMouseDragging = false;

            handle.addEventListener('mousedown', (e) => {
                isMouseDragging = true;
                touchStartY = e.clientY;
                dialogContent.style.transition = 'none';
                handle.style.cursor = 'grabbing';
            });

            window.addEventListener('mousemove', (e) => {
                if (!isMouseDragging) return;
                touchCurrentY = e.clientY;
                updateDialogPosition(touchCurrentY);
            });

            window.addEventListener('mouseup', () => {
                if (!isMouseDragging) return;
                isMouseDragging = false;

                const swipeDistance = touchCurrentY - touchStartY;
                
                if (swipeDistance >= CLOSE_THRESHOLD) {
                    finishClose();
                } else {
                    resetDialog();
                }
                
                touchStartY = 0;
                touchCurrentY = 0;
            });

            handle.addEventListener('touchcancel', () => {
                isDragging = false;
                resetDialog();
                touchStartY = 0;
                touchCurrentY = 0;
            });
        };

        const toggleIcons = (isOpen) => {
            if (isOpen) {
                hamburgerIcon.classList.remove('tw-inline-block');
                hamburgerIcon.classList.add('tw-hidden');
                closeIcon.classList.remove('tw-hidden');
                closeIcon.classList.add('tw-inline-block');
            } else {
                hamburgerIcon.classList.remove('tw-hidden');
                hamburgerIcon.classList.add('tw-inline-block');
                closeIcon.classList.remove('tw-inline-block');
                closeIcon.classList.add('tw-hidden');
            }
        };

        toggleIcons(false);

        const initTabs = () => {
            const tabBtns = dialogContent.querySelectorAll('.tab-btn');
            const tabsWrapper = dialogContent.querySelector('.tw-tabs-content-wrapper');
            const tabContents = dialogContent.querySelectorAll('.tw-tabs-content-link-list');
            let isScrollingFromClick = false;

            const tabBtnContainer = dialogContent.querySelector('.tw-tab-btn-container');
            if (!tabBtnContainer) return;

            const existingIndicator = tabBtnContainer.querySelector('.active-tab-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }

            const activeIndicator = document.createElement('span');
            activeIndicator.classList.add('active-tab-indicator');
            Object.assign(activeIndicator.style, {
                position: 'absolute',
                bottom: '0',
                left: '0',
                height: '2px',
                backgroundColor: 'currentColor',
                transition: 'transform 0.3s ease, width 0.3s ease',
                display: 'block'
            });
            tabBtnContainer.appendChild(activeIndicator);

            function updateIndicator(activeBtn) {
                if (!activeBtn) return;
                
                const width = activeBtn.offsetWidth;
                const left = activeBtn.offsetLeft;
                
                activeIndicator.style.width = `${width}px`;
                activeIndicator.style.transform = `translateX(${left}px)`;
            }

            tabBtns.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    isScrollingFromClick = true;
                    
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    updateIndicator(btn);
                    
                    const scrollPosition = tabContents[index].offsetLeft;
                    
                    tabsWrapper.scrollTo({
                        left: scrollPosition,
                        top: 0,
                        behavior: 'smooth'
                    });

                    setTimeout(() => {
                        isScrollingFromClick = false;
                    }, 500);
                });
            });

            tabsWrapper.addEventListener('scroll', () => {
                if (!isScrollingFromClick) {
                    updateActiveTabOnScroll();
                }
            });

            function updateActiveTabOnScroll() {
                const scrollPosition = tabsWrapper.scrollLeft;
                
                let activeIndex = 0;
                let minDistance = Infinity;
                
                tabContents.forEach((content, index) => {
                    const distance = Math.abs(content.offsetLeft - scrollPosition);
                    if (distance < minDistance) {
                        minDistance = distance;
                        activeIndex = index;
                    }
                });

                tabBtns.forEach((btn, index) => {
                    if (index === activeIndex) {
                        btn.classList.add('active');
                        updateIndicator(btn);
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }

            if (tabBtns.length > 0) {
                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabBtns[0].classList.add('active');
               
                requestAnimationFrame(() => {
                    updateIndicator(tabBtns[0]);
                });
                tabsWrapper.scrollLeft = 0;
            }
        };

        const openDialog = () => {
            dialogContent.removeAttribute('close');
            dialogContent.showModal();
            dialogContent.classList.remove('hide');
            document.body.classList.add('overflow-hidden');
            toggleIcons(true);

            
            requestAnimationFrame(() => {
                initTabs();
                handleSwipeClose();
            });
        };

        const closeDialog = (fromSwipe = false) => {
            if (fromSwipe) {
                document.body.classList.remove('overflow-hidden');
                toggleIcons(false);
                dialogContent.close();
                return;
            }
            
            dialogContent.classList.add('hide');
            document.body.classList.remove('overflow-hidden');
            toggleIcons(false);

            const handleAnimationEnd = () => {
                dialogContent.classList.remove('hide');
                dialogContent.close();
                dialogContent.removeEventListener('webkitAnimationEnd', handleAnimationEnd);
            };

            if (!('showModal' in document.createElement('dialog'))) {
                dialogContent.close();
            } else {
                dialogContent.addEventListener('webkitAnimationEnd', handleAnimationEnd);
            }
        };

        if (animation === 'horizontal') {
            dialogContent.classList.remove('vertical');
            dialogContent.classList.add('horizontal');
        } else {
            dialogContent.classList.remove('horizontal');
            dialogContent.classList.add('vertical');
        }

        btn.addEventListener("click", openDialog);
        closeButton.addEventListener("click", closeDialog);

        dialogContent.addEventListener('click', (event) => {
            if (event.target === dialogContent) {
                closeDialog();
                event.stopPropagation();
            }
        });

        dialogContent.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeDialog();
            }
        });

    };

    twDialog(
        '#showDialog-{{ section.id }}', 
        '#tw-dialog-button-{{ section.id }}', 
        'vertical'
    );
    
})();

(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabsWrapper = document.querySelector('.tw-tabs-content-wrapper');
        const tabContents = document.querySelectorAll('.tw-tabs-content-link-list');
        let isScrollingFromClick = false;

        const tabBtnContainer = document.querySelector('.tw-tab-btn-container');
        const activeIndicator = document.createElement('span');
        activeIndicator.classList.add('active-tab-indicator');
        Object.assign(activeIndicator.style, {
            position: 'absolute',
            bottom: '0',
            left: '0',
            height: '2px',
            backgroundColor: 'currentColor',
            transition: 'transform 0.3s ease, width 0.3s ease',
            display: 'block'
        });
        tabBtnContainer.appendChild(activeIndicator);

        function updateIndicator(activeBtn) {
            if (!activeBtn) return;
            
            const width = activeBtn.offsetWidth;
            const left = activeBtn.offsetLeft;
            
            activeIndicator.style.width = `${width}px`;
            activeIndicator.style.transform = `translateX(${left}px)`;
        }

        tabBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                isScrollingFromClick = true;
                
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateIndicator(btn);
                
                const scrollPosition = tabContents[index].offsetLeft;
                
                tabsWrapper.scrollTo({
                    left: scrollPosition,
                    top: 0,
                    behavior: 'smooth'
                });

                setTimeout(() => {
                    isScrollingFromClick = false;
                }, 500);
            });
        });

        tabsWrapper.addEventListener('scroll', () => {
            if (!isScrollingFromClick) {
                updateActiveTabOnScroll();
            }
        });

        tabsWrapper.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                tabsWrapper.scrollLeft += e.deltaY;
                if (!isScrollingFromClick) {
                    updateActiveTabOnScroll();
                }
            }
        });

        function updateActiveTabOnScroll() {
            const scrollPosition = tabsWrapper.scrollLeft;
            
            let activeIndex = 0;
            let minDistance = Infinity;
            
            tabContents.forEach((content, index) => {
                const distance = Math.abs(content.offsetLeft - scrollPosition);
                if (distance < minDistance) {
                    minDistance = distance;
                    activeIndex = index;
                }
            });

            tabBtns.forEach((btn, index) => {
                if (index === activeIndex) {
                    btn.classList.add('active');
                    updateIndicator(btn);
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        window.addEventListener('resize', () => {
            const activeBtn = document.querySelector('.tab-btn.active');
            updateIndicator(activeBtn);
        });

        updateIndicator(tabBtns[0]);
        tabBtns[0].classList.add('active');
    });
})(); 