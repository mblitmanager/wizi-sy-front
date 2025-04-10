
import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

type CollapsibleTriggerFunctionChildren = (props: { open: boolean }) => React.ReactNode;

interface CollapsibleTriggerProps {
  children: React.ReactNode | CollapsibleTriggerFunctionChildren;
}

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  CollapsibleTriggerProps & React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>(({ children, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);

  return (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {typeof children === 'function' 
        ? (children as CollapsibleTriggerFunctionChildren)({ open }) 
        : children}
    </CollapsiblePrimitive.Trigger>
  );
});
CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={`data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.Content>
))
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
