/* =========================================================
   张伟 (Alex Zhang) · 个人主页交互脚本
   纯原生 JavaScript，无任何依赖
   功能：导航滚动态 / 移动端菜单 / 滚动高亮 / 打字机 /
        浮现动画 / 技能进度条 / 数字滚动 / 表单校验 / 回到顶部
   ========================================================= */
(() => {
  'use strict';

  const reduceMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 导航栏滚动态 + 回到顶部按钮 ---------- */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');

  const onWindowScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 480);
  };

  window.addEventListener('scroll', onWindowScroll, { passive: true });
  onWindowScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 2. 移动端菜单 ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  const closeMenu = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const willOpen = !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', willOpen);
      navToggle.classList.toggle('open', willOpen);
      navToggle.setAttribute('aria-expanded', String(willOpen));
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  /* ---------- 3. 滚动高亮（Scrollspy） ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((section) => spy.observe(section));
  }

  // 页面滚到最底部时，强制高亮最后一个导航项（联系我）
  window.addEventListener(
    'scroll',
    () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom && sections.length) {
        setActiveLink(sections[sections.length - 1].id);
      }
    },
    { passive: true }
  );

  /* ---------- 4. Hero 打字机效果 ---------- */
  const typeEl = document.getElementById('typing');
  if (typeEl) {
    const roles = [
      '机械工程专业学生',
      'Python / 机器学习学习者',
      '全栈 Web 开发学习者',
      '嵌入式 · PCB 方向探索中',
      '正在寻找实习机会',
    ];

    if (reduceMotion) {
      typeEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const word = roles[roleIndex];
        charIndex += deleting ? -1 : 1;
        typeEl.textContent = word.slice(0, charIndex);

        let delay = deleting ? 55 : 130;
        if (!deleting && charIndex === word.length) {
          delay = 2000; // 整词停留
          deleting = true;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          delay = 450;
        }
        window.setTimeout(tick, delay);
      };
      tick();
    }
  }

  /* ---------- 5. 元素进入视口时的浮现动画 ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- 6. 技能进度条 + 数字滚动 ---------- */
  const animateCount = (el) => {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1400;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const statsEl = document.querySelector('.about__stats');
    if (statsEl) {
      const countObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target
                .querySelectorAll('.stat__num[data-count]')
                .forEach(animateCount);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      countObserver.observe(statsEl);
    }

    document.querySelectorAll('.skill-card').forEach((card) => {
      const barObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      barObserver.observe(card);
    });
  } else {
    // 兜底：不支持 IntersectionObserver 时直接展示最终状态
    document.querySelectorAll('.skill-card').forEach((card) => {
      card.classList.add('in-view');
    });
    document.querySelectorAll('.stat__num[data-count]').forEach(animateCount);
  }

  /* ---------- 7. 联系表单（演示模式） ---------- */
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  let toastTimer = null;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 4000);
  };

  if (form) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fields = [
      { input: document.getElementById('name'), validate: (v) => v.trim().length >= 2 },
      { input: document.getElementById('email'), validate: (v) => emailPattern.test(v.trim()) },
      { input: document.getElementById('message'), validate: (v) => v.trim().length >= 10 },
    ];

    fields.forEach(({ input }) => {
      if (!input) return;
      input.addEventListener('input', () => {
        const field = input.closest('.form-field');
        if (field) field.classList.remove('error');
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      let firstInvalid = null;
      fields.forEach(({ input, validate }) => {
        if (!input) return;
        const valid = validate(input.value);
        const field = input.closest('.form-field');
        if (field) field.classList.toggle('error', !valid);
        if (!valid && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // ✏️ 演示模式：GitHub Pages 是静态站点，无法直接发送邮件。
      // 接入 Formspree 等服务后替换此段逻辑（见 README「让表单真正收到邮件」）。
      form.reset();
      showToast('🎉 消息发送成功，我会尽快回复你！（当前为演示模式）');
    });
  }

  /* ---------- 8. 页脚年份自动更新 ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 9. 邮箱防爬混淆（点击显示 / 一键复制） ---------- */
  // 地址拆成碎片存储，网页源码里不会出现完整邮箱，爬虫正则抓不到
  const MAIL_BOXES = [
    { user: '3245314637', domain: ['qq', 'com'] },
    { user: 'hzhu799', domain: ['gmail', 'com'] },
  ];
  const buildEmail = (box) => box.user + '@' + box.domain.join('.');

  const copyText = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      // 剪贴板 API 不可用时走下面的降级方案
    }
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (err) {
      ok = false;
    }
    helper.remove();
    return ok;
  };

  // 信息流图标按钮（首页 / 联系区）：点击即复制邮箱
  document.querySelectorAll('[data-email-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const box = btn.getAttribute('data-email-copy') === 'gmail'
        ? MAIL_BOXES[1]
        : MAIL_BOXES[0];
      const addr = buildEmail(box);
      const ok = await copyText(addr);
      showToast(ok ? '📧 邮箱已复制：' + addr : '复制失败，请通过 GitHub 联系我');
    });
  });

  // 「点击显示邮箱」：显示两个地址并附带复制按钮
  const emailGuard = document.getElementById('email-guard');
  const revealBtn = emailGuard ? emailGuard.querySelector('.email-reveal') : null;
  if (emailGuard && revealBtn) {
    revealBtn.addEventListener('click', () => {
      emailGuard.innerHTML = '';
      MAIL_BOXES.forEach((box) => {
        const addr = buildEmail(box);

        const line = document.createElement('span');
        line.className = 'email-line';

        const link = document.createElement('a');
        link.href = 'mailto:' + addr;
        link.textContent = addr;

        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = '复制';
        copyBtn.addEventListener('click', async () => {
          const ok = await copyText(addr);
          showToast(ok ? '📧 邮箱已复制：' + addr : '复制失败，请手动选择复制');
        });

        line.appendChild(link);
        line.appendChild(copyBtn);
        emailGuard.appendChild(line);
      });
    });
  }
})();
