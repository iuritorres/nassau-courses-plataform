import { getCourse } from '@/app/_services/notion';
import ReactMarkdown from 'react-markdown';

export default async function CoursePage({
  params,
}: {
  params: { slug: string };
}) {
  const course = await getCourse(params.slug);

  return (
    <div className="w-full bg-slate-800 min-h-screen">
      <div className="m-auto max-w-2xl bg-slate-700 p-6 min-h-screen">
        <h1 className="text-4xl py-6">{course.title}</h1>

        <ReactMarkdown
          components={{
            h1: 'h2',
            h2: ({ node, ...props }) => (
              <h2 className="text-2xl" {...props} />
            ),
          }}
        >
          {course.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
