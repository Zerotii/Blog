const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'posts');
const outputDirectory = path.join(process.cwd(), 'public', 'data');

if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

function generateBlogData () {
  if (!fs.existsSync(postsDirectory)) {
    console.log('Posts directory not found');
    return;
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      // Simple markdown to HTML conversion
      let contentHtml = matterResult.content
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>')
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/`(.*?)`/gim, '<code>$1</code>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/^(?!<[h|l|c|d|b])/gim, '<p>')
        .replace(/(?![h|l|c|d|b]>$)/gim, '</p>');

      // Clean up extra paragraph tags
      contentHtml = contentHtml
        .replace(/<p><\/p>/gim, '')
        .replace(/<p>(<h\d+>.*?<\/h\d+>)<\/p>/gim, '$1')
        .replace(/<p>(<li>.*?<\/li>)<\/p>/gim, '<ul>$1</ul>')
        .replace(/<p>(<pre>.*?<\/pre>)<\/p>/gim, '$1');
      const wordCount = matterResult.content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);

      return {
        slug,
        content: contentHtml,
        readingTime: `${readingTime} min read`,
        ...matterResult.data,
      };
    });

  // Sort posts by date
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Generate all posts data
  const allPostsData = posts.map(post => {
    const { content, ...metadata } = post;
    return metadata;
  });

  // Generate categories data
  const categoryMap = new Map();
  allPostsData.forEach(post => {
    if (post.category) {
      if (!categoryMap.has(post.category)) {
        categoryMap.set(post.category, []);
      }
      categoryMap.get(post.category).push(post);
    }
  });

  const categoriesData = Array.from(categoryMap.entries()).map(([name, posts]) => ({
    name,
    count: posts.length,
    posts,
  }));

  // Generate tags data
  const tagSet = new Set();
  allPostsData.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tagSet.add(tag));
    }
  });
  const tagsData = Array.from(tagSet).sort();

  // Save all posts data
  fs.writeFileSync(
    path.join(outputDirectory, 'posts.json'),
    JSON.stringify(allPostsData, null, 2)
  );

  // Save individual post data
  posts.forEach(post => {
    fs.writeFileSync(
      path.join(outputDirectory, `post-${post.slug}.json`),
      JSON.stringify(post, null, 2)
    );
  });

  // Save categories data
  fs.writeFileSync(
    path.join(outputDirectory, 'categories.json'),
    JSON.stringify(categoriesData, null, 2)
  );

  // Save tags data
  fs.writeFileSync(
    path.join(outputDirectory, 'tags.json'),
    JSON.stringify(tagsData, null, 2)
  );

  console.log(`Generated blog data: ${posts.length} posts, ${categoriesData.length} categories, ${tagsData.length} tags`);
}

generateBlogData();