'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit3, 
  Share2, 
  Download, 
  Copy, 
  Trash2,
  MoreVertical,
  BookOpen,
  Clock,
  Target,
  Globe,
  Lock,
  Eye,
  Sparkles
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

import { PageHeader } from '@/components/ui/page-header';
import { useDeckById, useDeckOperations, AiGenerateDialog } from '@/features/decks';
import { CardList } from '@/features/flashcards';
import { useDueCardsCount, StudyStatus, StudyOptions } from '@/features/study';

export default function DeckDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = parseInt(params.id as string);
  
  const { data: deck, isLoading, error } = useDeckById(deckId);
  const { deleteDeck } = useDeckOperations();
  const { data: dueCount } = useDueCardsCount(deckId);

  const handleBack = () => {
    router.push('/decks');
  };

  const handleEdit = () => {
    router.push(`/decks/${deckId}/edit`);
  };

  const handleStudy = () => {
    // Navigate to client study page for local practice
    router.push(`/client-study?deckId=${deckId}`);
  };



  const handlePractice = () => {
    // Navigate to practice page with deckId in query params  
    router.push(`/practice?deckId=${deckId}`);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/decks/${deckId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Deck link copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleDuplicate = () => {
    toast.info('Deck duplication feature coming soon');
  };

  const handleDownload = () => {
    toast.info('Deck download feature coming soon');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDeck.mutateAsync(deckId);
      toast.success('Deck deleted successfully');
      router.push('/decks');
    } catch (error) {
      console.error('Failed to delete deck:', error);
      toast.error('Failed to delete deck');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Failed to load deck</p>
          <Button onClick={handleBack} variant="outline">
            Back to Decks
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = true; // TODO: Check if current user is owner
  const visibilityIcon = deck.visibility === 'PUBLIC' ? Globe : 
                         deck.visibility === 'PRIVATE' ? Lock : Eye;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <PageHeader
        title={deck.title}
        description={deck.description}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {isOwner && (
              <Button variant="outline" onClick={handleEdit}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleStudy}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Study Cards (Local)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePractice}>
                  <Target className="mr-2 h-4 w-4" />
                  Practice Mode (SRS)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isOwner && (
                  <AiGenerateDialog deckId={deckId} deckTitle={deck.title}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate with AI
                    </DropdownMenuItem>
                  </AiGenerateDialog>
                )}
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuItem>
                {isOwner && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {/* Deck Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  {React.createElement(visibilityIcon, { className: "h-3 w-3" })}
                  {deck.visibility}
                </Badge>
                {deck.cefrLevel && (
                  <Badge variant="secondary">{deck.cefrLevel}</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {deck.cardCount || 0} cards
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Updated {new Date(deck.updatedAt).toLocaleDateString()}
                </span>
                <StudyStatus dueCount={dueCount} />
              </div>
            </div>
            {deck.coverImageUrl && (
              <div 
                className="w-20 h-20 object-cover rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${deck.coverImageUrl})` }}
                role="img"
                aria-label={deck.title}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Languages</h3>
            <div className="flex gap-2">
              <Badge variant="outline">{deck.sourceLanguage} → {deck.targetLanguage}</Badge>
            </div>
          </div>
          
          {deck.tags && deck.tags.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {deck.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {deck.description && (
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{deck.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Study Options */}
      <StudyOptions 
        dueCount={dueCount}
        deckTitle={deck.title}
        onSrsStudy={handlePractice}
        onClientStudy={handleStudy}
      />

      {/* Deck Content Tabs */}
      <Tabs defaultValue="cards" className="space-y-6">
        <TabsList>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-4">
          <CardList 
            deckId={deckId} 
            deckTitle={deck.title} 
            onStudy={handleStudy}
          />
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Study Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Accuracy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5h</div>
                <p className="text-xs text-muted-foreground">Study time</p>
              </CardContent>
            </Card>
            
            {dueCount && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Study Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <StudyStatus dueCount={dueCount} variant="detailed" />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Activity timeline coming soon</p>
                <p className="text-sm">Track your learning progress and milestones</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
