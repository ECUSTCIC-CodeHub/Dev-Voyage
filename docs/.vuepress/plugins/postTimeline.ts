import fs from 'fs';
import path from 'path';

interface TimelineConfig {
  inputPath: string;
  jsonFileName?: string;
}

/**
 * 文章时间线插件
 * @param configs 时间线配置，可以是单个配置或配置数组
 */
const postTimelinePlugin = (configs: TimelineConfig | TimelineConfig[]) => {
  // 确保configs是数组格式
  const configArray = Array.isArray(configs) ? configs : [configs];
  
  // JSON文件存储目录
  const jsonDir = path.join(process.cwd(), "docs",'.vuepress', 'public', 'timelines');

  // 时间线处理逻辑（提取为单独函数，方便复用）
  const processTimelines = (app: any) => {
    // 创建JSON存储目录
    if (!fs.existsSync(jsonDir)) {
      fs.mkdirSync(jsonDir, { recursive: true });
      console.log('创建时间线JSON存储目录:', jsonDir);
    }

    // 从 VuePress app 对象获取 base 路径
    const getBasePath = (): string => {
      // VuePress 2.x 的 base 配置在 app.options.base 或 app.siteData.base
      const base = app.options?.base || app.siteData?.base || '/'

      return ""
      return base.endsWith('/') ? base : base + '/'
    }

    console.log('=== 文章时间线插件开始运行 ===');
    console.log('配置项:', configArray);
    console.log('Base 路径:', getBasePath());
    console.log('总页面数:', app.pages.length);
    
    configArray.forEach((config, index) => {
      console.log(`\n处理时间线 ${index + 1}:`);
      console.log('输入路径:', config.inputPath);

      
      const {
        inputPath,
        jsonFileName = `timeline-${index + 1}.json`
      } = config;
      const title = '文章时间线';

      // 筛选文章
      const filteredPages = app.pages.filter((p: any) => 
        p.filePathRelative?.startsWith(inputPath)
      );
      console.log('筛选出的文章数量:', filteredPages.length);
      console.log('筛选出的文章:', filteredPages.map((p: any) => p.filePathRelative));
      
      // 安全的日期处理函数
      const safeDateConvert = (dateValue: any): string => {
        if (!dateValue) return 'Unknown';
        
        // 尝试创建 Date 对象
        const date = new Date(dateValue);
        
        // 检查 Date 对象是否有效
        if (isNaN(date.getTime())) {
          return 'Unknown';
        }
        
        // 返回 ISO 格式的日期部分
        return date.toISOString().split('T')[0];
      };
      
      // 安全的路径转换函数 - 统一处理逻辑
      const getPostPath = (page: any): string => {
        const base = getBasePath()
        
        // 1. 优先使用 permalink
        if (page.frontmatter && page.frontmatter.permalink) {
          // 如果 permalink 以 / 开头，直接返回（VuePress 会自动处理 base）
          if (page.frontmatter.permalink.startsWith('/')) {
            return base.slice(0, -1) + page.frontmatter.permalink
          }
          // 否则拼接 base
          return base + page.frontmatter.permalink
        }
        
        // 2. 使用 filePathRelative 推断路径
        if (page.filePathRelative) {
          let path = page.filePathRelative
            .replace(/^docs\//, '')  // 移除 docs/ 前缀
            .replace(/\.md$/, '')    // 移除 .md 后缀
            .replace(/\/index$/, '') // 移除 /index
          
          // 处理中文路径编码
          if (path.includes('/')) {
            const parts = path.split('/')
            const fileName = parts.pop()
            const dir = parts.map((part: string) => 
              encodeURI(part).replace(/%20/g, ' ')
            ).join('/')
            path = fileName ? `${dir}/${fileName}` : dir
          } else {
            path = encodeURI(path).replace(/%20/g, ' ')
          }
          
          return base + path
        }
        
        // 3. 后备方案：从 page.path 推断（移除 .html 和 base 前缀）
        if (page.path) {
          // 移除 .html 后缀
          let path = page.path.replace(/\.html$/, '')
          
          // 如果以 base 开头，移除 base
          if (path.startsWith(base)) {
            path = path.substring(base.length - 1) // 保留开头的 /
          }
          
          return path
        }
        
        return '/unknown'
      }

      const posts = filteredPages
         .map((p: any) => ({
           title: p.title || p.frontmatter.title || p.filePathRelative || '无标题',
           // 创建时间
           date: p.frontmatter.createTime || p.frontmatter.date || 
                 (p.date ? new Date(p.date).toISOString().split('T')[0] : 'Unknown'),
           // 最后修改时间
           updateTime: p.frontmatter.updateTime || p.frontmatter.lastModified || 
                      (p.lastUpdated ? new Date(p.lastUpdated).toISOString().split('T')[0] : 'Unknown'),
           // 作者
           author: p.frontmatter.author || p.frontmatter.writer || '未知作者',
           // 摘要
           excerpt: p.frontmatter.excerpt || p.frontmatter.summary || '',
           // 路径 - 使用安全的路径获取函数
           path: getPostPath(p)
         }))
         .sort((a: any, b: any) => {
             // 安全的日期解析用于排序
             const getTimeSafe = (dateStr: string): number => {
               if (dateStr === 'Unknown') return 0;
               const time = new Date(dateStr).getTime();
               return isNaN(time) ? 0 : time;
             };
             
             const dateA = getTimeSafe(a.date);
             const dateB = getTimeSafe(b.date);
             return dateB - dateA;
         });
          
      // 生成JSON数据
      const timelineData = {
        title,
        posts
      };
      
      // 写入JSON文件
      const jsonPath = path.join(jsonDir, jsonFileName);
      fs.writeFileSync(jsonPath, JSON.stringify(timelineData, null, 2), 'utf-8');
      console.log('生成的时间线JSON文件:', jsonPath);
      console.log('生成的时间线数据:', timelineData);
    });
    
    console.log('=== 文章时间线插件运行结束 ===');
  };

  return {
    name: 'post-timeline-plugin',
    
    // 在插件初始化时执行
    onInitialized() {
      console.log('文章时间线插件: 初始化完成');
    },
    
    // 使用onPrepared钩子确保所有页面都已加载完成
    onPrepared(app: any) {
      console.log('文章时间线插件: 开始处理时间线（onPrepared）');
      processTimelines(app);
    },
    
    // 当文件更新时执行 - 使用 fs.watch 监听文件变更
    onWatched: (app: any, watchers: any) => {
      console.log('文章时间线插件: 设置文件监听器');
      
      // 为每个配置的输入路径设置文件监听
      configArray.forEach((config) => {
        // 直接使用配置的 inputPath，因为它是相对于 docs 目录的
        const watchPath = path.join(process.cwd(), 'docs', config.inputPath)
        
        // 检查路径是否存在
        if (fs.existsSync(watchPath)) {
          // 使用 fs.watch 监听目录变化
          const watcher = fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
            if (filename) {
              console.log(`\n📁 文件变更检测: ${filename} (${eventType})`)
              console.log('🔄 重新生成时间线数据...')
              
              // 延迟一小段时间，确保 VuePress 已处理完文件变更
              setTimeout(() => {
                try {
                  processTimelines(app)
                  console.log('✅ 时间线数据已更新\n')
                } catch (error) {
                  console.error('❌ 更新时间线失败:', error)
                }
              }, 500)
            }
          })
          
          // 保存监听器引用，避免被垃圾回收
          if (!app.$timelineWatchers) {
            app.$timelineWatchers = []
          }
          app.$timelineWatchers.push(watcher)
          
          console.log(`✅ 已设置监听器: ${watchPath}`)
        } else {
          console.warn(`⚠️ 警告: 监听路径不存在: ${watchPath}`)
        }
      })
    },
    
    // 在构建完成后执行
    onBuildEnd: (app: any) => {
      console.log('文章时间线插件: 构建完成，最后确认时间线JSON');
      processTimelines(app);
    },
  };
};

export default postTimelinePlugin;
