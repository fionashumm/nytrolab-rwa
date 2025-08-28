/**
 * RWA待选板块脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏效果
    initNavbar();
    
    // 初始化筛选功能
    initFilters();
    
    // 初始化视图切换
    initViewToggle();
    
    // 初始化热度条动画
    initHeatBars();
    
    // 初始化项目卡片交互
    initProjectCards();
    
    // 初始化搜索功能
    initSearch();
    
    // 初始化加载更多功能
    initLoadMore();
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
    const devStage = getSelectedFilterValues('开发阶段');
    
    // 获取所有项目卡片
    const projectCards = document.querySelectorAll('.rwa-project-card');
    
    // 应用筛选
    projectCards.forEach(card => {
        const cardType = card.querySelector('.project-category').textContent.trim();
        const cardStage = card.querySelector('.project-stage').textContent.trim();
        
        // 检查项目类型筛选
        const typeMatch = projectType.includes('全部') || projectType.includes(cardType);
        
        // 检查开发阶段筛选
        const stageMatch = devStage.includes('全部') || devStage.includes(cardStage);
        
        // 如果同时满足所有筛选条件，显示卡片，否则隐藏
        if (typeMatch && stageMatch) {
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
        document.querySelector('.rwa-projects-grid').before(resultMsg);
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
    const projectsGrid = document.querySelector('.rwa-projects-grid');
    const projectCards = Array.from(document.querySelectorAll('.rwa-project-card'));
    
    // 根据不同的排序选项进行排序
    switch (sortValue) {
        case '热度最高':
            projectCards.sort((a, b) => {
                const heatA = parseInt(a.querySelector('.heat-percentage').textContent);
                const heatB = parseInt(b.querySelector('.heat-percentage').textContent);
                return heatB - heatA;
            });
            break;
            
        case '最新添加':
            // 这里假设新项目有"新入驻"标签
            projectCards.sort((a, b) => {
                const isNewA = a.querySelector('.badge-new') !== null ? 1 : 0;
                const isNewB = b.querySelector('.badge-new') !== null ? 1 : 0;
                return isNewB - isNewA;
            });
            break;
            
        case '即将达标':
            projectCards.sort((a, b) => {
                const heatA = parseInt(a.querySelector('.heat-percentage').textContent);
                const heatB = parseInt(b.querySelector('.heat-percentage').textContent);
                // 优先显示热度85%以上的项目，并按热度排序
                if (heatA >= 85 && heatB >= 85) {
                    return heatB - heatA;
                } else if (heatA >= 85) {
                    return -1;
                } else if (heatB >= 85) {
                    return 1;
                } else {
                    return heatB - heatA;
                }
            });
            break;
            
        case '关注最多':
            projectCards.sort((a, b) => {
                const followersA = parseInt(a.querySelector('.data-item:first-child span').textContent);
                const followersB = parseInt(b.querySelector('.data-item:first-child span').textContent);
                return followersB - followersA;
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
    const projectsGrid = document.querySelector('.rwa-projects-grid');
    
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
 * 初始化热度条动画
 */
function initHeatBars() {
    const heatBars = document.querySelectorAll('.heat-progress');
    
    // 初始化所有热度条为0%宽度
    heatBars.forEach(bar => {
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
    const projectCards = document.querySelectorAll('.rwa-project-card');
    
    projectCards.forEach(card => {
        // 关注按钮点击事件
        const followBtn = card.querySelector('.btn-outline');
        if (followBtn) {
            followBtn.addEventListener('click', function() {
                this.classList.toggle('followed');
                
                if (this.classList.contains('followed')) {
                    this.innerHTML = '<i class="fas fa-heart"></i> 已关注';
                    this.style.backgroundColor = 'var(--color-primary)';
                    this.style.color = '#fff';
                    this.style.borderColor = 'var(--color-primary)';
                    
                    // 更新关注数
                    const followersEl = card.querySelector('.data-item:first-child span');
                    if (followersEl) {
                        let followers = followersEl.textContent.trim();
                        let num = parseInt(followers);
                        followersEl.textContent = `${num + 1}k 关注`;
                    }
                    
                    // 显示提示
                    showToast('已成功关注项目');
                } else {
                    this.innerHTML = '<i class="fas fa-heart"></i> 关注';
                    this.style.backgroundColor = '';
                    this.style.color = '';
                    this.style.borderColor = '';
                    
                    // 更新关注数
                    const followersEl = card.querySelector('.data-item:first-child span');
                    if (followersEl) {
                        let followers = followersEl.textContent.trim();
                        let num = parseInt(followers);
                        followersEl.textContent = `${num - 1}k 关注`;
                    }
                    
                    // 显示提示
                    showToast('已取消关注项目');
                }
            });
        }
        
        // 投票支持按钮点击事件
        const voteBtn = card.querySelector('.btn-primary');
        if (voteBtn) {
            voteBtn.addEventListener('click', function() {
                // 检查是否已经投票
                if (this.classList.contains('voted')) {
                    showToast('您今天已经为该项目投票');
                    return;
                }
                
                this.classList.add('voted');
                this.innerHTML = '<i class="fas fa-check"></i> 已投票';
                
                // 更新热度
                const heatPercentage = card.querySelector('.heat-percentage');
                const heatProgress = card.querySelector('.heat-progress');
                
                if (heatPercentage && heatProgress) {
                    let currentHeat = parseInt(heatPercentage.textContent);
                    let newHeat = Math.min(currentHeat + 1, 100);
                    
                    heatPercentage.textContent = `${newHeat}%`;
                    heatProgress.style.width = `${newHeat}%`;
                    
                    // 如果热度达到95%以上，添加即将达标标签
                    if (newHeat >= 95) {
                        const badges = card.querySelector('.project-badges');
                        
                        if (badges && !badges.querySelector('.badge-almost')) {
                            const almostBadge = document.createElement('span');
                            almostBadge.className = 'badge badge-almost';
                            almostBadge.textContent = '即将达标';
                            badges.appendChild(almostBadge);
                        }
                    }
                }
                
                // 显示提示
                showToast('投票成功！项目热度+1');
            });
        }
    });
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
 * 初始化搜索功能
 */
function initSearch() {
    const searchBox = document.querySelector('.search-box');
    
    if (!searchBox) return;
    
    const searchInput = searchBox.querySelector('input');
    const searchButton = searchBox.querySelector('button');
    
    // 点击搜索按钮
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value.trim());
    });
    
    // 按回车键搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value.trim());
        }
    });
}

/**
 * 执行搜索
 */
function performSearch(query) {
    if (!query) return;
    
    // 获取所有项目卡片
    const projectCards = document.querySelectorAll('.rwa-project-card');
    let matchCount = 0;
    
    // 重置之前的高亮
    document.querySelectorAll('.highlight').forEach(el => {
        el.outerHTML = el.textContent;
    });
    
    // 搜索并高亮匹配内容
    projectCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('.project-desc').textContent.toLowerCase();
        const category = card.querySelector('.project-category').textContent.toLowerCase();
        const searchQuery = query.toLowerCase();
        
        if (title.includes(searchQuery) || desc.includes(searchQuery) || category.includes(searchQuery)) {
            card.style.display = '';
            matchCount++;
            
            // 高亮匹配文本
            highlightText(card.querySelector('h3'), searchQuery);
            highlightText(card.querySelector('.project-desc'), searchQuery);
        } else {
            card.style.display = 'none';
        }
    });
    
    // 显示搜索结果提示
    let resultMsg = document.querySelector('.search-result-msg');
    
    if (!resultMsg) {
        resultMsg = document.createElement('div');
        resultMsg.className = 'search-result-msg';
        document.querySelector('.section-header').after(resultMsg);
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .search-result-msg {
                margin-bottom: 20px;
                padding: 10px 15px;
                background-color: var(--color-bg-light);
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .highlight {
                background-color: rgba(255, 193, 7, 0.3);
                padding: 0 2px;
                border-radius: 2px;
            }
        `;
        document.head.appendChild(style);
    }
    
    if (matchCount > 0) {
        resultMsg.innerHTML = `
            <div>搜索"${query}"的结果: 找到 ${matchCount} 个项目</div>
            <button class="btn btn-sm btn-outline clear-search">清除搜索</button>
        `;
    } else {
        resultMsg.innerHTML = `
            <div>没有找到与"${query}"相关的项目</div>
            <button class="btn btn-sm btn-outline clear-search">清除搜索</button>
        `;
    }
    
    resultMsg.style.display = 'flex';
    
    // 清除搜索按钮点击事件
    const clearBtn = resultMsg.querySelector('.clear-search');
    clearBtn.addEventListener('click', function() {
        // 清空搜索框
        document.querySelector('.search-box input').value = '';
        
        // 显示所有项目
        projectCards.forEach(card => {
            card.style.display = '';
        });
        
        // 移除高亮
        document.querySelectorAll('.highlight').forEach(el => {
            el.outerHTML = el.textContent;
        });
        
        // 隐藏搜索结果提示
        resultMsg.style.display = 'none';
    });
}

/**
 * 高亮文本
 */
function highlightText(element, query) {
    if (!element) return;
    
    const text = element.textContent;
    const regex = new RegExp(query, 'gi');
    
    if (regex.test(text)) {
        element.innerHTML = text.replace(regex, match => `<span class="highlight">${match}</span>`);
    }
}

/**
 * 初始化加载更多功能
 */
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.view-more-container .btn');
    
    if (!loadMoreBtn) return;
    
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

/**
 * 加载更多项目
 */
function loadMoreProjects() {
    // 模拟新项目数据
    const newProjects = [
        {
            image: 'https://i.imgur.com/9XcXAiL.jpg',
            title: '魔法学院',
            category: '角色扮演',
            stage: 'Alpha测试',
            desc: '一款以魔法学院为背景的角色扮演游戏，玩家将扮演一名魔法学徒，学习各种魔法，解开学院的秘密。',
            heat: 62,
            followers: 2.1,
            comments: 98,
            badges: []
        },
        {
            image: 'https://i.imgur.com/dKvZGxS.jpg',
            title: '赛车传奇',
            category: '竞速',
            stage: 'Beta测试',
            desc: '一款逼真的赛车模拟游戏，拥有精确的物理引擎和真实的赛道，让玩家体验专业赛车的刺激。',
            heat: 78,
            followers: 3.4,
            comments: 145,
            badges: ['trending']
        },
        {
            image: 'https://i.imgur.com/pSVVW7K.jpg',
            title: '像素冒险',
            category: '动作冒险',
            stage: '概念阶段',
            desc: '一款复古风格的像素冒险游戏，融合了现代游戏机制，玩家将探索充满谜题和挑战的世界。',
            heat: 41,
            followers: 1.5,
            comments: 67,
            badges: ['new']
        }
    ];
    
    const projectsGrid = document.querySelector('.rwa-projects-grid');
    
    // 创建并添加新项目卡片
    newProjects.forEach(project => {
        // 创建项目卡片元素
        const card = document.createElement('div');
        card.className = 'rwa-project-card';
        
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
                        badgeText = '新入驻';
                        break;
                    case 'trending':
                        badgeClass = 'badge-trending';
                        badgeText = '趋势';
                        break;
                    case 'almost':
                        badgeClass = 'badge-almost';
                        badgeText = '即将达标';
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
            <div class="project-info">
                <h3><a href="project-detail.html">${project.title}</a></h3>
                <div class="project-meta">
                    <span class="project-category">${project.category}</span>
                    <span class="project-stage">${project.stage}</span>
                </div>
                <p class="project-desc">${project.desc}</p>
                <div class="project-stats">
                    <div class="heat-meter">
                        <div class="heat-label">热度</div>
                        <div class="heat-bar">
                            <div class="heat-progress" style="width: ${project.heat}%;"></div>
                        </div>
                        <div class="heat-percentage">${project.heat}%</div>
                    </div>
                    <div class="project-data">
                        <div class="data-item">
                            <i class="fas fa-user"></i>
                            <span>${project.followers}k 关注</span>
                        </div>
                        <div class="data-item">
                            <i class="fas fa-comment"></i>
                            <span>${project.comments} 评论</span>
                        </div>
                    </div>
                </div>
                <div class="project-actions">
                    <button class="btn btn-outline"><i class="fas fa-heart"></i> 关注</button>
                    <button class="btn btn-primary"><i class="fas fa-fire"></i> 投票支持</button>
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
    
    // 初始化新添加卡片的交互
    initProjectCards();
    initHeatBars();
    
    // 如果已经加载了足够多的项目，可以隐藏加载更多按钮
    const totalProjects = document.querySelectorAll('.rwa-project-card').length;
    const loadMoreBtn = document.querySelector('.view-more-container .btn');
    
    if (totalProjects >= 12) { // 假设最多显示12个项目
        loadMoreBtn.textContent = '已加载全部';
        loadMoreBtn.disabled = true;
    }
}