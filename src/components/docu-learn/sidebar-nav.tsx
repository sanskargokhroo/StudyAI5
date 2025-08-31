'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, Layers, FileText, HelpCircle } from 'lucide-react';

interface SidebarNavProps {
  activeActivity: string;
  setActiveActivity: (activity: 'home' | 'notes' | 'flashcards' | 'quiz') => void;
}

export function SidebarNav({ activeActivity, setActiveActivity }: SidebarNavProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setActiveActivity('home')}
          isActive={activeActivity === 'home'}
          tooltip="Home"
        >
          <Home />
          <span>Home</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setActiveActivity('notes')}
          isActive={activeActivity === 'notes'}
          tooltip="Notes"
        >
          <FileText />
          <span>Notes</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setActiveActivity('flashcards')}
          isActive={activeActivity === 'flashcards'}
          tooltip="Flashcards"
        >
          <Layers />
          <span>Flashcards</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setActiveActivity('quiz')}
          isActive={activeActivity === 'quiz'}
          tooltip="Quiz"
        >
          <HelpCircle />
          <span>Quiz</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
