'use server';

import { Client } from '@notionhq/client';
import { NotionDatabaseResponse } from '../_types/notion';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
const database = getNotionDatabase();

export async function getNotionDatabase() {
  const response = await notion.search({
    filter: {
      value: 'database',
      property: 'object',
    },
  });

  return response;
}

export async function getCourses() {
  const databaseId = (await database).results[0].id;

  const response = await notion.databases.query({
    database_id: databaseId,
  });

  const typedResponse = response as unknown as NotionDatabaseResponse;

  return typedResponse.results.map((course) => {
    console.log(course);

    return {
      id: course.id,
      title: course.properties.title.title[0].plain_text,
      slug: course.properties.slug.rich_text[0].plain_text,
      tags: course.properties.tags.multi_select.map((tag) => tag.name),
      createdAt: course.created_time,
    };
  });
}

export async function getCourse(slug: string) {
  const databaseId = (await database).results[0].id;

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      or: [
        {
          property: 'slug',
          rich_text: {
            equals: slug,
          },
        },
      ],
    },
  });

  const pageId = response.results[0].id;

  // Notion to Markdown
  const n2m = new NotionToMarkdown({ notionClient: notion });
  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdblocks);

  // prettier-ignore
  return {
    title: (response.results[0] as any).properties.title.title[0].plain_text,
    content: mdString.parent,
  };
}
