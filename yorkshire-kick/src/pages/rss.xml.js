import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
export async function GET(context) {
  const posts = (await getCollection("posts", ({ data }) => !data.draft)).sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
  return rss({ title: "Daft-a-Peth", description: "Football, betting, golf, food, life and other nonsense.", site: context.site, items: posts.map((post) => ({ title: post.data.title, description: post.data.description, pubDate: post.data.published, link: `/posts/${post.id}/` })) });
}
