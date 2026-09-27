import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/**
 * Centred dialog. It animates with the `card-expand` keyframes, which grow it out of
 * the point set by `--from-x`, `--from-y` and `--from-s` (see useExpandOrigin).
 */
function DialogContent({ className, children, style, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]" />
      <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4">
        <DialogPrimitive.Content
          data-slot="dialog-content"
          style={style}
          className={cn(
            'bg-card text-card-foreground data-[state=open]:animate-card-expand data-[state=closed]:animate-card-collapse pointer-events-auto relative flex max-h-[calc(100dvh-2rem)] w-full max-w-[720px] flex-col gap-4 overflow-y-auto rounded-2xl border p-6 shadow-2xl outline-none',
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="hover:bg-muted focus-visible:ring-ring/50 absolute top-3.5 right-3.5 rounded-md p-1.5 opacity-70 outline-none transition-opacity hover:opacity-100 focus-visible:ring-[3px]">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
}

const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

export { Dialog, DialogContent, DialogTitle, DialogDescription };
