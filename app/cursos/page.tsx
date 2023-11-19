import Link from 'next/link';
import { getCourses } from '../_services/notion';

export default async function CoursesHome() {
  const courses = await getCourses();

  return (
    <div className="w-full bg-slate-800 min-h-screen">
      <div className="m-auto max-w-2xl bg-slate-700 p-6 min-h-screen">
        <h1 className="text-4xl py-6">Cursos</h1>

        <ul>
          {courses.map((course) => (
            <li key={course.id} className="mb-3">
              <Link href={`/cursos/${course.slug}`}>{course.title}</Link>

              <div className="space-x-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="text-sm text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>

              <p>
                {new Intl.DateTimeFormat('pt-BR').format(
                  new Date(course.createdAt)
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
