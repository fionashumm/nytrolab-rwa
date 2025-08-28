/**
 * 公开信息页面脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏效果
    initNavbar();
    
    // 初始化信息标签切换
    initInfoTabs();
    
    // 初始化法律文件标签切换
    initLegalDocTabs();
    
    // 初始化筛选功能
    initFilters();
    
    // 初始化搜索功能
    initSearch();
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
 * 初始化信息标签切换
 */
function initInfoTabs() {
    const tabLinks = document.querySelectorAll('.info-tabs a');
    const infoSections = document.querySelectorAll('.info-section');
    
    // 点击标签切换内容
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有标签的active类
            tabLinks.forEach(tab => tab.classList.remove('active'));
            
            // 给当前点击的标签添加active类
            this.classList.add('active');
            
            // 获取目标内容区域的ID
            const targetId = this.getAttribute('href');
            
            // 隐藏所有内容区域
            infoSections.forEach(section => section.classList.remove('active-section'));
            
            // 显示目标内容区域
            document.querySelector(targetId).classList.add('active-section');
            
            // 平滑滚动到内容区域
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    
    // 处理URL中的锚点
    if (window.location.hash) {
        const hash = window.location.hash;
        const targetTab = document.querySelector(`.info-tabs a[href="${hash}"]`);
        
        if (targetTab) {
            targetTab.click();
        }
    }
}

/**
 * 初始化法律文件标签切换
 */
function initLegalDocTabs() {
    const tabButtons = document.querySelectorAll('.category-tabs .tab-btn');
    const docLists = document.querySelectorAll('.legal-doc-list');
    
    if (tabButtons.length === 0 || docLists.length === 0) return;
    
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // 给当前点击的按钮添加active类
            this.classList.add('active');
            
            // 隐藏所有文档列表
            docLists.forEach(list => list.classList.remove('active'));
            
            // 显示对应的文档列表
            docLists[index].classList.add('active');
        });
    });
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
            filterMenu.style.display = filterMenu.style.display === 'block' ? 'none' : 'block';
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
                
                // 应用筛选逻辑
                applyFilters();
            });
        });
        
        // 点击其他区域关闭筛选菜单
        document.addEventListener('click', function() {
            filterMenu.style.display = 'none';
        });
        
        filterMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}

/**
 * 应用筛选逻辑
 */
function applyFilters() {
    // 这里是筛选逻辑的示例实现
    // 实际项目中，可能需要根据后端API或本地数据进行筛选
    console.log('应用筛选...');
    
    // 获取当前活动的内容区域
    const activeSection = document.querySelector('.info-section.active-section');
    if (!activeSection) return;
    
    // 获取选中的筛选选项
    const selectedFilters = Array.from(
        activeSection.querySelectorAll('.filter-menu input:checked')
    ).map(input => input.parentElement.textContent.trim());
    
    // 检查是否选择了"全部"
    const isAllSelected = selectedFilters.includes('全部');
    
    // 根据不同的内容区域应用不同的筛选逻辑
    if (activeSection.id === 'platform-info') {
        const announcements = activeSection.querySelectorAll('.announcement-item');
        
        announcements.forEach(item => {
            const category = item.querySelector('.announcement-category').textContent.trim();
            
            if (isAllSelected || selectedFilters.includes(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    } 
    else if (activeSection.id === 'project-updates') {
        // 项目动态筛选逻辑
        // 实际项目中可能需要根据项目类型等进行筛选
    }
    
    // 可以根据需要添加其他内容区域的筛选逻辑
}

/**
 * 初始化搜索功能
 */
function initSearch() {
    const searchBoxes = document.querySelectorAll('.search-box');
    
    searchBoxes.forEach(box => {
        const input = box.querySelector('input');
        const button = box.querySelector('button');
        
        if (!input || !button) return;
        
        // 点击搜索按钮
        button.addEventListener('click', function() {
            performSearch(input.value.trim());
        });
        
        // 按回车键搜索
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(input.value.trim());
            }
        });
    });
}

/**
 * 执行搜索
 */
function performSearch(query) {
    if (!query) return;
    
    // 获取当前活动的内容区域
    const activeSection = document.querySelector('.info-section.active-section');
    if (!activeSection) return;
    
    console.log(`在${activeSection.id}中搜索: ${query}`);
    
    // 根据不同的内容区域应用不同的搜索逻辑
    if (activeSection.id === 'platform-info') {
        const announcements = activeSection.querySelectorAll('.announcement-item');
        let hasResults = false;
        
        announcements.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const content = item.querySelector('p').textContent.toLowerCase();
            const searchQuery = query.toLowerCase();
            
            if (title.includes(searchQuery) || content.includes(searchQuery)) {
                item.style.display = 'block';
                hasResults = true;
                
                // 高亮匹配文本（简单实现，实际项目可能需要更复杂的高亮逻辑）
                highlightText(item, searchQuery);
            } else {
                item.style.display = 'none';
            }
        });
        
        // 显示搜索结果提示
        let resultMsg = activeSection.querySelector('.search-result-msg');
        if (!resultMsg) {
            resultMsg = document.createElement('div');
            resultMsg.className = 'search-result-msg';
            activeSection.querySelector('.section-header').after(resultMsg);
        }
        
        resultMsg.textContent = hasResults ? 
            `搜索"${query}"的结果:` : 
            `没有找到与"${query}"相关的内容`;
        
        // 添加清除搜索按钮
        if (!activeSection.querySelector('.clear-search')) {
            const clearBtn = document.createElement('button');
            clearBtn.className = 'btn btn-outline clear-search';
            clearBtn.textContent = '清除搜索';
            clearBtn.addEventListener('click', function() {
                // 恢复所有项目显示
                announcements.forEach(item => {
                    item.style.display = 'block';
                    // 移除高亮
                    removeHighlight(item);
                });
                
                // 清空搜索框
                activeSection.querySelector('.search-box input').value = '';
                
                // 移除搜索结果提示和清除按钮
                resultMsg.remove();
                clearBtn.remove();
            });
            
            resultMsg.appendChild(clearBtn);
        }
    } 
    else if (activeSection.id === 'project-updates') {
        // 项目动态搜索逻辑
        // 实际项目中可能需要根据项目名称、更新内容等进行搜索
    }
    
    // 可以根据需要添加其他内容区域的搜索逻辑
}

/**
 * 高亮匹配文本
 */
function highlightText(element, query) {
    const title = element.querySelector('h3 a');
    const content = element.querySelector('p');
    
    if (title) {
        const originalTitle = title.textContent;
        const highlightedTitle = originalTitle.replace(
            new RegExp(query, 'gi'),
            match => `<span class="highlight">${match}</span>`
        );
        title.innerHTML = highlightedTitle;
    }
    
    if (content) {
        const originalContent = content.textContent;
        const highlightedContent = originalContent.replace(
            new RegExp(query, 'gi'),
            match => `<span class="highlight">${match}</span>`
        );
        content.innerHTML = highlightedContent;
    }
    
    // 添加高亮样式
    if (!document.getElementById('highlight-style')) {
        const style = document.createElement('style');
        style.id = 'highlight-style';
        style.textContent = '.highlight { background-color: rgba(255, 193, 7, 0.3); padding: 0 2px; border-radius: 2px; }';
        document.head.appendChild(style);
    }
}

/**
 * 移除高亮
 */
function removeHighlight(element) {
    const title = element.querySelector('h3 a');
    const content = element.querySelector('p');
    
    if (title && title.innerHTML.includes('<span class="highlight">')) {
        title.textContent = title.textContent;
    }
    
    if (content && content.innerHTML.includes('<span class="highlight">')) {
        content.textContent = content.textContent;
    }
}

/**
 * 加载更多项目动态
 */
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.querySelector('#project-updates .view-more-container .btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // 模拟加载更多项目动态
            loadMoreProjectUpdates();
        });
    }
});

/**
 * 模拟加载更多项目动态
 */
function loadMoreProjectUpdates() {
    const projectsGrid = document.querySelector('.projects-updates-grid');
    const loadMoreBtn = document.querySelector('#project-updates .view-more-container .btn');
    
    if (!projectsGrid || !loadMoreBtn) return;
    
    // 显示加载中状态
    loadMoreBtn.textContent = '加载中...';
    loadMoreBtn.disabled = true;
    
    // 模拟网络请求延迟
    setTimeout(() => {
        // 模拟新加载的项目动态数据
        const newProjects = [
            {
                image: 'https://i.imgur.com/9XcXAiL.jpg',
                title: '龙之谷',
                date: '2023-05-18',
                updateTitle: '新角色设计稿公布',
                content: '我们很高兴向大家展示游戏中的新角色"暗夜精灵"的设计稿。这个角色将在游戏的第二章中登场，拥有独特的暗影魔法和高机动性...',
            },
            {
                image: 'https://i.imgur.com/dKvZGxS.jpg',
                title: '荒野求生',
                date: '2023-05-15',
                updateTitle: '生存系统优化完成',
                content: '经过多次测试和调整，我们终于完成了生存系统的优化。现在玩家需要更加注意食物、水和温度三项基本生存需求，使游戏体验更加真实...',
            },
            {
                image: 'https://i.imgur.com/JQTXrG2.jpg',
                title: '未来都市',
                date: '2023-05-12',
                updateTitle: '城市建筑风格确定',
                content: '在参考了大量赛博朋克和未来主义风格的作品后，我们最终确定了游戏中城市的建筑风格。这种风格融合了高科技元素和复古美学...',
            }
        ];
        
        // 创建并添加新的项目动态卡片
        newProjects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-update-card';
            card.innerHTML = `
                <div class="project-update-header">
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-update-meta">
                        <h3>${project.title}</h3>
                        <span class="update-date">${project.date}</span>
                    </div>
                </div>
                <div class="project-update-content">
                    <h4>${project.updateTitle}</h4>
                    <p>${project.content}</p>
                    <a href="#" class="btn-read-more">查看完整更新</a>
                </div>
            `;
            
            // 添加到网格中，并设置初始透明度为0
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            projectsGrid.appendChild(card);
            
            // 添加过渡效果
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        });
        
        // 恢复按钮状态
        loadMoreBtn.textContent = '加载更多';
        loadMoreBtn.disabled = false;
        
        // 如果已经加载了足够多的项目，可以隐藏加载更多按钮
        const totalProjects = document.querySelectorAll('.project-update-card').length;
        if (totalProjects >= 12) { // 假设最多显示12个项目
            loadMoreBtn.textContent = '已加载全部';
            loadMoreBtn.disabled = true;
        }
    }, 1500); // 模拟1.5秒的加载时间
}