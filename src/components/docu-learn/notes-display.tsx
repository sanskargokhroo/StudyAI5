import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface NotesDisplayProps {
  notes: string;
}

export function NotesDisplay({ notes }: NotesDisplayProps) {
  const formattedNotes = notes
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');

  return (
    <div className="p-4 sm:p-6 md:p-8 h-full">
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Generated Notes</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border p-4 bg-background">
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: formattedNotes }} />
                </ScrollArea>
            </CardContent>
        </Card>
    </div>
  );
}
