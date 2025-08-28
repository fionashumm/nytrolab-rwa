/**
 * 严选板块交互功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 导航栏效果
    const header = document.querySelector('.site-header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 筛选下拉菜单
    const filterDropdowns = document.querySelectorAll('.filter-dropdown');
    
    filterDropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.btn-filter');
        const menu = dropdown.querySelector('.filter-menu');
        
        if (btn && menu) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdown.classList.toggle('active');
                menu.style.display = dropdown.classList.contains('active') ? 'block' : 'none';
                
                // 关闭其他打开的下拉菜单
                filterDropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
                        otherDropdown.classList.remove('active');
                        const otherMenu = otherDropdown.querySelector('.filter-menu');
                        if (otherMenu) otherMenu.style.display = 'none';
                    }
                });
            });
        }
    });
    
    // 点击页面其他地方关闭下拉菜单
    document.addEventListener('click', function() {
        filterDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            const menu = dropdown.querySelector('.filter-menu');
            if (menu) menu.style.display = 'none';
        });
    });

    // 视图切换
    const gridViewBtn = document.querySelector('.btn-grid-view');
    const listViewBtn = document.querySelector('.btn-list-view');
    const projectsGrid = document.querySelector('.selected-projects-grid');
    
    if (gridViewBtn && listViewBtn && projectsGrid) {
        gridViewBtn.addEventListener('click', function() {
            projectsGrid.classList.remove('list-view');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });
        
        listViewBtn.addEventListener('click', function() {
            projectsGrid.classList.add('list-view');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        });
    }

    // 筛选功能
    const filterCheckboxes = document.querySelectorAll('.filter-menu input[type="checkbox"]');
    const filterRadios = document.querySelectorAll('.filter-menu input[type="radio"]');
    const projectCards = document.querySelectorAll('.selected-project-card');
    
    // 收集所有筛选条件
    let activeFilters = {
        categories: [],
        rating: null,
        stage: null
    };
    
    // 更新筛选条件
    function updateFilters() {
        // 重置筛选条件
        activeFilters.categories = [];
        activeFilters.rating = null;
        activeFilters.stage = null;
        
        // 收集类别筛选条件
        document.querySelectorAll('.category-filter:checked').forEach(checkbox => {
            activeFilters.categories.push(checkbox.value);
        });
        
        // 收集评级筛选条件
        const ratingFilter = document.querySelector('.rating-filter:checked');
        if (ratingFilter) activeFilters.rating = ratingFilter.value;
        
        // 收集阶段筛选条件
        const stageFilter = document.querySelector('.stage-filter:checked');
        if (stageFilter) activeFilters.stage = stageFilter.value;
        
        // 应用筛选
        applyFilters();
    }
    
    // 应用筛选条件到项目卡片
    function applyFilters() {
        projectCards.forEach(card => {
            let showCard = true;
            
            // 类别筛选
            if (activeFilters.categories.length > 0) {
                const cardCategory = card.dataset.category;
                if (!activeFilters.categories.includes(cardCategory)) {
                    showCard = false;
                }
            }
            
            // 评级筛选
            if (activeFilters.rating && showCard) {
                const cardRating = parseFloat(card.dataset.rating);
                const filterRating = parseFloat(activeFilters.rating);
                
                if (cardRating < filterRating) {
                    showCard = false;
                }
            }
            
            // 阶段筛选
            if (activeFilters.stage && showCard) {
                const cardStage = card.dataset.stage;
                if (cardStage !== activeFilters.stage) {
                    showCard = false;
                }
            }
            
            // 显示或隐藏卡片
            card.style.display = showCard ? 'flex' : 'none';
        });
        
        // 更新筛选按钮文本
        updateFilterButtonText();
    }
    
    // 更新筛选按钮文本
    function updateFilterButtonText() {
        // 更新类别按钮
        const categoryBtn = document.querySelector('.category-filter-btn');
        if (categoryBtn) {
            if (activeFilters.categories.length > 0) {
                categoryBtn.innerHTML = `类别 <span>(${activeFilters.categories.length})</span> <i class="fas fa-chevron-down"></i>`;
            } else {
                categoryBtn.innerHTML = `类别 <i class="fas fa-chevron-down"></i>`;
            }
        }
        
        // 更新评级按钮
        const ratingBtn = document.querySelector('.rating-filter-btn');
        if (ratingBtn && activeFilters.rating) {
            ratingBtn.innerHTML = `评级 (${activeFilters.rating}+) <i class="fas fa-chevron-down"></i>`;
        } else if (ratingBtn) {
            ratingBtn.innerHTML = `评级 <i class="fas fa-chevron-down"></i>`;
        }
        
        // 更新阶段按钮
        const stageBtn = document.querySelector('.stage-filter-btn');
        if (stageBtn && activeFilters.stage) {
            const stageName = document.querySelector(`.stage-filter[value="${activeFilters.stage}"]`)?.dataset.name || activeFilters.stage;
            stageBtn.innerHTML = `${stageName} <i class="fas fa-chevron-down"></i>`;
        } else if (stageBtn) {
            stageBtn.innerHTML = `开发阶段 <i class="fas fa-chevron-down"></i>`;
        }
    }
    
    // 添加筛选事件监听器
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateFilters);
    });
    
    filterRadios.forEach(radio => {
        radio.addEventListener('change', updateFilters);
    });

    // 收藏按钮交互
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            button.classList.toggle('active');
            
            // 更新收藏图标
            const icon = button.querySelector('i');
            if (button.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                button.setAttribute('title', '取消收藏');
                
                // 显示收藏成功提示
                showToast('项目已添加到收藏');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                button.setAttribute('title', '添加到收藏');
                
                // 显示取消收藏提示
                showToast('已从收藏中移除');
            }
        });
    });

    // 投资者见证轮播
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const sliderDots = document.querySelectorAll('.dot');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    let currentSlide = 0;
    
    function showSlide(index) {
        // 隐藏所有卡片
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // 移除所有点的激活状态
        sliderDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // 显示当前卡片和点
        testimonialCards[index].classList.add('active');
        sliderDots[index].classList.add('active');
        currentSlide = index;
    }
    
    // 初始化轮播
    if (testimonialCards.length > 0) {
        showSlide(0);
        
        // 点击导航点切换轮播
        sliderDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showSlide(index);
            });
        });
        
        // 上一张/下一张按钮
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', function() {
                let newIndex = currentSlide - 1;
                if (newIndex < 0) newIndex = testimonialCards.length - 1;
                showSlide(newIndex);
            });
            
            nextButton.addEventListener('click', function() {
                let newIndex = currentSlide + 1;
                if (newIndex >= testimonialCards.length) newIndex = 0;
                showSlide(newIndex);
            });
        }
        
        // 自动轮播
        setInterval(function() {
            let newIndex = currentSlide + 1;
            if (newIndex >= testimonialCards.length) newIndex = 0;
            showSlide(newIndex);
        }, 5000);
    }

    // 常见问题折叠面板
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // 关闭其他打开的问题
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // 切换当前问题的状态
                item.classList.toggle('active');
            });
        }
    });

    // 加载更多项目
    const loadMoreBtn = document.querySelector('.btn-load-more');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // 显示加载中状态
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
            loadMoreBtn.disabled = true;
            
            // 模拟加载延迟
            setTimeout(function() {
                // 创建新项目卡片
                const newProjects = [
                    {
                        image: 'https://i.imgur.com/8dKNuQR.jpg',
                        title: '星际探险：无尽边界',
                        rating: '4.7',
                        category: '策略',
                        team: 'Nova Studios',
                        stage: '测试阶段',
                        desc: '一款太空探索策略游戏，玩家将指挥自己的舰队探索未知星系，建立殖民地，与外星文明交流或征战。',
                        minInvest: '1,000',
                        targetAmount: '800,000',
                        currentAmount: '650,000',
                        roi: '25-30%',
                        deadline: '2023-12-15'
                    },
                    {
                        image: 'https://i.imgur.com/fP3GHyU.jpg',
                        title: '魔法学院：秘术师',
                        rating: '4.9',
                        category: 'RPG',
                        team: 'Arcane Works',
                        stage: '完成阶段',
                        desc: '一款魔法主题的角色扮演游戏，玩家将作为魔法学院的学生，学习各种魔法，解开学院的秘密，成为强大的秘术师。',
                        minInvest: '2,000',
                        targetAmount: '1,200,000',
                        currentAmount: '1,100,000',
                        roi: '35-40%',
                        deadline: '2023-11-30'
                    },
                    {
                        image: 'https://i.imgur.com/qLTHRNK.jpg',
                        title: '机甲战士：钢铁意志',
                        rating: '4.6',
                        category: '动作',
                        team: 'Mech Dynamics',
                        stage: '测试阶段',
                        desc: '一款机甲题材的动作游戏，玩家将驾驶定制的机甲参与竞技场战斗，完成任务，升级装备，成为最强机甲战士。',
                        minInvest: '1,500',
                        targetAmount: '950,000',
                        currentAmount: '720,000',
                        roi: '28-33%',
                        deadline: '2024-01-10'
                    }
                ];
                
                const projectsGrid = document.querySelector('.selected-projects-grid');
                
                if (projectsGrid) {
                    // 添加新项目卡片到网格
                    newProjects.forEach(project => {
                        const card = document.createElement('div');
                        card.className = 'selected-project-card';
                        card.dataset.category = project.category.toLowerCase();
                        card.dataset.rating = project.rating;
                        card.dataset.stage = project.stage.replace(/\s+/g, '-').toLowerCase();
                        
                        card.innerHTML = `
                            <div class="project-image">
                                <img src="${project.image}" alt="${project.title}">
                                <div class="project-badges">
                                    <span class="badge badge-new">新项目</span>
                                </div>
                            </div>
                            <div class="project-content">
                                <div class="project-header">
                                    <h3><a href="project-detail.html">${project.title}</a></h3>
                                    <div class="project-rating">
                                        <div class="rating-value">${project.rating}</div>
                                        <div class="rating-stars">
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star-half-alt"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="project-meta">
                                    <div class="project-category">${project.category}</div>
                                    <div class="project-team">${project.team}</div>
                                    <div class="project-stage">${project.stage}</div>
                                </div>
                                <div class="project-desc">
                                    ${project.desc}
                                </div>
                                <div class="investment-info">
                                    <div class="info-row">
                                        <div class="info-item">
                                            <span class="label">最低投资</span>
                                            <span class="value">${project.minInvest} USDT</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">目标金额</span>
                                            <span class="value">${project.targetAmount} USDT</span>
                                        </div>
                                    </div>
                                    <div class="info-row">
                                        <div class="info-item">
                                            <span class="label">已筹金额</span>
                                            <span class="value highlight">${project.currentAmount} USDT</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">预期回报</span>
                                            <span class="value highlight">${project.roi}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="project-footer">
                                    <a href="project-detail.html" class="btn btn-primary">查看详情</a>
                                    <button class="btn-outline btn-favorite" title="添加到收藏">
                                        <i class="far fa-heart"></i> 收藏
                                    </button>
                                    <div class="project-deadline">
                                        <i class="far fa-clock"></i> 截止日期: ${project.deadline}
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        projectsGrid.appendChild(card);
                        
                        // 为新添加的收藏按钮添加事件监听器
                        const newFavoriteBtn = card.querySelector('.btn-favorite');
                        if (newFavoriteBtn) {
                            newFavoriteBtn.addEventListener('click', function(e) {
                                e.preventDefault();
                                newFavoriteBtn.classList.toggle('active');
                                
                                // 更新收藏图标
                                const icon = newFavoriteBtn.querySelector('i');
                                if (newFavoriteBtn.classList.contains('active')) {
                                    icon.classList.remove('far');
                                    icon.classList.add('fas');
                                    newFavoriteBtn.setAttribute('title', '取消收藏');
                                    
                                    // 显示收藏成功提示
                                    showToast('项目已添加到收藏');
                                } else {
                                    icon.classList.remove('fas');
                                    icon.classList.add('far');
                                    newFavoriteBtn.setAttribute('title', '添加到收藏');
                                    
                                    // 显示取消收藏提示
                                    showToast('已从收藏中移除');
                                }
                            });
                        }
                    });
                    
                    // 恢复加载按钮状态
                    loadMoreBtn.innerHTML = '加载更多项目';
                    loadMoreBtn.disabled = false;
                    
                    // 应用当前筛选条件到新加载的项目
                    applyFilters();
                }
            }, 1500);
        });
    }

    // 显示提示消息
    function showToast(message) {
        // 检查是否已存在toast元素
        let toast = document.querySelector('.toast-message');
        
        // 如果不存在，创建一个新的
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-message';
            document.body.appendChild(toast);
        }
        
        // 设置消息内容
        toast.textContent = message;
        toast.classList.add('show');
        
        // 3秒后隐藏
        setTimeout(function() {
            toast.classList.remove('show');
        }, 3000);
    }

    // 订阅表单验证
    const subscribeForm = document.querySelector('.subscribe-form');
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = subscribeForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email === '') {
                showToast('请输入您的电子邮箱');
                return;
            }
            
            // 简单的邮箱格式验证
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('请输入有效的电子邮箱地址');
                return;
            }
            
            // 模拟提交
            const submitBtn = subscribeForm.querySelector('button');
            const originalText = submitBtn.textContent;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
            submitBtn.disabled = true;
            
            setTimeout(function() {
                showToast('订阅成功！感谢您的关注');
                emailInput.value = '';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // 初始化统计数字动画
    const statValues = document.querySelectorAll('.stat-value');
    let animated = false;
    
    function animateStats() {
        if (animated) return;
        
        statValues.forEach(stat => {
            const targetValue = parseInt(stat.dataset.value);
            let currentValue = 0;
            const duration = 2000; // 动画持续时间（毫秒）
            const interval = 20; // 更新间隔（毫秒）
            const steps = duration / interval;
            const increment = targetValue / steps;
            
            const counter = setInterval(() => {
                currentValue += increment;
                
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(counter);
                }
                
                stat.textContent = Math.floor(currentValue).toLocaleString();
            }, interval);
        });
        
        animated = true;
    }
    
    // 监听滚动事件，当统计数字进入视口时触发动画
    const statsSection = document.querySelector('.stats-row');
    
    if (statsSection) {
        window.addEventListener('scroll', function() {
            const sectionPosition = statsSection.getBoundingClientRect();
            
            if (sectionPosition.top < window.innerHeight && sectionPosition.bottom >= 0) {
                animateStats();
            }
        });
        
        // 页面加载时检查是否在视口内
        if (statsSection.getBoundingClientRect().top < window.innerHeight) {
            animateStats();
        }
    }
});