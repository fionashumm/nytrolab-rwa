/**
 * 项目详情页脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏效果
    initNavbar();
    
    // 初始化媒体切换
    initMediaGallery();
    
    // 初始化热度动画
    initHeatAnimation();
    
    // 初始化评论功能
    initComments();
    
    // 初始化支持选项交互
    initSupportTiers();
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
 * 初始化媒体画廊
 */
function initMediaGallery() {
    const mainMedia = document.querySelector('.project-media-main img');
    const videoButton = document.querySelector('.media-play-button');
    const thumbs = document.querySelectorAll('.media-thumb');
    
    // 缩略图点击切换主图
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // 移除所有缩略图的active类
            thumbs.forEach(t => t.classList.remove('active'));
            
            // 给当前点击的缩略图添加active类
            this.classList.add('active');
            
            // 获取缩略图的数据
            const imgSrc = this.querySelector('img').getAttribute('src');
            const isVideo = this.dataset.type === 'video';
            
            // 更新主媒体
            mainMedia.setAttribute('src', imgSrc);
            
            // 显示或隐藏视频播放按钮
            if (videoButton) {
                videoButton.style.display = isVideo ? 'flex' : 'none';
            }
        });
    });
    
    // 视频播放按钮点击事件
    if (videoButton) {
        videoButton.addEventListener('click', function() {
            const videoUrl = this.dataset.video;
            
            // 创建视频元素替换图片
            if (videoUrl) {
                const videoElement = document.createElement('video');
                videoElement.setAttribute('src', videoUrl);
                videoElement.setAttribute('controls', true);
                videoElement.setAttribute('autoplay', true);
                videoElement.style.width = '100%';
                videoElement.style.height = '100%';
                videoElement.style.objectFit = 'cover';
                
                const mediaMain = document.querySelector('.project-media-main');
                mediaMain.innerHTML = '';
                mediaMain.appendChild(videoElement);
            }
        });
    }
}

/**
 * 初始化热度动画
 */
function initHeatAnimation() {
    const heatLevel = document.querySelector('.heat-level');
    
    if (heatLevel) {
        // 获取热度值
        const heatValue = parseInt(document.querySelector('.heat-value').textContent);
        const maxHeat = 100;
        
        // 计算热度百分比
        const heatPercent = Math.min(heatValue / maxHeat * 100, 100);
        
        // 设置热度条宽度，添加动画效果
        setTimeout(() => {
            heatLevel.style.width = `${heatPercent}%`;
        }, 300);
        
        // 根据热度值改变颜色
        if (heatPercent < 30) {
            heatLevel.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        } else if (heatPercent < 70) {
            heatLevel.style.background = 'linear-gradient(90deg, #FFC107, #FF9800)';
        } else {
            heatLevel.style.background = 'linear-gradient(90deg, #FF5722, #F44336)';
        }
        
        // 添加热度增长动画
        animateHeatCounter(document.querySelector('.heat-value'), 0, heatValue);
    }
}

/**
 * 热度数字增长动画
 */
function animateHeatCounter(element, start, end) {
    if (!element) return;
    
    const duration = 1500;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const increment = (end - start) / totalFrames;
    
    let currentFrame = 0;
    let currentValue = start;
    
    const animate = () => {
        currentFrame++;
        currentValue += increment;
        
        element.textContent = Math.floor(currentValue);
        
        if (currentFrame < totalFrames) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = end;
        }
    };
    
    animate();
}

/**
 * 初始化评论功能
 */
function initComments() {
    const commentForm = document.querySelector('.comment-form');
    const commentsList = document.querySelector('.comments-list');
    const commentTextarea = document.querySelector('.comment-form textarea');
    const likeButtons = document.querySelectorAll('.btn-like');
    const replyButtons = document.querySelectorAll('.btn-reply');
    
    // 评论提交
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取评论内容
            const commentText = commentTextarea.value.trim();
            
            if (commentText) {
                // 模拟添加新评论
                addNewComment(commentText);
                
                // 清空评论框
                commentTextarea.value = '';
            }
        });
    }
    
    // 点赞功能
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const likeCount = this.querySelector('span');
            let count = parseInt(likeCount.textContent);
            
            if (this.classList.contains('liked')) {
                // 取消点赞
                this.classList.remove('liked');
                count--;
            } else {
                // 添加点赞
                this.classList.add('liked');
                count++;
            }
            
            likeCount.textContent = count;
        });
    });
    
    // 回复功能
    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const commentId = this.closest('.comment-item').dataset.id;
            const username = this.closest('.comment-item').querySelector('h4').textContent.split(' ')[0];
            
            // 将回复信息添加到评论框
            commentTextarea.value = `@${username} `;
            commentTextarea.focus();
            
            // 滚动到评论框
            commentTextarea.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/**
 * 添加新评论
 */
function addNewComment(text) {
    const commentsList = document.querySelector('.comments-list');
    
    if (!commentsList) return;
    
    // 创建新评论元素
    const newComment = document.createElement('div');
    newComment.className = 'comment-item';
    newComment.dataset.id = 'new-' + Date.now();
    
    // 获取当前日期
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    
    // 设置评论HTML
    newComment.innerHTML = `
        <div class="comment-avatar">
            <img src="https://i.imgur.com/RzHm8Vt.jpg" alt="用户头像">
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <h4>当前用户</h4>
                <div class="comment-date">${dateStr}</div>
            </div>
            <p>${text}</p>
            <div class="comment-actions">
                <button class="btn-like"><i class="fas fa-heart"></i> <span>0</span></button>
                <button class="btn-reply"><i class="fas fa-reply"></i> 回复</button>
            </div>
        </div>
    `;
    
    // 添加新评论到列表顶部
    commentsList.insertBefore(newComment, commentsList.firstChild);
    
    // 添加点赞和回复事件
    const likeBtn = newComment.querySelector('.btn-like');
    const replyBtn = newComment.querySelector('.btn-reply');
    
    likeBtn.addEventListener('click', function() {
        const likeCount = this.querySelector('span');
        let count = parseInt(likeCount.textContent);
        
        if (this.classList.contains('liked')) {
            this.classList.remove('liked');
            count--;
        } else {
            this.classList.add('liked');
            count++;
        }
        
        likeCount.textContent = count;
    });
    
    replyBtn.addEventListener('click', function() {
        const commentTextarea = document.querySelector('.comment-form textarea');
        commentTextarea.value = `@当前用户 `;
        commentTextarea.focus();
        commentTextarea.scrollIntoView({ behavior: 'smooth' });
    });
    
    // 添加动画效果
    newComment.style.opacity = '0';
    newComment.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        newComment.style.transition = 'all 0.3s ease';
        newComment.style.opacity = '1';
        newComment.style.transform = 'translateY(0)';
    }, 10);
}

/**
 * 初始化支持选项交互
 */
function initSupportTiers() {
    const supportTiers = document.querySelectorAll('.support-tier');
    const supportButtons = document.querySelectorAll('.support-tier .btn-primary');
    
    // 支持选项悬停效果
    supportTiers.forEach(tier => {
        tier.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        tier.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
    });
    
    // 支持按钮点击事件
    supportButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tierName = this.closest('.support-tier').querySelector('h4').textContent;
            const tierPrice = this.closest('.support-tier').querySelector('.tier-price').textContent;
            
            // 模拟支持操作，实际项目中应跳转到支付页面
            alert(`您选择了 ${tierName} 支持选项，金额为 ${tierPrice}。\n实际项目中将跳转到支付页面。`);
        });
    });
    
    // 初始化进度条动画
    const progressBars = document.querySelectorAll('.progress-bar-fill');
    
    progressBars.forEach(bar => {
        const percent = bar.dataset.percent || '0';
        
        setTimeout(() => {
            bar.style.width = `${percent}%`;
        }, 300);
    });
}