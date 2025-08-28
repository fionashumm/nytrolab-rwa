document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');
const navMenu = document.querySelector('.nav-menu');

// 处理主导航菜单
if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // 点击菜单项后关闭菜单
    const menuItems = mainNav.querySelectorAll('a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target) && mainNav.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// 处理其他页面的导航菜单
if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // 点击菜单项后关闭菜单
    const menuItems = navMenu.querySelectorAll('a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}
    
    // 黑神话：悟空轮播图功能
    const wukongSlider = document.querySelector('.wukong-slider');
    if (wukongSlider) {
        const slides = document.querySelectorAll('.wukong-slide');
        const dots = document.querySelectorAll('.wukong-dot');
        const prevBtn = document.querySelector('.wukong-prev');
        const nextBtn = document.querySelector('.wukong-next');
        let currentSlide = 0;
        let slideInterval;
        
        // 显示指定幻灯片
        function showSlide(index) {
            // 处理索引边界
            if (index >= slides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }
            
            // 更新幻灯片显示
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }
        
        // 自动轮播
        function startSlideShow() {
            slideInterval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000);
        }
        
        // 停止自动轮播
        function stopSlideShow() {
            clearInterval(slideInterval);
        }
        
        // 绑定点击事件
        prevBtn.addEventListener('click', () => {
            stopSlideShow();
            showSlide(currentSlide - 1);
            startSlideShow();
        });
        
        nextBtn.addEventListener('click', () => {
            stopSlideShow();
            showSlide(currentSlide + 1);
            startSlideShow();
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopSlideShow();
                showSlide(index);
                startSlideShow();
            });
        });
        
        // 鼠标悬停时暂停轮播
        wukongSlider.addEventListener('mouseenter', stopSlideShow);
        wukongSlider.addEventListener('mouseleave', startSlideShow);
        
        // 启动轮播
        startSlideShow();
    }
    
    // 滚动时导航栏效果
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
            
            if (scrollTop > lastScrollTop) {
                // 向下滚动
                header.classList.add('hidden');
            } else {
                // 向上滚动
                header.classList.remove('hidden');
            }
        } else {
            header.classList.remove('scrolled');
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 项目热度动画效果
    const heatIndexElements = document.querySelectorAll('.heat-index');
    
    heatIndexElements.forEach(element => {
        const heatValue = parseInt(element.textContent.match(/\d+/)[0]);
        
        if (heatValue > 90) {
            // 添加脉动动画效果
            element.classList.add('pulse');
        }
    });
    
    // 轮播图功能（如果存在）
    const sliders = document.querySelectorAll('.stories-slider');
    
    sliders.forEach(slider => {
        // 这里可以添加轮播图逻辑
        // 简单示例，实际项目可能需要更复杂的轮播库
        const slides = slider.querySelectorAll('.story-card');
        let currentSlide = 0;
        
        // 如果有多个幻灯片，才需要轮播功能
        if (slides.length > 1) {
            // 创建导航点
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'slider-dots';
            
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = 'slider-dot';
                if (index === 0) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    goToSlide(index);
                });
                
                dotsContainer.appendChild(dot);
            });
            
            slider.appendChild(dotsContainer);
            
            // 创建前进/后退按钮
            const prevButton = document.createElement('button');
            prevButton.className = 'slider-nav prev';
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevButton.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
            });
            
            const nextButton = document.createElement('button');
            nextButton.className = 'slider-nav next';
            nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextButton.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
            });
            
            slider.appendChild(prevButton);
            slider.appendChild(nextButton);
            
            // 自动轮播
            let slideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
            
            // 鼠标悬停时暂停轮播
            slider.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            slider.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    goToSlide(currentSlide + 1);
                }, 5000);
            });
            
            function goToSlide(index) {
                // 处理循环
                if (index < 0) index = slides.length - 1;
                if (index >= slides.length) index = 0;
                
                // 更新当前幻灯片索引
                currentSlide = index;
                
                // 更新幻灯片位置
                slides.forEach((slide, i) => {
                    slide.style.transform = `translateX(${100 * (i - index)}%)`;
                });
                
                // 更新导航点
                const dots = dotsContainer.querySelectorAll('.slider-dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
            
            // 初始化幻灯片位置
            slides.forEach((slide, i) => {
                slide.style.transform = `translateX(${100 * i}%)`;
            });
        }
    });
    
    // 表单验证
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // 如果是邮箱订阅表单，验证邮箱格式
            const emailField = form.querySelector('input[type="email"]');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value.trim())) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (!isValid) {
                event.preventDefault();
                // 可以添加错误提示
            } else if (form.classList.contains('subscribe-form')) {
                // 如果是订阅表单，阻止默认提交并显示成功消息
                event.preventDefault();
                const input = form.querySelector('input');
                const button = form.querySelector('button');
                const originalButtonText = button.textContent;
                
                // 禁用输入和按钮，显示加载状态
                input.disabled = true;
                button.disabled = true;
                button.textContent = '处理中...';
                
                // 模拟API调用
                setTimeout(() => {
                    // 创建成功消息
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = '订阅成功！感谢您的关注。';
                    
                    // 替换表单为成功消息
                    form.innerHTML = '';
                    form.appendChild(successMessage);
                }, 1000);
            }
        });
    });
    
    // 添加项目卡片悬停效果
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
});