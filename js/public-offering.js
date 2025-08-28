/**
 * 公募区页面脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏效果
    initNavbar();
    
    // 初始化筛选功能
    initFilters();
    
    // 初始化视图切换
    initViewToggle();
    
    // 初始化精选项目轮播
    initFeaturedSlider();
    
    // 初始化进度条动画
    initProgressBars();
    
    // 初始化项目卡片交互
    initProjectCards();
    
    // 初始化常见问题折叠面板
    initFaqAccordion();
    
    // 初始化成功案例轮播
    initSuccessStories();
});

/**
 * 初始化导航栏效果
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    // 滚动时改变导航栏样式
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 移动端菜单切换
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
}

/**
 * 初始化筛选功能
 */
function initFilters() {
    const filterDropdowns = document.querySelectorAll('.filter-dropdown');
    
    filterDropdowns.forEach(dropdown => {
        const filterBtn = dropdown.querySelector('.btn-filter');
        const filterMenu = dropdown.querySelector('.filter-menu');
        
        if (!filterBtn || !filterMenu) return;
        
        // 点击按钮显示/隐藏筛选菜单
        filterBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 关闭其他打开的筛选菜单
            document.querySelectorAll('.filter-menu').forEach(menu => {
                if (menu !== filterMenu) {
                    menu.style.display = 'none';
                }
            });
            
            // 切换当前筛选菜单
            filterMenu.style.display = filterMenu.style.display === 'block' ? 'none' : 'block';
            dropdown.classList.toggle('active');
        });
        
        // 点击筛选选项
        const filterOptions = filterMenu.querySelectorAll('input[type="checkbox"]');
        filterOptions.forEach(option => {
            option.addEventListener('change', function() {
                // 如果选择了"全部"，取消其他选项
                if (this.checked && this.parentElement.textContent.trim() === '全部') {
                    filterOptions.forEach(opt => {
                        if (opt !== this) {
                            opt.checked = false;
                        }
                    });
                } 
                // 如果选择了其他选项，取消"全部"
                else if (this.checked) {
                    const allOption = Array.from(filterOptions).find(opt => 
                        opt.parentElement.textContent.trim() === '全部'
                    );
                    if (allOption) {
                        allOption.checked = false;
                    }
                }
                
                // 更新按钮文本
                updateFilterButtonText(dropdown);
                
                // 应用筛选
                applyFilters();
            });
        });
        
        // 点击排序选项
        const sortOptions = filterMenu.querySelectorAll('input[type="radio"]');
        sortOptions.forEach(option => {
            option.addEventListener('change', function() {
                if (this.checked) {
                    // 更新按钮文本
                    updateFilterButtonText(dropdown);
                    
                    // 应用排序
                    applySorting();
                }
            });
        });
    });
    
    // 点击其他区域关闭筛选菜单
    document.addEventListener('click', function() {
        document.querySelectorAll('.filter-menu').forEach(menu => {
            menu.style.display = 'none';
        });
        document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
    
    document.querySelectorAll('.filter-menu').forEach(menu => {
        menu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}

/**
 * 更新筛选按钮文本
 */
function updateFilterButtonText(dropdown) {
    const filterBtn = dropdown.querySelector('.btn-filter');
    const filterMenu = dropdown.querySelector('.filter-menu');
    
    if (!filterBtn || !filterMenu) return;
    
    // 检查是复选框还是单选按钮
    const isCheckbox = filterMenu.querySelector('input[type="checkbox"]') !== null;
    const isRadio = filterMenu.querySelector('input[type="radio"]') !== null;
    
    if (isCheckbox) {
        const checkedOptions = Array.from(filterMenu.querySelectorAll('input[type="checkbox"]:checked'));
        
        if (checkedOptions.length === 0) {
            // 如果没有选中任何选项，默认选中"全部"
            const allOption = filterMenu.querySelector('input[type="checkbox"]:first-of-type');
            if (allOption) {
                allOption.checked = true;
                filterBtn.innerHTML = '全部 <i class="fas fa-chevron-down"></i>';
            }
        } else if (checkedOptions.length === 1) {
            // 如果只选中了一个选项
            const label = checkedOptions[0].parentElement.textContent.trim();
            filterBtn.innerHTML = `${label} <i class="fas fa-chevron-down"></i>`;
        } else {
            // 如果选中了多个选项
            filterBtn.innerHTML = `已选${checkedOptions.length}项 <i class="fas fa-chevron-down"></i>`;
        }
    } else if (isRadio) {
        const checkedOption = filterMenu.querySelector('input[type="radio"]:checked');
        
        if (checkedOption) {
            const label = checkedOption.parentElement.textContent.trim();
            filterBtn.innerHTML = `${label} <i class="fas fa-chevron-down"></i>`;
        }
    }
}

/**
 * 应用筛选
 */
function applyFilters() {
    // 获取所有筛选条件
    const projectType = getSelectedFilterValues('项目类型');
    const fundingStatus = getSelectedFilterValues('众筹状态');
    
    // 获取所有项目卡片
    const projectCards = document.querySelectorAll('.project-card');
    
    // 应用筛选
    projectCards.forEach(card => {
        const cardType = card.querySelector('.project-category').textContent.trim();
        
        // 检查众筹状态
        let cardStatus = '进行中'; // 默认状态
        const badges = card.querySelectorAll('.badge');
        badges.forEach(badge => {
            const badgeText = badge.textContent.trim();
            if (badgeText === '已达标' || badgeText === '即将结束' || badgeText === '已结束') {
                cardStatus = badgeText;
            }
        });
        
        // 检查项目类型筛选
        const typeMatch = projectType.includes('全部') || projectType.includes(cardType);
        
        // 检查众筹状态筛选
        const statusMatch = fundingStatus.includes('全部') || fundingStatus.includes(cardStatus);
        
        // 如果同时满足所有筛选条件，显示卡片，否则隐藏
        if (typeMatch && statusMatch) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
    
    // 检查是否有显示的卡片
    const visibleCards = Array.from(projectCards).filter(card => card.style.display !== 'none');
    
    // 显示筛选结果提示
    showFilterResults(visibleCards.length, projectCards.length);
}

/**
 * 获取选中的筛选值
 */
function getSelectedFilterValues(filterLabel) {
    const filterGroups = document.querySelectorAll('.filter-group');
    let selectedValues = [];
    
    filterGroups.forEach(group => {
        const label = group.querySelector('label');
        
        if (label && label.textContent.trim() === filterLabel) {
            const checkedOptions = group.querySelectorAll('input[type="checkbox"]:checked');
            
            checkedOptions.forEach(option => {
                selectedValues.push(option.parentElement.textContent.trim());
            });
        }
    });
    
    return selectedValues;
}

/**
 * 显示筛选结果提示
 */
function showFilterResults(visibleCount, totalCount) {
    let resultMsg = document.querySelector('.filter-results-msg');
    
    if (!resultMsg) {
        resultMsg = document.createElement('div');
        resultMsg.className = 'filter-results-msg';
        document.querySelector('.projects-grid').before(resultMsg);
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .filter-results-msg {
                margin-bottom: 20px;
                padding: 10px 15px;
                background-color: var(--color-bg-light);
                border-radius: 8px;
                font-size: 0.9rem;
                color: var(--color-text);
            }
        `;
        document.head.appendChild(style);
    }
    
    if (visibleCount === 0) {
        resultMsg.textContent = '没有符合条件的项目';
        resultMsg.style.display = 'block';
    } else if (visibleCount < totalCount) {
        resultMsg.textContent = `显示 ${visibleCount} 个项目（共 ${totalCount} 个）`;
        resultMsg.style.display = 'block';
    } else {
        resultMsg.style.display = 'none';
    }
}

/**
 * 应用排序
 */
function applySorting() {
    const sortOption = document.querySelector('input[name="sort"]:checked');
    
    if (!sortOption) return;
    
    const sortValue = sortOption.parentElement.textContent.trim();
    const projectsGrid = document.querySelector('.projects-grid');
    const projectCards = Array.from(document.querySelectorAll('.project-card'));
    
    // 根据不同的排序选项进行排序
    switch (sortValue) {
        case '最新上线':
            projectCards.sort((a, b) => {
                const isNewA = a.querySelector('.badge-new') !== null ? 1 : 0;
                const isNewB = b.querySelector('.badge-new') !== null ? 1 : 0;
                return isNewB - isNewA;
            });
            break;
            
        case '筹款最多':
            projectCards.sort((a, b) => {
                const amountA = parseInt(a.querySelector('.amount').textContent.replace(/[^0-9]/g, ''));
                const amountB = parseInt(b.querySelector('.amount').textContent.replace(/[^0-9]/g, ''));
                return amountB - amountA;
            });
            break;
            
        case '支持者最多':
            projectCards.sort((a, b) => {
                const backersA = parseInt(a.querySelector('.backers').textContent.replace(/[^0-9]/g, ''));
                const backersB = parseInt(b.querySelector('.backers').textContent.replace(/[^0-9]/g, ''));
                return backersB - backersA;
            });
            break;
            
        case '即将结束':
            projectCards.sort((a, b) => {
                const daysA = parseInt(a.querySelector('.time-left').textContent.replace(/[^0-9]/g, ''));
                const daysB = parseInt(b.querySelector('.time-left').textContent.replace(/[^0-9]/g, ''));
                return daysA - daysB;
            });
            break;
            
        case '完成度最高':
            projectCards.sort((a, b) => {
                const percentageA = parseInt(a.querySelector('.percentage').textContent);
                const percentageB = parseInt(b.querySelector('.percentage').textContent);
                return percentageB - percentageA;
            });
            break;
    }
    
    // 重新添加排序后的卡片
    projectCards.forEach(card => {
        projectsGrid.appendChild(card);
    });
}

/**
 * 初始化视图切换
 */
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.btn-view');
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!viewButtons.length || !projectsGrid) return;
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // 给当前点击的按钮添加active类
            this.classList.add('active');
            
            // 获取视图类型
            const viewType = this.getAttribute('data-view');
            
            // 切换视图
            if (viewType === 'grid') {
                projectsGrid.classList.remove('list-view');
            } else if (viewType === 'list') {
                projectsGrid.classList.add('list-view');
            }
        });
    });
}

/**
 * 初始化精选项目轮播
 */
function initFeaturedSlider() {
    const slider = document.querySelector('.featured-slider');
    
    if (!slider) return;
    
    const slides = [
        {
            image: 'https://i.imgur.com/8dKNuQR.jpg',
            title: '星际探险：无尽宇宙',
            category: '动作冒险',
            team: '星辰工作室',
            desc: '一款开放世界太空探险游戏，玩家将探索无尽宇宙，发现奇异星球，与外星文明互动，建立自己的星际帝国。',
            amount: '¥1,258,760',
            percentage: '84%',
            timeLeft: '15天',
            backers: '2,145',
            badges: ['featured', 'hot']
        },
        {
            image: 'https://i.imgur.com/fP3GHyU.jpg',
            title: '幻想世界：龙之传说',
            category: '角色扮演',
            team: '龙骑士工作室',
            desc: '一款史诗级奇幻RPG游戏，玩家将扮演龙骑士，与传说中的龙族建立联系，对抗黑暗势力，拯救幻想大陆。',
            amount: '¥1,876,320',
            percentage: '93%',
            timeLeft: '7天',
            backers: '3,254',
            badges: ['featured', 'ending']
        },
        {
            image: 'https://i.imgur.com/qLTHRNK.jpg',
            title: '城市建造者：未来都市',
            category: '模拟经营',
            team: '城市规划工作室',
            desc: '一款未来城市建设模拟游戏，玩家将规划和建设未来都市，管理资源，解决城市问题，创造可持续发展的未来。',
            amount: '¥952,480',
            percentage: '79%',
            timeLeft: '12天',
            backers: '1,876',
            badges: ['featured']
        }
    ];
    
    let currentSlide = 0;
    const featuredProject = slider.querySelector('.featured-project');
    const dots = slider.querySelectorAll('.dot');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    
    // 更新轮播内容
    function updateSlider() {
        const slide = slides[currentSlide];
        
        // 更新图片和徽章
        const image = featuredProject.querySelector('.featured-image img');
        image.src = slide.image;
        image.alt = slide.title;
        
        // 更新徽章
        let badgesHTML = '';
        slide.badges.forEach(badge => {
            let badgeClass = '';
            let badgeText = '';
            
            switch (badge) {
                case 'featured':
                    badgeClass = 'badge-featured';
                    badgeText = '精选';
                    break;
                case 'hot':
                    badgeClass = 'badge-hot';
                    badgeText = '热门';
                    break;
                case 'ending':
                    badgeClass = 'badge-ending';
                    badgeText = '即将结束';
                    break;
            }
            
            badgesHTML += `<span class="badge ${badgeClass}">${badgeText}</span>`;
        });
        
        featuredProject.querySelector('.featured-badges').innerHTML = badgesHTML;
        
        // 更新标题和内容
        featuredProject.querySelector('h3 a').textContent = slide.title;
        featuredProject.querySelector('.project-category').textContent = slide.category;
        featuredProject.querySelector('.project-team').textContent = `由 ${slide.team} 开发`;
        featuredProject.querySelector('.project-desc').textContent = slide.desc;
        
        // 更新筹款信息
        featuredProject.querySelector('.amount').textContent = slide.amount;
        featuredProject.querySelector('.percentage').textContent = slide.percentage;
        featuredProject.querySelector('.time').textContent = slide.timeLeft;
        featuredProject.querySelector('.backers-info span').textContent = `${slide.backers} 人已支持`;
        
        // 更新进度条
        const progressBar = featuredProject.querySelector('.progress');
        progressBar.style.width = slide.percentage;
        
        // 更新轮播点
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // 切换到下一张幻灯片
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }
    
    // 切换到上一张幻灯片
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    }
    
    // 点击下一张按钮
    nextBtn.addEventListener('click', nextSlide);
    
    // 点击上一张按钮
    prevBtn.addEventListener('click', prevSlide);
    
    // 点击轮播点
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // 自动轮播
    let slideInterval = setInterval(nextSlide, 5000);
    
    // 鼠标悬停时暂停轮播
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    // 鼠标离开时恢复轮播
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
}

/**
 * 初始化进度条动画
 */
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    
    // 初始化所有进度条为0%宽度
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        // 使用Intersection Observer检测元素是否可见
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 元素可见时，添加动画效果
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 200);
                    
                    // 停止观察
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(bar);
    });
}

/**
 * 初始化项目卡片交互
 */
function initProjectCards() {
    // 收藏按钮点击事件
    const bookmarkBtns = document.querySelectorAll('.btn-outline');
    
    bookmarkBtns.forEach(btn => {
        if (btn.querySelector('i.fa-bookmark') || btn.querySelector('i.fa-heart')) {
            btn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                
                if (icon.classList.contains('far')) {
                    // 切换为实心图标
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    this.classList.add('active');
                    
                    // 显示提示
                    showToast('项目已收藏');
                } else {
                    // 切换为空心图标
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    this.classList.remove('active');
                    
                    // 显示提示
                    showToast('已取消收藏');
                }
            });
        }
    });
    
    // 加载更多按钮点击事件
    const loadMoreBtn = document.querySelector('.load-more .btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // 显示加载中状态
            this.textContent = '加载中...';
            this.disabled = true;
            
            // 模拟加载延迟
            setTimeout(() => {
                // 加载新项目
                loadMoreProjects();
                
                // 恢复按钮状态
                this.textContent = '加载更多项目';
                this.disabled = false;
            }, 1000);
        });
    }
}

/**
 * 显示提示消息
 */
function showToast(message) {
    // 检查是否已存在toast元素
    let toast = document.querySelector('.toast-message');
    
    if (!toast) {
        // 创建toast元素
        toast = document.createElement('div');
        toast.className = 'toast-message';
        document.body.appendChild(toast);
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .toast-message {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: #fff;
                padding: 12px 24px;
                border-radius: 30px;
                font-size: 14px;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease, transform 0.3s ease;
                pointer-events: none;
            }
            .toast-message.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    // 设置消息内容
    toast.textContent = message;
    
    // 显示toast
    toast.classList.add('show');
    
    // 3秒后隐藏
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * 加载更多项目
 */
function loadMoreProjects() {
    // 模拟新项目数据
    const newProjects = [
        {
            image: 'https://i.imgur.com/RzHm8Vt.jpg',
            title: '太空殖民：火星基地',
            category: '策略模拟',
            team: '红色星球工作室',
            desc: '建立和管理火星上的第一个人类殖民地，应对极端环境挑战，确保殖民者的生存和发展。',
            amount: '¥635,420',
            percentage: '63%',
            daysLeft: 14,
            backers: 876,
            badges: []
        },
        {
            image: 'https://i.imgur.com/9XcXAiL.jpg',
            title: '幽灵猎人：灵异调查',
            category: '恐怖冒险',
            team: '暗影游戏',
            desc: '一款恐怖冒险游戏，玩家扮演灵异调查员，使用各种工具探索闹鬼地点，揭开超自然现象的真相。',
            amount: '¥528,750',
            percentage: '52%',
            daysLeft: 19,
            backers: 743,
            badges: ['new']
        },
        {
            image: 'https://i.imgur.com/dKvZGxS.jpg',
            title: '厨师大战：美食竞赛',
            category: '休闲模拟',
            team: '美食游戏',
            desc: '一款有趣的烹饪模拟游戏，玩家将参加各种烹饪挑战，学习新菜谱，经营自己的餐厅，成为顶级厨师。',
            amount: '¥412,680',
            percentage: '41%',
            daysLeft: 23,
            backers: 624,
            badges: []
        }
    ];
    
    const projectsGrid = document.querySelector('.projects-grid');
    
    // 创建并添加新项目卡片
    newProjects.forEach(project => {
        // 创建项目卡片元素
        const card = document.createElement('div');
        card.className = 'project-card';
        
        // 设置卡片内容
        let badgesHTML = '';
        if (project.badges.length > 0) {
            badgesHTML = '<div class="project-badges">';
            project.badges.forEach(badge => {
                let badgeClass = '';
                let badgeText = '';
                
                switch (badge) {
                    case 'hot':
                        badgeClass = 'badge-hot';
                        badgeText = '热门';
                        break;
                    case 'new':
                        badgeClass = 'badge-new';
                        badgeText = '新上线';
                        break;
                    case 'ending':
                        badgeClass = 'badge-ending';
                        badgeText = '即将结束';
                        break;
                    case 'success':
                        badgeClass = 'badge-success';
                        badgeText = '已达标';
                        break;
                    case 'trending':
                        badgeClass = 'badge-trending';
                        badgeText = '趋势';
                        break;
                }
                
                badgesHTML += `<span class="badge ${badgeClass}">${badgeText}</span>`;
            });
            badgesHTML += '</div>';
        }
        
        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
                ${badgesHTML}
            </div>
            <div class="project-content">
                <h3><a href="project-detail.html">${project.title}</a></h3>
                <div class="project-meta">
                    <span class="project-category">${project.category}</span>
                    <span class="project-team">${project.team}</span>
                </div>
                <p class="project-desc">${project.desc}</p>
                <div class="funding-progress">
                    <div class="progress-stats">
                        <div class="stat">
                            <span class="amount">${project.amount}</span>
                            <span class="label">已筹资金</span>
                        </div>
                        <div class="stat">
                            <span class="percentage">${project.percentage}</span>
                            <span class="label">已达目标</span>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${project.percentage};"></div>
                    </div>
                    <div class="time-left">
                        <i class="far fa-clock"></i> 剩余 ${project.daysLeft} 天
                    </div>
                </div>
                <div class="project-footer">
                    <a href="project-detail.html" class="btn btn-sm btn-primary">查看详情</a>
                    <div class="backers">
                        <i class="fas fa-user"></i> ${project.backers} 支持者
                    </div>
                </div>
            </div>
        `;
        
        // 设置初始透明度为0
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // 添加到网格中
        projectsGrid.appendChild(card);
        
        // 添加过渡效果
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
    
    // 初始化新添加卡片的进度条
    initProgressBars();
    
    // 初始化新添加卡片的交互
    initProjectCards();
    
    // 如果已经加载了足够多的项目，可以隐藏加载更多按钮
    const totalProjects = document.querySelectorAll('.project-card').length;
    const loadMoreBtn = document.querySelector('.load-more .btn');
    
    if (totalProjects >= 12) { // 假设最多显示12个项目
        loadMoreBtn.textContent = '已加载全部';
        loadMoreBtn.disabled = true;
    }
}

/**
 * 初始化常见问题折叠面板
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggleIcon = item.querySelector('.toggle-icon i');
        
        question.addEventListener('click', () => {
            // 关闭其他打开的FAQ项
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.toggle-icon i').className = 'fas fa-plus';
                }
            });
            
            // 切换当前FAQ项
            item.classList.toggle('active');
            
            // 切换图标
            if (item.classList.contains('active')) {
                toggleIcon.className = 'fas fa-minus';
            } else {
                toggleIcon.className = 'fas fa-plus';
            }
        });
    });
}

/**
 * 初始化成功案例轮播
 */
function initSuccessStories() {
    const slider = document.querySelector('.stories-slider');
    
    if (!slider) return;
    
    const slides = [
        {
            image: 'https://i.imgur.com/JQTXrG2.jpg',
            title: '《暗影猎人》',
            amount: '¥2,580,000',
            backers: '3,245',
            percentage: '215%',
            desc: '《暗影猎人》是一款动作角色扮演游戏，通过我们平台成功筹集了超过250万元资金，远超目标金额。游戏已于去年正式发布，获得了Steam平台"特别好评"评价。'
        },
        {
            image: 'https://i.imgur.com/9XcXAiL.jpg',
            title: '《像素农场》',
            amount: '¥1,850,000',
            backers: '4,127',
            percentage: '185%',
            desc: '《像素农场》是一款复古风格的农场模拟游戏，在我们平台筹集了185万元资金。游戏发布后在各大应用商店获得了4.8星的高评分，月活跃用户超过50万。'
        },
        {
            image: 'https://i.imgur.com/dKvZGxS.jpg',
            title: '《机甲战士》',
            amount: '¥3,120,000',
            backers: '2,876',
            percentage: '260%',
            desc: '《机甲战士》是一款科幻机甲对战游戏，筹集了312万元资金，是我们平台筹资金额最高的项目之一。游戏已成功登陆多个主流游戏平台，并举办了多次电竞赛事。'
        }
    ];
    
    let currentSlide = 0;
    const storyCard = slider.querySelector('.story-card');
    const dots = slider.querySelectorAll('.dot');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    
    // 更新轮播内容
    function updateSlider() {
        const slide = slides[currentSlide];
        
        // 更新图片
        storyCard.querySelector('.story-image img').src = slide.image;
        storyCard.querySelector('.story-image img').alt = slide.title;
        
        // 更新内容
        storyCard.querySelector('h3').textContent = slide.title;
        storyCard.querySelector('.stat:nth-child(1) .value').textContent = slide.amount;
        storyCard.querySelector('.stat:nth-child(2) .value').textContent = slide.backers;
        storyCard.querySelector('.stat:nth-child(3) .value').textContent = slide.percentage;
        storyCard.querySelector('p').textContent = slide.desc;
        
        // 更新轮播点
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // 切换到下一张幻灯片
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }
    
    // 切换到上一张幻灯片
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    }
    
    // 点击下一张按钮
    nextBtn.addEventListener('click', nextSlide);
    
    // 点击上一张按钮
    prevBtn.addEventListener('click', prevSlide);
    
    // 点击轮播点
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // 自动轮播
    let slideInterval = setInterval(nextSlide, 6000);
    
    // 鼠标悬停时暂停轮播
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    // 鼠标离开时恢复轮播
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 6000);
    });
}