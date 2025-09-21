import { Button } from '@/components/ui/button';
import { CheckSquare, Plus, Sparkles } from 'lucide-react';
import { useTaskFocus } from './TaskFocusContext';

export function EmptyState() {
  const { focusTaskInput, focusTaskInputWithAI } = useTaskFocus();
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckSquare className="w-12 h-12 text-primary" />
      </div>
      
      <h3 className="text-title text-gray-900 mb-3">
        Ready to get things done?
      </h3>
      
      <p className="text-body text-gray-600 mb-8 max-w-md mx-auto">
        Create your first task and start building momentum. 
        Every big accomplishment begins with a single step.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          variant="primary" 
          size="lg" 
          className="gap-2"
          onClick={focusTaskInput}
        >
          <Plus className="w-5 h-5" />
          Create your first task
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="gap-2"
          onClick={focusTaskInputWithAI}
        >
          <Sparkles className="w-5 h-5" />
          Explore AI features
        </Button>
      </div>

      {/* Tips */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Quick Add</h4>
          <p className="text-xs text-gray-600">
            Use ⌘+Enter to quickly add tasks
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <CheckSquare className="w-5 h-5 text-accent" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Stay Organized</h4>
          <p className="text-xs text-gray-600">
            Use tags and due dates to stay on track
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-cta/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-5 h-5 text-cta-foreground" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">AI Powered</h4>
          <p className="text-xs text-gray-600">
            Get smart suggestions and motivation
          </p>
        </div>
      </div>
    </div>
  );
}