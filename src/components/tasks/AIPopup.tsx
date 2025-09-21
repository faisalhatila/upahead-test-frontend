import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Task } from '@/stores/taskStore';
import { cn } from '@/lib/utils';
import { X, Sparkles, RefreshCw, Copy, Heart } from 'lucide-react';

interface AIPopupProps {
  task: Task;
  onClose: () => void;
}

type MessageType = 'Tip' | 'Fun Fact' | 'Motivational';

interface AIMessage {
  type: MessageType;
  content: string;
}

export function AIPopup({ task, onClose }: AIPopupProps) {
  const [message, setMessage] = useState<AIMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock AI responses for demo
  const mockResponses: AIMessage[] = [
    {
      type: 'Tip',
      content: 'Break this task into smaller, 15-minute chunks. Your brain loves quick wins and will build momentum naturally.'
    },
    {
      type: 'Fun Fact',
      content: 'Did you know? The average person makes 35,000 decisions per day. Completing this task removes one from tomorrow\'s list!'
    },
    {
      type: 'Motivational',
      content: 'You\'ve got this! Every small step forward is progress. This task is your chance to prove to yourself what you\'re capable of.'
    },
    {
      type: 'Tip',
      content: 'Try the 2-minute rule: if this task can be done in under 2 minutes, do it right now. Future you will thank present you.'
    },
    {
      type: 'Fun Fact',
      content: 'Studies show that writing down your tasks makes you 42% more likely to complete them. You\'re already ahead of the game!'
    },
    {
      type: 'Motivational',
      content: 'Progress, not perfection. This task doesn\'t need to be perfect - it just needs to be done. You\'re closer than you think.'
    },
  ];

  const generateMessage = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      // In a real implementation, this would call OpenAI API with the prompt:
      // `Generate 1-3 friendly sentences tailored to this task title: "${task.title}". 
      //  Keep it short, upbeat, and actionable. Include one micro-tip and label 
      //  the message type as either Tip, Fun Fact, or Motivational.`
      
      const randomMessage = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setMessage(randomMessage);
    } catch (err) {
      setError('Failed to generate AI insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateMessage();
  }, []);

  const handleCopy = async () => {
    if (message) {
      await navigator.clipboard.writeText(message.content);
      // In a real app, you'd show a toast notification here
    }
  };

  const getTypeColor = (type: MessageType) => {
    switch (type) {
      case 'Tip':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Fun Fact':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'Motivational':
        return 'bg-cta/10 text-cta-foreground border-cta/20';
    }
  };

  const getTypeIcon = (type: MessageType) => {
    switch (type) {
      case 'Tip':
        return '💡';
      case 'Fun Fact':
        return '🎯';
      case 'Motivational':
        return '🚀';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl shadow-large max-w-md w-full ai-popup-enter">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-heading text-gray-900">AI Boost</h3>
              <p className="text-xs text-gray-500">for: {task.title}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading && (
            <div className="text-center py-8">
              <div className="spinner w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full mx-auto mb-4" />
              <p className="text-body-sm text-gray-600">
                Generating personalized insights...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-error" />
              </div>
              <p className="text-body-sm text-error mb-4">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={generateMessage}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          )}

          {message && (
            <div className="space-y-4">
              {/* Message Type Badge */}
              <div className="flex justify-center">
                <span className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border",
                  getTypeColor(message.type)
                )}>
                  <span>{getTypeIcon(message.type)}</span>
                  {message.type}
                </span>
              </div>

              {/* Message Content */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-body text-gray-800 leading-relaxed">
                  {message.content}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2 text-gray-600 hover:text-gray-800"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateMessage}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generate Another
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onClose}
                    className="gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Apply as Note
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
