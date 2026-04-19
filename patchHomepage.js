const fs = require('fs');

const uiPath = 'frontend/src/app/page.tsx';
let uiContent = fs.readFileSync(uiPath, 'utf8');

if (!uiContent.includes('latestBuzzNews')) {
  // Add new states
  uiContent = uiContent.replace(
    'const [allNews, setAllNews] = useState<MainSiteNewsItem[]>([]);',
    'const [allNews, setAllNews] = useState<MainSiteNewsItem[]>([]);\n  const [latestBuzzNews, setLatestBuzzNews] = useState<MainSiteNewsItem[]>([]);\n  const [tvNews, setTvNews] = useState<MainSiteNewsItem[]>([]);'
  );

  // Update Promise.all
  uiContent = uiContent.replace(
    `const [fetchedCats, fetchedAllNews] = await Promise.all([
          listCategories(),
          getAllPublishedNews(10)
        ]);`,
    `const [fetchedCats, fetchedAllNews, fetchedLatest, fetchedTv] = await Promise.all([
          listCategories(),
          getAllPublishedNews(10),
          getNewsByCategory("Latest Buzz", 4),
          getNewsByCategory("Manav Rachna TV", 2)
        ]);`
  );

  // Set new states
  uiContent = uiContent.replace(
    'setAllNews(fetchedAllNews);',
    'setAllNews(fetchedAllNews);\n        setLatestBuzzNews(fetchedLatest);\n        setTvNews(fetchedTv);'
  );

  // Update sideNews and multimediaNews declarations
  uiContent = uiContent.replace(
    'const sideNews = allNews.slice(1, 5);',
    'const sideNews = latestBuzzNews.length > 0 ? latestBuzzNews : allNews.slice(1, 5);'
  );
  uiContent = uiContent.replace(
    'const multimediaNews = allNews.slice(5, 7);',
    'const multimediaNews = tvNews.length > 0 ? tvNews : allNews.slice(5, 7);'
  );
  
  fs.writeFileSync(uiPath, uiContent);
  console.log('Fixed page.tsx');
} else {
  console.log('Already fixed or not found.');
}
