import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import type { Subject } from '@/content/types';
import { allTopics, getCachedSubject, loadSubject, subjectList } from '@/content/registry';
import { subjectHref, useHashRoute } from '@/lib/useHashRoute';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { Sidebar } from '@/components/Sidebar';
import { SubjectOverview } from '@/components/SubjectOverview';
import { TopicPage } from '@/components/TopicPage';
import { Brand } from '@/components/Brand';

export default function App() {
  const route = useHashRoute();
  const meta = subjectList.find((s) => s.id === route.subjectId) ?? subjectList[0];
  const [subject, setSubject] = useState<Subject | undefined>(() => getCachedSubject(meta.id));
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let live = true;
    loadSubject(meta.id).then((s) => live && setSubject(s));
    return () => {
      live = false;
    };
  }, [meta.id]);

  useEffect(() => {
    document.documentElement.style.setProperty('--subject', meta.accent);
  }, [meta.accent]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.subjectId, route.topicId]);

  const current = subject?.id === meta.id ? subject : undefined;
  const topic = current && route.topicId ? allTopics(current).find((t) => t.id === route.topicId) : undefined;

  const sidebar = current && (
    <Sidebar subject={current} topicId={topic?.id} query={query} onQueryChange={setQuery} onNavigate={() => setMenuOpen(false)} />
  );

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]">
      {/* Phone / tablet top bar */}
      <div className="bg-sidebar sticky top-[env(safe-area-inset-top,0px)] z-20 flex items-center gap-3 border-b px-4 py-2.5 md:hidden">
        <Button variant="outline" size="icon" aria-label="Open topic list" onClick={() => setMenuOpen(true)}>
          <Menu />
        </Button>
        <Brand href={subjectHref(meta.id)} />
      </div>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="pt-[env(safe-area-inset-top,0px)]">
          <SheetTitle className="sr-only">Topics</SheetTitle>
          <SheetDescription className="sr-only">Switch subject, search and pick a topic.</SheetDescription>
          {sidebar}
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="bg-sidebar sticky top-0 hidden h-screen border-r md:block">{sidebar}</aside>

      <main className="w-full max-w-[1040px] px-4 pt-6 pb-20 sm:px-8 md:pt-10 lg:px-14">
        {!current ? (
          <p className="text-muted-foreground">Loading {meta.name}…</p>
        ) : topic ? (
          <TopicPage key={`${current.id}.${topic.id}`} subject={current} topic={topic} />
        ) : (
          <SubjectOverview subject={current} />
        )}
      </main>
    </div>
  );
}
