import { ScrollArea } from "@/components/ui/scroll-area";

interface NotesDisplayProps {
  notes: string;
}

export function NotesDisplay({ notes }: NotesDisplayProps) {
  const formattedNotes = notes
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');

  return (
    <ScrollArea className="h-48 w-full rounded-md border p-4 animate-in fade-in duration-500 bg-background">
      <div className="text-sm" dangerouslySetInnerHTML={{ __html: formattedNotes }} />
    </ScrollArea>
  );
}
