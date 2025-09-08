// Steam风格布局交互功能

class SteamLayout {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.dot');
        this.autoSlideInterval = null;
        
        this.init();
    }
    
    init() {
        this.initHeroCarousel();
        this.initViewToggle();
        this.initFilterInteractions();
        this.initProjectInteractions();
        this.initSidebarInteractions();
    }
    
    // 初始化轮播图功能
    initHeroCarousel() {
        const prevBtn = document.querySelector('.hero-prev');
        const nextBtn = document.querySelector('.hero-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // 点击指示器切换
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // 自动轮播
        this.startAutoSlide();
        
        // 鼠标悬停时暂停自动轮播
        const heroSection = document.querySelector('.steam-hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => this.stopAutoSlide());
            heroSection.addEventListener('mouseleave', () => this.startAutoSlide());
        }
    }
    
    // 上一张幻灯片
    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateSlide();
    }
    
    // 下一张幻灯片
    nextSlide() {
        this.currentSlide = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
        this.updateSlide();
    }
    
    // 跳转到指定幻灯片
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlide();
    }
    
    // 更新幻灯片显示
    updateSlide() {
        // 更新幻灯片
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        // 更新指示器
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    // 开始自动轮播
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    // 停止自动轮播
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    // 初始化视图切换功能
    initViewToggle() {
        const viewBtns = document.querySelectorAll('.view-btn');
        const projectsContainer = document.querySelector('.projects-container');
        
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const viewType = btn.dataset.view;
                
                // 更新按钮状态
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 更新容器类名
                if (projectsContainer) {
                    projectsContainer.className = `projects-container ${viewType}-view`;
                }
            });
        });
    }
    
    // 初始化筛选器交互
    initFilterInteractions() {
        const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
        
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }
    
    // 应用筛选器
    applyFilters() {
        const selectedFilters = {
            progress: [],
            type: []
        };
        
        // 收集选中的筛选条件
        document.querySelectorAll('.filter-group').forEach(group => {
            const label = group.querySelector('label').textContent;
            const checkboxes = group.querySelectorAll('input[type="checkbox"]:checked');
            
            checkboxes.forEach(checkbox => {
                const value = checkbox.parentElement.textContent.trim();
                if (label.includes('融资进度')) {
                    selectedFilters.progress.push(value);
                } else if (label.includes('项目类型')) {
                    selectedFilters.type.push(value);
                }
            });
        });
        
        // 这里可以添加实际的筛选逻辑
        console.log('应用筛选器:', selectedFilters);
        
        // 显示筛选结果提示
        this.showFilterResults(selectedFilters);
    }
    
    // 显示筛选结果
    showFilterResults(filters) {
        const hasFilters = filters.progress.length > 0 || filters.type.length > 0;
        
        if (hasFilters) {
            // 创建或更新筛选结果提示
            let filterInfo = document.querySelector('.filter-info');
            if (!filterInfo) {
                filterInfo = document.createElement('div');
                filterInfo.className = 'filter-info';
                filterInfo.style.cssText = `
                    background: linear-gradient(90deg, #66c0f4, #4a90c2);
                    color: white;
                    padding: 10px 15px;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                `;
                
                const steamFeatured = document.querySelector('.steam-featured');
                if (steamFeatured) {
                    steamFeatured.insertBefore(filterInfo, steamFeatured.firstChild);
                }
            }
            
            const totalFilters = filters.progress.length + filters.type.length;
            filterInfo.innerHTML = `
                <span>已应用 ${totalFilters} 个筛选条件</span>
                <button onclick="steamLayout.clearFilters()" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">×</button>
            `;
        } else {
            // 移除筛选结果提示
            const filterInfo = document.querySelector('.filter-info');
            if (filterInfo) {
                filterInfo.remove();
            }
        }
    }
    
    // 清除所有筛选器
    clearFilters() {
        document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        const filterInfo = document.querySelector('.filter-info');
        if (filterInfo) {
            filterInfo.remove();
        }
    }
    
    // 初始化项目卡片交互
    initProjectInteractions() {
        // 项目卡片悬停效果
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCard(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCard(card, 'leave');
            });
        });
        
        // 操作按钮点击事件
        const actionBtns = document.querySelectorAll('.action-btn');
        
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const icon = btn.querySelector('i');
                
                if (icon.classList.contains('fa-heart')) {
                    this.toggleFavorite(btn);
                } else if (icon.classList.contains('fa-share')) {
                    this.shareProject(btn);
                }
            });
        });
    }
    
    // 卡片动画效果
    animateCard(card, action) {
        const overlay = card.querySelector('.project-overlay');
        const actions = card.querySelector('.project-actions');
        
        if (action === 'enter') {
            if (overlay) {
                overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)';
            }
            if (actions) {
                actions.style.opacity = '1';
                actions.style.transform = 'translateY(0)';
            }
        } else {
            if (overlay) {
                overlay.style.background = 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)';
            }
            if (actions) {
                actions.style.opacity = '0.7';
                actions.style.transform = 'translateY(-5px)';
            }
        }
    }
    
    // 切换收藏状态
    toggleFavorite(btn) {
        const icon = btn.querySelector('i');
        const isFavorited = icon.classList.contains('fas');
        
        if (isFavorited) {
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.style.background = 'rgba(0, 0, 0, 0.6)';
            this.showToast('已取消收藏', 'info');
        } else {
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.style.background = '#ff4757';
            this.showToast('已添加到收藏', 'success');
        }
        
        // 添加点击动画
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    }
    
    // 分享项目
    shareProject(btn) {
        // 模拟分享功能
        const projectCard = btn.closest('.project-card');
        const projectTitle = projectCard.querySelector('h3, h4').textContent;
        
        // 复制到剪贴板
        const shareText = `推荐一个很棒的项目：${projectTitle} - 来自NytrolabRWA平台`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('分享链接已复制到剪贴板', 'success');
            });
        } else {
            this.showToast('分享功能暂不可用', 'error');
        }
        
        // 添加点击动画
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    }
    
    // 初始化侧边栏交互
    initSidebarInteractions() {
        // 分类项点击效果
        const categoryItems = document.querySelectorAll('.category-item');
        
        categoryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 更新活动状态
                categoryItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // 模拟加载对应分类的内容
                const category = item.textContent.trim();
                this.loadCategoryContent(category);
            });
        });
        
        // 特价项目和新品点击效果
        const offerItems = document.querySelectorAll('.offer-item, .release-item');
        
        offerItems.forEach(item => {
            item.addEventListener('click', () => {
                // 添加点击动画
                item.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 150);
                
                // 这里可以添加跳转到项目详情的逻辑
                console.log('点击了项目:', item.querySelector('h4').textContent);
            });
        });
        
        // 统计卡片点击效果
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach(item => {
            item.addEventListener('click', () => {
                // 添加点击动画
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 150);
                
                // 显示详细统计信息
                const label = item.querySelector('.stat-label').textContent;
                this.showStatDetails(label);
            });
        });
    }
    
    // 加载分类内容
    loadCategoryContent(category) {
        this.showToast(`正在加载 ${category} 相关项目...`, 'info');
        
        // 这里可以添加实际的内容加载逻辑
        setTimeout(() => {
            this.showToast(`${category} 项目加载完成`, 'success');
        }, 1000);
    }
    
    // 显示统计详情
    showStatDetails(statType) {
        const details = {
            '活跃玩家': '过去30天内有活动的用户数量',
            '精品游戏': '经过严格筛选的高质量游戏项目',
            '累计支持': '平台成立以来的总筹资金额',
            '成功率': '成功完成筹资目标的项目比例'
        };
        
        const detail = details[statType] || '暂无详细信息';
        this.showToast(`${statType}: ${detail}`, 'info', 3000);
    }
    
    // 显示提示消息
    showToast(message, type = 'info', duration = 2000) {
        // 移除现有的toast
        const existingToast = document.querySelector('.steam-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // 创建新的toast
        const toast = document.createElement('div');
        toast.className = 'steam-toast';
        
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#66c0f4'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, duration);
    }
}

// 初始化Steam布局
let steamLayout;

document.addEventListener('DOMContentLoaded', () => {
    steamLayout = new SteamLayout();
});

// 导出到全局作用域，供HTML中的事件处理器使用
window.steamLayout = steamLayout;